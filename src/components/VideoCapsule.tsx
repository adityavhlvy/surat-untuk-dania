import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, Play, Pause, Volume2, VolumeX, ChevronRight, Maximize, Sparkles } from 'lucide-react';

interface VideoCapsuleProps {
  onNext: () => void;
  onVideoPlay: () => void;
  onVideoPause: () => void;
}

export const VideoCapsule: React.FC<VideoCapsuleProps> = ({
  onNext,
  onVideoPlay,
  onVideoPause,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    return () => {
      onVideoPause();
    };
  }, [onVideoPause]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      onVideoPause();
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      onVideoPlay();
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    onVideoPause();
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    onVideoPause();
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    onVideoPlay();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center px-3 sm:px-6 py-2 sm:py-4 z-10 max-w-4xl mx-auto box-border overflow-hidden">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between pt-14 sm:pt-18 pb-1 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Film className="w-4 h-4 text-amber-400" />
          <h2 className="font-serif text-sm sm:text-base font-bold text-white leading-none">
            Secret Memory Cinema
          </h2>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-semibold">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Special Video Reel</span>
        </span>
      </div>

      {/* Main Video Box (Dedicated 9:16 vertical smartphone frame) */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-auto overflow-hidden py-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-[260px] sm:max-w-[280px] h-[64vh] sm:h-[68vh] bg-slate-950 border border-pink-500/30 rounded-3xl overflow-hidden shadow-2xl p-2 sm:p-2.5 group flex flex-col items-center"
        >
          {/* Top Notch / Reel Bar */}
          <div className="w-full flex justify-between items-center px-2 py-0.5 border-b border-white/10 mb-1 text-[8px] font-mono text-slate-400">
            <span className="text-red-400 animate-pulse">● REC SPECIAL</span>
            <span className="text-amber-300">DANIA 24TH REEL</span>
          </div>

          {/* Video Player */}
          <div
            className="relative flex-1 w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              src="/special-video.mp4"
              className="w-full h-full object-cover"
              playsInline
              loop
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoEnded}
            />

            {!isPlaying && (
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-2xl shadow-pink-500/50"
                >
                  <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                </motion.div>
              </div>
            )}

            {/* Hover Floating Controls */}
            <div className="absolute bottom-2 inset-x-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur border border-white/15 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition duration-300">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="hover:text-amber-300 transition"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="hover:text-amber-300 transition"
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="hover:text-amber-300 transition"
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[9px] sm:text-[10px] text-slate-400 text-center italic mt-1 truncate max-w-full">
            "Setiap detik tawa dan senyumanmu adalah keindahan terindah."
          </p>
        </motion.div>
      </div>

      {/* Bottom Button */}
      <div className="w-full flex items-center justify-end pt-1 border-t border-white/10 flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            if (videoRef.current) videoRef.current.pause();
            onVideoPause();
            onNext();
          }}
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer shadow"
        >
          <span>Buka Surat Cinta 💌</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
