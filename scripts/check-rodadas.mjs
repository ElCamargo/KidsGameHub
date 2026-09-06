/**
 * KidsGameHub — conferência das rodadas
 * ElCamargo Soluções em TI LTDA
 *
 * Monta uma rodada de verdade de CADA trilha em CADA faixa, antes de todo
 * build, e confere que ela é jogável: pergunta com enunciado, quatro
 * alternativas distintas, a resposta certa entre elas, e — nas bandeiras —
 * uma bandeira de verdade em cada pergunta.
 *
 * Existe por um motivo concreto: as fases Lenda das bandeiras quebravam o app
 * ao chegar na 13ª pergunta, porque a rodada pedia 15 bandeiras e o continente
 * só tinha 12. O erro só aparecia jogando até o fim, no celular. Agora aparece
 * no build, em dois segundos.
 *
 * As rodadas moram em src/lib/rodadas.js e as tabelas em src/lib/catalogo.js,
 * que são JavaScript comum: dá para importar direto aqui, sem esbuild e sem
 * arquivo temporário. Antes disso tudo vivia no App.jsx, que é JSX.
 */
import { ANOS, conteudoDoAno, faixaDaBanda, faseDeEntrada } from "../src/lib/escola.js";
import { T } from "../src/data/textos.js";
import { CATALOG, DIFFS, ROUTE, bandFor, escadaDe, totalDe } from "../src/lib/catalogo.js";
import * as app from "../src/lib/rodadas.js";

/* Uma fase de cada faixa, na metade dela, onde o comportamento é o típico. */
function fasesDeCadaFaixa(cont) {
  const { plan } = escadaDe(cont);
  const vistas = new Map();
  plan.forEach((faixa, i) => { if (!vistas.has(faixa)) vistas.set(faixa, []); vistas.get(faixa).push(i + 1); });
  // primeira, do meio e última de cada faixa: pega os cantos e o corpo
  return [...vistas].flatMap(([faixa, fases]) =>
    [...new Set([fases[0], fases[Math.floor(fases.length / 2)], fases.at(-1)])].map(st => ({ faixa, stage: st })));
}

const erros = [];
const aviso = m => erros.push(m);

function conferirRodada(rotulo, r, { exigeBandeira = false } = {}) {
  if (!r || !Array.isArray(r.qs)) { aviso(`${rotulo}: não montou rodada`); return 0; }
  if (r.qs.length < 3) { aviso(`${rotulo}: rodada com só ${r.qs.length} pergunta(s)`); return r.qs.length; }
  r.qs.forEach((q, i) => {
    const onde = `${rotulo} · pergunta ${i + 1}`;
    const enunciado = q.ask || q.prompt || q.flag;
    if (!enunciado) aviso(`${onde}: sem enunciado nem bandeira`);
    if (q.answer == null || q.answer === "") aviso(`${onde}: sem resposta certa`);
    if (!Array.isArray(q.options)) { aviso(`${onde}: sem alternativas`); return; }
    if (q.options.length !== 4) aviso(`${onde}: ${q.options.length} alternativas, deviam ser 4`);
    if (q.options.some(o => o == null || o === "")) aviso(`${onde}: alternativa vazia`);
    if (new Set(q.options).size !== q.options.length) aviso(`${onde}: alternativa repetida`);
    if (!q.options.includes(q.answer)) aviso(`${onde}: a resposta certa não está entre as alternativas`);
    if (exigeBandeira && (typeof q.flag !== "string" || !q.flag)) aviso(`${onde}: sem bandeira`);
    // Raciocinar: errar sem saber por quê ensina só que errou.
    const porque = app.explicacaoDe(q);
    if (!porque || !porque.trim()) aviso(`${onde}: sem explicação para quem errar`);
    // A frase montada da própria pergunta tem que dizer a resposta; a frase
    // curada no banco pode dizer o fato de outro jeito, e aí é ela que manda.
    else if (!q.porque && !String(porque).includes(String(q.answer))) aviso(`${onde}: a explicação não diz a resposta certa`);
  });
  return r.qs.length;
}

const t = T.pt;
const resumo = [];

/* ---------- bandeiras, continente por continente ---------- */
for (const r of ROUTE) {
  const tamanhos = [];
  for (const { faixa, stage } of fasesDeCadaFaixa(r.id)) {
    const rodada = app.buildRound(r.id, stage, "pt");
    const n = conferirRodada(`bandeiras/${r.id} ${faixa} f${stage}`, rodada, { exigeBandeira: true });
    tamanhos.push(`${faixa[0]}${n}`);
  }
  resumo.push(`🚩 ${r.id.padEnd(3)} ${tamanhos.join(" ")}`);
}

