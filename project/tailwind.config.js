/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Marcellus', 'Italiana', 'Georgia', 'serif'],
        heading: ['Marcellus', 'Italiana', 'serif'],
        body: ['Josefin Sans', 'sans-serif'],
        sans: ['Josefin Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        obsidian: '#0A0A0A',
        champagne: '#F2F0E4',
        charcoal: '#141414',
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F2E8C4',
          dark: '#AA820A',
          muted: 'rgba(212, 175, 55, 0.3)',
        },
        midnight: '#1E3D59',
        pewter: '#888888',
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 25px rgba(212, 175, 55, 0.45)',
        'gold-glow-sm': '0 0 8px rgba(212, 175, 55, 0.2)',
        'hard-gold': '4px 4px 0px 0px #D4AF37',
      }
    },
  },
  plugins: [],
};

