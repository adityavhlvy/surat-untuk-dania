# Untuk Dania

Dua pengalaman dalam satu situs.

- `/` — halaman pembuka, memilih antara surat atau kado ulang tahun
- `/surat/` — surat delapan halaman (HTML/CSS/JS biasa)
- `/birthday/` — kado interaktif (React + Vite)

## Menjalankan

```bash
bun install
bun dev
```

Buka `http://localhost:3000`.

## Build

```bash
bun run build
```

Hasilnya di `dist/`, siap diunggah ke hosting statis apa pun.

```bash
bunx serve dist   # atau: cd dist && python3 -m http.server 8000
```

## Struktur

```
index.html          halaman pembuka
surat/              surat: index.html, style.css, script.js
birthday/           halaman React (entry HTML)
src/                komponen dan data React
design/tokens.css   token warna, tipografi, ruang, dan gerak
public/             aset bersama: music.mp3, album-art.jpg,
                    youtube-audio.mp3, special-video.mp4, dania-photos/
```

## Design system

Satu file token, dua tema. Nama token sama, nilainya berbeda:

- `data-theme="paper"` untuk halaman pembuka dan surat
- `data-theme="midnight"` untuk halaman kado

Warna disimpan sebagai triplet kanal (`--bg-rgb`, `--accent-rgb`, dst.) lalu
diekspos sebagai warna jadi (`--bg`, `--accent`). Pola ini membuat Tailwind
bisa memakai opacity modifier tanpa kehilangan nilai token.

Peran warna: `--bg`, `--surface`, `--surface-raised`, `--text`, `--heading`,
`--muted`, `--faint`, `--accent`, `--accent-strong`, `--accent-soft`,
`--accent2`, `--on-accent`, `--line`, `--line-strong`, `--success`, `--danger`.
Tipografi: `--font-display`, `--font-prose`, `--font-ui`, `--font-hand`.
Plus skala teks fluid, skala ruang 4px, radius, shadow, lapisan, dan gerak
(`--dur`, `--ease`, `--ease-out`).

Cara pakai:

- Surat: `surat/style.css` mengimpor token di baris pertama.
- React: `src/main.tsx` mengimpor `../design/tokens.css`, lalu Tailwind
  membaca variabel yang sama lewat `tailwind.config.js`.
- Portal: `<link rel="stylesheet" href="design/tokens.css">`.

Ganti satu nilai di `design/tokens.css`, ketiga halaman ikut berubah.

Utilitas semantik untuk komponen: `bg-bg`, `bg-surface`, `text-ink`,
`text-heading`, `text-muted`, `text-faint`, `border-line`, `bg-accent`,
`text-on-accent`, `shadow-glow`.

Kelas komponen bersama ada di `src/index.css`: `.scene` dan `.scene-pad`
(kerangka bab), `.panel`, `.panel-gold`, `.panel-glass`, `.btn`,
`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.icon-btn`, `.chip`,
`.segment`, `.field`, `.scene-header`, `.scene-title`.

Semua halaman memuat keluarga font yang sama lewat Google Fonts (Lora,
Playfair Display, Plus Jakarta Sans, Caveat). Gerak dimatikan otomatis lewat
`prefers-reduced-motion`.

Aset di `public/` diakses lewat path absolut (misal `/music.mp3`), jadi bisa dipakai dari halaman mana pun.

## Catatan

- Email dari scene photobox dikirim lewat FormSubmit, atur di `src/lib/email.ts`.
- Vite menganggap `surat/` dan `birthday/` sebagai halaman terpisah (multi-page), dikonfigurasi di `vite.config.ts`.
