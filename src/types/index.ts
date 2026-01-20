/**
 * 애플리케이션 전역 타입 정의
 */

// 지원 언어 타입
export type Language = 'ko' | 'en' | 'ja' | 'zh';

// 테마 타입
export type Theme = 'light' | 'dark';

// 변환 모드 타입
export type ConversionMode = 'image-to-svg' | 'svg-to-image';

// 이미지 파일 상태
export type ImageStatus = 'idle' | 'processing' | 'completed' | 'error';

// 업로드된 이미지 정보
export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  status: ImageStatus;
  error?: string;
}

// 변환 설정 (파티클 기반)
export interface ConversionSettings {
  colorCount: number;        // 색상 수 (2-32)
  particleSize: number;      // 원 크기 (1-10)
  particleDensity: number;   // 샘플링 밀도 (1-100%)
  blur: number;              // 블러 강도 (0-5)
}

// 변환 결과
export interface ConversionResult {
  id: string;
  originalImage: UploadedImage;
  svgCode: string;
  svgDataUrl: string;
  colors: string[];
  processingTime: number;
}

// 앱 상태
export interface AppState {
  // 테마
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  
  // 언어
  language: Language;
  setLanguage: (language: Language) => void;
  
  // 변환 모드
  conversionMode: ConversionMode;
  setConversionMode: (mode: ConversionMode) => void;
  toggleConversionMode: () => void;
  
  // 이미지
  images: UploadedImage[];
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  updateImageStatus: (id: string, status: ImageStatus, error?: string) => void;
  
  // 설정
  settings: ConversionSettings;
  updateSettings: (settings: Partial<ConversionSettings>) => void;
  resetSettings: () => void;
  
  // 결과
  results: ConversionResult[];
  addResult: (result: ConversionResult) => void;
  removeResult: (id: string) => void;
  clearResults: () => void;
  
  // 처리 상태
  isProcessing: boolean;
  setProcessing: (processing: boolean) => void;
}

// 번역 키 타입
export interface Translations {
  app: {
    title: string;
    subtitle: string;
    description: string;
    descriptionSvgToImage: string;
  };
  mode: {
    imageToSvg: string;
    svgToImage: string;
  };
  dropzone: {
    title: string;
    titleSvg: string;
    subtitle: string;
    dragActive: string;
    formats: string;
    formatsSvg: string;
  };
  settings: {
    title: string;
    colorCount: string;
    colorCountDesc: string;
    particleSize: string;
    particleSizeDesc: string;
    particleDensity: string;
    particleDensityDesc: string;
    blur: string;
    blurDesc: string;
    reset: string;
  };
  actions: {
    convert: string;
    converting: string;
    download: string;
    downloadAll: string;
    downloadSvg: string;
    downloadPng: string;
    downloadJpg: string;
    downloadWebp: string;
    copy: string;
    copied: string;
    clear: string;
    remove: string;
  };
  results: {
    title: string;
    noResults: string;
    svgCode: string;
    preview: string;
    colors: string;
    processingTime: string;
    seconds: string;
  };
  errors: {
    invalidFile: string;
    conversionFailed: string;
    fileTooLarge: string;
    noImages: string;
  };
  footer: {
    developer: string;
    github: string;
    madeWith: string;
  };
  theme: {
    light: string;
    dark: string;
  };
  language: {
    ko: string;
    en: string;
    ja: string;
    zh: string;
  };
}
