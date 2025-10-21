/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7a5af8',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#1f0f3f',
        },
        accent: {
          400: '#e879f9',
          500: '#d66efd',
          600: '#c026d3',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7a5af8 0%, #d66efd 50%, #1f0f3f 100%)',
        'gradient-hero': 'linear-gradient(to bottom, rgba(122, 90, 248, 0.1), rgba(31, 15, 63, 0.95))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
