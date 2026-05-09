/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'
        },
        accent: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87'
        },
        surface: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      },
      boxShadow: {
        glow:    '0 0 40px -8px rgba(14,165,233,0.35)',
        'glow-accent': '0 0 40px -8px rgba(168,85,247,0.35)',
        glass:   '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)'
      },
      backgroundImage: {
        'hero-gradient':   'linear-gradient(135deg,rgba(14,165,233,0.35),rgba(168,85,247,0.35))',
        'card-gradient':   'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))',
        'primary-gradient':'linear-gradient(135deg,#0ea5e9,#a855f7)'
      },
      keyframes: {
        blob: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%':     { transform: 'translate(30px,-20px) scale(1.08)' },
          '66%':     { transform: 'translate(-20px,20px) scale(0.92)' }
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-12px)' }
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        pulseDot: {
          '0%,80%,100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '40%':          { opacity: '1',   transform: 'scale(1)' }
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        blob:      'blob 14s ease-in-out infinite',
        float:     'float 3s ease-in-out infinite',
        shimmer:   'shimmer 1.8s linear infinite',
        pulseDot:  'pulseDot 1.2s infinite ease-in-out',
        fadeUp:    'fadeUp 0.4s ease forwards'
      }
    }
  },
  plugins: []
};