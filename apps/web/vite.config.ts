import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "apple-touch-icon-180.png"],
      manifest: {
        name: "LearnLoop — 24주 합격 트레이너",
        short_name: "LearnLoop",
        description:
          "출퇴근 지하철에서 푸는 아침/저녁 학습 퀴즈 + 24주 합격 트레이너.",
        lang: "ko",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#0066cc",
        background_color: "#ffffff",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "icon.svg", sizes: "any", type: "image/svg+xml" },
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icon-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@learnloop/core": path.resolve(__dirname, "../../packages/core/src"),
    },
  },
});
