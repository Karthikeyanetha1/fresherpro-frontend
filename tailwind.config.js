/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0A0E27',
          card: '#131835',
          border: '#1E2440',
        },
        accent: {
          primary: '#6366F1',
          secondary: '#8B5CF6',
        }
      },
    },
  },
  plugins: [],
}
