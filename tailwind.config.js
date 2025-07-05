/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Define custom colors for dark mode
        dark: {
          bg: {
            primary: '#121212',
            secondary: '#1e1e1e',
            tertiary: '#2d2d2d',
          },
          text: {
            primary: '#ffffff',
            secondary: '#e0e0e0',
            tertiary: '#a0a0a0',
          }
        }
      }
    },
  },
  plugins: [],
}
