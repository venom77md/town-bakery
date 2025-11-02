/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8E7',
        'light-yellow': '#FEF9E7',
        brown: '#8B4513',
        'light-brown': '#A0522D',
        'warm-brown': '#CD853F',
        primary: '#C48A47', // Town Bakery primary color
      },
      fontFamily: {
        arabic: ['Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

