import React, { useCallback } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { Upload, Image, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store';
import { getTranslation } from '../../i18n';
import { validateFileType, validateFileSize } from '../../utils';
import toast from 'react-hot-toast';
import './Dropzone.css';

/**
 * 이미지 드롭존 컴포넌트
 * 드래그 앤 드롭 및 클릭으로 이미지 업로드 지원
 */
export const Dropzone: React.FC = () => {
  const { language, conversionMode, addImages } = useAppStore();
  const t = getTranslation(language);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles: File[] = [];

    acceptedFiles.forEach(file => {
      if (!validateFileType(file)) {
        toast.error(`${file.name}: ${t.errors.invalidFile}`);
        return;
      }

      if (!validateFileSize(file)) {
        toast.error(`${file.name}: ${t.errors.fileTooLarge}`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      addImages(validFiles);
    }
  }, [addImages, t.errors]);

  // 변환 모드에 따라 허용 파일 형식 변경
  const acceptedFileTypes: Accept = conversionMode === 'image-to-svg'
    ? {
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/webp': ['.webp'],
      }
    : {
        'image/svg+xml': ['.svg'],
      };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${isDragReject ? 'dropzone-reject' : ''}`}
    >
      <input {...getInputProps()} />
      
      <div className="dropzone-content">
        {isDragReject ? (
          <>
            <div className="dropzone-icon dropzone-icon-error">
              <AlertCircle size={48} strokeWidth={1.5} />
            </div>
            <p className="dropzone-title">{t.errors.invalidFile}</p>
          </>
        ) : isDragActive ? (
          <>
            <div className="dropzone-icon dropzone-icon-active">
              <Image size={48} strokeWidth={1.5} />
            </div>
            <p className="dropzone-title">{t.dropzone.dragActive}</p>
          </>
        ) : (
          <>
            <div className="dropzone-icon">
              <Upload size={48} strokeWidth={1.5} />
            </div>
            <p className="dropzone-title">
              {conversionMode === 'image-to-svg' ? t.dropzone.title : t.dropzone.titleSvg}
            </p>
            <p className="dropzone-subtitle">{t.dropzone.subtitle}</p>
            <p className="dropzone-formats">
              {conversionMode === 'image-to-svg' ? t.dropzone.formats : t.dropzone.formatsSvg}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
