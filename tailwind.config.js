/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f6ff',
          100: '#e4edff',
          200: '#c7d9ff',
          300: '#9ab8ff',
          400: '#6b90ff',
          500: '#4a6cff',
          600: '#344ef5',
          700: '#2b3ed8',
          800: '#2637ad',
          900: '#243589'
        }
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(0,0,0,0.25)'
      },
      backgroundImage: {
        'mesh': 'radial-gradient(1200px 600px at 10% 0%, rgba(74,108,255,0.25), transparent), radial-gradient(1000px 500px at 90% 0%, rgba(234,76,137,0.2), transparent), radial-gradient(800px 400px at 50% 100%, rgba(16,185,129,0.15), transparent)'
      }
    }
  },
  plugins: []
};

