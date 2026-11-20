import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

export const App: React.FC = () => {
  const [currentScene, setCurrentScene] = useState(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCinemaPlaying, setIsCinemaPlaying] = useState(false);

  const handleOpenEnvelope = () => {
    setIsPlayingAudio(true);
    setCurrentScene(2);
  };

  const handleRestartJourney = () => {
    setIsCinemaPlaying(false);
    setCurrentScene(1);
  };

  // Reset cinema playing state when scene changes away from Scene 4
  const handleSceneChange = (newScene: number) => {
    if (newScene !== 4) {
      setIsCinemaPlaying(false);
    }
    setCurrentScene(newScene);
  };

  // Effective audio is playing if audio is enabled AND cinema is NOT currently playing video
  const shouldPlayBgm = isPlayingAudio && !isCinemaPlaying;

  return (
    <div className="relative w-full min-h-[100dvh] bg-bg text-ink flex flex-col justify-between overflow-x-hidden font-sans">
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

      {/* Main Scene Switcher */}
      <main className="relative flex-1 w-full flex flex-col justify-center items-center z-10">
        <AnimatePresence mode="wait">
          {currentScene === 1 && (
            <motion.section
              key="scene-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full h-[100dvh] flex items-center justify-center overflow-hidden"
            >
              <EnvelopeIntro onOpen={handleOpenEnvelope} />
            </motion.section>
          )}

          {currentScene === 2 && (
            <motion.section
              key="scene-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full h-[100dvh] flex items-center justify-center overflow-hidden"
            >
              <CosmicPrologue onNext={() => handleSceneChange(3)} />
            </motion.section>
          )}

          {currentScene === 3 && (
            <motion.section
              key="scene-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full h-[100dvh] flex items-center justify-center overflow-hidden"
            >
              <PhotoCardDeck onNext={() => handleSceneChange(4)} />
            </motion.section>
          )}

          {currentScene === 4 && (
            <motion.section
              key="scene-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full h-[100dvh] flex items-center justify-center overflow-hidden"
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full h-[100dvh] flex items-center justify-center overflow-hidden"
            >
              <TypewriterLetter onNext={() => handleSceneChange(6)} />
            </motion.section>
          )}

          {currentScene === 6 && (
            <motion.section
              key="scene-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full min-h-[100dvh] flex items-center justify-center"
            >
              <PhotoboxStudio onNext={() => handleSceneChange(7)} />
            </motion.section>
          )}

          {currentScene === 7 && (
            <motion.section
              key="scene-7"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full min-h-[100dvh] flex items-center justify-center"
            >
              <BirthdayCake onRestart={handleRestartJourney} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
