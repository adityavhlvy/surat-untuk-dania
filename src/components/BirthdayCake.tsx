import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  Heart,
  Flame,
  Wind,
  RotateCcw,
  Mail,
  Send,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendEmail } from '../lib/email';

interface BirthdayCakeProps {
  onRestart: () => void;
}

const RECIPIENT_EMAILS = 'adityavahlevy1003@gmail.com, daniachaeyoung@gmail.com';

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ onRestart }) => {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [wishMade, setWishMade] = useState(false);
  const [senderName, setSenderName] = useState('Dania');
  const [wishInput, setWishInput] = useState('');
  const [savedWish, setSavedWish] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const reduceMotion = useReducedMotion();
  const blowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confettiTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (blowTimeoutRef.current) clearTimeout(blowTimeoutRef.current);
      if (confettiTimerRef.current) clearInterval(confettiTimerRef.current);
    };
  }, []);

  const handleBlowCandles = () => {
    if (candlesBlown) return;
    setIsBlowing(true);

    blowTimeoutRef.current = setTimeout(() => {
      setCandlesBlown(true);
      setIsBlowing(false);

      if (reduceMotion) return;

      const duration = 4.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 1000 };

      confettiTimerRef.current = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          if (confettiTimerRef.current) clearInterval(confettiTimerRef.current);
          confettiTimerRef.current = null;
          return;
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
      disableForReducedMotion: true,
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

  const handleCopyWish = async () => {
    if (!savedWish) return;
    try {
      await navigator.clipboard.writeText(
        `✨ Doa & Harapan Ulang Tahun Dania ke-24 (17 Agustus 2026):\n"${savedWish}"\n\nDikirim untuk: ${RECIPIENT_EMAILS}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="scene scene-pad max-w-4xl px-4 text-center sm:px-6">
      {/* Top Badge */}
      <div className="mx-auto mb-5 max-w-xl">
        <p className="chip mx-auto">
          <Sparkles aria-hidden="true" className="h-4 w-4" />
          Grand Celebration Moment
        </p>
        <h2 className="mt-3 font-serif text-2xl font-bold text-heading sm:text-4xl md:text-5xl">
          {candlesBlown ? (
            <span className="text-gradient-gold">✨ Make a Wish, Dania! ✨</span>
          ) : (
            <span>Kue Ulang Tahun ke-24</span>
          )}
        </h2>
        <p className="lead mt-2">
          {candlesBlown
            ? 'Lilin telah ditiup. Tuliskan doa dan harapan terindahmu di bawah ini.'
            : 'Pikirkan sebuah harapan terindah dalam hatimu, lalu tiup lilin angka 24 ini.'}
        </p>
      </div>

      {/* 3D-Styled Birthday Cake */}
      <div className="relative mx-auto my-4 flex h-56 w-64 flex-col items-center justify-end sm:h-64 sm:w-80">
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 rounded-full blur-3xl transition duration-700 ${
            candlesBlown ? 'bg-accent2/15' : 'animate-pulse-slow bg-accent/20'
          }`}
        />

        {/* Number Candles: 2 and 4 */}
        <div className="z-20 mb-2 flex items-end justify-center gap-5 sm:gap-6">
          {['2', '4'].map((num, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              <div className="flex h-8 items-center justify-center sm:h-10">
                <AnimatePresence>
                  {!candlesBlown ? (
                    <motion.div
                      key="flame"
                      initial={reduceMotion ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                      className="relative flex cursor-pointer items-center justify-center"
                      onClick={handleBlowCandles}
                    >
                      <div className="h-7 w-4 animate-flicker rounded-full bg-gradient-to-t from-accent via-accent2 to-accent-soft shadow-lg sm:h-8 sm:w-5" />
                      <div className="absolute bottom-1 h-3 w-1.5 rounded-full bg-white/90 sm:h-4 sm:w-2" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="smoke"
                      initial={reduceMotion ? false : { opacity: 0.9, y: 0, scale: 0.5 }}
                      animate={{ opacity: 0, y: -25, scale: 1.8 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="text-muted"
                    >
                      <Wind aria-hidden="true" className="h-5 w-5 opacity-60" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-5 w-2 rounded-t-sm bg-gradient-to-b from-accent-soft to-accent sm:h-6 sm:w-2.5" />
              <div className="-mt-1 rounded-lg border border-accent-soft/60 bg-gradient-to-b from-accent to-accent-strong px-2.5 py-0.5 font-serif text-xl font-black text-on-accent shadow-lg sm:px-3 sm:py-1 sm:text-2xl">
                {num}
              </div>
            </div>
          ))}
        </div>

        {/* Tier 1 */}
        <div className="relative flex h-14 w-40 items-center justify-center overflow-hidden rounded-t-3xl border-t-2 border-accent-soft/70 bg-gradient-to-r from-accent2 via-accent-soft to-accent2 shadow-xl sm:h-16 sm:w-48">
          <div className="absolute inset-x-0 top-0 h-3 rounded-b-xl bg-white/40 sm:h-4" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <span key={s} className="h-1.5 w-1.5 animate-ping rounded-full bg-accent-soft sm:h-2 sm:w-2" />
            ))}
          </div>
        </div>

        {/* Tier 2 */}
        <div className="relative flex h-16 w-56 flex-col items-center justify-center rounded-2xl border-2 border-line-strong bg-gradient-to-r from-surface-raised via-surface to-bg p-2 shadow-lg sm:h-20 sm:w-64">
          <div className="absolute -top-1 inset-x-2 h-1.5 rounded-full bg-gradient-to-r from-accent to-accent-strong sm:h-2" />
          <p className="font-serif text-xs font-bold italic tracking-wide text-accent sm:text-sm">
            Happy 24th Dania
          </p>
          <div className="mt-0.5 flex items-center gap-1 text-2xs text-accent2 sm:mt-1">
            <Heart aria-hidden="true" className="h-2.5 w-2.5 fill-accent2 sm:h-3 sm:w-3" />
            <span>17 Agustus 2026</span>
            <Heart aria-hidden="true" className="h-2.5 w-2.5 fill-accent2 sm:h-3 sm:w-3" />
          </div>
        </div>

        {/* Cake Stand */}
        <div className="-mt-1 h-3 w-64 rounded-full bg-gradient-to-r from-faint via-line-strong to-faint shadow-lg sm:h-4 sm:w-72" />
      </div>

      {/* Blow Candle Action Button */}
      {!candlesBlown && (
        <motion.button
          type="button"
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          onClick={handleBlowCandles}
          disabled={isBlowing}
          className="btn btn-primary mx-auto my-4 px-8 py-3.5 text-sm sm:text-base"
        >
          <Flame aria-hidden="true" className="h-5 w-5 fill-on-accent" />
          <span>{isBlowing ? 'Meniup Lilin...' : 'Tiup Lilin Sekarang'}</span>
        </motion.button>
      )}

      {/* Wish Input Card */}
      {candlesBlown && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto my-4 w-full max-w-xl space-y-4"
        >
          {!wishMade ? (
            <form
              onSubmit={handleSaveWishAndEmail}
              className="panel-gold space-y-4 p-5 text-left sm:p-7"
            >
              <div>
                <label htmlFor="sender-name" className="field-label">
                  Nama Pengirim / Panggilan Sayang
                </label>
                <input
                  id="sender-name"
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  autoComplete="name"
                  className="field"
                  placeholder="Contoh: Dania / Aditya"
                />
              </div>

              <div>
                <label htmlFor="wish-input" className="field-label">
                  Doa & Harapan Terindahmu di Umur 24
                </label>
                <textarea
                  id="wish-input"
                  value={wishInput}
                  onChange={(e) => setWishInput(e.target.value)}
                  placeholder="Tuliskan harapanmu seluas-luasnya di sini... (impian, doa kesehatan, kelancaran masa depan, atau pesan manis berdua)"
                  rows={4}
                  maxLength={600}
                  aria-describedby="wish-counter wish-email-note"
                  className="field resize-none leading-relaxed"
                  required
                />
                <p id="wish-counter" className="mt-1 text-right text-2xs tabular-nums text-faint">
                  {wishInput.length} / 600
                </p>
              </div>

              <div
                id="wish-email-note"
                className="flex items-start gap-2.5 rounded-xl border border-line bg-accent/5 p-3 text-xs text-muted"
              >
                <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  Pesan otomatis dipersiapkan untuk dikirim ke email kita:
                  <strong className="mt-0.5 block font-mono text-2xs text-heading">
                    adityavahlevy1003@gmail.com & daniachaeyoung@gmail.com
                  </strong>
                </span>
              </div>

              <motion.button
                type="submit"
                whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                disabled={!wishInput.trim() || emailStatus === 'sending'}
                className="btn btn-primary w-full"
              >
                <Send aria-hidden="true" className="h-4 w-4" />
                <span>
                  {emailStatus === 'sending' ? 'Mengirim...' : 'Simpan Harapan & Kirim ke Email'}
                </span>
              </motion.button>
            </form>
          ) : (
            <div className="panel-gold space-y-4 p-6 text-center sm:p-8">
              <div className="inline-flex rounded-full bg-success/15 p-3 text-success">
                <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
              </div>
              <h4 className="font-serif text-lg font-bold text-accent sm:text-xl">
                Harapan & Doa Dania Telah Tersimpan
              </h4>
              <p className="whitespace-pre-line rounded-xl border border-line bg-bg/70 p-4 text-left text-sm italic leading-relaxed text-ink">
                “{savedWish}”
              </p>

              <p className="text-xs text-muted">
                Terkirim untuk kenangan kita:
                <br />
                <span className="font-mono text-2xs text-accent">{RECIPIENT_EMAILS}</span>
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCopyWish}
                  className="btn btn-secondary btn-sm"
                >
                  <Copy aria-hidden="true" className="h-4 w-4" />
                  <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={emailStatus === 'sending'}
                  className="btn btn-primary btn-sm"
                >
                  <Mail aria-hidden="true" className="h-4 w-4" />
                  <span>{emailStatus === 'sending' ? 'Mengirim...' : 'Kirim Ulang ke Email'}</span>
                </button>
              </div>

              <p
                role="status"
                className={`text-xs font-semibold ${
                  emailStatus === 'sent'
                    ? 'text-success'
                    : emailStatus === 'error'
                      ? 'text-danger'
                      : 'text-accent'
                }`}
              >
                {emailStatus === 'idle'
                  ? ''
                  : emailStatus === 'sending'
                    ? 'Mengirim email...'
                    : emailStatus === 'sent'
                      ? 'Email terkirim ke Aditya dan Dania.'
                      : 'Email gagal terkirim. Cek koneksi lalu kirim ulang.'}
              </p>
            </div>
          )}

          {/* Grand Blessing Banner */}
          <div className="panel p-5 text-center">
            <h3 className="mb-1.5 font-serif text-xl font-bold text-gradient-gold sm:text-2xl">
              Selamat Ulang Tahun, Dania! 💐
            </h3>
            <p className="text-xs font-light leading-relaxed text-muted sm:text-sm">
              Terima kasih sudah lahir dan tumbuh menjadi bidadari paling istimewa. Hari ini dan
              seterusnya, kamu layak mendapatkan semua kebahagiaan di dunia ini.
            </p>
          </div>
        </motion.div>
      )}

      {/* Footer Restart Journey Action */}
      <div className="mx-auto mt-4 flex w-full max-w-xl flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        <span className="text-2xs text-faint">17 Agustus 2026 · Dania 24th</span>
        <button type="button" onClick={onRestart} className="btn btn-ghost btn-sm">
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Ulangi Perjalanan</span>
        </button>
      </div>
    </div>
  );
};
