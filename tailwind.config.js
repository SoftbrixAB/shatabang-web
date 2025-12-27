/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        danger: '#FAA'
      },
      spacing: {
        'calendar-block': '180px'
      },
      zIndex: {
        'media-icon': '5',
        'overlay': '1000'
      }
    },
  },
  plugins: [],
}
