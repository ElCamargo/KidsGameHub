/**
 * KidsGameHub — o documento de revisão do banco bíblico
 * ElCamargo Soluções em TI LTDA
 *
 * Gera uma página única, para imprimir ou mandar por mensagem, com TODOS os
 * fatos que viram perguntas da Bíblia no app.
 *
 * POR QUE OS FATOS E NÃO AS PERGUNTAS. O banco não guarda duas mil perguntas
 * escritas à mão: guarda tabelas de fatos, e moldes que viram perguntas. Um
 * capítulo errado em Gênesis estraga quatro perguntas de uma vez, e revisar as
 * perguntas geradas seria ler quatro vezes o mesmo erro. São 770 linhas de
 * fato — um pastor lê num fim de semana; duas mil perguntas ninguém revisa.
 *
 * Cada linha tem um CÓDIGO (LIV-001, PES-014...) e o nome ao lado. O revisor
 * não precisa abrir nada de código: cita o código e diz o que está errado.
 *
 * A página não busca nada na rede, não tem script e abre offline em qualquer
 * navegador — as mesmas regras do app valem para o que sai dele.
 *
 * Rodar: npm run doc-biblia
 */
import fs from "node:fs";
import { execSync } from "node:child_process";
import { LIVROS, AUTORES, GRUPOS_BIBLIA, LISTAS_BIBLIA } from "../src/data/biblia-livros.js";
import { PERSONAGENS, PARENTESCO, MAES, PAPEIS } from "../src/data/biblia-pessoas.js";
import { LUGARES, MILAGRES, PARABOLAS } from "../src/data/biblia-lugares.js";
import { VERSICULOS, CITACOES, NUMEROS, FATOS } from "../src/data/biblia-fatos.js";

const pt = x => (x && typeof x === "object" ? x.pt : x) ?? "";
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/* O código é a POSIÇÃO na tabela, e não o campo `n` dela: `n` é o grau de
   dificuldade (vai de 1 a 4) e se repete às dezenas. Cada linha traz também o
   nome, então o código serve para apontar rápido e o nome desfaz qualquer
   dúvida. */
const cod = (p, i) => `${p}-${String(i).padStart(3, "0")}`;

/* Uma seção: o que a tabela vira, e a tabela. */
function secao({ id, titulo, quantos, vira, colunas, linhas, nota }) {
  return `
<section id="${id}">
  <h2>${esc(titulo)} <span class="conta">${quantos} ${quantos === 1 ? "linha" : "linhas"}</span></h2>
  <p class="vira"><strong>O que isto vira no app:</strong> ${vira}</p>
  ${nota ? `<p class="nota">${nota}</p>` : ""}
  <table>
    <thead><tr><th class="cod">Código</th>${colunas.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead>
    <tbody>
      ${linhas.map(([c, ...cels]) => `<tr><td class="cod">${c}</td>${cels.map(v => `<td>${esc(v)}</td>`).join("")}</tr>`).join("\n      ")}
    </tbody>
  </table>
</section>`;
}

const secoes = [];

/* ---------- os 66 livros ---------- */
secoes.push(secao({
  id: "livros", titulo: "Os 66 livros", quantos: LIVROS.length,
  vira: "seis perguntas por livro — quantos capítulos tem, qual livro tem tantos capítulos, a que grupo pertence, qual vem antes, qual vem depois e de quem é a autoria tradicional.",
  nota: "A autoria é a <strong>tradicional</strong>, e a pergunta diz isso com essas palavras. Onde a autoria é discutida (Hebreus, por exemplo), é a atribuição tradicional que está na tabela — se preferir outra, é só apontar.",
  colunas: ["Livro", "Testamento", "Grupo", "Capítulos", "Autoria tradicional"],
  linhas: LIVROS.map((l, i) => [
    cod("LIV", i + 1), pt(l), l.t === "ao" ? "Antigo" : "Novo",
    pt(GRUPOS_BIBLIA[l.g]), l.cap, pt(AUTORES[l.autor]) || "—",
  ]),
}));

