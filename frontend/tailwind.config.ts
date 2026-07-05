import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        inter:   ["var(--font-inter)",   "sans-serif"],
      },
      colors: {
        primary:   "#4F46E5",
        secondary: "#14B8A6",
      },
    },
  },
  plugins: [],
};

export default config;
