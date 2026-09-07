/**
 * KidsGameHub — build e PWA
 * ElCamargo Soluções em TI LTDA
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        /* Três pedaços em vez de um só: o React quase nunca muda, os bancos de
           perguntas mudam sozinhos, e a interface muda toda semana. Separados,
           quem já tem o app baixa só o que mudou de verdade. */
        manualChunks: {
          react: ["react", "react-dom"],
          dados: [
            "./src/data/biblia.js", "./src/data/biblia-livros.js", "./src/data/biblia-pessoas.js",
            "./src/data/biblia-lugares.js", "./src/data/biblia-fatos.js", "./src/data/curiosidades.js",
            "./src/data/ciencias.js", "./src/data/versos.js", "./src/data/devocional.js",
            "./src/data/caderno.js", "./src/data/textos.js", "./src/data/geografia.js",
            "./src/data/desenhos.js",
          ],
        },
      },
    },
  },
  // O site ainda vive em https://elcamargo.github.io/KidsGameHub/ — sem esta
  // base os arquivos são buscados na raiz do domínio e a página abre em branco.
  //
  // A MUDANÇA PARA clarim.elcamargo.com.br ESTÁ PRONTA E SEGURA NO GIT (commit
  // "O Clarim ganha domínio próprio"), mas não pode sair ainda: o navegador
  // guarda o progresso por ORIGEM, não por aplicativo. No endereço novo o app
  // abriria vazio, e o que cada criança conquistou ficaria preso no endereço
  // antigo para sempre.
  //
  // A ordem é: cada aparelho salva a cópia pela tela de perfis → aí este base
  // vira "/" e o public/CNAME volta → aí cada um restaura a cópia.
  base: "/KidsGameHub/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-180.png", "icon-192.png", "icon-512.png", "privacidade.html", "termos.html"],
      manifest: {
        name: "Clarim — Kids Game Hub",
        short_name: "Clarim",
        description: "Jogos educativos para crianças, sem anúncios.",
        lang: "pt-BR",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "portrait",
        background_color: "#1B2A6B",
        theme_color: "#3C4FC4",
        categories: ["education", "games", "kids"],
        /* `any` e `maskable` são desenhos diferentes, não tamanhos diferentes.
           O Android recorta o maskable num círculo ou num squircle e só garante
           os 80% centrais: o ícone quadrado usado nos dois lugares perdia as
           pontas dos raios, as beiradas do livro, e mostrava canto transparente
           onde o quadrado tem borda arredondada. O maskable tem fundo sangrando
           até a borda e o desenho reduzido para caber no círculo. */
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
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
