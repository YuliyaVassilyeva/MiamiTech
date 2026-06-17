import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Miami sunset palette
        sand: "#fdf6ec",
        coral: "#ff5e7e",
        sunset: "#ff8c42",
        ocean: "#00b4d8",
        deep: "#0a2540",
        palm: "#06d6a0",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "miami-gradient":
          "linear-gradient(135deg, #ff5e7e 0%, #ff8c42 40%, #00b4d8 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
