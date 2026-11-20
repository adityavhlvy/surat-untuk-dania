// Relay email via FormSubmit.co — gratis, tanpa backend, tanpa akun.
// Aktifasi sekali: kiriman pertama memicu email verifikasi ke inbox utama,
// klik link-nya sekali, setelah itu semua pesan masuk.
// ponytail: ganti EmailJS/Resend kalau butuh API key + branded sender.
export const EMAILS = {
  to: 'adityavahlevy1003@gmail.com',
  cc: 'daniachaeyoung@gmail.com',
};

export async function sendEmail(payload: Record<string, string>): Promise<void> {
  const res = await fetch(`https://formsubmit.co/ajax/${EMAILS.to}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: 'Pesan dari Dania Birthday Web 💌',
      _template: 'table',
      _captcha: 'false',
      _honeypot: '', // anti-spam: FormSubmit tolak kalau terisi (bot)
      _cc: EMAILS.cc,
      ...payload,
    }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`FormSubmit error ${res.status}: ${err}`);
  }
}
