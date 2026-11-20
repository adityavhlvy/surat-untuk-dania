import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Sparkles,
  Download,
  Image as ImageIcon,
  Palette,
  Layout,
  Check,
  Sliders,
  Mail
} from 'lucide-react';
import { MEMORIES } from '../data/memories';
import confetti from 'canvas-confetti';
import { sendEmail } from '../lib/email';

interface PhotoboxStudioProps {
  onNext: () => void;
}

type FrameLayout = 'strip-4' | 'grid-4' | 'strip-3' | 'grid-6';

interface FilterOption {
  id: string;
  name: string;
  filterStyle: string;
  canvasFilter: string;
}

const FILTERS: FilterOption[] = [
  { id: 'normal', name: 'Original', filterStyle: 'none', canvasFilter: 'none' },
  { id: 'vintage', name: 'Vintage 90s', filterStyle: 'sepia(45%) contrast(110%) brightness(95%)', canvasFilter: 'sepia(45%) contrast(1.1) brightness(0.95)' },
  { id: 'noir', name: 'Classic B&W', filterStyle: 'grayscale(100%) contrast(125%)', canvasFilter: 'grayscale(100%) contrast(1.25)' },
  { id: 'pastel', name: 'Pastel Dream', filterStyle: 'saturate(130%) brightness(108%) hue-rotate(-10deg)', canvasFilter: 'saturate(1.3) brightness(1.08) hue-rotate(-10deg)' },
  { id: 'golden', name: 'Golden Hour', filterStyle: 'sepia(25%) saturate(140%) brightness(105%)', canvasFilter: 'sepia(25%) saturate(1.4) brightness(1.05)' },
  { id: 'cyber', name: 'Neon Glow', filterStyle: 'contrast(120%) saturate(160%) hue-rotate(15deg)', canvasFilter: 'contrast(1.2) saturate(1.6) hue-rotate(15deg)' },
  { id: 'soft', name: 'Soft Velvet', filterStyle: 'brightness(105%) contrast(90%) saturate(110%)', canvasFilter: 'brightness(1.05) contrast(0.9) saturate(1.1)' },
];

const FRAME_COLORS = [
  { id: 'midnight', name: 'Midnight Gold', bg: '#0B0F24', border: '#FFD166', text: '#FFE3A8' },
  { id: 'white', name: 'Studio White', bg: '#FFFFFF', border: '#CBD5E1', text: '#0F172A' },
  { id: 'sakura', name: 'Sakura Pink', bg: '#FDF2F8', border: '#F472B6', text: '#BE185D' },
  { id: 'noir', name: 'Noir Matte', bg: '#18181B', border: '#3F3F46', text: '#FAFAFA' },
  { id: 'rose-gold', name: 'Rose Gold', bg: '#2A1B28', border: '#F472B6', text: '#FBCFE8' },
  { id: 'merdeka', name: '17 Agustus Red', bg: '#881337', border: '#FFE4E6', text: '#FFFFFF' },
];

const STICKERS = ['✨', '💖', '🎂', '👑', '🌸', '🎀', '🧸', '☀️', '🌷', '💍', '🕊️', '🇮🇩'];

