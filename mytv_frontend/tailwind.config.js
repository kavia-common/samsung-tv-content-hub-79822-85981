/** Tailwind CSS configuration for MyTV (React + Vite).
 * - Scans index.html and all JSX under src for class usage.
 * - Extends with a few custom theme tokens to match Ocean Professional dark theme.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#F59E0B',
        bg: '#0B1220',
        surface: '#0f172a',
        text: '#E5E7EB',
        muted: '#9CA3AF',
      },
      boxShadow: {
        ocean: '0 10px 30px rgba(0,0,0,0.45)',
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
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.2s ease-in-out infinite',
        'splash-bg-fade': 'splash-bg-fade 900ms ease-out forwards',
        'splash-content-fade': 'splash-content-fade 950ms ease-out 100ms both',
      },
      backgroundImage: {
        'banner-gradient':
          'linear-gradient(90deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.55) 40%, rgba(2,6,23,0.2) 70%, rgba(2,6,23,0.0) 100%)',
        'topmenu-gradient':
          'linear-gradient(180deg, rgba(2,6,23,0.95), rgba(2,6,23,0.75))',
      },
    },
  },
  plugins: [],
}
