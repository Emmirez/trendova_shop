/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'body': ['"DM Sans"', 'sans-serif'],
        'mono': ['"Space Mono"', 'monospace'],
      },
      colors: {
        'obsidian': '#0A0A0A',
        'charcoal': '#141414',
        'smoke': '#1E1E1E',
        'gold': '#C9A84C',
        'gold-light': '#E8C97A',
        'cream': '#F5F0E8',
        'muted': '#666666',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        'slide-in': 'slideIn 0.6s ease forwards',
        'ticker': 'ticker 20s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
