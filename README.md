# SVG Converter 🎨

A web application for bidirectional conversion between images and SVG files.

🌐 **Live Demo**: https://img-to-svg-converter.vercel.app (Auto-generated after Vercel deployment)

## ✨ Features

### Bidirectional Conversion
- **Image → SVG**: Convert PNG, JPG, WEBP images to vector SVG
- **SVG → Image**: Convert SVG files to PNG, JPG, or WEBP images
- **One-Click Toggle**: Easy mode switching via header toggle button

### Core Capabilities
- **Particle-Based Rendering**: High-quality SVG generation using 2-pass grid system
- **Multiple Export Formats**: SVG, PNG (2× resolution), JPG (white background), WEBP (optimized)
- **Drag & Drop**: Simple file upload interface
- **Color Analysis**: Automatic extraction of unique colors from images
- **Customization**: Adjust particle size, density, blur strength, and more

### User Experience
- **Dark/Light Mode**: Auto-sync with system theme
- **Multi-language Support**: Korean, English, Japanese, Chinese (auto-detect)
- **SVG Code Preview**: Instantly view and copy conversion results
- **Batch Processing**: Convert multiple images simultaneously

## 🚀 Getting Started

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Vercel Deployment

### Method 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Method 2: GitHub Integration (Auto Deploy)

1. **Create Vercel Account**
   - Visit https://vercel.com
   - Sign in with GitHub account

2. **Import Project**
   - Click "New Project"
   - Select GitHub repository
   - Framework: Vite (auto-detected)
   - Click "Deploy"

3. **Auto Deploy Setup**
   - Push to main branch → auto deploy
   - Each PR creates preview deployment

## 📖 How to Use

### Image → SVG Conversion

1. Select **"Image to SVG"** mode in header
2. Upload image files (PNG, JPG, WEBP)
3. Adjust particle size, density, blur settings
4. Click "Convert" button
5. Download as SVG, PNG, JPG, WEBP or copy code

### SVG → Image Conversion

1. Select **"SVG to Image"** mode in header
2. Upload SVG file
3. Click "Convert" button (no settings required)
4. Download as PNG, JPG, or WEBP format

## 🛠️ Tech Stack

- **React 19** + TypeScript
- **Vite** - Build tool
- **Zustand** - State management
- **react-dropzone** - File upload
- **lucide-react** - Icons
- **react-hot-toast** - Notifications

## 📁 Project Structure

```
src/
├── components/          # UI components
│   ├── Header/         # Header (theme/language/mode toggle)
│   ├── Footer/         # Footer (developer info)
│   ├── Dropzone/       # File upload area
│   ├── ImageList/      # Uploaded images list
│   ├── Settings/       # Conversion settings panel
│   └── Results/        # Conversion results display
├── i18n/               # Translation files
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── imageConverter.ts  # Image → SVG conversion logic
│   ├── svgToImage.ts      # SVG → Image conversion logic
│   └── security.ts        # Security utilities
└── App.tsx             # Main app component
```

## 🔒 Security Features

- **CSP (Content Security Policy)**: XSS attack prevention
- **Input Validation**: File type/size verification
- **SVG Sanitization**: Malicious code removal
- **Rate Limiting**: Prevent excessive requests
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.

## 🎨 Conversion Algorithm (Image → SVG)

1. **Image Preprocessing**: Resize to max 600×600, optional Gaussian blur
2. **Background Detection**: Auto-detect background color via 4-corner pixel sampling
3. **2-Pass Grid Sampling**:
   - First pass: Aligned grid sampling
   - Second pass: Offset grid to fill gaps
4. **Color Extraction**: Unique color extraction with luminance-based filtering
5. **SVG Generation**: Convert each particle to SVG circle element

## 🖼️ Export Formats

- **SVG**: Vector graphics (lossless, scalable)
- **PNG**: 2× resolution, transparent background support
- **JPG**: White background, 95% quality
- **WEBP**: Optimized format, customizable quality

## 📄 License

MIT License

## 👨‍💻 Developer

- GitHub: [@jiwonjae-svg](https://github.com/jiwonjae-svg)

---

Made with ❤️
