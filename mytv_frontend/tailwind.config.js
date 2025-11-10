/** Tailwind CSS configuration for MyTV (React + Vite).
 * - Scans index.html and all JSX under src for class usage.
 * - Extends with a richer dark palette, fluid typography, gradients, glass utilities and animations.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Upgraded dark theme palette
        primary: '#2563EB',
        secondary: '#F59E0B',
        brand: {
          50: '#eaf2ff',
          100: '#d7e6ff',
          200: '#b3d0ff',
          300: '#84b2ff',
          400: '#5291ff',
          500: '#2563EB',
          600: '#1e4fc0',
          700: '#1b459f',
          800: '#183a82',
          900: '#142f69',
        },
        amberish: '#F59E0B',
        bg: '#0B1220',
        surface: '#0f172a',
        surface2: '#111827',
        text: '#E5E7EB',
        muted: '#9CA3AF',
        slateGlass: 'rgba(15,23,42,0.55)',
      },
      fontSize: {
        // fluidish scale
        'display': ['clamp(2.5rem, 4.5vw, 5rem)', { lineHeight: '1.05', fontWeight: '900' }],
        'headline': ['clamp(1.75rem, 2.6vw, 2.75rem)', { lineHeight: '1.1', fontWeight: '800' }],
        'subhead': ['clamp(1.1rem, 1.6vw, 1.5rem)', { lineHeight: '1.2', fontWeight: '600' }],
      },
      boxShadow: {
        ocean: '0 10px 30px rgba(0,0,0,0.45)',
        glow: '0 10px 30px rgba(37,99,235,0.25)',
        card: '0 10px 30px rgba(0,0,0,0.40)',
        cardHover: '0 20px 40px rgba(0,0,0,0.55)',
      },
      borderRadius: {
        'xl2': '14px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'splash-bg-fade': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'splash-content-fade': {
          from: { opacity: '0', transform: 'translateY(6px) scale(.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'brand-pulse': {
          '0%, 100%': { opacity: '0.55', filter: 'drop-shadow(0 0 0 rgba(37,99,235,0))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 8px 24px rgba(37,99,235,0.35))' },
        },
        'float-up': {
          '0%': { transform: 'translateY(4px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.2s ease-in-out infinite',
        'splash-bg-fade': 'splash-bg-fade 900ms ease-out forwards',
        'splash-content-fade': 'splash-content-fade 1100ms ease-out 80ms both',
        'brand-pulse': 'brand-pulse 2.4s ease-in-out infinite',
        'float-up': 'float-up .25s ease-out',
      },
      backgroundImage: {
        // Layered gradients for banner and header glass
        'banner-gradient':
          'linear-gradient(90deg, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.6) 38%, rgba(2,6,23,0.24) 72%, rgba(2,6,23,0.0) 100%)',
        'topmenu-gradient':
          'linear-gradient(180deg, rgba(2,6,23,0.85), rgba(2,6,23,0.64))',
        'layered-radial':
          'radial-gradient(900px 680px at 60% 10%, rgba(37,99,235,0.25), rgba(11,18,32,0)), radial-gradient(900px 680px at 15% 80%, rgba(245,158,11,0.18), rgba(11,18,32,0))',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(.22,.61,.36,1)',
      },
      scrollSnapType: {
        x: 'x mandatory',
      },
    },
  },
  plugins: [],
}
