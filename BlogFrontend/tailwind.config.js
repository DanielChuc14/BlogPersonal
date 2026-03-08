/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  corePlugins: {
    preflight: false, // Avoid conflicts with Angular Material base styles
  },
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1a1a2e',
          mid: '#16213e',
          accent: '#e94560',
        },
        surface: '#f5f7fa',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
      },
    },
  },
  plugins: [],
};
