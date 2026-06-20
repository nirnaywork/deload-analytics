/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        white: 'var(--color-white)',
        'grey-light': 'var(--color-grey-light)',
        blush: 'var(--color-blush)',
        taupe: 'var(--color-taupe)',
        black: 'var(--color-black)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 24px 80px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
