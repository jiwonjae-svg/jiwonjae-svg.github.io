import type { Translations } from '../types';

export const en: Translations = {
  app: {
    title: 'SVG Converter',
    subtitle: 'Image to Vector',
    description: 'Convert PNG, JPG, WEBP images to high-quality SVG vector files',
  },
  dropzone: {
    title: 'Drop images here',
    subtitle: 'or click to select files',
    dragActive: 'Drop the files!',
    formats: 'Supported formats: PNG, JPG, WEBP (max 10MB)',
  },
  settings: {
    title: 'Conversion Settings',
    colorCount: 'Color Count',
    colorCountDesc: 'Number of colors in output SVG (2-32)',
    particleSize: 'Particle Size',
    particleSizeDesc: 'Circle radius (1-10)',
    particleDensity: 'Particle Density',
    particleDensityDesc: 'Sampling density (10-100%)',
    blur: 'Blur',
    blurDesc: 'Blur strength for noise reduction',
    reset: 'Reset Settings',
  },
  actions: {
    convert: 'Convert',
    converting: 'Converting...',
    download: 'Download',
    downloadAll: 'Download All',
    copy: 'Copy',
    copied: 'Copied!',
    clear: 'Clear All',
    remove: 'Remove',
  },
  results: {
    title: 'Conversion Results',
    noResults: 'No converted images',
    svgCode: 'SVG Code',
    preview: 'Preview',
    colors: 'Extracted Colors',
    processingTime: 'Processing Time',
    seconds: 'sec',
  },
  errors: {
    invalidFile: 'Unsupported file format',
    conversionFailed: 'Conversion failed',
    fileTooLarge: 'File size too large (max 10MB)',
    noImages: 'Please add images to convert',
  },
  footer: {
    developer: 'Developer',
    github: 'GitHub',
    madeWith: 'Made with ❤️',
  },
  theme: {
    light: 'Light Mode',
    dark: 'Dark Mode',
  },
  language: {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
    zh: '中文',
  },
};
