import type { UploadedImage, ConversionResult, ConversionSettings } from '../types';
import { generateSvgFromPixels } from './imageToSvgAlgorithm';

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

        const imageData = ctx.getImageData(0, 0, width, height);
        const { svgCode, colors } = generateSvgFromPixels(imageData, settings);
        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        const svgDataUrl = URL.createObjectURL(blob);
        const processingTime = performance.now() - startTime;

        resolve({
          id: image.id,
          originalImage: image,
          svgCode,
          svgDataUrl,
          colors,
          processingTime,
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
