/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        // Atelier core luxury palette
        atelier: {
          50:  '#FAF7F2',
          100: '#F4EFEA',
          200: '#E8E3DC',
          300: '#DCD6CC',
          400: '#A89F91',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#141210'
        },
        // Warm Terracotta / Clay Primary (replaces cyan/neon)
        primary: {
          50:  '#FDF8F6',
          100: '#F7EDE8',
          200: '#EFDCD3',
          300: '#E2C2B3',
          400: '#D49B85',
          500: '#C26D53',
          600: '#A95C45',
          700: '#8E4A37',
          800: '#733B2C',
          900: '#5C2E22',
          950: '#3D1B13'
        },
        // Muted Sage / Olive Accent (replaces purple neon)
        accent: {
          50:  '#F4F7F4',
          100: '#E9EFE9',
          200: '#D4DFD4',
          300: '#B2C6B3',
          400: '#8DA88F',
          500: '#678A6A',
          600: '#4A6B53',
          700: '#395340',
          800: '#2B3E30',
          900: '#1E2C22'
        },
        surface: {
          50:  '#FAF7F2',
          100: '#F4EFEA',
          200: '#E8E3DC',
          800: '#24201E',
          900: '#1C1917',
          950: '#141210'
        }
      },
      boxShadow: {
        tactile: '0 2px 10px rgba(28, 25, 23, 0.04), 0 1px 3px rgba(28, 25, 23, 0.02)',
        card: '0 10px 30px -4px rgba(28, 25, 23, 0.05), 0 2px 6px -1px rgba(28, 25, 23, 0.02)',
        'card-hover': '0 20px 40px -8px rgba(28, 25, 23, 0.09), 0 6px 16px -2px rgba(28, 25, 23, 0.04)',
        recessed: 'inset 0 2px 4px rgba(28, 25, 23, 0.06)'
      },
      keyframes: {
        floatSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        floatSoft: 'floatSoft 4s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-out forwards'
      }
    }
  },
  plugins: []
};
