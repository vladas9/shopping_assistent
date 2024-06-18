/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 14s linear infinite",
        // "custom-pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        // "float": "floating 3s ease-in-out infinite",
      },
      colors: {
        primary: "#131515",
        secondary: "#2B2C28",
        third: "#339989",
        fourth: "#7DE2D1",
        fourth_gr: "#99ECDE",
        better_white: "#FFFAFB",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        eczar: ["Eczar", "serif"],
        lilitaone: ["Lilita One", "cursive"],
        poiretone: ["Poiret One", "cursive"],
        urbanist: ["Urbanist", "sans-serif"],
        geologica: ["Geologica", "sans-serif"],
      },
    },
  },
  plugins: [],
};
