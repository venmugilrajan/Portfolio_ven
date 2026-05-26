/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background:   '#F8F6F1',
        surface:      '#EDEAE3',
        surfaceAlt:   '#E3E0D8',
        accent:       '#5B4FE8',
        accentLight:  '#EEF0FF',
        accentHover:  '#4338CA',
        purple:       '#9B59B6',
        muted:        '#C8C4BB',
        textPrimary:  '#1C1917',
        textMuted:    '#78716C',
        darkBackground: '#1C1917',
      },
      fontFamily: {
        karla:   ['Inter', 'sans-serif'],
        pacifico: ['Pacifico', 'cursive'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
