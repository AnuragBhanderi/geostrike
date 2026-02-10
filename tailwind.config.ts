import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#07070d",
          2: "#0d0d16",
          3: "#13131f",
          4: "#1a1a2a",
        },
        accent: {
          red: "#ff2d55",
          amber: "#ffae00",
          cyan: "#00e5ff",
          purple: "#7b61ff",
        },
        txt: {
          DEFAULT: "#e4e4f0",
          mid: "#8888a0",
          dim: "#555568",
        },
        bdr: {
          DEFAULT: "rgba(255,255,255,0.06)",
          light: "rgba(255,255,255,0.1)",
        },
      },
      fontFamily: {
        display: ["Chakra Petch", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        body: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
