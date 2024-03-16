/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        light: "#eeeeee",
        main: "#2874A6",
        dark: "#222222",
        accent: "#DE3163",
      },
    },
  },
  plugins: [],
}
