import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BackgroundStars } from './components/BackgroundStars';
import { AudioPlayer } from './components/AudioPlayer';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { CosmicPrologue } from './components/CosmicPrologue';
import { PhotoCardDeck } from './components/PhotoCardDeck';
import { VideoCapsule } from './components/VideoCapsule';
import { TypewriterLetter } from './components/TypewriterLetter';
import { PhotoboxStudio } from './components/PhotoboxStudio';
import { BirthdayCake } from './components/BirthdayCake';
import { NavigationPills } from './components/NavigationPills';

const SCENE_TITLES = [
  'Amplop',
  '17 Agustus',
  '24 Kenangan',
  'Cinema',
  'Surat Cinta',
  'Photobox',
  'Kue Ulang Tahun',
];

export const App: React.FC = () => {
  const [currentScene, setCurrentScene] = useState(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCinemaPlaying, setIsCinemaPlaying] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleOpenEnvelope = () => {
    setIsPlayingAudio(true);
    setCurrentScene(2);
  };

  const handleRestartJourney = () => {
    setIsCinemaPlaying(false);
    setCurrentScene(1);
  };

  // Reset cinema playing state when scene changes away from Scene 4
  const handleSceneChange = useCallback((newScene: number) => {
    if (newScene !== 4) {
      setIsCinemaPlaying(false);
    }
    setCurrentScene(newScene);
  }, []);

  // Keyboard navigation: panah kiri/kanan untuk pindah bab.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      ) {
        return;
      }

      // Jangan pindah bab saat lightbox sedang terbuka.
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) {
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setCurrentScene((scene) => Math.min(scene + 1, SCENE_TITLES.length));
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setCurrentScene((scene) => Math.max(scene - 1, 1));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.title = `${SCENE_TITLES[currentScene - 1]} · Untuk Dania`;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentScene]);

  // Effective audio is playing if audio is enabled AND cinema is NOT currently playing video
  const shouldPlayBgm = isPlayingAudio && !isCinemaPlaying;

  const sceneTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: 'easeOut' as const };

  const enter = (scale = false) =>
    reduceMotion
      ? { opacity: 1, scale: 1, y: 0 }
      : { opacity: 0, scale: scale ? 0.97 : 1, y: scale ? 0 : 16 };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col justify-between overflow-x-hidden bg-bg font-sans text-ink">
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-surface px-4 py-2 text-sm font-semibold text-heading focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Lewati ke konten
      </a>

      {/* Background Starfield and Lights */}
      <BackgroundStars />

      {/* Top Scene Navigation (visible after opening envelope) */}
      {currentScene > 1 && (
        <NavigationPills
          currentScene={currentScene}
          onSelectScene={handleSceneChange}
        />
      )}

      {/* Floating Audio Controller */}
      <AudioPlayer
        isPlaying={shouldPlayBgm}
        onToggle={() => setIsPlayingAudio(!isPlayingAudio)}
      />

      {/* Live region untuk pembaca layar */}
      <p aria-live="polite" className="sr-only">
        Bab {currentScene} dari {SCENE_TITLES.length}: {SCENE_TITLES[currentScene - 1]}
      </p>

      {/* Main Scene Switcher */}
      <main id="main" tabIndex={-1} className="relative z-10 flex w-full flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false}>
          {currentScene === 1 && (
            <motion.section
              key="scene-1"
              initial={enter(true)}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
              transition={sceneTransition}
              className="w-full"
            >
              <EnvelopeIntro onOpen={handleOpenEnvelope} />
            </motion.section>
          )}

          {currentScene === 2 && (
            <motion.section
              key="scene-2"
              initial={enter()}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -16 }}
              transition={sceneTransition}
              className="w-full"
            >
              <CosmicPrologue onNext={() => handleSceneChange(3)} />
            </motion.section>
          )}

          {currentScene === 3 && (
            <motion.section
              key="scene-3"
              initial={enter()}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -16 }}
              transition={sceneTransition}
              className="w-full"
            >
              <PhotoCardDeck onNext={() => handleSceneChange(4)} />
            </motion.section>
          )}

          {currentScene === 4 && (
            <motion.section
              key="scene-4"
              initial={enter()}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -16 }}
              transition={sceneTransition}
              className="w-full"
            >
              <VideoCapsule
                onNext={() => handleSceneChange(5)}
                onVideoPlay={() => setIsCinemaPlaying(true)}
                onVideoPause={() => setIsCinemaPlaying(false)}
              />
            </motion.section>
          )}

          {currentScene === 5 && (
            <motion.section
              key="scene-5"
              initial={enter()}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -16 }}
              transition={sceneTransition}
              className="w-full"
            >
              <TypewriterLetter onNext={() => handleSceneChange(6)} />
            </motion.section>
          )}

          {currentScene === 6 && (
            <motion.section
              key="scene-6"
              initial={enter()}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -16 }}
              transition={sceneTransition}
              className="w-full"
            >
              <PhotoboxStudio onNext={() => handleSceneChange(7)} />
            </motion.section>
          )}

          {currentScene === 7 && (
            <motion.section
              key="scene-7"
              initial={enter(true)}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
              transition={sceneTransition}
              className="w-full"
            >
              <BirthdayCake onRestart={handleRestartJourney} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
