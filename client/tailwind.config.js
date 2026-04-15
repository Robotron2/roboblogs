/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0618BF',
          50: '#e8eaff',
          100: '#c5c9ff',
          200: '#8e94ff',
          300: '#5760e6',
          400: '#2e3ad9',
          500: '#0618BF',
          600: '#0514a6',
          700: '#040f80',
          800: '#030b5c',
          900: '#020738',
        },
        accent: {
          DEFAULT: '#1A78E6',
          light: '#4d9bef',
          dark: '#1260c0',
        },
        body: '#6B6F80',
        surface: {
          light: '#FFFFFF',
          dark: '#1A1B1E',
        },
        background: {
          light: '#F8F9FA',
          dark: '#111214',
        },
        outline: '#C1C1BE',
        success: '#0AAF55',
        warning: '#F1B033',
        error: '#BA3A1A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
