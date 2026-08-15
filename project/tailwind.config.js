/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        paper: '#F9F9F7',
        ink: '#111111',
        divider: '#E5E5E0',
        editorialRed: '#CC0000',
      },
      boxShadow: {
        'hard-sm': '2px 2px 0px 0px #111111',
        'hard': '4px 4px 0px 0px #111111',
        'hard-lg': '6px 6px 0px 0px #111111',
        'hard-red': '4px 4px 0px 0px #CC0000',
      }
    },
  },
  plugins: [],
};

