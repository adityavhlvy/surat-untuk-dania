import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Camera,
  Sparkles,
  Download,
  Image as ImageIcon,
  Palette,
  Layout,
  Check,
  Sliders,
  Mail,
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

type Notice = { tone: 'info' | 'success' | 'error'; text: string } | null;

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

const LAYOUTS: { id: FrameLayout; label: string }[] = [
  { id: 'strip-4', label: '4-Cut Strip' },
  { id: 'grid-4', label: '2×2 Polaroid' },
  { id: 'strip-3', label: '3-Cut Film' },
  { id: 'grid-6', label: '6-Cut Party' },
];

export const PhotoboxStudio: React.FC<PhotoboxStudioProps> = ({ onNext }) => {
  const reduceMotion = useReducedMotion();
  const [layout, setLayout] = useState<FrameLayout>('strip-4');
  const [activeFilter, setActiveFilter] = useState<FilterOption>(FILTERS[0]);
  const [frameColor, setFrameColor] = useState(FRAME_COLORS[0]);
  const [footerTitle, setFooterTitle] = useState('DANIA 24TH BIRTHDAY • 17.08.2026');
  const [activeStickers, setActiveStickers] = useState<string[]>(['✨', '💖']);
  const [notice, setNotice] = useState<Notice>(null);

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
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // File input
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const getSlotCount = () => {
    if (layout === 'strip-4' || layout === 'grid-4') return 4;
    if (layout === 'strip-3') return 3;
    return 6;
  };

  const notify = (text: string, tone: 'info' | 'success' | 'error' = 'info') => {
    setNotice({ text, tone });
    window.setTimeout(() => setNotice(null), 6000);
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
    } catch {
      notify('Tidak dapat mengakses kamera. Beri izin kamera di browsermu, lalu coba lagi.', 'error');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
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
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [mediaStream]);

  // Capture shot with countdown
  const triggerCapture = (targetSlot: number) => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(3);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
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
      notify(`Jepretan tersimpan di slot #${targetSlot + 1}.`, 'success');
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
      notify(`Foto baru masuk ke slot #${targetIdx + 1}.`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const toggleSticker = (s: string) => {
    if (activeStickers.includes(s)) {
      setActiveStickers(activeStickers.filter((item) => item !== s));
    } else if (activeStickers.length < 5) {
      setActiveStickers([...activeStickers, s]);
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
    const canvasHeight =
      padding * 2 + headerHeight + rows * photoHeight + (rows - 1) * gap + footerHeight;

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
    ctx.fillText('✨ DANIA PHOTOBOX STUDIO • 24TH ✨', canvasWidth / 2, padding + 32);

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
          disableForReducedMotion: true,
        });
        notify('Photostrip HD berhasil diunduh.', 'success');
      }
    } catch {
      notify('Gagal mengunduh foto. Coba lagi sebentar lagi.', 'error');
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
        disableForReducedMotion: true,
      });
      notify('Email terkirim. Kolase foto dilampirkan otomatis.', 'success');
    } catch {
      notify('Email gagal terkirim. Foto akan diunduh sebagai cadangan.', 'error');
      try {
        const dataUrl = await generatePhotostripCanvas();
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = 'dania-photobox-24th.png';
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
    <div className="scene scene-pad max-w-6xl px-4 sm:px-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header */}
      <div className="mx-auto mb-6 max-w-xl text-center">
        <p className="chip mx-auto">
          <Camera aria-hidden="true" className="h-3.5 w-3.5" />
          Korean Style Photobox Studio
        </p>
        <h2 className="mt-3 font-serif text-2xl font-bold text-heading sm:text-4xl">
          Dania&apos;s 24th Photobox
        </h2>
        <p className="lead mt-2">
          Pilih foto, jepret lewat webcam, pasang filter, lalu unduh atau kirim ke email.
        </p>
      </div>

      {notice && (
        <div
          role="status"
          className={`mx-auto mb-5 w-full max-w-xl rounded-xl border px-4 py-3 text-xs font-medium ${
            notice.tone === 'error'
              ? 'border-danger/40 bg-danger/10 text-danger'
              : notice.tone === 'success'
                ? 'border-success/40 bg-success/10 text-success'
                : 'border-line-strong bg-surface text-ink'
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* 3-Column Studio Layout */}
      <div className="mb-8 grid w-full grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-12">
        {/* LEFT COLUMN: Controls */}
        <div className="order-2 w-full space-y-4 md:col-span-1 lg:order-1 lg:col-span-4">
          {/* Webcam & Upload */}
          <section className="panel space-y-3 p-4" aria-labelledby="webcam-title">
            <div className="flex items-center justify-between gap-2">
              <h3
                id="webcam-title"
                className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.14em] text-accent"
              >
                <Camera aria-hidden="true" className="h-4 w-4" /> Live Webcam
              </h3>
              {isCameraActive && (
                <span className="rounded-full border border-danger/40 bg-danger/10 px-2 py-0.5 text-2xs font-semibold text-danger">
                  REC LIVE
                </span>
              )}
            </div>

            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-line bg-bg/80">
              {flash && <div className="absolute inset-0 z-50 animate-ping bg-white" />}
              {countdown !== null && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70">
                  <span className="animate-bounce font-serif text-5xl font-black text-accent">
                    {countdown}
                  </span>
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                aria-label="Pratinjau kamera"
                className={`h-full w-full -scale-x-100 object-cover ${
                  isCameraActive ? 'block' : 'hidden'
                }`}
                style={{ filter: activeFilter.filterStyle }}
              />
              {!isCameraActive && (
                <div className="p-4 text-center">
                  <Camera aria-hidden="true" className="mx-auto mb-1.5 h-8 w-8 text-faint" />
                  <p className="text-2xs text-muted">Aktifkan kamera untuk selfie langsung</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!isCameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="btn btn-primary btn-sm flex-1"
                >
                  <Camera aria-hidden="true" className="h-3.5 w-3.5" /> Buka Kamera
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => triggerCapture(activeSlotIdx ?? 0)}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                    Jepret Slot #{(activeSlotIdx ?? 0) + 1} (3s)
                  </button>
                  <button type="button" onClick={stopCamera} className="btn btn-ghost btn-sm">
                    Tutup
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-secondary btn-sm"
              >
                <ImageIcon aria-hidden="true" className="h-3.5 w-3.5 text-accent" /> Upload
              </button>
            </div>
          </section>

          {/* Layout Selector */}
          <section className="panel space-y-2 p-4" aria-labelledby="layout-title">
            <h3
              id="layout-title"
              className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.14em] text-muted"
            >
              <Layout aria-hidden="true" className="h-4 w-4 text-accent" /> Format Kolase
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {LAYOUTS.map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setLayout(fmt.id)}
                  aria-pressed={layout === fmt.id}
                  className={`rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition ${
                    layout === fmt.id
                      ? 'border-accent bg-accent/10 font-bold text-accent'
                      : 'border-line bg-bg/50 text-muted hover:border-line-strong hover:text-heading'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Filters Selector */}
          <section className="panel space-y-2 p-4" aria-labelledby="filter-title">
            <h3
              id="filter-title"
              className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.14em] text-muted"
            >
              <Sliders aria-hidden="true" className="h-4 w-4 text-accent2" /> Filter ({activeFilter.name})
            </h3>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter foto">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  aria-pressed={activeFilter.id === f.id}
                  className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    activeFilter.id === f.id
                      ? 'border-accent bg-accent font-bold text-on-accent'
                      : 'border-line bg-bg/50 text-muted hover:text-heading'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </section>

          {/* Frame Theme & Text */}
          <section className="panel space-y-3 p-4" aria-labelledby="frame-title">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3
                id="frame-title"
                className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.14em] text-muted"
              >
                <Palette aria-hidden="true" className="h-4 w-4 text-accent2" /> Warna Frame
              </h3>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Warna frame">
                {FRAME_COLORS.map((fc) => (
                  <button
                    key={fc.id}
                    type="button"
                    onClick={() => setFrameColor(fc)}
                    aria-pressed={frameColor.id === fc.id}
                    aria-label={fc.name}
                    title={fc.name}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                      frameColor.id === fc.id
                        ? 'scale-110 border-accent shadow-md'
                        : 'border-line hover:border-line-strong'
                    }`}
                    style={{ backgroundColor: fc.bg }}
                  >
                    {frameColor.id === fc.id && (
                      <Check aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="photostrip-caption" className="field-label">
                Teks Banner Photostrip
              </label>
              <input
                id="photostrip-caption"
                type="text"
                value={footerTitle}
                onChange={(e) => setFooterTitle(e.target.value)}
                className="field"
              />
            </div>

            <div>
              <p className="field-label">Stiker / Emoticon</p>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Stiker">
                {STICKERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSticker(s)}
                    aria-pressed={activeStickers.includes(s)}
                    aria-label={`Stiker ${s}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition ${
                      activeStickers.includes(s)
                        ? 'scale-105 border-accent2 bg-accent2/20'
                        : 'border-line bg-bg/50 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* CENTER COLUMN: Live Preview */}
        <div className="order-1 flex w-full flex-col items-center justify-center md:col-span-1 lg:sticky lg:top-[calc(var(--nav-h)+1rem)] lg:order-2 lg:col-span-4">
          <div
            className="w-full max-w-xs rounded-2xl border p-4 shadow-lg transition duration-300 sm:p-5"
            style={{
              backgroundColor: frameColor.bg,
              borderColor: frameColor.border,
            }}
          >
            <div className="mb-2 border-b border-dashed border-white/20 pb-2 text-center">
              <span
                className="font-serif text-xs font-bold tracking-wider sm:text-sm"
                style={{ color: frameColor.text }}
              >
                ✨ DANIA PHOTOBOX • 24TH ✨
              </span>
            </div>

            <div
              className={`mb-3 grid gap-2 ${
                layout === 'strip-4' || layout === 'strip-3' ? 'grid-cols-1' : 'grid-cols-2'
              }`}
            >
              {slots.slice(0, slotCount).map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlotIdx(idx)}
                  aria-pressed={activeSlotIdx === idx}
                  aria-label={`Pilih slot ${idx + 1}`}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-lg border-2 bg-black/40 transition ${
                    activeSlotIdx === idx
                      ? 'scale-[1.02] border-accent shadow-lg'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Slot ${idx + 1}`}
                    className="pointer-events-none h-full w-full object-cover"
                    style={{ filter: activeFilter.filterStyle }}
                  />
                  <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 font-mono text-2xs font-bold text-white">
                    #{idx + 1}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center bg-accent2/20 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="rounded-full bg-black/70 px-2 py-0.5 text-2xs font-bold text-white">
                      Ubah Foto #{idx + 1}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t border-dashed border-white/20 pt-2 text-center">
              <p
                className="mb-1 truncate text-2xs font-semibold uppercase tracking-wider sm:text-xs"
                style={{ color: frameColor.text }}
              >
                {footerTitle}
              </p>
              {activeStickers.length > 0 && (
                <div className="text-sm tracking-widest">{activeStickers.join(' ')}</div>
              )}
            </div>
          </div>

          <div className="mt-4 w-full max-w-xs space-y-2">
            <motion.button
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              onClick={handleDownloadPhotostrip}
              disabled={isExporting}
              className="btn btn-primary w-full"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              <span>{isExporting ? 'Mengekspor HD...' : 'Download Photostrip PNG'}</span>
            </motion.button>

            <motion.button
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              onClick={handleSendToEmail}
              disabled={isExporting}
              className="btn btn-secondary w-full"
            >
              <Mail aria-hidden="true" className="h-4 w-4 text-accent" />
              <span>Kirim Hasil ke Email</span>
            </motion.button>
          </div>
        </div>

        {/* RIGHT COLUMN: Photo Presets */}
        <section
          className="panel order-3 w-full space-y-3 p-4 md:col-span-2 lg:col-span-4"
          aria-labelledby="gallery-title"
        >
          <div className="flex items-center justify-between gap-2">
            <h3
              id="gallery-title"
              className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.14em] text-accent"
            >
              <Sparkles aria-hidden="true" className="h-4 w-4" /> 24 Koleksi Foto
            </h3>
            <span className="text-2xs text-faint">Target: #{ (activeSlotIdx ?? 0) + 1}</span>
          </div>

          <p className="text-xs text-muted">
            Klik foto untuk memasukkannya ke slot #{ (activeSlotIdx ?? 0) + 1}:
          </p>

          <div className="no-scrollbar grid max-h-[380px] grid-cols-4 gap-2 overflow-y-auto p-1 pr-2">
            {MEMORIES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectPresetPhoto(m.image)}
                aria-label={`Pilih foto ${m.id}: ${m.title}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-line transition hover:border-accent"
              >
                <img
                  src={m.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute inset-x-0 bottom-0 bg-bg/80 py-0.5 text-center font-mono text-2xs text-accent">
                  #{m.id}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Next to Birthday Cake */}
      <div className="text-center">
        <motion.button
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          onClick={onNext}
          className="btn btn-primary"
        >
          Lanjut ke Kue Ulang Tahun & Tiup Lilin
        </motion.button>
      </div>
    </div>
  );
};
