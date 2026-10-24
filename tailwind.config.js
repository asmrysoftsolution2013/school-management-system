/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff8fb",
          100: "#d4edf3",
          200: "#a9d9e5",
          300: "#7dc3d4",
          400: "#52adc1",
          500: "#3792a7",
          600: "#2a7585",
          700: "#235d6a",
          800: "#1d4852",
          900: "#17373f",
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
