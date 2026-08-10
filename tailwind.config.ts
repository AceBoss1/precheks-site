import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14110F",       // masthead / primary headline black (warm, not pure black)
        paper: "#F6F3EC",     // page background, warm paper
        gold: "#C9992E",      // brand signature accent, drawn from the Precheks mark
        "gold-deep": "#8B6914",
        bronze: "#5B4A22",
        slate: "#55534C",     // secondary text
        rule: "#DEDACD",      // hairline dividers
        card: "#FFFFFF",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        grid: ["'Barlow Condensed'", "sans-serif"],
        ui: ["Archivo", "sans-serif"],
        body: ["'Source Serif 4'", "serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      letterSpacing: {
        wideish: "0.04em",
        eyebrow: "0.14em",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
