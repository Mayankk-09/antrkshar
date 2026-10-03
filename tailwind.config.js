/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0a0a0a',
        offwhite: '#f2f2f0',
        grey: {
          400: '#a3a3a3',
          600: '#525252',
          800: '#262626',
          900: '#171717'
        }
      },
      fontFamily: {
        display: ['"Anton"', 'sans-serif'],
        accent: ['"Syne"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-.04em',
        tight: '-.02em',
        widest: '.25em',
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
      }
    },
  },
  plugins: [],
}
