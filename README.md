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

Token warna memakai nama peran: `--bg`, `--surface`, `--text`, `--heading`,
`--muted`, `--accent`, `--accent-soft`, `--line`. Tipografi: `--font-display`,
`--font-prose`, `--font-ui`, `--font-hand`. Plus skala teks, skala ruang 4px,
radius, dan gerak (`--dur`, `--ease`).

Cara pakai:

- Surat: `surat/style.css` mengimpor token di baris pertama.
- React: `src/main.tsx` mengimpor `../design/tokens.css`, lalu Tailwind
  membaca variabel yang sama lewat `tailwind.config.js`.
- Portal: `<link rel="stylesheet" href="design/tokens.css">`.

Ganti satu nilai di `design/tokens.css`, ketiga halaman ikut berubah.
Komponen React lama masih memakai utilitas Tailwind bawaan (slate, pink,
amber). Komponen baru sebaiknya memakai kelas semantik: `bg-bg`, `text-ink`,
`text-heading`, `text-muted`, `border-line`, `bg-accent`.

Aset di `public/` diakses lewat path absolut (misal `/music.mp3`), jadi bisa dipakai dari halaman mana pun.

## Catatan

- Email dari scene photobox dikirim lewat FormSubmit, atur di `src/lib/email.ts`.
- Vite menganggap `surat/` dan `birthday/` sebagai halaman terpisah (multi-page), dikonfigurasi di `vite.config.ts`.
