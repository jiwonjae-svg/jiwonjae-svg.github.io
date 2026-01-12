/**
 * 보안 유틸리티 함수
 * XSS, 입력 검증 등 보안 관련 헬퍼 함수들
 */

/**
 * HTML 특수문자 이스케이프 (XSS 방지)
 */
export const escapeHtml = (str: string): string => {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  
  return str.replace(/[&<>"'`=/]/g, char => htmlEntities[char] || char);
};

/**
 * SVG 코드 정제 (잠재적 위험 요소 제거)
 */
export const sanitizeSvg = (svgCode: string): string => {
  // script 태그 제거
  let sanitized = svgCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // on* 이벤트 핸들러 제거
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // javascript: URL 제거
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // data: URL에서 위험한 MIME 타입 제거 (text/html 등)
  sanitized = sanitized.replace(/data:text\/html/gi, 'data:text/plain');
  
  // xlink:href에서 javascript: 제거
  sanitized = sanitized.replace(/xlink:href\s*=\s*["']javascript:[^"']*["']/gi, '');
  
  // foreignObject 제거 (HTML 삽입 가능)
  sanitized = sanitized.replace(/<foreignObject\b[^<]*(?:(?!<\/foreignObject>)<[^<]*)*<\/foreignObject>/gi, '');
  
  return sanitized;
};

/**
 * 파일 타입 검증
 */
export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  return allowedTypes.includes(file.type);
};

/**
 * 파일 크기 검증 (10MB 제한)
 */
export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * 파일명 정제
 */
export const sanitizeFilename = (filename: string): string => {
  // 경로 구분자 및 위험 문자 제거
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\.\./g, '_')
    .replace(/^\.+/, '_')
    .substring(0, 255);
};

/**
 * URL 유효성 검증
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:', 'blob:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * 안전한 외부 링크 속성 생성
 */
export const safeExternalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer nofollow',
};

/**
 * CSP 메타 태그 생성 (index.html에 추가됨)
 */
export const getCSPContent = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagservices.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://pagead2.googlesyndication.com",
    "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
};

/**
 * Rate limiting 구현 (클라이언트 사이드)
 */
class RateLimiter {
  private timestamps: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canProceed(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);
    
    if (this.timestamps.length >= this.maxRequests) {
      return false;
    }
    
    this.timestamps.push(now);
    return true;
  }

  getRemainingTime(): number {
    if (this.timestamps.length === 0) return 0;
    const oldest = Math.min(...this.timestamps);
    return Math.max(0, this.windowMs - (Date.now() - oldest));
  }
}

export const conversionRateLimiter = new RateLimiter(20, 60000); // 분당 20회 제한
