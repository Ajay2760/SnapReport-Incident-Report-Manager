/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        system: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Flighty Signal-Light System
        'signal-blue': '#007bff',
        'amber-alert': '#f7be00',
        'deep-indigo': '#0d0021',
        'midnight-ink': '#05010d',
        'carbon': '#333333',
        'slate-custom': '#595959',
        'steel': '#737373',
        'fog': '#808080',
        'silver': '#cfcfcf',
        'linen': '#faf8f7',
        'ash': '#89898e',
        'alert-red': '#d92d20',
      },
      borderRadius: {
        'pill': '999px',
        'card': '16px',
        'floating': '20px',
        'input': '12px',
      },
      boxShadow: {
        'subtle': 'rgba(0, 0, 0, 0.02) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.02) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px',
        'subtle-2': 'rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.02) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px',
        'subtle-3': 'rgba(0, 0, 0, 0.03) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.03) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.03) 0px 6px 6px -3px, rgba(0, 0, 0, 0.03) 0px 12px 12px -6px, rgba(0, 0, 0, 0.03) 0px 24px 24px -12px',
        'nav-pill': '0px 1px 1px 0.5px rgba(0,0,0,0.03), 0px 3px 3px 1.5px rgba(0,0,0,0.03), 0px 6px 6px -3px rgba(0,0,0,0.03), 0px 12px 12px -6px rgba(0,0,0,0.03), 0px 24px 24px -12px rgba(0,0,0,0.03)',
      },
      spacing: {
        '4.5': '18px',
        '15': '60px',
        '18': '72px',
      },
      letterSpacing: {
        'display': '-0.025em',
        'heading': '-0.02em',
        'tight-sm': '-0.01em',
        'tight-xs': '-0.006em',
      },
      lineHeight: {
        'display': '1',
        'heading': '1.1',
      },
      maxWidth: {
        'page': '1200px',
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
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
