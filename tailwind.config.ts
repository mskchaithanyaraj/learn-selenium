import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        bg: {
          primary: "#0B0B0D",
          secondary: "#111114",
          card: "#17171B",
          elevated: "#1E1E24",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.15)",
          focus: "rgba(255,255,255,0.3)",
        },
        accent: {
          blue: "#3B82F6",
          cyan: "#06B6D4",
          emerald: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
          purple: "#8B5CF6",
          pink: "#EC4899",
          orange: "#F97316",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "gradient-x": "gradientX 3s ease infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scaleIn: { from: { opacity: "0", transform: "scale(0.95)" }, to: { opacity: "1", transform: "scale(1)" } },
        pulseGlow: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.6" } },
        gradientX: { "0%, 100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        glow: "0 0 20px rgba(59,130,246,0.3)",
        "glow-emerald": "0 0 20px rgba(16,185,129,0.3)",
        card: "0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.6)",
        "card-hover": "0 1px 0 rgba(255,255,255,0.08), 0 8px 40px rgba(0,0,0,0.7)",
      },
    },
  },
  plugins: [],
};

export default config;