/* ---------- personagens ---------- */
secoes.push(secao({
  id: "pessoas", titulo: "Personagens", quantos: PERSONAGENS.length,
  vira: "quatro perguntas por personagem — quem fez tal coisa, o que a pessoa fez, em que livro está a história dela e que papel ela teve.",
  colunas: ["Nome", "O que fez", "Papel", "Livro"],
  linhas: PERSONAGENS.map((p, i) => [cod("PES", i + 1), pt(p.nome), pt(p.feito), pt(PAPEIS[p.papel]) || p.papel, p.livro]),
}));

secoes.push(secao({
  id: "pais", titulo: "Pais e filhos", quantos: PARENTESCO.length,
  vira: "a pergunta “quem era o pai de fulano?”.",
  colunas: ["Filho", "Pai"],
  linhas: PARENTESCO.map(([, filho, , , pai], i) => [cod("PAI", i + 1), filho, pai]),
}));

secoes.push(secao({
  id: "maes", titulo: "Mães e filhos", quantos: MAES.length,
  vira: "a pergunta “quem era a mãe de fulano?”.",
  colunas: ["Filho", "Mãe"],
  linhas: MAES.map(([, filho, , , mae], i) => [cod("MAE", i + 1), filho, mae]),
}));

/* ---------- lugares, milagres, parábolas ---------- */
secoes.push(secao({
  id: "lugares", titulo: "Lugares", quantos: LUGARES.length,
  vira: "três perguntas por lugar — onde aconteceu tal coisa, o que aconteceu naquele lugar e em que livro ele aparece.",
  colunas: ["Lugar", "O que aconteceu", "Livro"],
  linhas: LUGARES.map((l, i) => [cod("LUG", i + 1), pt(l.lugar), pt(l.evento), l.livro]),
}));

secoes.push(secao({
  id: "milagres", titulo: "Milagres de Jesus", quantos: MILAGRES.length,
  vira: "três perguntas por milagre — onde a Bíblia diz que Jesus fez aquilo, o que Jesus fez naquele lugar e em que Evangelho está.",
  colunas: ["O que Jesus fez", "Onde", "Evangelho"],
  linhas: MILAGRES.map((m, i) => [cod("MIL", i + 1), pt(m.obra), pt(m.lugar), m.evangelho]),
}));

secoes.push(secao({
  id: "parabolas", titulo: "Parábolas", quantos: PARABOLAS.length,
  vira: "três perguntas por parábola — qual é o ensino dela, qual parábola ensina aquilo e em que Evangelho está.",
  nota: "Aqui a revisão é <strong>doutrinária</strong>, e não só factual: a coluna “o que ensina” é a leitura que a criança leva para casa.",
  colunas: ["Parábola", "O que ensina", "Evangelho"],
  linhas: PARABOLAS.map((p, i) => [cod("PRB", i + 1), pt(p.nome), pt(p.ensina), p.evangelho]),
}));

/* ---------- Escritura citada ---------- */
secoes.push(secao({
  id: "versiculos", titulo: "Versículos", quantos: VERSICULOS.length,
  vira: "duas perguntas por versículo — em que livro está escrito aquilo, e completar a frase.",
  nota: "É o único lugar do banco em que <strong>Escritura é citada</strong>. Vale conferir a fidelidade do texto e o livro indicado.",
  colunas: ["Começo", "Fim", "Livro"],
  linhas: VERSICULOS.map((v, i) => [cod("VER", i + 1), pt(v.ini), pt(v.fim), v.livro]),
}));

secoes.push(secao({
  id: "citacoes", titulo: "Quem disse", quantos: CITACOES.length,
  vira: "a pergunta “quem disse isto?”.",
  colunas: ["Fala", "Quem disse"],
  linhas: CITACOES.map((c, i) => [cod("CIT", i + 1), pt(c.fala), c.quem]),
}));

