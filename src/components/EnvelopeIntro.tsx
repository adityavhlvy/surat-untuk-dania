import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnvelopeIntroProps {
  onOpen: () => void;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleOpenLetter = () => {
    if (isOpen) return;
    setIsOpen(true);
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
    <div className="scene max-w-2xl items-center justify-center px-4 py-10 text-center">
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="chip"
      >
        <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
        17 Agustus 2026 · Edisi Spesial
        <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
      </motion.p>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="panel-glass relative mt-6 w-full max-w-md overflow-hidden p-6 sm:p-8"
      >
        {/* Garis sudut dekoratif */}
        <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-5 w-5 rounded-tl border-l border-t border-line-strong" />
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-5 w-5 rounded-tr border-r border-t border-line-strong" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 rounded-bl border-b border-l border-line-strong" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 rounded-br border-b border-r border-line-strong" />

        <p className="eyebrow">Sebuah perjalanan untukmu</p>
        <h1 className="mt-2 font-serif text-3xl font-bold leading-[1.15] tracking-tight text-heading sm:text-4xl">
          Happy 24th Birthday,{' '}
          <span className="text-gradient-gold italic">Dania</span>
        </h1>
        <p className="lead mx-auto mt-3 max-w-sm">
          Di tanggal paling bersejarah ini, ada ruang penuh kenangan dan cinta yang dirancang
          khusus untukmu.
        </p>

        <button
          type="button"
          onClick={handleOpenLetter}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={isOpen}
          aria-label="Buka amplop dan mulai perjalanan"
          className="group mx-auto my-6 block w-full max-w-[260px] cursor-pointer disabled:cursor-wait"
        >
          <span className="relative block aspect-[3/2] w-full overflow-hidden rounded-xl border border-line-strong bg-surface-raised shadow-md transition duration-300 group-hover:-translate-y-1 group-hover:border-accent group-focus-visible:-translate-y-1">
            {/* Lipatan atas */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1/2 border-b border-line-strong bg-surface transition duration-300 group-hover:bg-surface-raised"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            />
            {/* Lipatan bawah */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/2"
              style={{
                background:
                  'linear-gradient(160deg, transparent 45%, rgb(var(--accent-rgb) / 0.06) 45%)',
              }}
            />
            {/* Segel lilin */}
            <motion.span
              animate={
                reduceMotion
                  ? undefined
                  : isHovered
                    ? { scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }
                    : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 1.4, repeat: isHovered ? Infinity : 0 }}
              className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent-soft/60 bg-gradient-to-br from-accent-soft via-accent to-accent2 shadow-glow"
            >
              <Heart aria-hidden="true" className="h-6 w-6 fill-on-accent/80 text-on-accent" />
            </motion.span>
          </span>
          <span className="mt-3 block text-2xs font-semibold uppercase tracking-[0.16em] text-accent">
            {isOpen ? 'Membuka memori...' : 'Ketuk segel lilin'}
          </span>
        </button>

        <motion.button
          type="button"
          onClick={handleOpenLetter}
          disabled={isOpen}
          whileHover={reduceMotion ? undefined : { scale: 1.015 }}
          whileTap={reduceMotion ? undefined : { scale: 0.985 }}
          className="btn btn-primary w-full"
        >
          <span>{isOpen ? 'Mempersiapkan semesta Dania...' : 'Buka & Mulai Perjalanan'}</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </motion.button>

        <p className="mt-3 text-2xs text-faint">
          🎵 Nyalakan volume audio untuk pengalaman terbaik
        </p>
      </motion.div>
    </div>
  );
};
