import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0C1220",
          mid: "#131E30",
          card: "#182640",
          light: "#1E3050",
        },
        gold: {
          DEFAULT: "#C9A84C",
          dim: "rgba(201,168,76,0.12)",
        },
        burgundy: {
          DEFAULT: "#6B2D3E",
        },
        court: {
          text: "#F2EDE6",
          "text-sec": "rgba(242,237,230,0.6)",
          "text-ter": "rgba(242,237,230,0.3)",
          border: "rgba(255,255,255,0.06)",
          "border-light": "rgba(255,255,255,0.04)",
        },
        chamber: {
          grays: "#6B2D3E",
          lincolns: "#2E5090",
          inner: "#3D6B45",
          middle: "#8B6914",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        court: "14px",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "glow-breathe": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201,168,76,0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(201,168,76,0.3)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "glow-breathe": "glow-breathe 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
