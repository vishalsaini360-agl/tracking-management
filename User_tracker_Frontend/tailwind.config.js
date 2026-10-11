/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  // ...
  theme: {
    extend: {
      colors: {
        bgclr: "#f5f8fa",
        sidenavbg: "#242627",
        sidenavcolor: "#BFBFBF",
        neonBlue: "#0081F7",
        amsPrimary:"#ef880f",
        flipkartPrimary:"#0081f7",
        instamartPrimary:"#9c4674",
        zeptoPrimary:"#3c006b",
        blinkitPrimary:"#13a976",
      },
      screens: {
        'xs': '320px',   // Extra small screens
        'sm': '580px',   // Small screens
        'md': '768px',   // Medium screens
        'lg': '992px',  // Large screens
        'xl': '1200px',  // Extra-large screens
        '2xl': '1381px', // 2X large screens

        //add for cards width in ds3
         's1280': '1280px',
  's1512': '1512px',
  's1728': '1728px',
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [],
};
