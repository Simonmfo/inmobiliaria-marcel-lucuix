/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "Inter", "sans-serif"],
      },
      colors: {
        brand: {
          50: '#f2fbf6',
          100: '#e1f6eb',
          200: '#c5eed9',
          300: '#98dec0',
          400: '#62c6a2',
          500: '#34ab84',
          600: '#006341', // Inmobiliaria Marcel Lucuix Forest Green
          700: '#005236',
          800: '#00422c',
          900: '#003322',
        },
        gold: {
          50: '#fdfbf7',
          100: '#f9f3e6',
          200: '#f1e2c6',
          300: '#e5cba0',
          400: '#d7af72',
          500: '#c6954b', // Marcel Lucuix Gold
          600: '#b07d39',
          700: '#8f612d',
          800: '#754e28',
          900: '#614023',
        },
        "secondary-container": "#dc2626",
        "on-secondary-container": "#ffffff",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-container": "var(--color-surface-container)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-container-low": "var(--color-surface-container-low)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "outline-variant": "var(--color-outline-variant)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        secondary: "var(--color-secondary)",
      }
    },
  },
  plugins: [],
}
