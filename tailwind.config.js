
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        crimson:  ['"Crimson Pro"', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#1e1a14',
          800: '#2e2418',
          700: '#3d3120',
          600: '#564430',
        },
        parchment: {
          50:  '#fdfaf4',
          100: '#faf3e4',
          200: '#f2e4c4',
        },
      },
      boxShadow: {
        book:       '0 2px 8px -1px rgba(30,26,20,0.12), 0 1px 4px -1px rgba(30,26,20,0.08)',
        'book-hover': '0 16px 32px -6px rgba(30,26,20,0.22), 0 6px 12px -3px rgba(30,26,20,0.12)',
      },
    },
  },
  plugins: [],
}
