/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        teal: "#4ECDC4",
        dark: "#0F1117",
        card: "#1C1F26",
        muted: "#8B8FA8",
      },
    },
  },
  plugins: [],
};
