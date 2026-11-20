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
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        'surface-raised': 'rgb(var(--surface-raised-rgb) / <alpha-value>)',
        ink: 'rgb(var(--text-rgb) / <alpha-value>)',
        heading: 'rgb(var(--heading-rgb) / <alpha-value>)',
        muted: 'rgb(var(--muted-rgb) / <alpha-value>)',
        faint: 'rgb(var(--faint-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-strong': 'rgb(var(--accent-strong-rgb) / <alpha-value>)',
        'accent-soft': 'rgb(var(--accent-soft-rgb) / <alpha-value>)',
        accent2: 'rgb(var(--accent2-rgb) / <alpha-value>)',
        'on-accent': 'rgb(var(--on-accent-rgb) / <alpha-value>)',
        line: 'rgb(var(--line-rgb) / 0.16)',
        'line-strong': 'rgb(var(--line-rgb) / 0.32)',
        success: 'rgb(var(--success-rgb) / <alpha-value>)',
        danger: 'rgb(var(--danger-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        serif: ['var(--font-display)'],
        sans: ['var(--font-ui)'],
        prose: ['var(--font-prose)'],
        handwriting: ['var(--font-hand)'],
      },
      fontSize: {
        '2xs': 'var(--text-2xs)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
