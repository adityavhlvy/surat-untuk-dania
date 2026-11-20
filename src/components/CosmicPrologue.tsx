import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Heart, Clock, Star, Calendar, ChevronRight } from 'lucide-react';

interface CosmicPrologueProps {
  onNext: () => void;
}

export const CosmicPrologue: React.FC<CosmicPrologueProps> = ({ onNext }) => {
  const stats = [
    { number: '24', label: 'Tahun Bersinar', desc: 'Babak baru penuh cinta', icon: Star },
    { number: '8,766', label: 'Hari di Dunia', desc: 'Menebar kebaikan', icon: Calendar },
    { number: '210,384', label: 'Jam Penuh Makna', desc: 'Senyummu sangat berarti', icon: Clock },
    { number: '1', label: 'Dania di Hatiku', desc: 'Satu-satunya untukku', icon: Heart },
  ];

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center px-3 sm:px-6 py-3 sm:py-6 z-10 max-w-4xl mx-auto box-border overflow-hidden">
      {/* Top Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-14 sm:mt-18 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] sm:text-xs font-semibold tracking-wider uppercase flex-shrink-0"
      >
        <Flag className="w-3 h-3 text-red-500" />
        <span>17 Agustus 2002 — 17 Agustus 2026</span>
      </motion.div>

      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center max-w-2xl mx-auto my-auto py-1"
      >
        <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
          Saat Seluruh Negeri Merdeka,{' '}
          <span className="bg-gradient-to-r from-red-400 via-pink-300 to-amber-300 bg-clip-text text-transparent italic">
            Semesta Melahirkanmu.
          </span>
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed max-w-lg mx-auto">
          17 Agustus adalah hari di mana seorang bidadari berhati lembut bernama{' '}
          <strong className="text-pink-300 font-semibold">Dania</strong> lahir membawa kehangatan di bumi.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 w-full my-auto flex-shrink-0">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx + 0.2 }}
              className="p-2.5 sm:p-3.5 rounded-xl glass-card border border-white/10 flex flex-col items-center text-center"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-amber-400/20 border border-white/10 flex items-center justify-center mb-1">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              </div>
              <span className="font-serif text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-200 to-pink-300 bg-clip-text text-transparent leading-none my-0.5">
                {stat.number}
              </span>
              <span className="text-white text-[11px] sm:text-xs font-semibold">{stat.label}</span>
              <span className="text-slate-400 text-[9px] sm:text-[10px] font-light truncate max-w-full">
                {stat.desc}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Narrative Quote Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full glass-panel-gold rounded-xl p-3 sm:p-4 border border-amber-400/20 text-center my-auto flex-shrink-0"
      >
        <p className="font-serif italic text-xs sm:text-sm text-amber-100/90 leading-relaxed mb-1">
          "24 tahun adalah bukti indahnya prosesmu menjadi perempuan hebat seperti sekarang. Terima kasih sudah selalu menebarkan senyum terindah."
        </p>
        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-pink-300 font-semibold">
          — 24 Moments of Dania —
        </p>
      </motion.div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="mb-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-gradient-to-r from-pink-500 to-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-pink-500/20 cursor-pointer flex-shrink-0"
      >
        <span>Lihat 24 Kenangan Indah</span>
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};
