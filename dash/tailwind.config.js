/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          "mog-green": "#5D6657",
          "mog-marron": {
            100: "#F2EFE9",
            200: "#F1E5D2",
            300: "#B29E7F",
          }
        }
      },
    },
    plugins: [],
  }
  