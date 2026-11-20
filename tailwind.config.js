/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./birthday/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Peran semantik, nilainya dari design/tokens.css per tema
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--text)',
        heading: 'var(--heading)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        line: 'var(--line)',
        midnight: {
          950: 'var(--midnight-950)',
          900: 'var(--midnight-900)',
          800: 'var(--midnight-800)',
          700: 'var(--midnight-700)',
        },
        starlight: {
          gold: 'var(--starlight-gold)',
          rose: 'var(--starlight-rose)',
          amber: 'var(--starlight-amber)',
          glow: 'var(--starlight-glow)',
        }
      },
      fontFamily: {
        serif: ['var(--font-display)'],
        sans: ['var(--font-ui)'],
        prose: ['var(--font-prose)'],
        handwriting: ['var(--font-hand)'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
