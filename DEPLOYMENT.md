# 배포 가이드

## 📦 배포 전 체크리스트

### 1. 설정 파일 업데이트

#### package.json
```json
{
  "homepage": "https://yourusername.github.io/project-svg"
}
```
- `yourusername`을 실제 GitHub 사용자명으로 변경
- `project-svg`를 실제 레포지토리 이름으로 변경

#### vite.config.ts
```typescript
base: '/project-svg/'
```
- 레포지토리 이름과 일치하도록 수정

#### public/sitemap.xml & robots.txt
- URL을 실제 배포 URL로 변경

---

## 💰 Google AdSense 설정 가이드

### 1. AdSense 계정 생성 및 사이트 등록

1. **AdSense 가입**
   - https://www.google.com/adsense 방문
   - Google 계정으로 로그인
   - 사이트 URL 입력 (예: https://yourusername.github.io/project-svg)

2. **승인 대기**
   - 사이트 콘텐츠가 충분해야 함 (최소 10-20개 이상의 페이지 권장)
   - 오리지널 콘텐츠 필수
   - AdSense 정책 준수 확인
   - 승인까지 보통 1-2주 소요

### 2. AdSense 코드 삽입

#### index.html에 AdSense 스크립트 추가
```html
<!-- 승인 후 주석 해제하고 실제 클라이언트 ID로 교체 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" 
        crossorigin="anonymous"></script>
```

**클라이언트 ID 찾는 방법:**
- AdSense 대시보드 → 계정 → 계정 정보
- "게시자 ID"가 클라이언트 ID (ca-pub-으로 시작하는 16자리 숫자)

### 3. 광고 단위 생성 및 코드 얻기

1. **AdSense 대시보드 접속**
   - 좌측 메뉴 → "광고" → "광고 단위별"

2. **새 광고 단위 만들기**
   - "디스플레이 광고" 선택 (가로형 배너)
   - 이름 지정: "상단 배너", "중간 광고", "하단 배너" 등
   - 크기: "반응형" 선택 (권장)
   - 저장 후 코드 복사

3. **광고 슬롯 ID 확인**
   - 생성된 코드에서 `data-ad-slot="1234567890"` 부분이 슬롯 ID
   - 각 광고 단위마다 고유한 슬롯 ID가 할당됨

### 4. App.tsx에 광고 코드 적용

현재 App.tsx에 이미 3개의 광고 위치가 설정되어 있습니다:

```tsx
{/* 상단 광고 */}
<div className="ad-container">
  <ins className="adsbygoogle"
    style={{ display: 'block' }}
    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"  // ← 여기에 실제 클라이언트 ID
    data-ad-slot="1234567890"                  // ← 여기에 실제 슬롯 ID
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
</div>

{/* 중간 광고 (인피드형) */}
<div className="ad-container">
  <ins className="adsbygoogle"
    style={{ display: 'block' }}
    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"  // ← 동일한 클라이언트 ID
    data-ad-slot="0987654321"                  // ← 다른 슬롯 ID
    data-ad-format="fluid"
    data-ad-layout-key="-fb+5w+4e-db+86"></ins>
</div>

{/* 하단 광고 */}
<div className="ad-container">
  <ins className="adsbygoogle"
    style={{ display: 'block' }}
    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"  // ← 동일한 클라이언트 ID
    data-ad-slot="1122334455"                  // ← 또 다른 슬롯 ID
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
</div>
```

**각 광고 위치에 맞는 슬롯 ID를 교체하세요!**

### 5. 광고 형식 종류

#### 디스플레이 광고 (Display Ads)
```html
<ins class="adsbygoogle"
  data-ad-format="auto"           <!-- 자동 크기 조절 -->
  data-full-width-responsive="true"></ins>
```
- 가장 일반적인 배너 형태
- 반응형으로 화면 크기에 맞게 조절됨

#### 인피드 광고 (In-feed Ads)
```html
<ins class="adsbygoogle"
  data-ad-format="fluid"
  data-ad-layout-key="-fb+5w+4e-db+86"></ins>
```
- 콘텐츠 사이에 자연스럽게 삽입
- 피드 형태의 리스트에 적합

#### 인아티클 광고 (In-article Ads)
```html
<ins class="adsbygoogle"
  data-ad-format="fluid"
  data-ad-layout="in-article"></ins>
```
- 긴 텍스트 콘텐츠 중간에 배치
- 읽는 흐름을 방해하지 않음

### 6. 광고 위치 권장사항

✅ **효과적인 위치:**
- 페이지 상단 (첫 화면에 보이는 위치)
- 콘텐츠 중간 (자연스러운 휴식 지점)
- 사이드바 (데스크톱)
- 콘텐츠 하단 (관련 콘텐츠와 함께)

❌ **피해야 할 위치:**
- 중요한 버튼 근처 (실수 클릭 유도)
- 너무 많은 광고 (사용자 경험 저하)
- 헤더/네비게이션 바로 아래

### 7. AdSense 정책 준수사항

⚠️ **반드시 준수해야 할 규칙:**

1. **클릭 유도 금지**
   - "광고를 클릭해주세요" 등의 문구 금지
   - 광고를 콘텐츠로 위장 금지

2. **성인/불법 콘텐츠 금지**
   - 폭력, 성인물, 저작권 침해 콘텐츠 불가

3. **자가 클릭 금지**
   - 본인이 자신의 광고 클릭 금지
   - 친구/가족에게 클릭 유도 금지

4. **광고 개수 제한**
   - 페이지당 광고 3개 권장 (현재 설정)
   - 너무 많으면 정책 위반

5. **트래픽 조작 금지**
   - 봇, 자동 새로고침 금지
   - 허위 트래픽 생성 금지

---

## 🚀 배포 방법

### 방법 1: GitHub Actions (권장)

1. **GitHub Pages 활성화**
   - GitHub 레포지토리 → Settings → Pages
   - Source: "GitHub Actions" 선택

2. **코드 푸시**
   ```bash
   git add .
   git commit -m "Setup deployment with AdSense"
   git push origin main
   ```

3. **자동 배포**
   - `.github/workflows/deploy.yml`이 자동으로 실행됨
   - Actions 탭에서 진행 상황 확인

### 방법 2: gh-pages 패키지

```bash
# 빌드 및 배포
npm run deploy
```

---

## 📋 배포 후 확인사항

### 1. 사이트 접속 확인
- https://yourusername.github.io/project-svg/
- 모든 페이지가 정상 작동하는지 확인

### 2. 광고 표시 확인
- 개발자 도구(F12) → Console 탭에서 에러 확인
- 광고가 로드되는지 확인 (처음에는 빈 공간일 수 있음)
- AdSense에서 승인 완료 시 1-2일 내 광고 표시

### 3. SEO 설정
- Google Search Console에 sitemap.xml 제출
- robots.txt 접근 가능한지 확인
- 메타 태그 검증 (Open Graph, Twitter Card)

### 4. 성능 테스트
- Lighthouse로 성능 점수 확인
- 모바일/데스크톱 반응형 확인
- 광고 로드로 인한 성능 저하 체크

---

## 💡 AdSense 수익 최적화 팁

1. **트래픽 증가**
   - 고품질 콘텐츠 작성
   - SEO 최적화
   - 소셜 미디어 공유

2. **광고 배치 최적화**
   - A/B 테스팅으로 최적 위치 찾기
   - 클릭률(CTR) 모니터링
   - 계절/이벤트에 따라 조정

3. **사용자 경험 유지**
   - 광고와 콘텐츠 균형 유지
   - 로딩 속도 최적화
   - 모바일 친화적 디자인

---

## 🔧 커스텀 도메인 설정 (선택사항)

1. **CNAME 파일 생성**
   ```
   public/CNAME
   ```
   내용:
   ```
   yourdomain.com
   ```

2. **DNS 설정**
   - A 레코드 추가:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - CNAME 레코드: `www` → `yourusername.github.io`

3. **GitHub 설정**
   - Settings → Pages → Custom domain에 도메인 입력
   - "Enforce HTTPS" 체크

---

## 📊 Google Analytics 추가 (선택사항)

### Analytics 4 설정

index.html에 추가:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Analytics와 AdSense 연동:**
- AdSense 대시보드 → 계정 → 설정
- Google Analytics 연결하여 상세한 트래픽 분석 가능

---

## 🐛 트러블슈팅

### 광고가 표시되지 않음

**원인 1: 승인 대기 중**
- AdSense 계정이 아직 승인되지 않음
- 해결: 승인 이메일을 기다리거나 승인 상태 확인

**원인 2: 클라이언트 ID 오류**
- `ca-pub-XXXXXXXXXXXXXXXX`가 실제 ID로 교체되지 않음
- 해결: AdSense 대시보드에서 정확한 ID 복사

**원인 3: 슬롯 ID 오류**
- `data-ad-slot` 값이 잘못됨
- 해결: 각 광고 단위의 정확한 슬롯 ID 확인

**원인 4: CSP 정책 차단**
- Content Security Policy에서 AdSense 도메인 차단
- 해결: index.html의 CSP 메타 태그 확인 (이미 설정됨)

**원인 5: 광고 차단기**
- 브라우저 확장 프로그램이 광고 차단 중
- 해결: 시크릿 모드나 다른 브라우저로 테스트

### 광고 승인이 계속 거부됨

**체크리스트:**
- [ ] 사이트에 충분한 콘텐츠가 있는가? (10개 이상 페이지)
- [ ] 오리지널 콘텐츠인가? (복사/붙여넣기 X)
- [ ] 금지된 콘텐츠가 없는가?
- [ ] 사이트가 6개월 이상 운영되었는가?
- [ ] 트래픽이 있는가? (일 방문자 100명 이상 권장)

### 404 오류

- `base` 경로가 레포지토리 이름과 일치하는지 확인
- `.nojekyll` 파일이 public 폴더에 있는지 확인

### 빌드 실패

- Node.js 버전 확인 (20 이상 권장)
- `npm ci`로 의존성 재설치

---

## 📱 PWA 기능

manifest.json이 설정되어 있어 PWA로 설치 가능합니다.

## 🔒 보안

현재 설정된 보안 헤더:
- Content Security Policy (CSP) - AdSense 도메인 포함
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer Policy

