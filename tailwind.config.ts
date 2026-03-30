import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          50: "#f7f5f0",
          100: "#ebe7dc",
          200: "#d9d0bc",
          300: "#c4b699",
          400: "#b09d7a",
          500: "#9d8a67",
          600: "#8a7758",
          700: "#6e6047",
          800: "#5a4e3c",
          900: "#4a4132",
        },
        leaf: {
          50: "#f0f7f2",
          100: "#dceee2",
          200: "#b8ddc5",
          300: "#8bc5a1",
          400: "#5da87a",
          500: "#3d8b5c",
          600: "#2d6f47",
          700: "#25573a",
          800: "#204631",
          900: "#1b3b2a",
          950: "#0f2418",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        hero: [
          "var(--font-hero)",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
