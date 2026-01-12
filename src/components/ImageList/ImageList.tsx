import React from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store';
import { getTranslation } from '../../i18n';
import './ImageList.css';

/**
 * 업로드된 이미지 목록 컴포넌트
 */
export const ImageList: React.FC = () => {
  const { images, removeImage, clearImages, language } = useAppStore();
  const t = getTranslation(language);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="image-list">
      <div className="image-list-header">
        <h3 className="image-list-title">
          {images.length} {images.length === 1 ? 'image' : 'images'}
        </h3>
        <button
          className="btn btn-text"
          onClick={clearImages}
          aria-label={t.actions.clear}
        >
          {t.actions.clear}
        </button>
      </div>

      <div className="image-grid">
        {images.map((image) => (
          <div key={image.id} className="image-item">
            <div className="image-preview">
              <img
                src={image.preview}
                alt={image.file.name}
                loading="lazy"
              />
              <div className={`image-status image-status-${image.status}`}>
                {image.status === 'processing' && (
                  <div className="spinner" aria-label="Processing" />
                )}
                {image.status === 'completed' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {image.status === 'error' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>
            </div>
            <button
              className="image-remove"
              onClick={() => removeImage(image.id)}
              aria-label={t.actions.remove}
            >
              <X size={14} />
            </button>
            <p className="image-name" title={image.file.name}>
              {image.file.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
