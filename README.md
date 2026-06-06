# SVG Converter

Browser-based image/SVG conversion tool built with React, TypeScript, and Vite.

Live demo: [https://img-to-svg-converter.vercel.app](https://img-to-svg-converter.vercel.app)

## Product Summary

SVG Converter is a privacy-first browser tool for converting raster images into particle-style SVG output and exporting SVG files back into PNG, JPG, or WEBP images. It is designed as a practical portfolio project: the main focus is understandable client-side image processing, deterministic conversion logic, and clear documentation rather than a large feature set.

## Key Features

- Convert PNG, JPG, and WEBP images into SVG markup.
- Convert SVG files into PNG, JPG, or WEBP output.
- Tune image-to-SVG conversion with particle size, sampling density, and blur controls.
- Preview generated SVG code and copy or download results.
- Process multiple files through the browser UI.
- Switch between Korean, English, Japanese, and Chinese UI text.
- Validate file type and file size before conversion.

## Tech Stack

- React 19
- TypeScript
- Vite
- Zustand
- react-dropzone
- lucide-react
- react-hot-toast
- Vitest

## Architecture Or Data Flow

The app is a static frontend application. There is no backend conversion service in the runtime path.

Image-to-SVG data flow:

1. File input: the user drops or selects a local PNG, JPG, or WEBP file.
2. Browser object URL: the file is loaded into an `Image` element without uploading it.
3. Canvas pixel extraction: the image is drawn to a canvas, resized to a maximum 600px edge, and read with `getImageData`.
4. Optional blur: a separable Gaussian blur can smooth noisy input before sampling.
5. 2-Pass Grid Sampling: the first pass samples an aligned grid; the second pass samples offset midpoint positions to reduce visible gaps.
6. Luminance filtering: bright corner-derived background pixels and transparent pixels are filtered out.
7. Adjacent region merging: same-color neighboring particles are clustered into fewer SVG path groups.
8. SVG generation: sorted color groups are emitted as SVG circles or path elements.
9. Result handling: SVG text is wrapped in a local `Blob` and exposed through a browser object URL for preview/download.

SVG-to-image data flow:

1. SVG text is loaded in the browser.
2. The SVG is rendered into an `Image`.
3. Canvas exports the result as PNG, JPG, or WEBP.

## Privacy Model

- Uploaded image and SVG files are not uploaded by the conversion code.
- There is no server-side image processing path.
- Conversion input, Canvas pixel extraction, SVG generation, and export all happen in the browser.
- Generated files are created as local browser `Blob` object URLs.

## Technical Challenges

- Keeping image processing responsive while sampling enough pixels for recognizable SVG output.
- Making the conversion algorithm explainable: sampling, filtering, clustering, and SVG generation are separated into pure functions.
- Avoiding server-side processing so the app remains privacy-first and easy to host as a static site.
- Balancing SVG detail against output size by using density controls and adjacent same-color clustering.
- Preserving existing bidirectional conversion behavior while improving testability.

## What I Improved

- Refactored the image-to-SVG conversion core into pure functions in `src/utils/imageToSvgAlgorithm.ts`.
- Kept DOM-specific work in `src/utils/imageConverter.ts`, limited to image loading, canvas extraction, and browser download helpers.
- Added unit tests for RGB formatting, luminance, background detection, two-pass grid sampling, transparent pixel filtering, adjacent particle clustering, SVG generation, and blur output stability.
- Added a repeatable benchmark script for synthetic image sizes.
- Rewrote the README to explain product intent, architecture, privacy, performance, tests, and recruiter-facing context.
- Added `AGENTS.md` with repository-specific contribution guidance.

## How To Run Locally

```bash
npm install
npm run dev
```

The Vite dev server starts on port `3000` by default.

Production build preview:

```bash
npm run build
npm run preview
```

## Tests

Run unit tests:

```bash
npm test
```

Run lint:

```bash
npm run lint
```

Run production build:

```bash
npm run build
```

Run the image-to-SVG benchmark:

```bash
npm run benchmark
```

Current benchmark sample from `npm run benchmark` on the local development machine:

| Sample | Pixels | Median ms | Avg ms | Particles | SVG chars |
| --- | ---: | ---: | ---: | ---: | ---: |
| 128x128 | 16,384 | 2.10 | 2.22 | 512 | 23,703 |
| 256x256 | 65,536 | 7.06 | 7.42 | 2,048 | 95,711 |
| 512x512 | 262,144 | 27.87 | 29.34 | 8,192 | 386,885 |

Benchmark scope: synthetic RGBA input passed directly to the pixel-to-SVG pipeline with `particleSize=2`, `particleDensity=50`, and `blur=0`. It does not include browser file decoding, canvas drawing, download time, or UI rendering.

## 日本語サマリー

このプロジェクトは、私のポートフォリオ用に開発したアプリケーションです。
主な目的は、実用的な機能実装、パフォーマンス改善、セキュリティ設計、または多言語対応の経験を示すことです。

採用担当者向けには、ブラウザ内で完結する画像処理、プライバシーを重視した設計、アルゴリズムの説明可能性、単体テストとベンチマークによる品質確認を示すことを重視しています。

## License

MIT License

## Developer

- GitHub: [@jiwonjae-svg](https://github.com/jiwonjae-svg)
