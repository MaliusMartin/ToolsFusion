/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:
      {
        'primary': '#F4F4F4',
        'secondary': '#004849'
        
      },

      fontFamily: {
        pblack: ["Poppins-Black", "sans-serif"],
        pbital: ["Poppins-BlackItalic", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pboldital: ["Poppins-BoldItalic", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pxtraboldital: ["Poppins-ExtraBoldItalic", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        pextralightitalic: ["Poppins-ExtraLightItalic", "sans-serif"],
        pitalic: ["Poppins-Italic", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        plightitalic: ["Poppins-LightItalic", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        pmediumitalic: ["Poppins-MediumItalic", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        psemiboldital: ["Poppins-SemiBoldItalic", "sans-serif"],
        pthin: ["Poppins-Thin", "sans-serif"],
        pthinitalic: ["Poppins-ThinItalic", "sans-serif"],
      },
    },
  },
  plugins: [],
}

