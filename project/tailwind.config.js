/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        display: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Core surfaces — CSS-var driven so light/dark stay in sync
        background: {
          deep: 'var(--background-deep)',
          base: 'var(--background-base)',
          elevated: 'var(--background-elevated)',
        },
        surface: 'var(--surface)',
        'surface-hover': 'var(--surface-hover)',
        foreground: 'var(--foreground)',
        'foreground-muted': 'var(--foreground-muted)',
        'foreground-subtle': 'var(--foreground-subtle)',
        accent: 'var(--accent)',
        'accent-bright': 'var(--accent-bright)',
        'accent-glow': 'var(--accent-glow)',
        border: {
          DEFAULT: 'var(--border-default)',
          hover: 'var(--border-hover)',
          accent: 'var(--border-accent)',
        },
        // Explicit aliases so `border-border-default`, `bg-background-base/70` etc. resolve
        'border-default': 'var(--border-default)',
        'border-hover': 'var(--border-hover)',
        'border-accent': 'var(--border-accent)',
        'background-base': 'var(--background-base)',
        'background-elevated': 'var(--background-elevated)',
        'background-deep': 'var(--background-deep)',
        // Status semantics — stable across themes
        status: {
          open: '#f59e0b',
          repair: '#5e6ad2',
          resolved: '#10b981',
          critical: '#f43f5e',
        },
        // Legacy aliases (kept so old classes don't break during migration)
        'midnight-wine': '#421d24',
        'royal-violet': '#5e6ad2',
        'lilac-mist': '#d4c7ff',
        'deep-lagoon': '#0c4243',
        'warm-parchment': '#f2f0eb',
        'soft-mist': '#e3e3e2',
        'ink-charcoal': '#292827',
        'stone-gray': '#666666',
        'paper-white': '#ffffff',
        'canvas-dark': '#161514',
        'card-dark': '#232020',
        'ink-light': '#efebe4',
      },
      borderRadius: {
        bezel: '28px',
        card: '20px',
        floating: '20px',
        button: '999px',
        small: '10px',
        pill: '999px',
        input: '14px',
      },
      boxShadow: {
        card: '0 0 0 1px var(--border-default), 0 8px 32px rgba(0,0,0,0.28)',
        'card-hover':
          '0 0 0 1px var(--border-hover), 0 16px 48px rgba(0,0,0,0.32)',
        accent:
          '0 0 0 1px rgba(94,106,210,0.5), 0 8px 24px rgba(94,106,210,0.35), inset 0 1px 0 rgba(255,255,255,0.22)',
        soft: '0 24px 64px -24px rgba(0,0,0,0.35)',
      },
      letterSpacing: {
        display: '-0.035em',
        eyebrow: '0.22em',
      },
      maxWidth: {
        page: '1200px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.32,0.72,0,1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.32,0.72,0,1) both',
        float: 'float 7s cubic-bezier(0.32,0.72,0,1) infinite',
        'pulse-dot': 'pulseDot 2s cubic-bezier(0.32,0.72,0,1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.82)' },
        },
      },
    },
  },
  plugins: [],
};
