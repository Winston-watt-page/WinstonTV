import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08090B",
          900: "#0B0D10",
          800: "#111318",
          700: "#181B22",
          600: "#20242D",
          500: "#2B3038",
        },
        marigold: {
          400: "#F2B857",
          500: "#E8A33D",
          600: "#C97F1F",
        },
        teal: {
          400: "#2F7A72",
          500: "#1F5F58",
          600: "#164742",
        },
        mist: {
          100: "#F4F1EA",
          300: "#C9CCD3",
          500: "#8B8F98",
          700: "#585C64",
        },
        signal: {
          live: "#E85D4B",
        },
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        tamil: ["'Noto Sans Tamil'", "Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        focus: "0 0 0 2px #0B0D10, 0 0 0 4px #E8A33D",
      },
      keyframes: {
        pulseLive: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        pulseLive: "pulseLive 1.6s ease-in-out infinite",
        fadeIn: "fadeIn 0.25s ease-out",
        shimmer: "shimmer 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
