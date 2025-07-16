/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-purple': '#1a0d2e',
        'light-purple': '#3a1f5f',
        'accent-blue': '#8d82ff',
        'accent-pink': '#ff82d4',
      },
      keyframes: {
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        fadeInPop: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        inputGlow: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(141, 130, 255, 0.4)' },
          '50%': { boxShadow: '0 0 10px rgba(141, 130, 255, 0.8)' },
        },
      },
      animation: {
        'gradient-bg': 'gradientShift 15s ease infinite alternate',
        'fade-in-pop': 'fadeInPop 0.6s ease-out forwards',
        'input-glow': 'inputGlow 2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}