/**
 * KidsGameHub — build e PWA
 * ElCamargo Soluções em TI LTDA
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // O site vive em https://elcamargo.github.io/KidsGameHub/ — sem esta base
  // os arquivos são buscados na raiz do domínio e a página abre em branco.
  base: "/KidsGameHub/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-180.png", "icon-192.png", "icon-512.png", "privacidade.html", "termos.html"],
      manifest: {
        name: "Lumus — Kids Game Hub",
        short_name: "Lumus",
        description: "Jogos educativos para crianças, sem anúncios.",
        lang: "pt-BR",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "portrait",
        background_color: "#1B2A6B",
        theme_color: "#3C4FC4",
        categories: ["education", "games", "kids"],
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Tudo entra no cache na instalação: depois da primeira abertura,
        // o jogo funciona sem internet nenhuma.
        globPatterns: ["**/*.{js,css,html,png,svg,woff,woff2}"],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: "index.html",
        // Nenhum runtimeCaching: o app não conversa com servidor externo.
      },
    }),
  ],
});
