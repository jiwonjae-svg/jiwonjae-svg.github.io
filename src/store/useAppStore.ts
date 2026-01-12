import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AppState, 
  ConversionSettings, 
  ConversionResult, 
  UploadedImage, 
  ImageStatus,
  Theme,
  Language 
} from '../types';
import { detectBrowserLanguage, getTranslation } from '../i18n';

/**
 * 기본 변환 설정 (파티클 기반)
 */
const defaultSettings: ConversionSettings = {
  colorCount: 8,
  particleSize: 2,
  particleDensity: 50,
  blur: 1,
};

/**
 * 고유 ID 생성
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 시스템 테마 감지
 */
const detectSystemTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

/**
 * 전역 상태 스토어
 */
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 테마 상태
      theme: detectSystemTheme(),
      setTheme: (theme: Theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
      
      // 언어 상태
      language: detectBrowserLanguage(),
      setLanguage: (language: Language) => set({ language }),
      
      // 이미지 상태
      images: [],
      addImages: (files: File[]) => {
        const newImages: UploadedImage[] = files.map(file => ({
          id: generateId(),
          file,
          preview: URL.createObjectURL(file),
          status: 'idle' as ImageStatus,
        }));
        set(state => ({ images: [...state.images, ...newImages] }));
      },
      removeImage: (id: string) => {
        set(state => {
          const imageToRemove = state.images.find(img => img.id === id);
          if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview);
          }
          return { images: state.images.filter(img => img.id !== id) };
        });
      },
      clearImages: () => {
        const { images } = get();
        images.forEach(img => URL.revokeObjectURL(img.preview));
        set({ images: [] });
      },
      updateImageStatus: (id: string, status: ImageStatus, error?: string) => {
        set(state => ({
          images: state.images.map(img => 
            img.id === id ? { ...img, status, error } : img
          ),
        }));
      },
      
      // 설정 상태
      settings: defaultSettings,
      updateSettings: (newSettings: Partial<ConversionSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      resetSettings: () => set({ settings: defaultSettings }),
      
      // 결과 상태
      results: [],
      addResult: (result: ConversionResult) => {
        set(state => ({ results: [result, ...state.results] }));
      },
      removeResult: (id: string) => {
        set(state => ({ results: state.results.filter(r => r.id !== id) }));
      },
      clearResults: () => set({ results: [] }),
      
      // 처리 상태
      isProcessing: false,
      setProcessing: (processing: boolean) => set({ isProcessing: processing }),
    }),
    {
      name: 'svg-converter-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        settings: state.settings,
      }),
    }
  )
);

/**
 * 번역 훅
 */
export const useTranslation = () => {
  const { language } = useAppStore();
  return getTranslation(language);
};
