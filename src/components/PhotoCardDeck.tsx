import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      });
    }
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center px-2 sm:px-4 py-2 sm:py-4 z-10 max-w-4xl mx-auto box-border overflow-hidden">
      {/* Floating hearts */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, scale: 0.6, x: heart.x - 12, y: heart.y - 12 }}
            animate={{ opacity: 0, scale: 1.8, y: heart.y - 100 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute text-pink-500"
          >
            <Heart className="w-5 h-5 fill-pink-500" />
          </motion.div>
        ))}
      </div>

      {/* Top Header */}
      <div className="w-full flex items-center justify-between pt-14 sm:pt-18 pb-1 border-b border-white/10 flex-shrink-0">
        <div>
          <h2 className="font-serif text-sm sm:text-lg font-bold text-white leading-none">
            24 Kenangan Dania
          </h2>
          <span className="text-[10px] text-amber-300">Potret #{currentIndex + 1} dari 24</span>
        </div>

        <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-white/15">
          <button
            type="button"
            onClick={() => setViewMode('stack')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer ${
              viewMode === 'stack' ? 'bg-pink-500 text-white font-bold' : 'text-slate-400'
            }`}
          >
            <Layers className="w-3 h-3 inline mr-1" />
            Deck
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer ${
              viewMode === 'grid' ? 'bg-pink-500 text-white font-bold' : 'text-slate-400'
            }`}
          >
            <Grid className="w-3 h-3 inline mr-1" />
            Semua (24)
          </button>
        </div>
      </div>

      {/* Main Card / Grid Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center overflow-hidden py-1">
        {viewMode === 'stack' ? (
          <div className="relative w-full max-w-[280px] sm:max-w-xs h-[370px] sm:h-[410px] flex items-center justify-center">
            {/* Background layered previews */}
            {[2, 1].map((offset) => {
              const targetIdx = (currentIndex + offset) % MEMORIES.length;
              const item = MEMORIES[targetIdx];
              return (
                <div
                  key={`back-${item.id}`}
                  style={{
                    transform: `scale(${1 - offset * 0.05}) translateY(${offset * 10}px)`,
                    zIndex: 10 - offset,
                  }}
                  className="absolute w-60 sm:w-68 h-[340px] sm:h-[380px] bg-slate-900/60 border border-white/10 rounded-2xl p-2 opacity-35 pointer-events-none"
                />
              );
            })}

            {/* Front Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMemory.id}
                initial={{ opacity: 0, scale: 0.88, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 70 }}
                transition={{ type: 'spring', damping: 24, stiffness: 240 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) handleNext();
                  else if (info.offset.x > 50) handlePrev();
                }}
                className="relative w-60 sm:w-68 h-[340px] sm:h-[380px] bg-gradient-to-b from-slate-900/95 to-slate-950 border border-pink-500/30 rounded-2xl p-2.5 sm:p-3 flex flex-col shadow-2xl z-20 overflow-hidden backdrop-blur-xl group cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center justify-between mb-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-medium border border-pink-500/30">
                    {currentMemory.tag}
                  </span>
                  <span className="text-amber-300 font-semibold">{currentMemory.dateStr}</span>
                </div>

                <div
                  className="relative flex-1 rounded-xl overflow-hidden cursor-pointer group/img bg-black/40"
                  onClick={() => setActiveModalPhoto(currentMemory)}
                >
                  <img
                    src={currentMemory.image}
                    alt={currentMemory.title}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition flex items-end p-2">
                    <span className="text-[10px] text-white flex items-center gap-1 font-medium">
                      <Maximize2 className="w-3 h-3 text-amber-300" /> Perbesar
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-white/10">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-white truncate">
                      {currentMemory.title}
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => handleLike(e, currentMemory.id)}
                      className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 cursor-pointer"
                    >
                      <Heart
                        className={`w-3 h-3 ${
                          likedPhotos[currentMemory.id] ? 'fill-pink-400 text-pink-400' : 'text-pink-300'
                        }`}
                      />
                      <span>{likedPhotos[currentMemory.id] || 0}</span>
                    </button>
                  </div>
                  <p className="text-slate-300 text-[10px] font-light line-clamp-2 italic">
                    "{currentMemory.quote}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="w-full h-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 overflow-y-auto p-1 pr-2 no-scrollbar">
            {MEMORIES.map((memory) => (
              <div
                key={memory.id}
                onClick={() => setActiveModalPhoto(memory)}
                className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-900 border border-white/10 cursor-pointer hover:border-pink-500 transition"
              >
                <img
                  src={memory.image}
                  alt={memory.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-amber-300 font-mono text-center py-0.5">
                  #{memory.id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeModalPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3"
            onClick={() => setActiveModalPhoto(null)}
          >
            <div
              className="relative max-w-sm sm:max-w-md w-full bg-slate-900 border border-pink-500/30 rounded-2xl p-3 sm:p-4 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveModalPhoto(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative max-h-[50vh] rounded-xl overflow-hidden bg-black mb-2 flex items-center justify-center">
                <img
                  src={activeModalPhoto.image}
                  alt={activeModalPhoto.title}
                  className="max-h-[50vh] w-auto object-contain"
                />
              </div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-white">
                {activeModalPhoto.title}
              </h3>
              <p className="text-slate-300 text-xs italic">"{activeModalPhoto.quote}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <div className="w-full flex items-center justify-between pt-1 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full glass-card border border-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-semibold text-slate-300">
            {currentIndex + 1} / 24
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full glass-card border border-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <span>Lanjut ke Cinema 🎬</span>
        </button>
      </div>
    </div>
  );
};
