/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background-color)',
        accent: 'var(--accent-color)',
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        text: 'var(--text-color)',
      }
    },
  },
  plugins: [],
}

