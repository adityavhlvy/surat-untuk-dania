import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const typingTimerRef = useRef<any>(null);

  const clearTimer = () => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  };

  const startTyping = (speed: number = 25) => {
    clearTimer();
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
  }, []);

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
    });
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center px-3 sm:px-6 py-2 sm:py-4 z-10 max-w-3xl mx-auto box-border overflow-hidden">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between pt-14 sm:pt-18 pb-1 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Feather className="w-4 h-4 text-amber-400" />
          <h2 className="font-serif text-sm sm:text-base font-bold text-white leading-none">
            Surat Cinta Digital
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {!isDone ? (
            <button
              type="button"
              onClick={handleSkipTyping}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-[11px] font-semibold text-amber-200 cursor-pointer hover:bg-amber-400/30 transition"
            >
              <FastForward className="w-3 h-3 text-amber-300" />
              <span>Tampilkan Semua</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-[11px] text-white cursor-pointer hover:bg-white/20 transition"
            >
              <RotateCcw className="w-3 h-3 text-amber-300" />
              <span>Ketik Ulang</span>
            </button>
          )}
        </div>
      </div>

      {/* Parchment Box (Scrollable inside, fits 1 screen) */}
      <div className="w-full flex-1 flex flex-col justify-center overflow-hidden my-auto py-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-h-[62vh] sm:max-h-[68vh] bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-amber-400/30 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl overflow-y-auto no-scrollbar"
        >
          <div className="font-serif text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed whitespace-pre-line">
            {displayedText}
            {!isDone && <span className="inline-block w-1.5 h-4 bg-amber-400 ml-1 animate-pulse" />}
          </div>

          {isDone && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-slate-400">Dicap dengan Cinta</p>
                <p className="font-serif italic text-amber-200 text-xs font-bold">17 Agustus 2026</p>
              </div>

              <button
                type="button"
                onClick={handleHeartStamp}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-semibold cursor-pointer hover:bg-pink-500/30 transition"
              >
                <Heart className="w-3.5 h-3.5 fill-pink-400" />
                <span>Beri Cap ({stampHearts})</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Button */}
      <div className="w-full flex items-center justify-end pt-1 border-t border-white/10 flex-shrink-0">
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer shadow"
        >
          <span>Buka Photobox Studio 📸</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
