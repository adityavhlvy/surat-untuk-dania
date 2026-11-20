import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Flag, Heart, Clock, Star, Calendar, ChevronRight } from 'lucide-react';

interface CosmicPrologueProps {
  onNext: () => void;
}

export const CosmicPrologue: React.FC<CosmicPrologueProps> = ({ onNext }) => {
  const reduceMotion = useReducedMotion();
  const stats = [
    { number: '24', label: 'Tahun Bersinar', desc: 'Babak baru penuh cinta', icon: Star },
    { number: '8.766', label: 'Hari di Dunia', desc: 'Menebar kebaikan', icon: Calendar },
    { number: '210.384', label: 'Jam Penuh Makna', desc: 'Senyummu sangat berarti', icon: Clock },
    { number: '1', label: 'Dania di Hatiku', desc: 'Satu-satunya untukku', icon: Heart },
  ];

  return (
    <div className="scene scene-pad max-w-4xl px-4 sm:px-6">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="chip chip-rose"
        >
          <Flag aria-hidden="true" className="h-3 w-3" />
          17 Agustus 2002 — 17 Agustus 2026
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl"
        >
          <h2 className="font-serif text-2xl font-bold leading-tight text-heading sm:text-3xl md:text-4xl">
            Saat Seluruh Negeri Merdeka,{' '}
            <span className="text-gradient-gold italic">Semesta Melahirkanmu.</span>
          </h2>
          <p className="lead mx-auto mt-3 max-w-lg">
            17 Agustus adalah hari di mana seorang bidadari berhati lembut bernama{' '}
            <strong className="font-semibold text-accent">Dania</strong> lahir membawa kehangatan
            di bumi.
          </p>
        </motion.div>

        <ul className="grid w-full grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.li
                key={stat.label}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: reduceMotion ? 0 : 0.08 * idx + 0.15 }}
                className="panel card-hover flex flex-col items-center p-3 text-center sm:p-4"
              >
                <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-accent/10">
                  <Icon aria-hidden="true" className="h-4 w-4 text-accent" />
                </span>
                <span className="font-serif text-xl font-bold leading-none text-heading sm:text-2xl">
                  {stat.number}
                </span>
                <span className="mt-1 text-2xs font-semibold text-heading sm:text-xs">
                  {stat.label}
                </span>
                <span className="mt-0.5 max-w-full truncate text-2xs text-muted">
                  {stat.desc}
                </span>
              </motion.li>
            );
          })}
        </ul>

        <motion.blockquote
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="panel-gold w-full max-w-2xl p-4 sm:p-5"
        >
          <p className="font-serif text-sm italic leading-relaxed text-ink sm:text-base">
            “24 tahun adalah bukti indahnya prosesmu menjadi perempuan hebat seperti sekarang.
            Terima kasih sudah selalu menebarkan senyum terindah.”
          </p>
          <footer className="mt-2 text-2xs font-semibold uppercase tracking-[0.18em] text-accent">
            — 24 Moments of Dania —
          </footer>
        </motion.blockquote>
      </div>

      <div className="mt-6 flex justify-center">
        <motion.button
          type="button"
          onClick={onNext}
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="btn btn-primary"
        >
          <span>Lihat 24 Kenangan Indah</span>
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
};