/* ---------- números e fatos avulsos ---------- */
secoes.push(secao({
  id: "numeros", titulo: "Números", quantos: NUMEROS.length,
  vira: "a própria pergunta, com a resposta certa e três números próximos como alternativas.",
  colunas: ["Pergunta", "Resposta"],
  linhas: NUMEROS.map((x, i) => [cod("NUM", i + 1), pt(x.q), x.r]),
}));

secoes.push(secao({
  id: "fatos", titulo: "Fatos avulsos", quantos: FATOS.length,
  vira: "a própria pergunta. Aqui as três alternativas erradas também foram escritas à mão — vale conferir se alguma delas não poderia ser defendida como certa.",
  colunas: ["Pergunta", "Resposta certa", "Alternativas erradas"],
  linhas: FATOS.map((x, i) => [cod("FAT", i + 1), pt(x.q), pt(x.a), x.d.map(pt).join(" · ")]),
}));

/* ---------- listas ---------- */
for (const [chave, lista] of Object.entries(LISTAS_BIBLIA)) {
  secoes.push(secao({
    id: "lista-" + chave, titulo: "Lista: " + pt(lista.pergunta).replace("{n}", "n").replace(/\?$/, ""),
    quantos: lista.itens.length,
    vira: "uma pergunta por item da lista, pedindo o item na posição certa.",
    colunas: ["Posição", "Item"],
    linhas: lista.itens.map((it, i) => [cod(chave.slice(0, 3).toUpperCase(), i + 1), i + 1, pt(it)]),
  }));
}

const total = [LIVROS, PERSONAGENS, PARENTESCO, MAES, LUGARES, MILAGRES, PARABOLAS,
  VERSICULOS, CITACOES, NUMEROS, FATOS].reduce((s, a) => s + a.length, 0)
  + Object.values(LISTAS_BIBLIA).reduce((s, l) => s + l.itens.length, 0);

let versao = "";
try {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const tag = execSync("git describe --tags --always", { encoding: "utf8" }).trim();
  versao = tag.startsWith("v" + pkg.version) ? tag : `v${pkg.version} · ${tag}`;
} catch { versao = "versão não identificada"; }

