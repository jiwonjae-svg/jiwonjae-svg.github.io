import type { Translations } from '../types';

export const ja: Translations = {
  app: {
    title: 'SVG変換ツール',
    subtitle: '画像をベクターに',
    description: 'PNG、JPG、WEBP画像を高品質なSVGベクターファイルに変換します',
  },
  dropzone: {
    title: '画像をここにドロップ',
    subtitle: 'またはクリックしてファイルを選択',
    dragActive: 'ファイルをドロップ！',
    formats: '対応形式：PNG、JPG、WEBP（最大10MB）',
  },
  settings: {
    title: '変換設定',
    colorCount: '色の数',
    colorCountDesc: '出力SVGの色数（2-32）',
    particleSize: 'パーティクルサイズ',
    particleSizeDesc: '円の半径（1-10）',
    particleDensity: 'パーティクル密度',
    particleDensityDesc: 'サンプリング密度（10-100%）',
    blur: 'ぼかし',
    blurDesc: 'ノイズ除去のためのぼかし強度',
    reset: '設定をリセット',
  },
  actions: {
    convert: '変換',
    converting: '変換中...',
    download: 'ダウンロード',
    downloadAll: '全てダウンロード',
    copy: 'コピー',
    copied: 'コピー完了！',
    clear: '全て削除',
    remove: '削除',
  },
  results: {
    title: '変換結果',
    noResults: '変換された画像はありません',
    svgCode: 'SVGコード',
    preview: 'プレビュー',
    colors: '抽出された色',
    processingTime: '処理時間',
    seconds: '秒',
  },
  errors: {
    invalidFile: 'サポートされていないファイル形式です',
    conversionFailed: '変換に失敗しました',
    fileTooLarge: 'ファイルサイズが大きすぎます（最大10MB）',
    noImages: '変換する画像を追加してください',
  },
  footer: {
    developer: '開発者',
    github: 'GitHub',
    madeWith: '❤️で作りました',
  },
  theme: {
    light: 'ライトモード',
    dark: 'ダークモード',
  },
  language: {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
    zh: '中文',
  },
};
