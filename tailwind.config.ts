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
      fontSize: {
        "court-xs": ["10px", { lineHeight: "14px", letterSpacing: "0.02em" }],
        "court-sm": ["11px", { lineHeight: "16px" }],
        "court-base": ["13px", { lineHeight: "20px" }],
        "court-md": ["15px", { lineHeight: "22px" }],
        "court-lg": ["16px", { lineHeight: "24px" }],
        "court-xl": ["18px", { lineHeight: "26px" }],
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
      },
      maxWidth: {
        "content-narrow": "672px",
        "content-medium": "1024px",
        "content-wide": "1280px",
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
        "slide-down": {
          "0%": { transform: "translateY(-12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "glow-breathe": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201,168,76,0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(201,168,76,0.3)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "recording-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.2)" },
        },
        "connection-wave": {
          "0%": { height: "4px" },
          "50%": { height: "12px" },
          "100%": { height: "4px" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "glow-breathe": "glow-breathe 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 1.5s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "recording-pulse": "recording-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
