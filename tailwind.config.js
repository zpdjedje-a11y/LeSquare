/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: "#1A1A1A",
        ambre: "#F59E0B",
        or: "#D97706",
        creme: "#FFF8F0",
        gris: "#2A2A2A",
        "gris-clair": "#3A3A3A",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}