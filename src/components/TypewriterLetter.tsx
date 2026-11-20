import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Feather, RotateCcw, FastForward, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TypewriterLetterProps {
  onNext: () => void;
}

const LETTER_TEXT = `Untuk Dania yang Paling Berharga,

Selamat ulang tahun yang ke-24, Sayang.

Tepat hari ini, 17 Agustus 2026, ketika seluruh negeri merayakan hari kemerdekaannya, ada rasa syukur yang jauh lebih dalam di hatiku: merayakan hadirnya kamu di bumi 24 tahun yang lalu.

Melihat perjalananmu sejauh ini, aku selalu bangga. Dania adalah sosok luar biasa—hangat, tulus, cerdas, dan selalu berhasil menenangkan duniaku hanya dengan satu senyuman manismu.

Di usia yang baru ini, doaku selalu menyertaimu:
Semoga kesehatan, keberkahan, dan kebahagiaan tanpa batas selalu memelukmu. Semoga semua mimpi dan cita-cita yang kamu bisikkan dalam doa perlahan mekar menjadi nyata.

Terima kasih sudah menjadi rumah paling nyaman dan hadiah terindah dalam hidupku.

Selamat bertambah usia, cintaku. Aku akan selalu ada di sini menemanimu.

Dengan segenap cinta,
Selamanya untuk Dania. ❤️`;

export const TypewriterLetter: React.FC<TypewriterLetterProps> = ({ onNext }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [stampHearts, setStampHearts] = useState(0);
  const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const clearTimer = () => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  };

  const startTyping = (speed: number = 25) => {
    clearTimer();
    if (reduceMotion) {
      setDisplayedText(LETTER_TEXT);
      setIsDone(true);
      return;
    }

    let index = 0;
    setDisplayedText('');
    setIsDone(false);

    typingTimerRef.current = setInterval(() => {
      if (index < LETTER_TEXT.length) {
        setDisplayedText(LETTER_TEXT.slice(0, index + 1));
        index++;
      } else {
        setIsDone(true);
        clearTimer();
      }
    }, speed);
  };

  useEffect(() => {
    startTyping(25);
    return () => clearTimer();
  }, [reduceMotion]);

  // Ikuti teks terbaru seperti mesin tik sungguhan.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [displayedText]);

  const handleSkipTyping = () => {
    clearTimer();
    setDisplayedText(LETTER_TEXT);
    setIsDone(true);
  };

  const handleRestart = () => {
    startTyping(15);
  };

  const handleHeartStamp = (e: React.MouseEvent) => {
    setStampHearts((prev) => prev + 1);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ['#F472B6', '#FDA4AF', '#FFE3A8'],
      disableForReducedMotion: true,
    });
  };

  return (
    <div className="scene scene-pad max-w-3xl px-4 sm:px-6">
      {/* Top Header */}
      <div className="scene-header">
        <h2 className="scene-title">
          <Feather aria-hidden="true" className="h-4 w-4 text-accent" />
          Surat Cinta Digital
        </h2>

        {!isDone ? (
          <button type="button" onClick={handleSkipTyping} className="btn btn-secondary btn-sm">
            <FastForward aria-hidden="true" className="h-3 w-3 text-accent" />
            <span>Tampilkan Semua</span>
          </button>
        ) : (
          <button type="button" onClick={handleRestart} className="btn btn-ghost btn-sm">
            <RotateCcw aria-hidden="true" className="h-3 w-3 text-accent" />
            <span>Ketik Ulang</span>
          </button>
        )}
      </div>

      {/* Parchment Box */}
      <div className="flex flex-1 flex-col justify-center overflow-hidden">
        <motion.div
          ref={scrollRef}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="panel-gold no-scrollbar max-h-[64vh] overflow-y-auto p-5 sm:max-h-[68vh] sm:p-7"
        >
          <p className="sr-only">{LETTER_TEXT}</p>
          <div
            aria-hidden="true"
            className="whitespace-pre-line font-prose text-sm leading-[1.9] text-ink sm:text-base"
          >
            {displayedText}
            {!isDone && (
              <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-accent align-middle" />
            )}
          </div>

          {isDone && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <div>
                <p className="text-2xs uppercase tracking-[0.16em] text-faint">Dicap dengan cinta</p>
                <p className="font-handwriting text-lg font-semibold text-accent">Aditya</p>
              </div>

              <button
                type="button"
                onClick={handleHeartStamp}
                className="btn btn-secondary btn-sm"
              >
                <Heart aria-hidden="true" className="h-3.5 w-3.5 fill-accent2 text-accent2" />
                <span>Beri Cap ({stampHearts})</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Button */}
      <div className="mt-3 flex w-full items-center justify-end border-t border-line pt-3">
        <button type="button" onClick={onNext} className="btn btn-primary btn-sm">
          <span>Buka Photobox Studio</span>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
