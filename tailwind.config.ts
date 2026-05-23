import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        royal: "#2563EB",
        ink: "#101828",
        mist: "#F8FAFC"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16, 24, 40, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
