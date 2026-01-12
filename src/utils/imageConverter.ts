/**
 * 파티클 기반 이미지 → SVG 변환 유틸리티
 * 2-패스 격자: 첫 번째 패스로 정렬된 격자 배치, 두 번째 패스로 사이 빈틈 메우기
 */

import type { UploadedImage, ConversionResult, ConversionSettings } from '../types';

// ============================================
// 타입 정의
// ============================================

interface Color {
  r: number;
  g: number;
  b: number;
}

interface ParticleWithColor {
  x: number;
  y: number;
  color: Color;
}

// ============================================
// 유틸리티 함수
// ============================================

const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${[r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('')}`;
};

const getLuminance = (color: Color): number => {
  return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
};

// ============================================
// 이미지 전처리
// ============================================

/**
 * 가우시안 블러
 */
const applyGaussianBlur = (imageData: ImageData, sigma: number): ImageData => {
  const { width, height, data } = imageData;
  const radius = Math.ceil(sigma * 3);
  const size = radius * 2 + 1;
  
  // 가우시안 커널 생성
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
  
  const newData = new Uint8ClampedArray(data.length);
  const temp = new Uint8ClampedArray(data.length);
  
  // 수평 블러
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      
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
      temp[idx] = r;
      temp[idx + 1] = g;
      temp[idx + 2] = b;
      temp[idx + 3] = a;
    }
  }
  
  // 수직 블러
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      
      for (let k = -radius; k <= radius; k++) {
        const py = Math.min(Math.max(y + k, 0), height - 1);
        const idx = (py * width + x) * 4;
        const weight = kernel[k + radius];
        
        r += temp[idx] * weight;
        g += temp[idx + 1] * weight;
        b += temp[idx + 2] * weight;
        a += temp[idx + 3] * weight;
      }
      
      const idx = (y * width + x) * 4;
      newData[idx] = r;
      newData[idx + 1] = g;
      newData[idx + 2] = b;
      newData[idx + 3] = a;
    }
  }
  
  return new ImageData(newData, width, height);
};

// ============================================
// 색상 수집
// ============================================

/**
 * 배경색 감지 (배열 처리)
 */
const detectBackgroundColor = (data: Uint8ClampedArray, width: number, height: number): Color => {
  const corners = [
    [0, 1, 2],
    [(width - 1) * 4, (width - 1) * 4 + 1, (width - 1) * 4 + 2],
    [(height - 1) * width * 4, (height - 1) * width * 4 + 1, (height - 1) * width * 4 + 2],
    [((height - 1) * width + width - 1) * 4, ((height - 1) * width + width - 1) * 4 + 1, ((height - 1) * width + width - 1) * 4 + 2]
  ];
  
  let r = 0, g = 0, b = 0;
  for (const [ri, gi, bi] of corners) {
    r += data[ri];
    g += data[gi];
    b += data[bi];
  }
  
  return { r: r / 4, g: g / 4, b: b / 4 };
};

/**
 * 이미지의 고유 색상 추출
 */
const extractUniqueColors = (data: Uint8ClampedArray, width: number, height: number): Color[] => {
  const colorMap = new Map<string, Color>();
  const bgColor = detectBackgroundColor(data, width, height);
  const bgLuminance = getLuminance(bgColor);
  
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // 배경색 필터링 (밝은 배경만)
    if (bgLuminance > 200) {
      const dr = r - bgColor.r;
      const dg = g - bgColor.g;
      const db = b - bgColor.b;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      if (dist < 30) continue;
    }
    
    const key = `${Math.round(r)},${Math.round(g)},${Math.round(b)}`;
    if (!colorMap.has(key)) {
      colorMap.set(key, { r, g, b });
    }
  }
  
  return Array.from(colorMap.values());
};

// ============================================
// 파티클 병합 및 최적화
// ============================================

/**
 * 인접한 파티클들을 클러스터로 그룹화 (공간 분할 최적화)
 */
const clusterAdjacentParticles = (
  particles: ParticleWithColor[],
  maxDistance: number
): ParticleWithColor[][] => {
  if (particles.length === 0) return [];
  
  // 공간 해싱: 그리드 기반 인덱싱
  const cellSize = maxDistance;
  const grid = new Map<string, number[]>();
  
  // 파티클을 그리드 셀에 배치
  particles.forEach((p, idx) => {
    const cellX = Math.floor(p.x / cellSize);
    const cellY = Math.floor(p.y / cellSize);
    const key = `${cellX},${cellY}`;
    
    if (!grid.has(key)) {
      grid.set(key, []);
    }
    grid.get(key)!.push(idx);
  });
  
  // 인접 셀 검색용 오프셋
  const neighborOffsets = [
    [0, 0], [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
  ];
  
  const clusters: ParticleWithColor[][] = [];
  const visited = new Set<number>();
  
  for (let i = 0; i < particles.length; i++) {
    if (visited.has(i)) continue;
    
    const cluster: ParticleWithColor[] = [particles[i]];
    visited.add(i);
    
    // BFS로 인접한 파티클 찾기 (인접 셀만 검색)
    const queue = [i];
    
    while (queue.length > 0) {
      const currentIdx = queue.shift()!;
      const current = particles[currentIdx];
      
      const cellX = Math.floor(current.x / cellSize);
      const cellY = Math.floor(current.y / cellSize);
      
      // 인접한 9개 셀만 검색
      for (const [dx, dy] of neighborOffsets) {
        const neighborKey = `${cellX + dx},${cellY + dy}`;
        const neighborIndices = grid.get(neighborKey);
        
        if (!neighborIndices) continue;
        
        for (const j of neighborIndices) {
          if (visited.has(j)) continue;
          
          const other = particles[j];
          const distX = current.x - other.x;
          const distY = current.y - other.y;
          const dist = Math.sqrt(distX * distX + distY * distY);
          
          if (dist <= maxDistance) {
            cluster.push(other);
            visited.add(j);
            queue.push(j);
          }
        }
      }
    }
    
    clusters.push(cluster);
  }
  
  return clusters;
};

/**
 * 클러스터를 하나의 경로로 변환 (Convex Hull 사용)
 */
const clusterToPath = (cluster: ParticleWithColor[], radius: number): string => {
  if (cluster.length === 1) {
    const p = cluster[0];
    return `<circle cx="${p.x}" cy="${p.y}" r="${radius}"/>`;
  }
  
  // 여러 원들을 하나의 path로 결합
  const circles = cluster.map(p => {
    // 각 원을 path로 표현
    return `M ${p.x - radius},${p.y} a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 ${-radius * 2},0`;
  }).join(' ');
  
  return `<path d="${circles}"/>`;
};

// ============================================
// 파티클 생성 (2-패스 격자)
// ============================================

/**
 * 첫 번째 패스: 정렬된 격자로 파티클 수집
 */
const collectGridParticles = (
  imageData: ImageData,
  density: number,
  particleSize: number
): ParticleWithColor[] => {
  const { width, height, data } = imageData;
  const particles: ParticleWithColor[] = [];
  
  // 배경색 감지
  const bgColor = detectBackgroundColor(data, width, height);
  const bgLuminance = getLuminance(bgColor);
  
  // 밀도에 따른 파티클 간격 계산
  const step = Math.max(particleSize * 2, Math.round(particleSize * 2 * (100 / density)));
  
  for (let y = particleSize; y < height; y += step) {
    for (let x = particleSize; x < width; x += step) {
      const px = Math.round(x);
      const py = Math.round(y);
      
      if (px < 0 || px >= width || py < 0 || py >= height) continue;
      
      const idx = (py * width + px) * 4;
      
      // 투명도 체크
      if (data[idx + 3] < 128) continue;
      
      const pixelColor: Color = {
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2]
      };
      
      // 배경색 필터링 (밝은 배경만)
      if (bgLuminance > 200) {
        const dr = pixelColor.r - bgColor.r;
        const dg = pixelColor.g - bgColor.g;
        const db = pixelColor.b - bgColor.b;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < 30) continue;
      }
      
      particles.push({ x: px, y: py, color: pixelColor });
    }
  }
  
  return particles;
};

/**
 * 두 번째 패스: 격자 사이 중간 지점에 파티클 추가
 */
const collectOffsetParticles = (
  imageData: ImageData,
  density: number,
  particleSize: number
): ParticleWithColor[] => {
  const { width, height, data } = imageData;
  const particles: ParticleWithColor[] = [];
  
  // 배경색 감지
  const bgColor = detectBackgroundColor(data, width, height);
  const bgLuminance = getLuminance(bgColor);
  
  // 첫 번째 패스와 동일한 간격 계산
  const step = Math.max(particleSize * 2, Math.round(particleSize * 2 * (100 / density)));
  const offset = step / 2;
  
  // offset을 적용한 격자로 파티클 수집
  for (let y = particleSize + offset; y < height; y += step) {
    for (let x = particleSize + offset; x < width; x += step) {
      const px = Math.round(x);
      const py = Math.round(y);
      
      if (px < 0 || px >= width || py < 0 || py >= height) continue;
      
      const idx = (py * width + px) * 4;
      
      // 투명도 체크
      if (data[idx + 3] < 128) continue;
      
      const pixelColor: Color = {
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2]
      };
      
      // 배경색 필터링 (밝은 배경만)
      if (bgLuminance > 200) {
        const dr = pixelColor.r - bgColor.r;
        const dg = pixelColor.g - bgColor.g;
        const db = pixelColor.b - bgColor.b;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < 30) continue;
      }
      
      particles.push({ x: px, y: py, color: pixelColor });
    }
  }
  
  return particles;
};

// ============================================
// 메인 변환 함수
// ============================================

export const convertImageToSvg = async (
  image: UploadedImage,
  settings: ConversionSettings
): Promise<ConversionResult> => {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) {
          throw new Error('Canvas context not available');
        }
        
        // 이미지 크기 제한 (작은 크기로 리사이징하여 파티클 수 감소)
        const maxSize = 600;
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        let imageData = ctx.getImageData(0, 0, width, height);
        
        // 1. 블러 적용 (옵션)
        if (settings.blur > 0) {
          imageData = applyGaussianBlur(imageData, settings.blur);
        }
        
        // 2. 첫 번째 패스: 정렬된 격자로 파티클 수집
        const firstPassParticles = collectGridParticles(
          imageData,
          settings.particleDensity,
          settings.particleSize
        );
        
        // 3. 두 번째 패스: 격자 사이 중간 지점에 파티클 추가
        const secondPassParticles = collectOffsetParticles(
          imageData,
          settings.particleDensity,
          settings.particleSize
        );
        
        // 4. 모든 파티클 병합
        const allParticles = [...firstPassParticles, ...secondPassParticles];
        
        // 5. 색상별로 그룹화 (어두운 색 → 밝은 색)
        const particlesByColor = new Map<string, ParticleWithColor[]>();
        
        for (const particle of allParticles) {
          const key = rgbToHex(particle.color.r, particle.color.g, particle.color.b);
          if (!particlesByColor.has(key)) {
            particlesByColor.set(key, []);
          }
          particlesByColor.get(key)!.push(particle);
        }
        
        // 6. 밝기 순 정렬
        const sortedEntries = Array.from(particlesByColor.entries()).sort((a, b) => {
          return getLuminance(a[1][0].color) - getLuminance(b[1][0].color);
        });
        
        // 7. SVG 생성 (인접한 파티클 병합)
        const svgElements: string[] = [];
        const radius = settings.particleSize.toFixed(1);
        const mergeDistance = settings.particleSize * 3; // 병합 기준 거리
        
        for (const [hexColor, colorParticles] of sortedEntries) {
          // 같은 색상의 파티클들을 클러스터로 그룹화
          const clusters = clusterAdjacentParticles(colorParticles, mergeDistance);
          
          for (const cluster of clusters) {
            const pathElement = clusterToPath(cluster, parseFloat(radius));
            svgElements.push(`<g fill="${hexColor}">${pathElement}</g>`);
          }
        }
        
        // 8. 고유 색상 추출
        const uniqueColors = extractUniqueColors(imageData.data, width, height);
        
        // 9. 최종 SVG
        const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${svgElements.join('\n  ')}
</svg>`;
        
        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        const svgDataUrl = URL.createObjectURL(blob);
        
        const processingTime = performance.now() - startTime;
        
        resolve({
          id: image.id,
          originalImage: image,
          svgCode,
          svgDataUrl,
          colors: uniqueColors.slice(0, 10).map(c => rgbToHex(c.r, c.g, c.b)),
          processingTime
        });
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = image.preview;
  });
};

// ============================================
// SVG 다운로드/복사 유틸리티
// ============================================

export const downloadSvg = (svgCode: string, originalFileName: string): void => {
  const blob = new Blob([svgCode], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const fileName = originalFileName.replace(/\.[^/.]+$/, '.svg');
  
  link.href = url;
  link.download = fileName;
  link.click();
  
  URL.revokeObjectURL(url);
};

export const copySvgToClipboard = async (svgCode: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(svgCode);
  } catch (error) {
    console.error('Failed to copy SVG to clipboard:', error);
    throw error;
  }
};
