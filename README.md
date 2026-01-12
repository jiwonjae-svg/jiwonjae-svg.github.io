# SVG Converter 🎨

이미지를 고품질 SVG 벡터 파일로 변환하는 웹 애플리케이션입니다.

## ✨ 주요 기능

- **이미지 → SVG 변환**: PNG, JPG, WEBP 이미지를 SVG로 변환
- **드래그 앤 드롭**: 간편한 파일 업로드
- **색상 분석**: K-means 클러스터링으로 대표 색상 추출
- **커스터마이징**: 색상 수, 임계값, 블러 등 세부 설정 가능
- **다크/라이트 모드**: 시스템 테마 연동
- **다국어 지원**: 한국어, English, 日本語, 中文
- **SVG 코드 미리보기**: 변환 결과 즉시 확인 및 복사

## 🚀 시작하기

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 미리보기
npm run preview
```

### GitHub Pages 배포

1. `vite.config.ts`에서 `base` 경로를 레포지토리 이름으로 수정
2. `package.json`에서 `homepage` URL 수정
3. 아래 명령어로 배포:

```bash
npm run deploy
```

또는 GitHub Actions를 통해 자동 배포됩니다 (main 브랜치 push 시).

## 🛠️ 기술 스택

- **React 19** + TypeScript
- **Vite** - 빌드 도구
- **Zustand** - 상태 관리
- **react-dropzone** - 파일 업로드
- **lucide-react** - 아이콘
- **react-hot-toast** - 알림

## 📁 프로젝트 구조

```
src/
├── components/          # UI 컴포넌트
│   ├── Header/         # 헤더 (테마/언어 전환)
│   ├── Footer/         # 푸터 (개발자 정보)
│   ├── Dropzone/       # 파일 업로드 영역
│   ├── ImageList/      # 업로드된 이미지 목록
│   ├── Settings/       # 변환 설정 패널
│   ├── Results/        # 변환 결과 표시
│   └── AdBanner/       # 광고 배너
├── i18n/               # 다국어 번역 파일
├── store/              # Zustand 상태 관리
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
│   ├── imageConverter.ts  # 이미지 → SVG 변환 로직
│   └── security.ts        # 보안 관련 유틸리티
└── App.tsx             # 메인 앱 컴포넌트
```

## 🔒 보안 기능

- **CSP (Content Security Policy)**: XSS 공격 방지
- **입력 검증**: 파일 타입/크기 검증
- **SVG 정제**: 악성 코드 제거
- **Rate Limiting**: 과도한 요청 방지
- **보안 헤더**: X-Frame-Options, X-Content-Type-Options 등

## 🎨 변환 알고리즘

1. **색상 분석**: K-means 클러스터링으로 이미지의 대표 색상 추출
2. **양자화**: 추출된 색상으로 이미지 단순화
3. **윤곽선 추적**: Marching Squares 알고리즘으로 각 색상 영역의 경계 추출
4. **경로 최적화**: Douglas-Peucker 알고리즘으로 경로 단순화
5. **SVG 생성**: 각 색상 레이어를 SVG path로 변환

## 📄 라이선스

MIT License

## 👨‍💻 개발자

- GitHub: [@yourusername](https://github.com/yourusername)

---

Made with ❤️
