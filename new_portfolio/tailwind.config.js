/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F5',
        darkBackground: '#0F131E',
      },
      fontFamily: {
        karla: ['Karla', 'sans-serif'],
        pacifico: ['Pacifico', 'cursive'],
        mono: ['Ubuntu Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}

