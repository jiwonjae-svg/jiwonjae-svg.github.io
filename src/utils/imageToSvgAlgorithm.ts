export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface ParticleWithColor {
  x: number;
  y: number;
  color: RgbColor;
}

export interface PixelData {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export interface ImageToSvgSettings {
  particleSize: number;
  particleDensity: number;
  blur: number;
}

export interface ImageToSvgPipelineResult {
  svgCode: string;
  colors: string[];
  particleCount: number;
}

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${[r, g, b].map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`;
};

export const getLuminance = (color: RgbColor): number => {
  return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
};

const getColorDistance = (a: RgbColor, b: RgbColor): number => {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;

  return Math.sqrt(dr * dr + dg * dg + db * db);
};

export const applyGaussianBlur = (imageData: PixelData, sigma: number): PixelData => {
  if (sigma <= 0) return imageData;

  const { width, height, data } = imageData;
  const radius = Math.ceil(sigma * 3);
  const size = radius * 2 + 1;
  const kernel = new Float32Array(size);
  let sum = 0;

  for (let i = 0; i < size; i++) {
    const x = i - radius;
    kernel[i] = Math.exp(-(x * x) / (2 * sigma * sigma));
    sum += kernel[i];
  }

  for (let i = 0; i < size; i++) {
    kernel[i] /= sum;
  }

  const blurredData = new Uint8ClampedArray(data.length);
  const tempData = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let k = -radius; k <= radius; k++) {
        const px = Math.min(Math.max(x + k, 0), width - 1);
        const idx = (y * width + px) * 4;
        const weight = kernel[k + radius];

        r += data[idx] * weight;
        g += data[idx + 1] * weight;
        b += data[idx + 2] * weight;
        a += data[idx + 3] * weight;
      }

      const idx = (y * width + x) * 4;
      tempData[idx] = r;
      tempData[idx + 1] = g;
      tempData[idx + 2] = b;
      tempData[idx + 3] = a;
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let k = -radius; k <= radius; k++) {
        const py = Math.min(Math.max(y + k, 0), height - 1);
        const idx = (py * width + x) * 4;
        const weight = kernel[k + radius];

        r += tempData[idx] * weight;
        g += tempData[idx + 1] * weight;
        b += tempData[idx + 2] * weight;
        a += tempData[idx + 3] * weight;
      }

      const idx = (y * width + x) * 4;
      blurredData[idx] = r;
      blurredData[idx + 1] = g;
      blurredData[idx + 2] = b;
      blurredData[idx + 3] = a;
    }
  }

  return { width, height, data: blurredData };
};

export const detectBackgroundColor = (data: Uint8ClampedArray, width: number, height: number): RgbColor => {
  const corners = [
    [0, 1, 2],
    [(width - 1) * 4, (width - 1) * 4 + 1, (width - 1) * 4 + 2],
    [(height - 1) * width * 4, (height - 1) * width * 4 + 1, (height - 1) * width * 4 + 2],
    [
      ((height - 1) * width + width - 1) * 4,
      ((height - 1) * width + width - 1) * 4 + 1,
      ((height - 1) * width + width - 1) * 4 + 2,
    ],
  ];

  let r = 0;
  let g = 0;
  let b = 0;

  for (const [ri, gi, bi] of corners) {
    r += data[ri];
    g += data[gi];
    b += data[bi];
  }

  return { r: r / 4, g: g / 4, b: b / 4 };
};

const isForegroundPixelWithLuminance = (
  color: RgbColor,
  alpha: number,
  backgroundColor: RgbColor,
  backgroundLuminance: number
): boolean => {
  if (alpha < 128) return false;

  if (backgroundLuminance <= 200) return true;

  return getColorDistance(color, backgroundColor) >= 30;
};

export const isForegroundPixel = (color: RgbColor, alpha: number, backgroundColor: RgbColor): boolean => {
  return isForegroundPixelWithLuminance(color, alpha, backgroundColor, getLuminance(backgroundColor));
};

export const extractUniqueColors = (data: Uint8ClampedArray, width: number, height: number): RgbColor[] => {
  const colorMap = new Map<string, RgbColor>();
  const backgroundColor = detectBackgroundColor(data, width, height);
  const backgroundLuminance = getLuminance(backgroundColor);

  for (let i = 0; i < data.length; i += 4) {
    const color = {
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
    };

    if (!isForegroundPixelWithLuminance(color, data[i + 3], backgroundColor, backgroundLuminance)) continue;

    const key = `${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)}`;
    if (!colorMap.has(key)) {
      colorMap.set(key, color);
    }
  }

  return Array.from(colorMap.values());
};

export const getSamplingStep = (particleSize: number, density: number): number => {
  return Math.max(particleSize * 2, Math.round(particleSize * 2 * (100 / density)));
};

export const collectGridParticles = (
  imageData: PixelData,
  density: number,
  particleSize: number,
  offset = 0
): ParticleWithColor[] => {
  const { width, height, data } = imageData;
  const particles: ParticleWithColor[] = [];
  const backgroundColor = detectBackgroundColor(data, width, height);
  const backgroundLuminance = getLuminance(backgroundColor);
  const step = getSamplingStep(particleSize, density);

  for (let y = particleSize + offset; y < height; y += step) {
    for (let x = particleSize + offset; x < width; x += step) {
      const px = Math.round(x);
      const py = Math.round(y);

      if (px < 0 || px >= width || py < 0 || py >= height) continue;

      const idx = (py * width + px) * 4;
      const pixelColor = {
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2],
      };

      if (!isForegroundPixelWithLuminance(pixelColor, data[idx + 3], backgroundColor, backgroundLuminance)) continue;

      particles.push({ x: px, y: py, color: pixelColor });
    }
  }

  return particles;
};

export const collectAlignedGridParticles = (
  imageData: PixelData,
  density: number,
  particleSize: number
): ParticleWithColor[] => {
  return collectGridParticles(imageData, density, particleSize);
};

export const collectOffsetGridParticles = (
  imageData: PixelData,
  density: number,
  particleSize: number
): ParticleWithColor[] => {
  return collectGridParticles(imageData, density, particleSize, getSamplingStep(particleSize, density) / 2);
};

export const clusterAdjacentParticles = (
  particles: ParticleWithColor[],
  maxDistance: number
): ParticleWithColor[][] => {
  if (particles.length === 0) return [];

  const cellSize = maxDistance;
  const grid = new Map<string, number[]>();

  particles.forEach((particle, idx) => {
    const cellX = Math.floor(particle.x / cellSize);
    const cellY = Math.floor(particle.y / cellSize);
    const key = `${cellX},${cellY}`;

    if (!grid.has(key)) {
      grid.set(key, []);
    }
    grid.get(key)!.push(idx);
  });

  const neighborOffsets = [
    [0, 0],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  const clusters: ParticleWithColor[][] = [];
  const visited = new Set<number>();

  for (let i = 0; i < particles.length; i++) {
    if (visited.has(i)) continue;

    const cluster: ParticleWithColor[] = [particles[i]];
    const queue = [i];
    visited.add(i);

    while (queue.length > 0) {
      const currentIdx = queue.shift()!;
      const current = particles[currentIdx];
      const cellX = Math.floor(current.x / cellSize);
      const cellY = Math.floor(current.y / cellSize);

      for (const [dx, dy] of neighborOffsets) {
        const neighborKey = `${cellX + dx},${cellY + dy}`;
        const neighborIndices = grid.get(neighborKey);

        if (!neighborIndices) continue;

        for (const neighborIdx of neighborIndices) {
          if (visited.has(neighborIdx)) continue;

          const other = particles[neighborIdx];
          const distX = current.x - other.x;
          const distY = current.y - other.y;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance <= maxDistance) {
            cluster.push(other);
            visited.add(neighborIdx);
            queue.push(neighborIdx);
          }
        }
      }
    }

    clusters.push(cluster);
  }

  return clusters;
};

export const clusterToPath = (cluster: ParticleWithColor[], radius: number): string => {
  if (cluster.length === 1) {
    const particle = cluster[0];
    return `<circle cx="${particle.x}" cy="${particle.y}" r="${radius}"/>`;
  }

  const circles = cluster.map((particle) => {
    return `M ${particle.x - radius},${particle.y} a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 ${-radius * 2},0`;
  });

  return `<path d="${circles.join(' ')}"/>`;
};

export const generateSvgFromPixels = (
  rawImageData: PixelData,
  settings: ImageToSvgSettings
): ImageToSvgPipelineResult => {
  const imageData = settings.blur > 0 ? applyGaussianBlur(rawImageData, settings.blur) : rawImageData;
  const firstPassParticles = collectAlignedGridParticles(
    imageData,
    settings.particleDensity,
    settings.particleSize
  );
  const secondPassParticles = collectOffsetGridParticles(
    imageData,
    settings.particleDensity,
    settings.particleSize
  );
  const allParticles = [...firstPassParticles, ...secondPassParticles];
  const particlesByColor = new Map<string, ParticleWithColor[]>();

  for (const particle of allParticles) {
    const key = rgbToHex(particle.color.r, particle.color.g, particle.color.b);
    if (!particlesByColor.has(key)) {
      particlesByColor.set(key, []);
    }
    particlesByColor.get(key)!.push(particle);
  }

  const sortedEntries = Array.from(particlesByColor.entries()).sort((a, b) => {
    return getLuminance(a[1][0].color) - getLuminance(b[1][0].color);
  });
  const svgElements: string[] = [];
  const radius = parseFloat(settings.particleSize.toFixed(1));
  const mergeDistance = settings.particleSize * 3;

  for (const [hexColor, colorParticles] of sortedEntries) {
    const clusters = clusterAdjacentParticles(colorParticles, mergeDistance);

    for (const cluster of clusters) {
      const pathElement = clusterToPath(cluster, radius);
      svgElements.push(`<g fill="${hexColor}">${pathElement}</g>`);
    }
  }

  const colors = extractUniqueColors(imageData.data, imageData.width, imageData.height)
    .slice(0, 10)
    .map((color) => rgbToHex(color.r, color.g, color.b));
  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${imageData.width}" height="${imageData.height}" viewBox="0 0 ${imageData.width} ${imageData.height}">
  ${svgElements.join('\n  ')}
</svg>`;

  return {
    svgCode,
    colors,
    particleCount: allParticles.length,
  };
};
