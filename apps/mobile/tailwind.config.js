/** @type {import('tailwindcss').Config} */
// 웹(src/index.css @theme)과 동일한 디자인 토큰을 NativeWind로 포팅.
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        action: "#0066cc",
        "action-focus": "#0071e3",
        canvas: "#ffffff",
        parchment: "#f5f5f7",
        pearl: "#fafafc",
        ink: "#1d1d1f",
        "ink-80": "#333333",
        "ink-48": "#7a7a7a",
        "body-muted": "#cccccc",
        hairline: "#e0e0e0",
        divider: "#f0f0f0",
      },
      borderRadius: {
        xs: "5px",
        sm: "8px",
        md: "11px",
        lg: "18px",
      },
    },
  },
  plugins: [],
};