export const PhotoboxStudio: React.FC<PhotoboxStudioProps> = ({ onNext }) => {
  const [layout, setLayout] = useState<FrameLayout>('strip-4');
  const [activeFilter, setActiveFilter] = useState<FilterOption>(FILTERS[0]);
  const [frameColor, setFrameColor] = useState(FRAME_COLORS[0]);
  const [footerTitle, setFooterTitle] = useState('DANIA 24TH BIRTHDAY • 17.08.2026');
  const [activeStickers, setActiveStickers] = useState<string[]>(['✨', '💖']);
  
  // Selected photos for slots
  const [slots, setSlots] = useState<string[]>([
    MEMORIES[0].image,
    MEMORIES[1].image,
    MEMORIES[2].image,
    MEMORIES[3].image,
    MEMORIES[4].image,
    MEMORIES[5].image,
  ]);
  const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);

  // Camera capture state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // File input
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const getSlotCount = () => {
    if (layout === 'strip-4' || layout === 'grid-4') return 4;
    if (layout === 'strip-3') return 3;
    return 6;
  };

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      alert('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan di browsermu.');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    setIsCameraActive(false);
    setCountdown(null);
  };

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  // Capture shot with countdown
  const triggerCapture = (targetSlot: number) => {
    setCountdown(3);
    const countInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countInterval);
          takeSnapshot(targetSlot);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const takeSnapshot = (targetSlot: number) => {
    if (!videoRef.current) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

      setSlots((prev) => {
        const next = [...prev];
        next[targetSlot] = dataUrl;
        return next;
      });
    }
  };

  const handleSelectPresetPhoto = (photoUrl: string) => {
    const targetIdx = activeSlotIdx !== null ? activeSlotIdx : 0;
    setSlots((prev) => {
      const next = [...prev];
      next[targetIdx] = photoUrl;
      return next;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const targetIdx = activeSlotIdx !== null ? activeSlotIdx : 0;
      setSlots((prev) => {
        const next = [...prev];
        next[targetIdx] = result;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const toggleSticker = (s: string) => {
    if (activeStickers.includes(s)) {
      setActiveStickers(activeStickers.filter((item) => item !== s));
    } else {
      if (activeStickers.length < 5) {
        setActiveStickers([...activeStickers, s]);
      }
    }
  };

  const generatePhotostripCanvas = async (): Promise<string | null> => {
    const count = getSlotCount();
    const isStrip = layout === 'strip-4' || layout === 'strip-3';
    const cols = layout === 'grid-4' ? 2 : layout === 'grid-6' ? 2 : 1;
    const rows = isStrip ? count : count / cols;

    const photoWidth = 480;
    const photoHeight = 360;
    const padding = 34;
    const gap = 18;
    const headerHeight = 65;
    const footerHeight = 90;

    const canvasWidth = padding * 2 + cols * photoWidth + (cols - 1) * gap;
    const canvasHeight = padding * 2 + headerHeight + rows * photoHeight + (rows - 1) * gap + footerHeight;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = frameColor.bg;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = frameColor.border;
    ctx.lineWidth = 3;
    ctx.strokeRect(14, 14, canvasWidth - 28, canvasHeight - 28);

    ctx.fillStyle = frameColor.text;
    ctx.font = 'bold 22px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText(`✨ DANIA PHOTOBOX STUDIO • 24TH ✨`, canvasWidth / 2, padding + 32);

    const activeSlotUrls = slots.slice(0, count);
    const loadImage = (url: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });

    const loadedImages = await Promise.all(activeSlotUrls.map(loadImage));

    loadedImages.forEach((img, i) => {
      const colIdx = i % cols;
      const rowIdx = Math.floor(i / cols);
      const x = padding + colIdx * (photoWidth + gap);
      const y = padding + headerHeight + rowIdx * (photoHeight + gap);

      ctx.save();
      if (activeFilter.canvasFilter !== 'none') {
        ctx.filter = activeFilter.canvasFilter;
      }
      // Cover-crop ala object-cover: jaga rasio asli, potong tengah, jangan stretch.
      const srcW = img.naturalWidth || img.width;
      const srcH = img.naturalHeight || img.height;
      const scale = Math.max(photoWidth / srcW, photoHeight / srcH);
      const sw = photoWidth / scale;
      const sh = photoHeight / scale;
      const sx = (srcW - sw) / 2;
      const sy = (srcH - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, x, y, photoWidth, photoHeight);
      ctx.restore();

      ctx.strokeStyle = frameColor.border;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, photoWidth, photoHeight);

      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(x + 8, y + 8, 38, 22);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`0${i + 1}`, x + 27, y + 24);
    });

    ctx.fillStyle = frameColor.text;
    ctx.font = '600 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(footerTitle, canvasWidth / 2, canvasHeight - padding - 40);

    if (activeStickers.length > 0) {
      ctx.font = '24px sans-serif';
      ctx.fillText(activeStickers.join('   '), canvasWidth / 2, canvasHeight - padding - 10);
    }

    return canvas.toDataURL('image/png');
  };

  const handleDownloadPhotostrip = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await generatePhotostripCanvas();
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `dania-photobox-24th-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();

        confetti({
          particleCount: 45,
          spread: 65,
          origin: { y: 0.7 },
          colors: ['#FFD166', '#F472B6', '#FFFFFF'],
        });
      }
    } catch (e) {
      alert('Gagal mendownload foto, silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendToEmail = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await generatePhotostripCanvas();
      if (!dataUrl) return;

      await sendEmail({
        _subject: '📸 Hasil Photobox Dania ke-24 (17 Agustus 2026)',
        'Format Kolase': layout,
        Filter: activeFilter.name,
        'Frame Tema': frameColor.name,
        Label: footerTitle,
        Stiker: activeStickers.join(' '),
        _attachment: dataUrl,
      });

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FFD166', '#F472B6'],
      });
      alert('Email terkirim! Foto kolase dilampirkan otomatis. 📸');
    } catch (e) {
      alert('Email gagal terkirim. Foto sudah terunduh — lampirkan manual ke email berdua ya.');
      try {
        const dataUrl = await generatePhotostripCanvas();
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = `dania-photobox-24th.png`;
          link.href = dataUrl;
          link.click();
        }
      } catch {
        // abaikan — download fallback sudah dicoba
      }
    } finally {
      setIsExporting(false);
    }
  };

  const slotCount = getSlotCount();

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col items-center px-3 sm:px-6 pt-18 sm:pt-22 pb-12 z-10 max-w-6xl mx-auto overflow-y-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header */}
      <div className="text-center mb-6 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel-gold text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Camera className="w-3.5 h-3.5" />
          <span>Korean Style Photobox Studio</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-1.5">
          Dania's 24th Photobox ✨
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm font-light">
          Pilih foto, gunakan webcam/upload, pasang filter estetik, download & kirimkan ke email.
        </p>
      </div>

      {/* 3-Column Studio Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        
        {/* LEFT COLUMN: Controls (Camera, Format, Filters, Frame, Stickers) */}
        <div className="lg:col-span-4 space-y-4 w-full order-2 lg:order-1">
          {/* Webcam & Upload Box */}
          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                <Camera className="w-4 h-4" /> Live Webcam Studio
              </span>
              {isCameraActive && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse">
                  REC LIVE
                </span>
              )}
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/15 flex items-center justify-center">
              {flash && <div className="absolute inset-0 bg-white z-50 animate-ping" />}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center">
                  <span className="font-serif text-5xl font-black text-amber-300 animate-bounce">
                    {countdown}
                  </span>
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${
                  isCameraActive ? 'block' : 'hidden'
                }`}
                style={{ filter: activeFilter.filterStyle }}
              />
              {!isCameraActive && (
                <div className="text-center p-4">
                  <Camera className="w-8 h-8 text-slate-500 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-400">Aktifkan kamera untuk foto selfie langsung</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!isCameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow hover:opacity-95"
                >
                  <Camera className="w-3.5 h-3.5" /> Buka Kamera
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => triggerCapture(activeSlotIdx !== null ? activeSlotIdx : 0)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow hover:opacity-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Jepret Slot #{ (activeSlotIdx ?? 0) + 1 } (3s)
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs cursor-pointer"
                  >
                    Tutup
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-3 rounded-xl glass-card hover:glass-panel-gold border border-white/20 text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-300" /> Upload
              </button>
            </div>
          </div>

          {/* Layout Selector */}
          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-amber-400" /> Format Kolase
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'strip-4', label: '4-Cut Strip (Korean)' },
                { id: 'grid-4', label: '2x2 Grid Polaroid' },
                { id: 'strip-3', label: '3-Cut Classic Film' },
                { id: 'grid-6', label: '6-Cut Party Grid' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setLayout(fmt.id as FrameLayout)}
                  className={`p-2.5 rounded-xl text-left text-xs font-medium border transition cursor-pointer ${
                    layout === fmt.id
                      ? 'bg-pink-500/20 border-pink-500 text-pink-200 font-bold'
                      : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filters Selector */}
          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-pink-400" /> Filter Estetik ({activeFilter.name})
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                    activeFilter.id === f.id
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow'
                      : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Frame Theme & Text */}
          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-purple-400" /> Warna Frame
              </span>
              <div className="flex gap-2">
                {FRAME_COLORS.map((fc) => (
                  <button
                    key={fc.id}
                    type="button"
                    onClick={() => setFrameColor(fc)}
                    className={`w-7 h-7 rounded-full border-2 transition cursor-pointer flex items-center justify-center ${
                      frameColor.id === fc.id ? 'scale-115 border-amber-400 shadow-md' : 'border-white/20'
                    }`}
                    style={{ backgroundColor: fc.bg }}
                    title={fc.name}
                  >
                    {frameColor.id === fc.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Teks Banner Photostrip:</label>
              <input
                type="text"
                value={footerTitle}
                onChange={(e) => setFooterTitle(e.target.value)}
                className="w-full bg-slate-950 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Stiker / Emoticon:</label>
              <div className="flex gap-1.5 flex-wrap">
                {STICKERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSticker(s)}
                    className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center border transition cursor-pointer ${
                      activeStickers.includes(s)
                        ? 'bg-pink-500/30 border-pink-500 scale-110'
                        : 'bg-slate-900 border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Live Photostrip Preview */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 w-full">
          <div
            className="p-4 sm:p-5 rounded-2xl shadow-2xl transition duration-300 w-full max-w-xs border"
            style={{
              backgroundColor: frameColor.bg,
              borderColor: frameColor.border,
            }}
          >
            <div className="text-center pb-2 mb-2 border-b border-dashed border-white/20">
              <span
                className="font-serif text-xs sm:text-sm font-bold tracking-wider"
                style={{ color: frameColor.text }}
              >
                ✨ DANIA PHOTOBOX • 24TH ✨
              </span>
            </div>

            {/* Slots Grid */}
            <div
              className={`grid gap-2 mb-3 ${
                layout === 'strip-4'
                  ? 'grid-cols-1'
                  : layout === 'grid-4'
                  ? 'grid-cols-2'
                  : layout === 'strip-3'
                  ? 'grid-cols-1'
                  : 'grid-cols-2'
              }`}
            >
              {slots.slice(0, slotCount).map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveSlotIdx(idx)}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border-2 transition group bg-black/40 ${
                    activeSlotIdx === idx ? 'border-amber-400 scale-[1.02] shadow-lg' : 'border-transparent'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Slot ${idx + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    style={{ filter: activeFilter.filterStyle }}
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white font-bold">
                    #{idx + 1}
                  </div>
                  <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold bg-black/70 px-2 py-0.5 rounded-full">
                      Ubah Foto #{idx + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Text */}
            <div className="text-center pt-2 border-t border-dashed border-white/20">
              <p
                className="text-[10px] sm:text-xs font-semibold truncate mb-1 uppercase tracking-wider"
                style={{ color: frameColor.text }}
              >
                {footerTitle}
              </p>
              {activeStickers.length > 0 && (
                <div className="text-sm tracking-widest">{activeStickers.join(' ')}</div>
              )}
            </div>
          </div>

          {/* Action Buttons: Download + Email */}
          <div className="w-full max-w-xs mt-4 space-y-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownloadPhotostrip}
              disabled={isExporting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 cursor-pointer disabled:opacity-75"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Sedang Mengekspor HD...' : 'Download Photostrip PNG (HD)'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSendToEmail}
              disabled={isExporting}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-pink-500/40 text-pink-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-800 transition"
            >
              <Mail className="w-4 h-4 text-amber-300" />
              <span>Kirim Hasil ke Email Berdua 💌</span>
            </motion.button>
          </div>
        </div>

        {/* RIGHT COLUMN: 24 Photo Presets */}
        <div className="lg:col-span-4 glass-card p-4 rounded-2xl border border-white/10 space-y-3 order-3 w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> 24 Koleksi Foto Dania
            </span>
            <span className="text-[11px] text-slate-400">
              Target: Slot #{ (activeSlotIdx ?? 0) + 1 }
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Klik foto di bawah untuk memasukkannya ke Slot Photobox #{ (activeSlotIdx ?? 0) + 1 }:
          </p>

          <div className="grid grid-cols-4 gap-2 max-h-[380px] overflow-y-auto p-1 pr-2 no-scrollbar">
            {MEMORIES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectPresetPhoto(m.image)}
                className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10 hover:border-pink-500 transition duration-200 cursor-pointer group"
              >
                <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-amber-300 font-mono py-0.5 text-center">
                  #{m.id}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Next to Birthday Cake */}
      <div className="mt-4 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 transition cursor-pointer"
        >
          <span>Lanjut ke Kue Ulang Tahun & Tiup Lilin 🎂</span>
        </motion.button>
      </div>
    </div>
  );
};
