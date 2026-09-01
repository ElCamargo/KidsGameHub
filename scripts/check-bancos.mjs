/**
 * KidsGameHub — conferência dos bancos de perguntas
 * ElCamargo Soluções em TI LTDA
 *
 * Roda antes de todo build. Conta o que os geradores realmente produzem e
 * quebra se ficar abaixo do mínimo — assim o número prometido no README não
 * depende de ninguém acreditar em mim, e um banco que encolher por acidente
 * derruba o build em vez de sair silencioso para as crianças.
 *
 * Também procura o erro que mais estraga um quiz: pergunta com duas respostas
 * certas, e alternativa errada igual à certa.
 */
import { todasPerguntasBiblia } from "../src/data/biblia.js";
import { CURIOSIDADES, CURIOSIDADE_NIVEL, AGUAS } from "../src/data/curiosidades.js";
import { perguntasCiencia, ANIMAIS } from "../src/data/ciencias.js";
import { LIVROS } from "../src/data/biblia-livros.js";
import { PERSONAGENS, PARENTESCO, MAES } from "../src/data/biblia-pessoas.js";
import { LUGARES, MILAGRES, PARABOLAS } from "../src/data/biblia-lugares.js";
import { VERSICULOS, CITACOES, NUMEROS, FATOS } from "../src/data/biblia-fatos.js";
import { conferirFaixas } from "./check-faixas.mjs";

const MIN_BIBLIA = 2000;
const MIN_CURIOSIDADES = 200;
const MIN_CIENCIAS = 200;

const erros = [];
const aviso = m => erros.push(m);

/* ---------- Bíblia ---------- */
const livrosPt = new Set(LIVROS.map(l => l.pt));
for (const p of PERSONAGENS) if (!livrosPt.has(p.livro)) aviso(`personagem ${p.nome.pt}: livro inexistente "${p.livro}"`);
for (const g of LUGARES) if (!livrosPt.has(g.livro)) aviso(`lugar ${g.lugar.pt}: livro inexistente "${g.livro}"`);
for (const v of VERSICULOS) if (!livrosPt.has(v.livro)) aviso(`versículo: livro inexistente "${v.livro}"`);
for (const m of MILAGRES) if (!livrosPt.has(m.evangelho)) aviso(`milagre: evangelho inexistente "${m.evangelho}"`);
for (const b of PARABOLAS) if (!livrosPt.has(b.evangelho)) aviso(`parábola: evangelho inexistente "${b.evangelho}"`);
const nomesPt = new Set(PERSONAGENS.map(p => p.nome.pt));
for (const c of CITACOES) if (!nomesPt.has(c.quem)) aviso(`citação sem personagem: "${c.quem}"`);
if (LIVROS.length !== 66) aviso(`a Bíblia tem 66 livros, a tabela tem ${LIVROS.length}`);

const contagem = {};
for (const lang of ["pt", "en", "es"]) {
  const banco = todasPerguntasBiblia(lang);
  contagem[lang] = banco.length;
  const porNivel = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const x of banco) {
    porNivel[x.n]++;
    const [pergunta, certa, erradas] = x.q;
    if (!pergunta || !certa) aviso(`[${lang}] pergunta ou resposta vazia`);
    if (erradas.length !== 3) aviso(`[${lang}] "${pergunta}" tem ${erradas.length} alternativas erradas`);
    if (erradas.includes(certa)) aviso(`[${lang}] "${pergunta}": a resposta certa aparece entre as erradas`);
    if (new Set(erradas).size !== erradas.length) aviso(`[${lang}] "${pergunta}": alternativas erradas repetidas`);
  }
  // Duas perguntas com o mesmo texto e respostas diferentes = resposta ambígua
  const porTexto = new Map();
  for (const x of banco) {
    const lista = porTexto.get(x.q[0]) || [];
    lista.push(x.q[1]);
    porTexto.set(x.q[0], lista);
  }
  for (const [texto, respostas] of porTexto)
    if (new Set(respostas).size > 1) aviso(`[${lang}] pergunta ambígua: "${texto}" tem ${new Set(respostas).size} respostas certas`);

  for (const n of [1, 2, 3, 4])
    if (porNivel[n] < 40) aviso(`[${lang}] só ${porNivel[n]} perguntas de nível ${n} — pouco para variar as fases`);
  if (banco.length < MIN_BIBLIA) aviso(`[${lang}] banco bíblico com ${banco.length} perguntas, mínimo ${MIN_BIBLIA}`);
}

