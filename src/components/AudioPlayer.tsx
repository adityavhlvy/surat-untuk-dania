import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Disc3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, onToggle }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume] = useState(0.8);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Audio autoplay prevented:', err);
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
      <audio
        ref={audioRef}
        src="/youtube-audio.mp3"
        loop
        preload="auto"
      />

      <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3">
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full glass-panel-gold text-xs text-amber-200 border border-amber-500/30 shadow-lg"
            >
              <Music className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Into The Sun — Special BGM for Dania</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Vinyl Player Button */}
        <motion.div
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative group cursor-pointer"
          onClick={onToggle}
        >
          {/* Glowing Aura Ring */}
          <div
            className={`absolute -inset-1 rounded-full blur-md transition duration-500 ${
              isPlaying
                ? 'bg-gradient-to-r from-pink-500 via-amber-400 to-indigo-500 opacity-80 animate-spin-slow'
                : 'bg-slate-700/50 opacity-40'
            }`}
          />

          <div className="relative flex items-center gap-1.5 sm:gap-2 bg-slate-950/90 border border-white/20 p-1.5 sm:p-2.5 rounded-full backdrop-blur-xl shadow-2xl">
            {/* Spinning Disc */}
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-900 border border-amber-400/40 flex items-center justify-center overflow-hidden">
              {/* Vinyl grooves */}
              <div className="absolute inset-1 rounded-full border border-white/10" />
              <div className="absolute inset-2.5 rounded-full border border-white/10" />

              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                className="w-full h-full flex items-center justify-center"
              >
                <Disc3 className={`w-6 h-6 ${isPlaying ? 'text-amber-400' : 'text-slate-500'}`} />
              </motion.div>

              {/* Center dot */}
              <div className="absolute w-2 h-2 rounded-full bg-pink-500 border border-white" />
            </div>

            {/* Visualizer bars */}
            <div className="flex items-center gap-0.5 px-1">
              {[0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.3].map((height, i) => (
                <motion.span
                  key={i}
                  animate={{
                    height: isPlaying ? [4, height * 18, 4] : 4,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6 + i * 0.1,
                    ease: 'easeInOut',
                  }}
                  className="w-1 bg-gradient-to-t from-pink-500 to-amber-300 rounded-full"
                />
              ))}
            </div>

            {/* Mute/Unmute quick toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-1.5 text-slate-400 hover:text-white transition rounded-full hover:bg-white/10"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-300" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};
