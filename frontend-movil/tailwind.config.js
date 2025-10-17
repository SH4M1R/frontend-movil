/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",   
    "./app/views/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
   
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito_400Regular", "Nunito_700Bold"],
      },
    },
  },
  plugins: [],
};