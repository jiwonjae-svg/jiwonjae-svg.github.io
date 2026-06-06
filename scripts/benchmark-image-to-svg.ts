import { generateSvgFromPixels, type PixelData } from '../src/utils/imageToSvgAlgorithm.ts';

interface BenchmarkSample {
  label: string;
  width: number;
  height: number;
}

const samples: BenchmarkSample[] = [
  { label: '128x128', width: 128, height: 128 },
  { label: '256x256', width: 256, height: 256 },
  { label: '512x512', width: 512, height: 512 },
];

const settings = {
  particleSize: 2,
  particleDensity: 50,
  blur: 0,
};

const createSyntheticImage = (width: number, height: number): PixelData => {
  const data = new Uint8ClampedArray(width * height * 4);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.3;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const distanceFromCenter = Math.hypot(x - centerX, y - centerY);
      const inCircle = distanceFromCenter < radius;
      const inDiagonal = Math.abs(x - y) < Math.max(2, width * 0.02);

      if (inCircle || inDiagonal) {
        data[idx] = (x * 7) % 180;
        data[idx + 1] = (y * 5) % 180;
        data[idx + 2] = 80;
      } else {
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
      }

      data[idx + 3] = 255;
    }
  }

  return { width, height, data };
};

const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const average = (values: number[]): number => {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

console.log('Image-to-SVG pipeline benchmark');
console.log(`Settings: particleSize=${settings.particleSize}, particleDensity=${settings.particleDensity}, blur=${settings.blur}`);
console.log('');
console.log('| Sample | Pixels | Median ms | Avg ms | Particles | SVG chars |');
console.log('| --- | ---: | ---: | ---: | ---: | ---: |');

for (const sample of samples) {
  const imageData = createSyntheticImage(sample.width, sample.height);
  let lastResult = generateSvgFromPixels(imageData, settings);

  for (let i = 0; i < 3; i++) {
    lastResult = generateSvgFromPixels(imageData, settings);
  }

  const runs: number[] = [];

  for (let i = 0; i < 10; i++) {
    const start = performance.now();
    lastResult = generateSvgFromPixels(imageData, settings);
    runs.push(performance.now() - start);
  }

  console.log(
    `| ${sample.label} | ${sample.width * sample.height} | ${median(runs).toFixed(2)} | ${average(runs).toFixed(2)} | ${lastResult.particleCount} | ${lastResult.svgCode.length} |`
  );
}
