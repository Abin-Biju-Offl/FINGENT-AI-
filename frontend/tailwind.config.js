/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8e8e8',
          100: '#d1d1d1',
          200: '#a3a3a3',
          300: '#757575',
          400: '#474747',
          500: '#111111',
          600: '#0d0d0d',
          700: '#0a0a0a',
          800: '#070707',
          900: '#030303',
        },
        secondary: {
          50: '#e6f2f0',
          100: '#cce5e1',
          200: '#99cbc3',
          300: '#66b1a5',
          400: '#339787',
          500: '#004D40',
          600: '#003d33',
          700: '#002e26',
          800: '#001f1a',
          900: '#000f0d',
        },
        accent: {
          DEFAULT: '#D4AF37',
          dark: '#b8941f',
          light: '#e6c968',
        },
        success: '#16a34a',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      backgroundColor: {
        'light': '#FAF7F0',
        'cream': '#FAF7F0',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #111111 0%, #004D40 100%)',
        'gradient-gold': 'linear-gradient(90deg, #B8860B 0%, #D4AF37 50%, #B8860B 100%)',
        'gradient-success': 'linear-gradient(135deg, #004D40 0%, #D4AF37 100%)',
        'gradient-accent': 'linear-gradient(135deg, #D4AF37 0%, #b8941f 100%)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
