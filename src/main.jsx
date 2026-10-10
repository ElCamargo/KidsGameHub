/**
 * KidsGameHub — ponto de entrada
 * ElCamargo Soluções em TI LTDA
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { installStorage } from "./lib/storage.js";
import App from "./App.jsx";
import "./index.css";

installStorage();

/* ----- a versao nova chega sem ninguem fazer nada -----
   O service worker ja troca sozinho (skipWaiting + clientsClaim), mas a
   pagina ABERTA continua rodando o codigo velho ate recarregar - e num app
   instalado na tela inicial "recarregar" nao existe como gesto. Dava no
   classico: o adulto abre, nao mudou nada; fecha, abre de novo, ai sim.

   Duas linhas resolvem. Pedir a conferencia na abertura faz a troca
   acontecer nos primeiros segundos, antes de a crianca comecar a jogar, em
   vez de quando o navegador resolver olhar. E recarregar assim que o
   trabalhador novo assume e o que faz a versao nova aparecer de primeira.

   `jaControlado` existe para a primeira instalacao nao recarregar a toa:
   ali o trabalhador assume uma pagina que nunca teve dono, e isso nao e
   atualizacao, e estreia. */
if ("serviceWorker" in navigator) {
  const jaControlado = !!navigator.serviceWorker.controller;
  let recarregando = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!jaControlado || recarregando) return;
    recarregando = true;
    window.location.reload();
  });
  navigator.serviceWorker.ready.then(r => r.update()).catch(() => { });
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
