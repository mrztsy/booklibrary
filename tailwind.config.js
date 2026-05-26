<<<<<<< HEAD

=======
/** @type {import('tailwindcss').Config} */
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
<<<<<<< HEAD
        playfair: ['"Poppins"', 'Inter', 'system-ui', 'sans-serif'],
        crimson:  ['"Inter"',   'system-ui', 'sans-serif'],
        display:  ['"Poppins"', 'Inter', 'system-ui', 'sans-serif'],
        sans:     ['"Inter"',   'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#F6F1E8',
        primary: '#18332F',
        secondary: '#5F6F64',
        accent: '#B8892D',
        accentHover: '#7A2E2E',
        textMain: '#1C1B19',
        textSecondary: '#6F6A61',
        borderSoft: '#D8CFC0',
        ink: {
          DEFAULT: '#18332F',
          900: '#1C1B19',
          800: '#18332F',
          700: '#274A43',
          600: '#5F6F64',
        },
        parchment: {
          50:  '#F6F1E8',
          100: '#FFFDF8',
          200: '#D8CFC0',
        },
      },
      boxShadow: {
        book:         '0 2px 10px -2px rgba(28,27,25,0.14), 0 1px 4px -1px rgba(28,27,25,0.08)',
        'book-hover': '0 18px 34px -8px rgba(28,27,25,0.24), 0 8px 14px -5px rgba(28,27,25,0.14)',
      },
=======
        playfair: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        crimson: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        parchment: {
          50:  '#F8F5F0',
          100: '#F8F5F0',
          200: '#E2E8F0',
        },
        ink: {
          DEFAULT: '#0F172A',
          800: '#1E293B',
          700: '#475569',
          600: '#64748B',
        },
      },
      boxShadow: {
        'book': '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px -20px rgba(30, 41, 59, 0.35)',
        'book-hover': '0 14px 36px -24px rgba(30, 41, 59, 0.45)',
      },
      backgroundImage: {
        'paper': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      }
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
    },
  },
  plugins: [],
}
