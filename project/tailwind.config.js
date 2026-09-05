/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        script: ['Caveat', 'cursive'],
      },
      colors: {
        // ── Superhuman — golden hour editorial system ──
        'midnight-wine': '#421d24',
        'royal-violet': '#714cb6',
        'lilac-mist': '#d4c7ff',
        'deep-lagoon': '#0c4243',
        'warm-parchment': '#f2f0eb',
        'soft-mist': '#e3e3e2',
        'ink-charcoal': '#292827',
        'stone-gray': '#666666',
        'paper-white': '#ffffff',
        // Dark theme surfaces (editorial, warm)
        'canvas-dark': '#161514',
        'card-dark': '#232020',
        'ink-light': '#efebe4',
        'mist-dark': 'rgba(255,255,255,0.10)',
      },
      borderRadius: {
        tabs: '8px',
        cards: '16px',
        floating: '16px',
        buttons: '16px',
        small: '8px',
        pill: '999px',
        input: '10px',
      },
      boxShadow: {
        subtle: 'rgb(113, 76, 182) 0px 0px 0px 1px inset',
      },
      spacing: {
        '4.5': '18px',
        '15': '60px',
        '18': '72px',
      },
      letterSpacing: {
        display: '-0.028em',
        'heading-lg': '-0.027em',
        'heading-sm': '-0.022em',
        'subheading': '-0.014em',
        'body': '-0.008em',
      },
      lineHeight: {
        display: '0.96',
        'heading-lg': '1.2',
        'heading-sm': '1.14',
        subheading: '1.3',
        body: '1.2',
      },
      maxWidth: {
        page: '1200px',
      },
      fontSize: {
        caption: ['12px', '1.5'],
        'body-sm': ['14px', '1.5'],
        body: ['16px', '1.2'],
        'label-bold': ['19px', '1.5'],
        subheading: ['26px', '1.3'],
        'heading-sm': ['28px', '1.14'],
        'heading-lg': ['49px', '1.2'],
        display: ['64px', '0.96'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-8px) translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
};