/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#060a12',
          900: '#0B111E',
          850: '#0f172a',
          800: '#151f32',
          700: '#1e293b',
          600: '#2b3b52',
        },
        accent: {
          cyan: '#38bdf8',
          emerald: '#10b981',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
