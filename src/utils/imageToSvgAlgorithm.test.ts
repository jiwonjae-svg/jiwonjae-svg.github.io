import { describe, expect, it } from 'vitest';
import {
  applyGaussianBlur,
  clusterAdjacentParticles,
  collectAlignedGridParticles,
  collectOffsetGridParticles,
  detectBackgroundColor,
  generateSvgFromPixels,
  getLuminance,
  rgbToHex,
  type PixelData,
} from './imageToSvgAlgorithm';

type Rgba = [number, number, number, number];

const createPixels = (width: number, height: number, fill: Rgba = [255, 255, 255, 255]): PixelData => {
  const data = new Uint8ClampedArray(width * height * 4);

  for (let idx = 0; idx < data.length; idx += 4) {
    data[idx] = fill[0];
    data[idx + 1] = fill[1];
    data[idx + 2] = fill[2];
    data[idx + 3] = fill[3];
  }

  return { width, height, data };
};

const setPixel = (imageData: PixelData, x: number, y: number, color: Rgba): void => {
  const idx = (y * imageData.width + x) * 4;
  imageData.data[idx] = color[0];
  imageData.data[idx + 1] = color[1];
  imageData.data[idx + 2] = color[2];
  imageData.data[idx + 3] = color[3];
};

describe('image-to-SVG algorithm helpers', () => {
  it('formats RGB values as rounded hex colors', () => {
    expect(rgbToHex(0, 15, 255)).toBe('#000fff');
    expect(rgbToHex(12.4, 128.6, 4)).toBe('#0c8104');
  });

  it('computes luminance with the same weighted formula used for sorting', () => {
    expect(getLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(255);
    expect(getLuminance({ r: 255, g: 0, b: 0 })).toBeCloseTo(76.245);
  });

  it('detects background color from the four corner pixels', () => {
    const imageData = createPixels(2, 2, [255, 255, 255, 255]);
    setPixel(imageData, 1, 0, [0, 0, 0, 255]);
    setPixel(imageData, 0, 1, [255, 0, 0, 255]);
    setPixel(imageData, 1, 1, [0, 0, 255, 255]);

    expect(detectBackgroundColor(imageData.data, imageData.width, imageData.height)).toEqual({
      r: 127.5,
      g: 63.75,
      b: 127.5,
    });
  });

  it('collects aligned grid particles while filtering bright background pixels', () => {
    const imageData = createPixels(4, 4);
    setPixel(imageData, 1, 1, [0, 0, 0, 255]);

    expect(collectAlignedGridParticles(imageData, 100, 1)).toEqual([
      { x: 1, y: 1, color: { r: 0, g: 0, b: 0 } },
    ]);
  });

  it('collects offset grid particles from the midpoint between aligned samples', () => {
    const imageData = createPixels(4, 4);
    setPixel(imageData, 2, 2, [12, 34, 56, 255]);

    expect(collectOffsetGridParticles(imageData, 100, 1)).toEqual([
      { x: 2, y: 2, color: { r: 12, g: 34, b: 56 } },
    ]);
  });

  it('does not collect transparent sampled pixels', () => {
    const imageData = createPixels(4, 4);
    setPixel(imageData, 1, 1, [0, 0, 0, 0]);

    expect(collectAlignedGridParticles(imageData, 100, 1)).toEqual([]);
  });

  it('groups adjacent same-color particles into connected clusters', () => {
    const particles = [
      { x: 1, y: 1, color: { r: 0, g: 0, b: 0 } },
      { x: 2, y: 2, color: { r: 0, g: 0, b: 0 } },
      { x: 20, y: 20, color: { r: 0, g: 0, b: 0 } },
    ];

    const clusters = clusterAdjacentParticles(particles, 3);

    expect(clusters).toHaveLength(2);
    expect(clusters[0]).toHaveLength(2);
    expect(clusters[1]).toHaveLength(1);
  });

  it('generates SVG from the two-pass particle pipeline', () => {
    const imageData = createPixels(4, 4);
    setPixel(imageData, 1, 1, [0, 0, 0, 255]);
    setPixel(imageData, 2, 2, [0, 0, 0, 255]);

    const result = generateSvgFromPixels(imageData, {
      particleSize: 1,
      particleDensity: 100,
      blur: 0,
    });

    expect(result.particleCount).toBe(2);
    expect(result.colors).toEqual(['#000000']);
    expect(result.svgCode).toContain('width="4" height="4" viewBox="0 0 4 4"');
    expect(result.svgCode).toContain('<g fill="#000000"><path');
  });

  it('keeps blur output dimensions and channel count stable', () => {
    const imageData = createPixels(3, 3, [20, 40, 60, 255]);
    const blurred = applyGaussianBlur(imageData, 1);

    expect(blurred.width).toBe(3);
    expect(blurred.height).toBe(3);
    expect(blurred.data).toHaveLength(imageData.data.length);
    expect(Array.from(blurred.data.slice(0, 4))).toEqual([20, 40, 60, 255]);
  });
});
