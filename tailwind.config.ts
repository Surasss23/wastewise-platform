import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#202923",
        muted: "#737D76",
        line: "#E7EBE7",
        canvas: "#F7F8F6",
        moss: "#55745D",
        "moss-soft": "#EAF0EA"
      },
      boxShadow: {
        soft: "0 12px 40px rgba(28, 42, 32, 0.06)"
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
