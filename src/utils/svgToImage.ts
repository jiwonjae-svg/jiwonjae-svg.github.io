/**
 * SVG를 이미지로 변환하는 유틸리티 함수
 */

/**
 * SVG 문자열을 PNG 이미지로 변환
 */
export const convertSvgToPng = async (
  svgCode: string,
  width: number,
  height: number,
  scale: number = 2
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      canvas.width = width * scale;
      canvas.height = height * scale;

      const img = new Image();
      const svgBlob = new Blob([svgCode], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        }, 'image/png');
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * SVG 문자열을 JPG 이미지로 변환
 */
export const convertSvgToJpg = async (
  svgCode: string,
  width: number,
  height: number,
  quality: number = 0.95,
  scale: number = 2,
  backgroundColor: string = '#ffffff'
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      canvas.width = width * scale;
      canvas.height = height * scale;

      // 흰색 배경 채우기
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      const svgBlob = new Blob([svgCode], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create JPG blob'));
          }
        }, 'image/jpeg', quality);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * SVG 문자열을 WEBP 이미지로 변환
 */
export const convertSvgToWebp = async (
  svgCode: string,
  width: number,
  height: number,
  quality: number = 0.95,
  scale: number = 2,
  backgroundColor?: string
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      canvas.width = width * scale;
      canvas.height = height * scale;

      // 배경색이 지정된 경우 채우기
      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const img = new Image();
      const svgBlob = new Blob([svgCode], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create WEBP blob'));
          }
        }, 'image/webp', quality);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Blob을 파일로 다운로드
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
