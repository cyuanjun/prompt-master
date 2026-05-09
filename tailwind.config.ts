import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#242018",
        paper: "#f6eddc",
        sketchPurple: "#8062cf",
        sketchAmber: "#e6a84f",
        sticky: "#fff0a6",
        tape: "#f4d789",
        muted: "#756d60",
      },
      fontFamily: {
        logo: ["var(--font-caveat)", "cursive"],
        hand: ["var(--font-kalam)", "cursive"],
        label: ["var(--font-patrick)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
