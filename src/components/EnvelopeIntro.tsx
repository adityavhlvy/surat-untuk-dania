import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnvelopeIntroProps {
  onOpen: () => void;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenLetter = () => {
    if (isOpen) return;
    setIsOpen(true);
    // Trigger small golden sparkle burst
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FFD166', '#F472B6', '#FFFFFF', '#F59E0B'],
      disableForReducedMotion: true,
    });

    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-center px-4 py-4 sm:py-6 z-10 overflow-hidden box-border">
      {/* Decorative Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-panel-gold border border-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-semibold tracking-wider uppercase shadow-md flex-shrink-0"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
        <span>17 Agustus 2026 • Special Edition</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
      </motion.div>

      {/* Main Envelope Box */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-sm sm:max-w-md w-full flex-shrink-1 my-auto"
      >
        {/* Ambient Glow */}
        <div className="absolute -inset-3 bg-gradient-to-r from-pink-500/20 via-amber-500/20 to-purple-600/20 rounded-3xl blur-2xl opacity-70 -z-10" />

        {/* Envelope Container */}
        <div className="relative bg-gradient-to-b from-slate-900/95 via-[#0B0F24]/95 to-slate-950/95 border border-amber-500/30 rounded-2xl p-4 sm:p-7 text-center backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col justify-between">
          {/* Gold Decorative Corner Lines */}
          <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-amber-400/50 rounded-tl" />
          <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-amber-400/50 rounded-tr" />
          <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-amber-400/50 rounded-bl" />
          <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-amber-400/50 rounded-br" />

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-pink-300 font-semibold mb-1">
              Sebuah Perjalanan Spesial
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-tight mb-1.5 sm:mb-2">
              Happy 24th Birthday,{' '}
              <span className="bg-gradient-to-r from-amber-200 via-pink-300 to-amber-200 bg-clip-text text-transparent italic">
                Dania
              </span>{' '}
              ✨
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed max-w-xs sm:max-w-sm mx-auto mb-3 sm:mb-4">
              Di tanggal paling bersejarah ini, ada ruang penuh kenangan dan cinta yang dirancang khusus untukmu.
            </p>
          </motion.div>

          {/* Interactive Envelope Flap Artwork */}
          <div className="relative my-2 sm:my-4 flex justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleOpenLetter}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-40 h-28 sm:w-48 sm:h-32 bg-gradient-to-tr from-amber-950/70 via-slate-900 to-rose-950/70 border border-amber-400/40 rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-xl group"
            >
              {/* Wax Seal */}
              <motion.div
                animate={{
                  scale: isHovered ? [1, 1.12, 1] : 1,
                  rotate: isHovered ? [0, 4, -4, 0] : 0,
                }}
                transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-400 via-pink-500 to-rose-600 border-2 border-amber-200 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:shadow-pink-500/60 transition"
              >
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white drop-shadow-md" />
              </motion.div>

              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-amber-200 mt-1.5 uppercase">
                {isOpen ? 'Membuka Memori...' : 'Ketuk Segel Lilin'}
              </span>
            </motion.div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenLetter}
            disabled={isOpen}
            className="w-full py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 text-slate-950 font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition disabled:opacity-80 cursor-pointer"
          >
            <span>{isOpen ? 'Mempersiapkan Semesta Dania...' : 'Buka & Mulai Perjalanan'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <p className="text-slate-400 text-[10px] sm:text-xs mt-2.5 sm:mt-3">
            🎵 Aktifkan volume audio untuk pengalaman terbaik
          </p>
        </div>
      </motion.div>
    </div>
  );
};
