import React from 'react';
import { Moon, Sun, Languages } from 'lucide-react';
import { useAppStore } from '../../store';
import { getTranslation } from '../../i18n';
import type { Language } from '../../types';
import './Header.css';

/**
 * 헤더 컴포넌트
 * 앱 제목, 테마 토글, 언어 선택 기능 포함
 */
export const Header: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage } = useAppStore();
  const t = getTranslation(language);

  const languages: { code: Language; label: string }[] = [
    { code: 'ko', label: t.language.ko },
    { code: 'en', label: t.language.en },
    { code: 'ja', label: t.language.ja },
    { code: 'zh', label: t.language.zh },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <div className="logo">
            <svg 
              viewBox="0 0 40 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="logo-icon"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="36" height="36" rx="8" fill="url(#gradient)" />
              <path 
                d="M12 20C12 16 14 12 20 12C26 12 28 16 28 20C28 24 26 28 20 28C14 28 12 24 12 20Z" 
                fill="white" 
                fillOpacity="0.9"
              />
              <path 
                d="M16 20L20 16L24 20L20 24L16 20Z" 
                fill="url(#gradient)"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="header-title">
            <h1>{t.app.title}</h1>
            <span className="header-subtitle">{t.app.subtitle}</span>
          </div>
        </div>

        <div className="header-controls">
          {/* 언어 선택 */}
          <div className="language-selector">
            <Languages size={18} aria-hidden="true" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label="Select language"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* 테마 토글 */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? t.theme.dark : t.theme.light}
            title={theme === 'light' ? t.theme.dark : t.theme.light}
          >
            {theme === 'light' ? (
              <Moon size={20} aria-hidden="true" />
            ) : (
              <Sun size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
