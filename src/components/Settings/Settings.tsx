import React from 'react';
import { Settings as SettingsIcon, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store';
import { getTranslation } from '../../i18n';
import './Settings.css';

/**
 * 변환 설정 컴포넌트
 */
export const Settings: React.FC = () => {
  const { settings, updateSettings, resetSettings, language } = useAppStore();
  const t = getTranslation(language);

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <div className="settings-title">
          <SettingsIcon size={18} />
          <h3>{t.settings.title}</h3>
        </div>
        <button
          className="btn btn-text btn-sm"
          onClick={resetSettings}
          aria-label={t.settings.reset}
        >
          <RotateCcw size={14} />
          {t.settings.reset}
        </button>
      </div>

      <div className="settings-grid">
        {/* 파티클 크기 */}
        <div className="setting-item">
          <div className="setting-label">
            <label htmlFor="particleSize">{t.settings.particleSize}</label>
            <span className="setting-value">{settings.particleSize}</span>
          </div>
          <input
            type="range"
            id="particleSize"
            min="1"
            max="10"
            step="0.5"
            value={settings.particleSize}
            onChange={(e) => updateSettings({ particleSize: Number(e.target.value) })}
            className="slider"
          />
          <p className="setting-desc">{t.settings.particleSizeDesc}</p>
        </div>

        {/* 파티클 밀도 */}
        <div className="setting-item">
          <div className="setting-label">
            <label htmlFor="particleDensity">{t.settings.particleDensity}</label>
            <span className="setting-value">{settings.particleDensity}%</span>
          </div>
          <input
            type="range"
            id="particleDensity"
            min="10"
            max="100"
            step="5"
            value={settings.particleDensity}
            onChange={(e) => updateSettings({ particleDensity: Number(e.target.value) })}
            className="slider"
          />
          <p className="setting-desc">{t.settings.particleDensityDesc}</p>
        </div>

        {/* 블러 */}
        <div className="setting-item">
          <div className="setting-label">
            <label htmlFor="blur">{t.settings.blur}</label>
            <span className="setting-value">{settings.blur}</span>
          </div>
          <input
            type="range"
            id="blur"
            min="0"
            max="5"
            step="0.5"
            value={settings.blur}
            onChange={(e) => updateSettings({ blur: Number(e.target.value) })}
            className="slider"
          />
          <p className="setting-desc">{t.settings.blurDesc}</p>
        </div>
      </div>
    </div>
  );
};
