import React from 'react';
import { Mail, Sparkles, Image, Film, Feather, Camera, Cake, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationPillsProps {
  currentScene: number;
  onSelectScene: (scene: number) => void;
}

const SCENES = [
  { id: 1, label: 'Amplop', icon: Mail },
  { id: 2, label: '17 Agustus', icon: Sparkles },
  { id: 3, label: '24 Memori', icon: Image },
  { id: 4, label: 'Cinema', icon: Film },
  { id: 5, label: 'Surat', icon: Feather },
  { id: 6, label: 'Photobox', icon: Camera },
  { id: 7, label: 'Kue 24th', icon: Cake },
] as const;

export const NavigationPills: React.FC<NavigationPillsProps> = ({
  currentScene,
  onSelectScene,
}) => {
  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-nav)] border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[var(--nav-h)] max-w-6xl items-center gap-2 px-3 sm:gap-4 sm:px-6">
        <a
          href="/"
          aria-label="Kembali ke halaman pembuka"
          title="Kembali ke halaman pembuka"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full px-1 py-1 text-xs font-semibold text-muted transition hover:text-heading"
        >
          <ChevronLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
          <span className="hidden font-serif text-sm text-heading sm:inline">Untuk Dania</span>
        </a>

        <nav
          aria-label="Bab perjalanan"
          className="no-scrollbar fade-x flex flex-1 items-center gap-0.5 overflow-x-auto py-1"
        >
          {SCENES.map((scene) => {
            const Icon = scene.icon;
            const isActive = currentScene === scene.id;

            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => onSelectScene(scene.id)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Bab ${scene.id}: ${scene.label}`}
                title={scene.label}
                className="nav-pill"
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-accent shadow-glow"
                    transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                  />
                )}
                <Icon aria-hidden="true" className="relative z-10 h-3.5 w-3.5" />
                <span className="relative z-10 hidden lg:inline">{scene.label}</span>
              </button>
            );
          })}
        </nav>

        <span
          aria-hidden="true"
          className="hidden shrink-0 font-mono text-2xs tabular-nums text-faint sm:block"
        >
          {String(currentScene).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
        </span>
      </div>
    </header>
  );
};
