/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#2563eb',
          purple: '#7c3aed',
        },
        bg: {
          light: '#f8fafc',
          dark: '#0f172a',
        },
        card: {
          light: '#ffffff',
          dark: '#1e293b',
        },
        text: {
          light: '#1e293b',
          dark: '#f1f5f9',
        },
        border: {
          light: '#e2e8f0',
          dark: '#334155',
        },
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        'secondary-gradient': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': {
            transform: 'translateY(0) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-20px) rotate(10deg)',
          },
        },
      },
    },
  },
  plugins: [],
}
