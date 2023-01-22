/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js"
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      lineClamp: ["hover"]
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
