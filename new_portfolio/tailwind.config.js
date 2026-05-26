/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FCFBF7',
        darkBackground: '#020202',
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

