/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        corporateBlue: {
          light: '#1e3a8a',
          DEFAULT: '#0B192C',
          dark: '#050c17',
        },
        corporateGold: {
          light: '#fde68a',
          DEFAULT: '#D4AF37',
          dark: '#b4942e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
