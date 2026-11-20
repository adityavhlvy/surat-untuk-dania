import React from 'react';
import { Mail, Sparkles, Image, Film, Feather, Camera, Cake } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationPillsProps {
  currentScene: number;
  onSelectScene: (scene: number) => void;
}

export const NavigationPills: React.FC<NavigationPillsProps> = ({
  currentScene,
  onSelectScene,
}) => {
  const scenes = [
    { id: 1, label: 'Amplop', icon: Mail },
    { id: 2, label: '17 Agustus', icon: Sparkles },
    { id: 3, label: '24 Memori', icon: Image },
    { id: 4, label: 'Cinema', icon: Film },
    { id: 5, label: 'Surat', icon: Feather },
    { id: 6, label: 'Photobox', icon: Camera },
    { id: 7, label: 'Kue 24th', icon: Cake },
  ];

  return (
    <div className="fixed top-2 sm:top-4 inset-x-0 z-50 flex justify-center px-2 sm:px-4 pointer-events-none">
      <div className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-slate-950/90 border border-white/20 shadow-2xl backdrop-blur-2xl pointer-events-auto max-w-full overflow-x-auto no-scrollbar">
        {scenes.map((scene) => {
          const Icon = scene.icon;
          const isActive = currentScene === scene.id;

          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => onSelectScene(scene.id)}
              className={`relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition duration-300 cursor-pointer ${
                isActive ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-pink-400 to-rose-400 shadow-md"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <span className="relative z-10">
                <Icon className="w-3.5 h-3.5" />
              </span>
              <span className="relative z-10 hidden sm:inline">{scene.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
