/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cookpad-orange': '#FF6B35',
        'cookpad-yellow': '#FFD23F',
      },
    },
  },
  plugins: [],
};
