/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0a',
          950: '#0a0a0a',
          900: '#0b0b0b',
        },
        surface: {
          900: '#0f1115',
          800: '#13151b',
        },
        accent: {
          red: '#e50914',
        },
        brand: {
          primary: '#2563EB',
          secondary: '#F59E0B',
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.45)',
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(.2,.8,.2,1)',
      }
    },
  },
  plugins: [],
}