/* ---------- capitais, região por região ---------- */
for (const reg of app.CAP_REGIOES) {
  for (const { faixa, stage } of fasesDeCadaFaixa(reg.id))
    conferirRodada(`capitais/${reg.id} ${faixa} f${stage}`, app.montarRodadaCapitais(stage, t, "pt", reg.id));
}

/* ---------- os demais quizzes ---------- */
const outros = [
  ["math", st => app.montarRodadaMath(st)],
  ["bichos", st => app.montarRodadaBichos(st, t)],
  ["arts", st => app.montarRodadaArte(st, t)],
  ["bible", st => app.montarRodadaBiblia(st, "pt")],
  ["curiosidades", st => app.montarRodadaCuriosidades(st, t, "pt")],
  ["ciencias", st => app.montarRodadaCiencias(st, t, "pt")],
  ["inicial", st => app.montarRodadaInicial(st, t)],
  ["rimas", st => app.montarRodadaRima(st, t)],
  ["silabas", st => app.montarRodadaSilaba(st, t)],
  ["aliteracao", st => app.montarRodadaAliteracao(st, t)],
  ["tabuada", st => app.montarRodadaTabuada(st, t)],
  ["horas", st => app.montarRodadaHoras(st, t)],
  ["dinheiro", st => app.montarRodadaDinheiro(st, t)],
];
for (const [cont, montar] of outros) {
  const tamanhos = [];
  for (const { faixa, stage } of fasesDeCadaFaixa(cont)) {
    const n = conferirRodada(`${cont} ${faixa} f${stage}`, montar(stage));
    tamanhos.push(`${faixa[0]}${n}`);
  }
  resumo.push(`🎯 ${cont.padEnd(13)} ${tamanhos.join(" ")}`);
}
for (const alvo of ["en", "es", "fr"]) {
  for (const { faixa, stage } of fasesDeCadaFaixa(`idiomas_${alvo}`))
    conferirRodada(`idiomas_${alvo} ${faixa} f${stage}`, app.montarRodadaIdioma(stage, t, alvo));
}

/* ---------- a trilha do ano escolar ----------
   Ela é a única porta que abre faixa e dispensa moeda, e aponta para trilhas
   por NOME. Um id trocado aqui manda a criança para uma tela vazia, e nada
   no app reclama — só esta conferência. */
const JOGOS = new Set(CATALOG.flatMap(c => c.games.map(g => g.id)));
for (const ano of ANOS) {
  const linha = [];
  for (const item of conteudoDoAno(ano)) {
    const onde = `escola/${ano}/${item.jogo}`;
    if (!JOGOS.has(item.jogo)) aviso(`${onde}: não existe jogo com esse id no CATALOG`);
    if (!t.games[item.jogo]) aviso(`${onde}: sem nome em t.games — o botão sairia vazio`);
    if (item.tela) { linha.push(`${item.jogo}·tela`); continue; }
    const { plan, total } = escadaDe(item.cont);
    if (!faixaDaBanda(plan, item.banda)) {
      aviso(`${onde}: a trilha "${item.cont}" não tem a faixa ${item.banda}`);
      continue;
    }
    const fase = faseDeEntrada(plan, item.banda, 0);
    if (bandFor(item.cont, fase) !== item.banda)
      aviso(`${onde}: a fase ${fase} é ${bandFor(item.cont, fase)}, não ${item.banda}`);
    if (fase < 1 || fase > total) aviso(`${onde}: fase ${fase} fora da escada de ${total}`);
    linha.push(`${item.cont}·${item.banda[0]}${fase}`);
  }
  resumo.push(`🎒 ${ano.padEnd(13)} ${linha.join(" ")}`);
}

console.log("");
for (const l of resumo) console.log("   " + l);
console.log("   (a letra é a faixa, o número são as perguntas da rodada)");

if (erros.length) {
  console.error(`\n✗ ${erros.length} problema(s) nas rodadas:`);
  for (const e of erros.slice(0, 30)) console.error("   " + e);
  if (erros.length > 30) console.error(`   ... e mais ${erros.length - 30}`);
  console.error("");
  process.exit(1);
}
console.log("\n✓ rodadas conferidas\n");
