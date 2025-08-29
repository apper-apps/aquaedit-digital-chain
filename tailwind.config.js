/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ocean-deep': '#1e3a8a',
        'ocean-teal': '#0d9488',
        'coral': '#f59e0b',
        'slate-dark': '#1e293b',
        'slate-darker': '#0f172a',
      },
      animation: {
        'wave': 'wave 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #0d9488 50%, #1e3a8a 100%)',
        'coral-gradient': 'linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      },
    },
  },
  plugins: [],
}