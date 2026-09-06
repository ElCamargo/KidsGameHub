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
import { T } from "../src/data/textos.js";
import { BAND_COLOR, BAND_PRECO, CUSTO_FAIXA, DIFFS, FAIXA_TEMPO, MEM_LEVELS, MEM_PRECO, PERGUNTAS_RODADA } from "../src/lib/catalogo.js";
import { FAIXA_POOL, PERGUNTAS_BICHO, VOCAB_NIVEL } from "../src/lib/rodadas.js";

/* Lê um objeto literal de um arquivo pelo começo da declaração, contando
   chaves. Sobrou para o BIBLIA_NIVEL, que não é exportado. */
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
  const bibliaJs = fs.readFileSync("src/data/biblia.js", "utf8");

  const faixas = DIFFS;
  if (faixas.length < 4) aviso(`DIFFS tem só ${faixas.length} faixas — algo se perdeu`);

  const mapas = {
    CURIOSIDADE_NIVEL,
    CIENCIA_NIVEL,
    BIBLIA_NIVEL: bloco(bibliaJs, "const BIBLIA_NIVEL = {"),
    PERGUNTAS_BICHO,
    VOCAB_NIVEL,
    PERGUNTAS_RODADA,
    CUSTO_FAIXA,
    BAND_PRECO,
    BAND_COLOR,
    MEM_LEVELS,
    MEM_PRECO,
    /* Faltar aqui não deixa a rodada vazia: deixa a faixa nova sorteando do
       mesmo pool do Gênio, sem ninguém perceber que ela não ficou mais difícil. */
    FAIXA_POOL,
  };

  for (const [nome, mapa] of Object.entries(mapas)) {
    if (mapa == null) { aviso(`não achei ${nome} para conferir`); continue; }
    const faltam = faixas.filter(f => !chavesDe(mapa).includes(f));
    if (faltam.length) aviso(`${nome}: sem a faixa ${faltam.join(", ")} — a rodada nasceria vazia`);
  }

  /* O Fácil não tem cronômetro de propósito: é a única ausência legítima. */
  const faltamTempo = faixas.filter(f => f !== "easy" && !chavesDe(FAIXA_TEMPO).includes(f));
  if (faltamTempo.length) aviso(`FAIXA_TEMPO: sem a faixa ${faltamTempo.join(", ")}`);

  /* Cada faixa tem que existir no dicionário dos seis idiomas. */
  for (const [code, textos] of Object.entries(T)) {
    const faltam = faixas.filter(f => !chavesDe(textos.levels).includes(f));
    if (faltam.length) aviso(`t.levels: ${code} está sem ${faltam.join(", ")}`);
  }

  return faixas;
}
