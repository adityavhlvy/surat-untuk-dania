import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Flame, Wind, RotateCcw, Mail, Send, CheckCircle2, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendEmail } from '../lib/email';

interface BirthdayCakeProps {
  onRestart: () => void;
}

const RECIPIENT_EMAILS = 'adityavahlevy1003@gmail.com,daniachaeyoung@gmail.com';

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ onRestart }) => {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [wishMade, setWishMade] = useState(false);
  const [senderName, setSenderName] = useState('Dania');
  const [wishInput, setWishInput] = useState('');
  const [savedWish, setSavedWish] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleBlowCandles = () => {
    if (candlesBlown) return;
    setIsBlowing(true);

    setTimeout(() => {
      setCandlesBlown(true);
      setIsBlowing(false);

      const duration = 4.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 1000 };

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: 0.1 + Math.random() * 0.8, y: Math.random() - 0.2 },
          colors: ['#FFD166', '#F472B6', '#FFFFFF', '#F59E0B', '#E11D48', '#38BDF8'],
        });
      }, 250);
    }, 900);
  };

  const handleSaveWishAndEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim()) return;
    const text = wishInput.trim();
    const name = senderName.trim() || 'Dania';
    setSavedWish(text);
    setWishMade(true);

    confetti({
      particleCount: 45,
      spread: 65,
      origin: { y: 0.8 },
      colors: ['#FFD166', '#F472B6'],
    });

    setEmailStatus('sending');
    try {
      await sendEmail({
        _subject: `✨ Doa & Harapan Ulang Tahun ke-24 (${name}) - 17 Agustus 2026`,
        Nama: name,
        'Pesan & Harapan': text,
      });
      setEmailStatus('sent');
    } catch {
      setEmailStatus('error');
    }
  };

  const handleResendEmail = async () => {
    if (!savedWish) return;
    setEmailStatus('sending');
    try {
      await sendEmail({
        _subject: `✨ Doa & Harapan Ulang Tahun ke-24 (${senderName}) - Kirim Ulang`,
        Nama: senderName.trim() || 'Dania',
        'Pesan & Harapan': `"${savedWish}"`,
      });
      setEmailStatus('sent');
    } catch {
      setEmailStatus('error');
    }
  };

  const handleCopyWish = () => {
    if (!savedWish) return;
    navigator.clipboard.writeText(
      `✨ Doa & Harapan Ulang Tahun Dania ke-24 (17 Agustus 2026):\n"${savedWish}"\n\nDikirim untuk: ${RECIPIENT_EMAILS}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col items-center justify-between px-4 sm:px-6 pt-18 sm:pt-22 pb-12 z-10 max-w-4xl mx-auto overflow-y-auto text-center">
      {/* Top Badge */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-gold border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span>Grand Celebration Moment</span>
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
          {candlesBlown ? (
            <span className="bg-gradient-to-r from-amber-300 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              ✨ Make a Wish, Dania! ✨
            </span>
          ) : (
            <span>Kue Ulang Tahun ke-24</span>
          )}
        </h2>
        <p className="text-slate-300 text-xs sm:text-base font-light max-w-md mx-auto">
          {candlesBlown
            ? 'Lilin telah ditiup! Tuliskan doa & harapan terindahmu di bawah ini.'
            : 'Pikirkan sebuah harapan terindah dalam hatimu, lalu tiup lilin angka 24 ini.'}
        </p>
      </div>

      {/* 3D-Styled Birthday Cake */}
      <div className="relative w-64 sm:w-80 h-60 sm:h-72 flex flex-col items-center justify-end my-4 flex-shrink-0">
        <div
          className={`absolute inset-0 rounded-full blur-3xl transition duration-700 -z-10 ${
            candlesBlown
              ? 'bg-gradient-to-t from-pink-500/20 to-indigo-500/20'
              : 'bg-gradient-to-t from-amber-500/30 to-rose-500/30 animate-pulse-slow'
          }`}
        />

        {/* Number Candles: 2 and 4 */}
        <div className="flex items-end justify-center gap-5 sm:gap-6 mb-2 z-20">
          {['2', '4'].map((num, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              <div className="h-8 sm:h-10 flex items-center justify-center">
                <AnimatePresence>
                  {!candlesBlown ? (
                    <motion.div
                      key="flame"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="relative flex items-center justify-center cursor-pointer"
                      onClick={handleBlowCandles}
                    >
                      <div className="w-4 h-7 sm:w-5 sm:h-8 bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 rounded-full animate-flicker shadow-lg shadow-amber-500/70" />
                      <div className="absolute w-1.5 h-3 sm:w-2 sm:h-4 bg-white/90 rounded-full bottom-1" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="smoke"
                      initial={{ opacity: 0.9, y: 0, scale: 0.5 }}
                      animate={{ opacity: 0, y: -25, scale: 1.8 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="text-slate-400"
                    >
                      <Wind className="w-5 h-5 opacity-60" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-2 sm:w-2.5 h-5 sm:h-6 bg-gradient-to-b from-amber-200 to-amber-400 rounded-t-sm" />
              <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 font-serif font-black text-xl sm:text-2xl rounded-lg shadow-lg border border-amber-200 -mt-1">
                {num}
              </div>
            </div>
          ))}
        </div>

        {/* Tier 1 */}
        <div className="relative w-40 sm:w-48 h-14 sm:h-16 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 rounded-t-3xl border-t-2 border-pink-200 shadow-xl flex items-center justify-center overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-3 sm:h-4 bg-white/40 rounded-b-xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <span key={s} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-200 animate-ping" />
            ))}
          </div>
        </div>

        {/* Tier 2 */}
        <div className="relative w-56 sm:w-64 h-18 sm:h-22 bg-gradient-to-r from-purple-900 via-pink-900 to-indigo-950 rounded-2xl border-2 border-amber-400/30 shadow-2xl flex flex-col items-center justify-center p-2">
          <div className="absolute -top-1 inset-x-2 h-1.5 sm:h-2 bg-gradient-to-r from-amber-300 to-yellow-500 rounded-full" />
          <p className="font-serif italic font-bold text-amber-200 text-xs sm:text-sm tracking-wide">
            Happy 24th Dania
          </p>
          <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-pink-300 text-[9px] sm:text-[10px]">
            <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-pink-400" />
            <span>17 Agustus 2026</span>
            <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-pink-400" />
          </div>
        </div>

        {/* Cake Stand */}
        <div className="w-64 sm:w-72 h-3 sm:h-4 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-full shadow-2xl -mt-1" />
      </div>

      {/* Blow Candle Action Button */}
      {!candlesBlown && (
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleBlowCandles}
          disabled={isBlowing}
          className="my-4 px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 text-slate-950 font-bold text-sm sm:text-lg flex items-center gap-2.5 shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 transition cursor-pointer"
        >
          <Flame className="w-5 h-5 fill-slate-950 text-slate-950" />
          <span>{isBlowing ? 'Meniup Lilin...' : 'Tiup Lilin Sekarang 🎂'}</span>
        </motion.button>
      )}

      {/* SPATIOUS & LARGE WISH INPUT CARD */}
      {candlesBlown && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl my-4 space-y-4"
        >
          {!wishMade ? (
            <form
              onSubmit={handleSaveWishAndEmail}
              className="glass-panel-gold p-5 sm:p-7 rounded-2xl border border-amber-400/40 text-left space-y-4 shadow-2xl backdrop-blur-2xl"
            >
              <div>
                <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-1.5">
                  Nama Pengirim / Panggilan Sayang:
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-slate-950/90 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  placeholder="Contoh: Dania / Aditya"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-200 uppercase tracking-wider mb-1.5">
                  Tuliskan Doa & Harapan Terindahmu di Umur 24:
                </label>
                <textarea
                  value={wishInput}
                  onChange={(e) => setWishInput(e.target.value)}
                  placeholder="Tuliskan harapanmu seluas-luasnya di sini... (misal: impian, doa kesehatan, kelancaran masa depan, atau pesan manis berdua)"
                  rows={4}
                  className="w-full bg-slate-950/90 border border-white/20 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition leading-relaxed"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-xs text-amber-200/90 flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <span>
                  Pesan otomatis dipersiapkan untuk dikirim ke email kita:
                  <strong className="block text-white mt-0.5 font-mono text-[11px]">
                    adityavahlevy1003@gmail.com & daniachaeyoung@gmail.com
                  </strong>
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Simpan Harapan & Kirim ke Email 💌</span>
              </motion.button>
            </form>
          ) : (
            <div className="glass-panel-gold p-6 sm:p-8 rounded-2xl border border-amber-400/40 text-center space-y-4 shadow-2xl">
              <div className="inline-flex p-3 rounded-full bg-pink-500/20 text-pink-300 mb-1">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="font-serif text-lg sm:text-xl font-bold text-amber-200">
                Harapan & Doa Dania Telah Tersimpan!
              </h4>
              <p className="text-white text-sm sm:text-base italic bg-slate-950/70 p-4 rounded-xl border border-white/10 text-left whitespace-pre-line leading-relaxed">
                "{savedWish}"
              </p>
              
              <p className="text-xs text-slate-300">
                Terkirim untuk kenangan kita: <br />
                <span className="text-amber-300 font-mono text-xs">
                  adityavahlevy1003@gmail.com & daniachaeyoung@gmail.com
                </span>
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyWish}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={emailStatus === 'sending'}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-amber-400 text-slate-950 text-xs sm:text-sm font-bold transition cursor-pointer shadow disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  <span>{emailStatus === 'sending' ? 'Mengirim...' : 'Kirim Ulang ke Email'}</span>
                </button>
              </div>

              {emailStatus !== 'idle' && (
                <p
                  className={`text-xs font-semibold ${
                    emailStatus === 'sent'
                      ? 'text-green-400'
                      : emailStatus === 'error'
                        ? 'text-rose-400'
                        : 'text-amber-300'
                  }`}
                >
                  {emailStatus === 'sending'
                    ? 'Mengirim email...'
                    : emailStatus === 'sent'
                      ? '✓ Email terkirim ke aditya & dania'
                      : '✗ Email gagal terkirim — cek koneksi lalu kirim ulang'}
                </p>
              )}
            </div>
          )}

          {/* Grand Blessing Banner */}
          <div className="p-5 rounded-2xl glass-card border border-white/15 text-center">
            <h3 className="font-serif text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-200 via-pink-300 to-amber-200 bg-clip-text text-transparent mb-1.5">
              Selamat Ulang Tahun, Dania! 💐
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
              Terima kasih sudah lahir dan tumbuh menjadi bidadari paling istimewa. Hari ini dan
              seterusnya, kamu layak mendapatkan semua kebahagiaan di dunia ini.
            </p>
          </div>
        </motion.div>
      )}

      {/* Footer Restart Journey Action */}
      <div className="mt-4 flex items-center justify-between w-full max-w-xl border-t border-white/10 pt-3">
        <span className="text-[11px] text-slate-400">17 Agustus 2026 • Dania 24th</span>
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ulangi Perjalanan dari Awal</span>
        </button>
      </div>
    </div>
  );
};
