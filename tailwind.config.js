/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          50:  "#f0faf5",
          100: "#e0f5ea",
          200: "#c8e3d5",
          300: "#a8d4be",
          400: "#7abba0",
          500: "#61c39a",
          600: "#3ca779",
          700: "#2e8f65",
          800: "#264f41",
          900: "#1a3828",
        },
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 900ms ease-out both",
        "reveal-up": "revealUp 1000ms ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        revealUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