const hoje = new Date().toISOString().slice(0, 10);

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lumus — revisão do banco bíblico</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #FAF9F6; color: #1B2A6B;
    font-family: Georgia, "Times New Roman", serif; line-height: 1.65; }
  .folha { max-width: 940px; margin: 0 auto; padding: 32px 22px 80px; }
  h1 { font-size: 30px; line-height: 1.2; margin: 0 0 4px; }
  .sub { color: #6C7695; font-size: 15px; margin: 0 0 26px; }
  h2 { font-size: 21px; margin: 38px 0 6px; padding-top: 14px; border-top: 3px solid #1B2A6B; }
  .conta { float: right; font-size: 13px; font-weight: normal; color: #6C7695;
    font-family: ui-monospace, Consolas, monospace; padding-top: 8px; }
  .vira { margin: 0 0 10px; font-size: 14px; color: #3C4A7A; }
  .nota { margin: 0 0 12px; font-size: 14px; background: #FFF4D6; border-left: 4px solid #F9A826;
    padding: 9px 12px; }
  .caixa { background: #EEF1FF; border: 2px solid #C3CBEA; border-radius: 10px;
    padding: 16px 18px; margin: 0 0 26px; }
  .caixa h3 { margin: 0 0 8px; font-size: 17px; }
  .caixa ol { margin: 0; padding-left: 20px; }
  .caixa li { margin-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px;
    font-family: system-ui, -apple-system, Segoe UI, sans-serif; }
  th { text-align: left; background: #1B2A6B; color: #fff; padding: 7px 9px; font-weight: 700; }
  td { padding: 6px 9px; border-bottom: 1px solid #E0E4F0; vertical-align: top; }
  tbody tr:nth-child(even) { background: #F2F4FB; }
  .cod { font-family: ui-monospace, Consolas, monospace; font-size: 12px;
    color: #6C7695; white-space: nowrap; width: 1%; }
  nav { font-size: 14px; margin: 0 0 8px; }
  nav a { color: #4C6FFF; margin-right: 14px; white-space: nowrap; display: inline-block; }
  footer { margin-top: 48px; padding-top: 14px; border-top: 2px solid #C3CBEA;
    font-size: 13px; color: #6C7695; }
  @media print {
    body { background: #fff; }
    .folha { max-width: none; padding: 0; }
    h2 { break-after: avoid; }
    tr { break-inside: avoid; }
    nav { display: none; }
  }
</style>
</head>
<body>
<div class="folha">

<h1>Lumus — revisão do banco bíblico</h1>
<p class="sub">${total} fatos · ${versao} · gerado em ${hoje}</p>

<div class="caixa">
  <h3>O que é isto, e o que se espera de quem lê</h3>
  <p style="margin-top:0">O Lumus é um app de jogos educativos para crianças, sem anúncio, sem cobrança
  e sem coleta de dados, dado de graça a famílias. Uma das áreas é a Bíblia.</p>

  <p><strong>As perguntas do app não são escritas uma a uma: elas são geradas a partir
  das tabelas abaixo.</strong> Um capítulo errado em Gênesis vira quatro perguntas
  erradas de uma vez. Por isso pedimos a revisão dos <em>fatos</em>, e não das
  perguntas: são ${total} linhas em vez de mais de duas mil perguntas.</p>

  <h3>O que procurar</h3>
  <ol>
    <li><strong>Está certo?</strong> Número de capítulos, autoria tradicional, quem era pai de quem,
      em que livro está a história, em que Evangelho está o milagre.</li>
    <li><strong>Dá para defender outra resposta?</strong> Pergunta com duas respostas certas é
      pergunta errada — e a criança é reprovada por acertar.</li>
    <li><strong>Está dito de um jeito que uma criança de 6 a 10 anos entende</strong>, sem assustar
      e sem simplificar a ponto de ficar errado.</li>
    <li><strong>O ensino das parábolas</strong> (seção Parábolas) é o que a criança leva para casa.
      É a parte que mais pede olho pastoral.</li>
  </ol>

  <h3>Como marcar</h3>
  <p style="margin-bottom:0">Cada linha tem um código à esquerda (<span class="cod">LIV-001</span>,
  <span class="cod">PES-014</span>…). Basta escrever o código e o que está errado —
  numa mensagem, num papel, do jeito que for mais fácil. Não é preciso abrir nada
  de programação.</p>
</div>

<nav>${secoes.map(s => {
  const id = s.match(/id="([^"]+)"/)[1];
  const titulo = s.match(/<h2>([^<]*)/)[1].trim();
  return `<a href="#${id}">${esc(titulo)}</a>`;
}).join("")}</nav>

${secoes.join("\n")}

<footer>
  <p><strong>Lumus — Kids Game Hub</strong> · ElCamargo Soluções em TI LTDA · Blumenau, SC<br>
  Gerado por <code>npm run doc-biblia</code> a partir de <code>src/data/biblia-*.js</code>.
  Os códigos seguem a ordem das tabelas: acrescentar uma linha no meio desloca
  as seguintes, então vale marcar tudo neste mesmo documento e só depois gerar
  o próximo. Cada linha traz o nome ao lado do código, que desfaz qualquer dúvida.</p>
  <p>Os textos em francês, alemão e italiano ainda não existem para os versículos e
  as falas — está no roadmap, e depende de uma edição em domínio público conferida
  para cada língua. Não é erro do banco.</p>
</footer>

</div>
</body>
</html>
`;

fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync("docs/revisao-biblia.html", html);
console.log(`\n✓ docs/revisao-biblia.html — ${total} fatos em ${secoes.length} seções\n`);
