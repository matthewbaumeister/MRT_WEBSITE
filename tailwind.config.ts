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
        // Brand colors from Make Ready Brand Guide
        primary: {
          DEFAULT: "#2F2F72", // Brand Purple
          50: "#F5F5FF",
          100: "#EBEBFF",
          200: "#D6D6FF",
          300: "#B8B8F5",
          400: "#9595D6",
          500: "#6464AA",
          600: "#2F2F72",
          700: "#252557",
          800: "#1C1C42",
          900: "#14142E",
        },
        accent: {
          DEFAULT: "#D4AF37", // Brand Gold
          50: "#FFFEF5",
          100: "#FFF9E0",
          200: "#FFF0B8",
          300: "#FFE68A",
          400: "#EDD15C",
          500: "#D4AF37",
          600: "#B8941F",
          700: "#997A15",
          800: "#7A5F0D",
          900: "#5C4708",
        },
        dark: {
          DEFAULT: "#1a1a1a",
          50: "#f7f7f7",
          100: "#e3e3e3",
          200: "#c8c8c8",
          300: "#a4a4a4",
          400: "#818181",
          500: "#666666",
          600: "#515151",
          700: "#434343",
          800: "#383838",
          900: "#1a1a1a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

