import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music, Disc3 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, onToggle }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume] = useState(0.8);
  const [showTooltip, setShowTooltip] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay diblokir browser: pengguna tinggal menekan tombol vinyl.
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  return (
    <>
      <audio ref={audioRef} src="/youtube-audio.mp3" loop preload="auto" />

      <div className="fixed bottom-3 right-3 z-[var(--z-nav)] flex items-center gap-2 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="hidden items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-xs text-ink shadow-md backdrop-blur md:flex"
            >
              <Music aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
              <span>Into The Sun — BGM untuk Dania</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="flex items-center gap-1 rounded-full border border-line bg-bg/85 p-1.5 shadow-lg backdrop-blur-xl"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
        >
          <button
            type="button"
            onClick={onToggle}
            aria-label={isPlaying ? 'Jeda musik latar' : 'Putar musik latar'}
            aria-pressed={isPlaying}
            title={isPlaying ? 'Jeda musik' : 'Putar musik'}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-surface-raised transition hover:border-accent"
          >
            <span
              aria-hidden="true"
              className={`absolute inset-0 rounded-full blur-md transition duration-500 ${
                isPlaying ? 'bg-accent/30' : 'bg-transparent'
              }`}
            />
            <motion.span
              animate={reduceMotion ? undefined : { rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="relative flex h-full w-full items-center justify-center"
            >
              <Disc3
                aria-hidden="true"
                className={`h-5 w-5 ${isPlaying ? 'text-accent' : 'text-faint'}`}
              />
            </motion.span>
            <span
              aria-hidden="true"
              className="absolute h-1.5 w-1.5 rounded-full border border-accent-soft bg-accent2"
            />
          </button>

          <div aria-hidden="true" className="flex items-center gap-0.5 px-1">
            {[0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.3].map((height, i) => (
              <motion.span
                key={i}
                animate={
                  reduceMotion
                    ? { height: 4 }
                    : { height: isPlaying ? [4, height * 18, 4] : 4 }
                }
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + i * 0.1,
                  ease: 'easeInOut',
                }}
                className="w-1 rounded-full bg-gradient-to-t from-accent2 to-accent"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? 'Nyalakan suara' : 'Bisukan suara'}
            aria-pressed={isMuted}
            title={isMuted ? 'Nyalakan suara' : 'Bisukan suara'}
            className="rounded-full p-1.5 text-muted transition hover:bg-surface-raised hover:text-heading"
          >
            {isMuted ? (
              <VolumeX aria-hidden="true" className="h-4 w-4 text-danger" />
            ) : (
              <Volume2 aria-hidden="true" className="h-4 w-4 text-accent" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
