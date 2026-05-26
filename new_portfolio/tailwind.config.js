/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0C0C0F',
        surface: '#13131A',
        surfaceAlt: '#1A1A26',
        accent: '#39FF14',
        accentDim: '#22CC00',
        accentGlow: 'rgba(57,255,20,0.15)',
        purple: '#7B2FBE',
        purpleGlow: 'rgba(123,47,190,0.2)',
        muted: '#3A3A4A',
        textPrimary: '#E8E8F0',
        textMuted: '#6B6B80',
        darkBackground: '#0C0C0F',
      },
      fontFamily: {
        karla: ['Inter', 'sans-serif'],
        pacifico: ['Pacifico', 'cursive'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'hex-spin': 'hexSpin 20s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px #39FF14, 0 0 20px rgba(57,255,20,0.3)' },
          '50%': { boxShadow: '0 0 20px #39FF14, 0 0 60px rgba(57,255,20,0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        hexSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
