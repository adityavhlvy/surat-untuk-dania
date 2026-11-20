import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      onVideoPause();
    };
    // Hanya saat unmount: jangan hentikan BGM tiap render ulang App.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      onVideoPause();
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          onVideoPlay();
        })
        .catch(() => {
          setIsPlaying(false);
          onVideoPause();
        });
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
    <div className="scene scene-pad max-w-4xl px-4 sm:px-6">
      {/* Top Header */}
      <div className="scene-header">
        <h2 className="scene-title">
          <Film aria-hidden="true" className="h-4 w-4 text-accent" />
          Secret Memory Cinema
        </h2>

        <span className="chip">
          <Sparkles aria-hidden="true" className="h-3 w-3" />
          Special Video Reel
        </span>
      </div>

      {/* Main Video Box (dedicated 9:16 vertical frame) */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-hidden py-2">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="panel relative flex h-[min(66vh,600px)] w-full max-w-[300px] flex-col items-center overflow-hidden rounded-[1.75rem] p-2.5 shadow-lg"
        >
          {/* Reel bar */}
          <div className="mb-1 flex w-full items-center justify-between border-b border-line px-2 py-1 font-mono text-2xs text-faint">
            <span className="text-danger">● REC SPECIAL</span>
            <span className="text-accent">DANIA 24TH REEL</span>
          </div>

          {/* Video Player */}
          <div
            className="group relative flex w-full flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-black"
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              src="/special-video.mp4"
              className="h-full w-full object-cover"
              playsInline
              loop
              preload="metadata"
              aria-label="Video kenangan spesial untuk Dania"
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoEnded}
            />

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
                <motion.span
                  whileHover={reduceMotion ? undefined : { scale: 1.1 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-on-accent shadow-glow"
                >
                  <Play aria-hidden="true" className="ml-0.5 h-5 w-5 fill-on-accent" />
                </motion.span>
              </div>
            )}

            {/* Floating Controls */}
            <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-xl border border-line-strong bg-bg/85 px-3 py-1.5 text-heading backdrop-blur transition duration-300 group-hover:opacity-100 sm:opacity-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  aria-label={isPlaying ? 'Jeda video' : 'Putar video'}
                  className="transition hover:text-accent"
                >
                  {isPlaying ? (
                    <Pause aria-hidden="true" className="h-3.5 w-3.5" />
                  ) : (
                    <Play aria-hidden="true" className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Nyalakan suara' : 'Bisukan suara'}
                  aria-pressed={isMuted}
                  className="transition hover:text-accent"
                >
                  {isMuted ? (
                    <VolumeX aria-hidden="true" className="h-3.5 w-3.5 text-danger" />
                  ) : (
                    <Volume2 aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Layar penuh"
                className="transition hover:text-accent"
              >
                <Maximize aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <p className="mt-1.5 line-clamp-2 max-w-full text-balance text-center text-2xs italic leading-snug text-muted">
            “Setiap detik tawa dan senyumanmu adalah keindahan terindah.”
          </p>
        </motion.div>
      </div>

      {/* Bottom Button */}
      <div className="mt-3 flex w-full items-center justify-end border-t border-line pt-3">
        <button
          type="button"
          onClick={() => {
            if (videoRef.current) videoRef.current.pause();
            onVideoPause();
            onNext();
          }}
          className="btn btn-primary btn-sm"
        >
          <span>Buka Surat Cinta</span>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
