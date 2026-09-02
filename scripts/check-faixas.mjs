/**
 * KidsGameHub — conferência das faixas de dificuldade
 * ElCamargo Soluções em TI LTDA
 *
 * Todo montador de rodada escolhe o pool de perguntas PELA FAIXA:
 * `CURIOSIDADE_NIVEL[band]`, `PERGUNTAS_BICHO[band]`, e assim por diante.
 * Uma faixa que falte num desses mapas devolve `undefined`, a rodada nasce
 * vazia e nada aparece na tela — sem erro, sem aviso, sem nada.
 *
 * Foi exatamente o que quase escapou quando Mestre e Lenda entraram. Aqui a
 * omissão vira build quebrado, que é onde ela deve doer.
 */
import fs from "node:fs";
import { CURIOSIDADE_NIVEL } from "../src/data/curiosidades.js";
import { CIENCIA_NIVEL } from "../src/data/ciencias.js";

/* Lê um objeto literal do App.jsx pelo começo da declaração, contando chaves. */
function bloco(txt, inicio) {
  const i = txt.indexOf(inicio);
  if (i < 0) return null;
  const abre = txt.indexOf("{", i);
  let nivel = 0;
  for (let k = abre; k < txt.length; k++) {
    if (txt[k] === "{") nivel++;
    else if (txt[k] === "}" && --nivel === 0) return txt.slice(abre, k + 1);
  }
  return null;
}

const chavesDe = obj => {
  if (obj && typeof obj === "object") return Object.keys(obj);
  const achadas = String(obj).match(/(\w+)\s*:/g) || [];
  return achadas.map(x => x.replace(/\s*:$/, ""));
};

export function conferirFaixas(aviso) {
  const app = fs.readFileSync("src/App.jsx", "utf8");
  const bibliaJs = fs.readFileSync("src/data/biblia.js", "utf8");

  const lista = app.match(/const DIFFS = \[([^\]]*)\]/);
  if (!lista) { aviso("não consegui ler DIFFS de src/App.jsx"); return []; }
  const faixas = lista[1].split(",").map(x => x.trim().replace(/"/g, "")).filter(Boolean);
  if (faixas.length < 4) aviso(`DIFFS tem só ${faixas.length} faixas — algo se perdeu`);

  const mapas = {
    CURIOSIDADE_NIVEL,
    CIENCIA_NIVEL,
    BIBLIA_NIVEL: bloco(bibliaJs, "const BIBLIA_NIVEL = {"),
    PERGUNTAS_BICHO: bloco(app, "const PERGUNTAS_BICHO = {"),
    VOCAB_NIVEL: bloco(app, "const VOCAB_NIVEL = {"),
    PERGUNTAS_RODADA: bloco(app, "const PERGUNTAS_RODADA = {"),
    CUSTO_FAIXA: bloco(app, "const CUSTO_FAIXA = {"),
    BAND_PRECO: bloco(app, "const BAND_PRECO = {"),
    BAND_COLOR: bloco(app, "const BAND_COLOR = {"),
    MEM_LEVELS: bloco(app, "const MEM_LEVELS = {"),
    MEM_PRECO: bloco(app, "const MEM_PRECO  = {"),
    /* Faltar aqui não deixa a rodada vazia: deixa a faixa nova sorteando do
       mesmo pool do Gênio, sem ninguém perceber que ela não ficou mais difícil. */
    FAIXA_POOL: bloco(app, "const FAIXA_POOL = {"),
  };

  for (const [nome, mapa] of Object.entries(mapas)) {
    if (mapa == null) { aviso(`não achei ${nome} para conferir`); continue; }
    const faltam = faixas.filter(f => !chavesDe(mapa).includes(f));
    if (faltam.length) aviso(`${nome}: sem a faixa ${faltam.join(", ")} — a rodada nasceria vazia`);
  }

  /* O Fácil não tem cronômetro de propósito: é a única ausência legítima. */
  const tempo = bloco(app, "const FAIXA_TEMPO = {");
  if (tempo) {
    const faltam = faixas.filter(f => f !== "easy" && !chavesDe(tempo).includes(f));
    if (faltam.length) aviso(`FAIXA_TEMPO: sem a faixa ${faltam.join(", ")}`);
  } else aviso("não achei FAIXA_TEMPO");

  /* Cada faixa tem que existir no dicionário dos seis idiomas. */
  for (const m of app.matchAll(/levels: \{([^}]*)\}/g)) {
    const faltam = faixas.filter(f => !chavesDe(m[1]).includes(f));
    if (faltam.length) aviso(`t.levels: um idioma está sem ${faltam.join(", ")}`);
  }

  return faixas;
}