/* ---------- Curiosidades ---------- */
const tiposValidos = new Set(["pais", "cidade", "agua", "continente"]);
const conts = new Set(["sa", "na", "eu", "af", "as", "oc"]);
for (const c of CURIOSIDADES) {
  if (!tiposValidos.has(c.t)) aviso(`curiosidade "${c.nome.pt}": tipo desconhecido "${c.t}"`);
  if (c.t === "agua" && !AGUAS[c.r]) aviso(`curiosidade "${c.nome.pt}": água desconhecida "${c.r}"`);
  if (c.t === "continente" && !conts.has(c.r)) aviso(`curiosidade "${c.nome.pt}": continente desconhecido "${c.r}"`);
  if (c.t === "pais" && !/^[A-Z]{2}$/.test(c.r)) aviso(`curiosidade "${c.nome.pt}": código de país estranho "${c.r}"`);
  for (const l of ["pt", "en", "es"]) if (!c.nome[l]) aviso(`curiosidade "${c.nome.pt}": falta o nome em ${l}`);
}
const nomesCur = CURIOSIDADES.map(c => c.nome.pt);
for (const n of nomesCur) if (nomesCur.filter(x => x === n).length > 1) aviso(`curiosidade repetida: "${n}"`);
for (const [band, niveis] of Object.entries(CURIOSIDADE_NIVEL)) {
  const n = CURIOSIDADES.filter(c => niveis.includes(c.n)).length;
  if (n < 12) aviso(`curiosidades: só ${n} na faixa ${band}`);
}
if (CURIOSIDADES.length < MIN_CURIOSIDADES)
  aviso(`curiosidades: ${CURIOSIDADES.length}, mínimo ${MIN_CURIOSIDADES}`);

/* ---------- faixas de dificuldade ---------- */
const faixas = conferirFaixas(aviso);

/* ---------- Ciências ---------- */
const ciencia = perguntasCiencia();
for (const a of ANIMAIS) if (a.onde && !conts.has(a.onde)) aviso(`animal ${a.e}: continente desconhecido "${a.onde}"`);
if (ciencia.length < MIN_CIENCIAS) aviso(`ciências: ${ciencia.length} perguntas, mínimo ${MIN_CIENCIAS}`);

/* ---------- relatório ---------- */
console.log("");
console.log(`📖 Bíblia        pt ${contagem.pt} · en ${contagem.en} · es ${contagem.es} perguntas`);
console.log(`   fontes: ${LIVROS.length} livros · ${PERSONAGENS.length} pessoas · ${LUGARES.length} lugares · ${MILAGRES.length} milagres · ${PARABOLAS.length} parábolas`);
console.log(`           ${VERSICULOS.length} versículos · ${CITACOES.length} falas · ${NUMEROS.length} números · ${FATOS.length} fatos · ${PARENTESCO.length + MAES.length} parentescos`);
console.log(`🗺️  Curiosidades  ${CURIOSIDADES.length} lugares do mundo`);
console.log(`🔬 Ciências      ${ciencia.length} perguntas de ${ANIMAIS.length} animais`);
console.log(`🎚️  Faixas        ${faixas.join(" · ")}`);

if (erros.length) {
  console.error(`\n✗ ${erros.length} problema(s):`);
  for (const e of erros.slice(0, 40)) console.error("   " + e);
  if (erros.length > 40) console.error(`   ... e mais ${erros.length - 40}`);
  console.error("");
  process.exit(1);
}
console.log("\n✓ bancos conferidos\n");
