import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight, Maximize2, X, Grid, Layers } from 'lucide-react';
import { MEMORIES } from '../data/memories';
import { MemoryItem } from '../types';
import confetti from 'canvas-confetti';

interface PhotoCardDeckProps {
  onNext: () => void;
}

export const PhotoCardDeck: React.FC<PhotoCardDeckProps> = ({ onNext }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'stack' | 'grid'>('stack');
  const [activeModalPhoto, setActiveModalPhoto] = useState<MemoryItem | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<{ [id: number]: number }>({});
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const currentMemory = MEMORIES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MEMORIES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + MEMORIES.length) % MEMORIES.length);
  };

  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setLikedPhotos((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));

    const newHeart = { id: Date.now(), x: e.clientX, y: e.clientY };
    setFloatingHearts((prev) => [...prev.slice(-8), newHeart]);

    if (id === 24) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#F472B6', '#FFD166'],
        disableForReducedMotion: true,
      });
    }
  };

  // Escape menutup lightbox, panah kiri/kanan pindah foto saat modal terbuka.
  useEffect(() => {
    if (!activeModalPhoto) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveModalPhoto(null);
        return;
      }

      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

      const step = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (currentIndex + step + MEMORIES.length) % MEMORIES.length;
      setCurrentIndex(nextIndex);
      setActiveModalPhoto(MEMORIES[nextIndex]);
    };

    window.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModalPhoto, currentIndex]);

  return (
    <div className="scene scene-pad max-w-4xl px-4 sm:px-6">
      {/* Floating hearts */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[var(--z-overlay)] overflow-hidden">
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, scale: 0.6, x: heart.x - 12, y: heart.y - 12 }}
            animate={{ opacity: 0, scale: 1.8, y: heart.y - 100 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute text-accent2"
          >
            <Heart className="h-5 w-5 fill-accent2" />
          </motion.div>
        ))}
      </div>

      {/* Top Header */}
      <div className="scene-header">
        <div>
          <h2 className="font-serif text-base font-semibold leading-none text-heading sm:text-lg">
            24 Kenangan Dania
          </h2>
          <span className="mt-1 block text-2xs text-accent" aria-live="polite">
            Potret #{currentIndex + 1} dari 24
          </span>
        </div>

        <div className="segment" role="group" aria-label="Mode tampilan kenangan">
          <button
            type="button"
            onClick={() => setViewMode('stack')}
            aria-pressed={viewMode === 'stack'}
            className="segment-item"
          >
            <Layers aria-hidden="true" className="h-3 w-3" />
            Deck
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            className="segment-item"
          >
            <Grid aria-hidden="true" className="h-3 w-3" />
            Semua
          </button>
        </div>
      </div>

      {/* Main Card / Grid Area */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-hidden py-2">
        {viewMode === 'stack' ? (
          <div className="relative flex h-[min(62vh,430px)] w-[min(78vw,290px)] items-center justify-center">
            {/* Background layered previews */}
            {[2, 1].map((offset) => {
              const targetIdx = (currentIndex + offset) % MEMORIES.length;
              const item = MEMORIES[targetIdx];
              return (
                <div
                  key={`back-${item.id}`}
                  aria-hidden="true"
                  style={{
                    transform: `scale(${1 - offset * 0.045}) translateY(${offset * 10}px)`,
                    zIndex: 10 - offset,
                  }}
                  className="absolute inset-0 rounded-2xl border border-line bg-surface opacity-40 shadow-sm"
                />
              );
            })}

            {/* Front Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMemory.id}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92, x: 60 }}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', damping: 26, stiffness: 260 }}
                drag={reduceMotion ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) handleNext();
                  else if (info.offset.x > 50) handlePrev();
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowLeft') {
                    event.stopPropagation();
                    event.preventDefault();
                    handlePrev();
                  }
                  if (event.key === 'ArrowRight') {
                    event.stopPropagation();
                    event.preventDefault();
                    handleNext();
                  }
                }}
                tabIndex={0}
                role="group"
                aria-label={`Kenangan ${currentIndex + 1}: ${currentMemory.title}. Gunakan panah kiri atau kanan untuk berpindah.`}
                className="panel relative z-20 flex h-full w-full cursor-grab flex-col overflow-hidden rounded-2xl p-2.5 shadow-lg active:cursor-grabbing sm:p-3"
              >
                <div className="mb-2 flex items-center justify-between text-2xs">
                  <span className="rounded-full border border-line bg-accent/10 px-2 py-0.5 font-semibold text-accent">
                    {currentMemory.tag}
                  </span>
                  <span className="font-mono text-faint">{currentMemory.dateStr}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalPhoto(currentMemory)}
                  aria-label={`Perbesar foto: ${currentMemory.title}`}
                  className="group/img relative flex-1 overflow-hidden rounded-xl bg-bg/70"
                >
                  <img
                    src={currentMemory.image}
                    alt={currentMemory.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 flex items-end bg-black/50 p-2 opacity-0 transition group-hover/img:opacity-100 group-focus-visible/img:opacity-100">
                    <span className="flex items-center gap-1 text-2xs font-medium text-white">
                      <Maximize2 aria-hidden="true" className="h-3 w-3 text-accent" /> Perbesar
                    </span>
                  </span>
                </button>

                <div className="mt-2 border-t border-line pt-2">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="truncate font-serif text-xs font-bold text-heading sm:text-sm">
                      {currentMemory.title}
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => handleLike(e, currentMemory.id)}
                      aria-label={`Sukai ${currentMemory.title}`}
                      className="flex shrink-0 items-center gap-1 rounded-full border border-accent2/30 bg-accent2/10 px-2 py-0.5 text-2xs text-accent2 transition hover:bg-accent2/20"
                    >
                      <Heart
                        aria-hidden="true"
                        className={`h-3 w-3 ${
                          likedPhotos[currentMemory.id] ? 'fill-accent2 text-accent2' : ''
                        }`}
                      />
                      <span className="tabular-nums">{likedPhotos[currentMemory.id] || 0}</span>
                    </button>
                  </div>
                  <p className="line-clamp-2 text-2xs font-light italic leading-relaxed text-muted">
                    “{currentMemory.quote}”
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="no-scrollbar grid max-h-[62vh] w-full grid-cols-3 gap-1.5 overflow-y-auto p-1 pr-2 sm:grid-cols-4 md:grid-cols-6">
            {MEMORIES.map((memory) => (
              <button
                key={memory.id}
                type="button"
                onClick={() => setActiveModalPhoto(memory)}
                aria-label={`Buka kenangan ${memory.id}: ${memory.title}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-line bg-surface transition hover:border-accent"
              >
                <img
                  src={memory.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute inset-x-0 bottom-0 bg-bg/80 py-0.5 text-center font-mono text-2xs text-accent">
                  #{memory.id}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeModalPhoto && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center bg-bg/90 p-3 backdrop-blur-xl"
            onClick={() => setActiveModalPhoto(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="lightbox-title"
              className="panel relative w-full max-w-sm p-3 text-left sm:max-w-md sm:p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setActiveModalPhoto(null)}
                aria-label="Tutup foto"
                className="icon-btn absolute right-2 top-2 z-10 h-8 w-8 bg-bg/80"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>

              <div className="mb-3 flex max-h-[52vh] items-center justify-center overflow-hidden rounded-xl bg-black">
                <img
                  src={activeModalPhoto.image}
                  alt={activeModalPhoto.title}
                  className="max-h-[52vh] w-auto object-contain"
                />
              </div>
              <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-accent">
                {activeModalPhoto.dateStr}
              </p>
              <h3
                id="lightbox-title"
                className="mt-1 font-serif text-base font-bold text-heading sm:text-lg"
              >
                {activeModalPhoto.title}
              </h3>
              <p className="mt-1 text-xs italic leading-relaxed text-muted">
                “{activeModalPhoto.quote}”
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <div className="mt-3 flex w-full items-center justify-between gap-2 border-t border-line pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Kenangan sebelumnya"
            className="icon-btn"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </button>
          <span className="text-2xs font-semibold tabular-nums text-muted" aria-live="polite">
            {currentIndex + 1} / 24
          </span>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Kenangan berikutnya"
            className="icon-btn"
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <button type="button" onClick={onNext} className="btn btn-primary btn-sm">
          <span>Lanjut ke Cinema</span>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
