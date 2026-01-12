import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../store';
import { getTranslation } from '../../i18n';
import { safeExternalLinkProps } from '../../utils';
import './Footer.css';

/**
 * 푸터 컴포넌트
 * 개발자 정보, GitHub 링크, 저작권 등
 */
export const Footer: React.FC = () => {
  const { language } = useAppStore();
  const t = getTranslation(language);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <p className="footer-made">
            {t.footer.madeWith}
          </p>
          <p className="footer-developer">
            <span>{t.footer.developer}:</span>
            <a
              href="https://github.com/yourusername"
              {...safeExternalLinkProps}
              className="footer-link"
            >
              @YourUsername
              <ExternalLink size={12} />
            </a>
          </p>
        </div>

        <div className="footer-links">
          <a
            href="https://github.com/yourusername/project-svg"
            {...safeExternalLinkProps}
            className="footer-github"
            aria-label="GitHub Repository"
          >
            <Github size={20} />
            <span>{t.footer.github}</span>
          </a>
        </div>

        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} SVG Converter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
