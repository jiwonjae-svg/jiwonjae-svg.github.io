import React, { useState } from 'react';
import { Download, Copy, Check, Trash2, Code, Image, Clock, FileDown } from 'lucide-react';
import { useAppStore } from '../../store';
import { getTranslation } from '../../i18n';
import { 
  downloadSvg, 
  copySvgToClipboard, 
  sanitizeSvg, 
  escapeHtml,
  convertSvgToPng,
  convertSvgToJpg,
  convertSvgToWebp,
  downloadBlob
} from '../../utils';
import type { ConversionResult } from '../../types';
import toast from 'react-hot-toast';
import './Results.css';

/**
 * 변환 결과 컴포넌트
 */
export const Results: React.FC = () => {
  const { results, removeResult, clearResults, language } = useAppStore();
  const t = getTranslation(language);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, 'preview' | 'code'>>({});
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<string | null>(null);

  const handleCopy = async (result: ConversionResult) => {
    try {
      await copySvgToClipboard(sanitizeSvg(result.svgCode));
      setCopiedId(result.id);
      toast.success(t.actions.copied);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDownloadSvg = (result: ConversionResult) => {
    downloadSvg(sanitizeSvg(result.svgCode), result.originalImage.file.name);
    setDownloadMenuOpen(null);
  };

  const handleDownloadPng = async (result: ConversionResult) => {
    try {
      const blob = await convertSvgToPng(result.svgCode, 600, 600, 2);
      const filename = result.originalImage.file.name.replace(/\.[^/.]+$/, '.png');
      downloadBlob(blob, filename);
      setDownloadMenuOpen(null);
      toast.success('PNG downloaded!');
    } catch (error) {
      toast.error('Failed to convert to PNG');
      console.error(error);
    }
  };

  const handleDownloadJpg = async (result: ConversionResult) => {
    try {
      const blob = await convertSvgToJpg(result.svgCode, 600, 600, 0.95, 2);
      const filename = result.originalImage.file.name.replace(/\.[^/.]+$/, '.jpg');
      downloadBlob(blob, filename);
      setDownloadMenuOpen(null);
      toast.success('JPG downloaded!');
    } catch (error) {
      toast.error('Failed to convert to JPG');
      console.error(error);
    }
  };

  const handleDownloadWebp = async (result: ConversionResult) => {
    try {
      const blob = await convertSvgToWebp(result.svgCode, 600, 600, 0.95, 2);
      const filename = result.originalImage.file.name.replace(/\.[^/.]+$/, '.webp');
      downloadBlob(blob, filename);
      setDownloadMenuOpen(null);
      toast.success('WEBP downloaded!');
    } catch (error) {
      toast.error('Failed to convert to WEBP');
      console.error(error);
    }
  };

  const handleDownloadAll = () => {
    results.forEach((result) => {
      downloadSvg(sanitizeSvg(result.svgCode), result.originalImage.file.name);
    });
  };

  const getActiveTab = (id: string): 'preview' | 'code' => {
    return activeTab[id] || 'preview';
  };

  const toggleTab = (id: string, tab: 'preview' | 'code') => {
    setActiveTab((prev) => ({ ...prev, [id]: tab }));
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="results-section">
      <div className="results-header">
        <h2 className="results-title">{t.results.title}</h2>
        <div className="results-actions">
          {results.length > 1 && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleDownloadAll}
            >
              <Download size={14} />
              {t.actions.downloadAll}
            </button>
          )}
          <button
            className="btn btn-text btn-sm"
            onClick={clearResults}
          >
            <Trash2 size={14} />
            {t.actions.clear}
          </button>
        </div>
      </div>

      <div className="results-grid">
        {results.map((result) => (
          <div key={result.id} className="result-card">
            <div className="result-card-header">
              <div className="result-tabs">
                <button
                  className={`result-tab ${getActiveTab(result.id) === 'preview' ? 'active' : ''}`}
                  onClick={() => toggleTab(result.id, 'preview')}
                >
                  <Image size={14} />
                  {t.results.preview}
                </button>
                <button
                  className={`result-tab ${getActiveTab(result.id) === 'code' ? 'active' : ''}`}
                  onClick={() => toggleTab(result.id, 'code')}
                >
                  <Code size={14} />
                  {t.results.svgCode}
                </button>
              </div>
              <button
                className="btn btn-icon btn-sm"
                onClick={() => removeResult(result.id)}
                aria-label={t.actions.remove}
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="result-content">
              {getActiveTab(result.id) === 'preview' ? (
                <div className="result-preview">
                  <div className="preview-comparison">
                    <div className="preview-original">
                      <span className="preview-label">Original</span>
                      <img
                        src={result.originalImage.preview}
                        alt="Original"
                        loading="lazy"
                      />
                    </div>
                    <div className="preview-svg">
                      <span className="preview-label">SVG</span>
                      <img
                        src={result.svgDataUrl}
                        alt="SVG Result"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="result-code">
                  <pre>
                    <code>{escapeHtml(result.svgCode)}</code>
                  </pre>
                </div>
              )}
            </div>

            <div className="result-meta">
              <div className="result-meta-item">
                <Clock size={14} />
                <span>{result.processingTime.toFixed(2)}{t.results.seconds}</span>
              </div>
            </div>

            <div className="result-card-footer">
              <button
                className="btn btn-secondary"
                onClick={() => handleCopy(result)}
              >
                {copiedId === result.id ? (
                  <>
                    <Check size={16} />
                    {t.actions.copied}
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    {t.actions.copy}
                  </>
                )}
              </button>
              
              <div className="download-menu-wrapper">
                <button
                  className="btn btn-primary"
                  onClick={() => setDownloadMenuOpen(downloadMenuOpen === result.id ? null : result.id)}
                >
                  <Download size={16} />
                  {t.actions.download}
                </button>
                
                {downloadMenuOpen === result.id && (
                  <div className="download-menu">
                    <button
                      className="download-menu-item"
                      onClick={() => handleDownloadSvg(result)}
                    >
                      <FileDown size={14} />
                      {t.actions.downloadSvg}
                    </button>
                    <button
                      className="download-menu-item"
                      onClick={() => handleDownloadPng(result)}
                    >
                      <FileDown size={14} />
                      {t.actions.downloadPng}
                    </button>
                    <button
                      className="download-menu-item"
                      onClick={() => handleDownloadJpg(result)}
                    >
                      <FileDown size={14} />
                      {t.actions.downloadJpg}
                    </button>
                    <button
                      className="download-menu-item"
                      onClick={() => handleDownloadWebp(result)}
                    >
                      <FileDown size={14} />
                      {t.actions.downloadWebp}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
