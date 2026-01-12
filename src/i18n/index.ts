import type { Language, Translations } from '../types';
import { ko } from './ko';
import { en } from './en';
import { ja } from './ja';
import { zh } from './zh';

/**
 * 언어별 번역 데이터 맵
 */
export const translations: Record<Language, Translations> = {
  ko,
  en,
  ja,
  zh,
};

/**
 * 현재 언어에 맞는 번역 가져오기
 */
export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations.en;
};

/**
 * 브라우저 기본 언어 감지
 */
export const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  const supportedLanguages: Language[] = ['ko', 'en', 'ja', 'zh'];
  
  if (supportedLanguages.includes(browserLang as Language)) {
    return browserLang as Language;
  }
  
  return 'en';
};

export { ko, en, ja, zh };
