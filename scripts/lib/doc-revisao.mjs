/**
 * KidsGameHub — a folha de revisão, compartilhada por todos os documentos
 * ElCamargo Soluções em TI LTDA
 *
 * Os bancos do app não guardam perguntas escritas uma a uma: guardam FATOS, e
 * moldes que viram perguntas. Um fato errado estraga várias perguntas de uma
 * vez — então quem revisa lê os fatos, não as perguntas geradas.
 *
 * Este arquivo é só a folha: o CSS, a moldura e a função que monta uma seção.
 * Quem sabe o que cada banco significa são os geradores (doc-biblia.mjs e
 * doc-bancos.mjs), e é lá que mora o texto de cada seção.
 *
 * A página não busca nada na rede, não tem script e abre offline em qualquer
 * navegador — as mesmas regras do app valem para o que sai dele.
 */
import fs from "node:fs";
import { execSync } from "node:child_process";

export const pt = x => (x && typeof x === "object" ? x.pt : x) ?? "";
export const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* O código é a POSIÇÃO na tabela, e não o campo `n` dela: `n` é o grau de
   dificuldade (vai de 1 a 4) e se repete às dezenas. Cada linha traz também o
   nome, então o código serve para apontar rápido e o nome desfaz qualquer
   dúvida. */
export const cod = (p, i) => `${p}-${String(i).padStart(3, "0")}`;

/* Uma seção: o que a tabela vira, e a tabela. */
/* `corpo` troca a tabela por HTML livre: a leitura precisa do texto ao lado
   das perguntas dele, e isso não cabe numa linha de tabela. */
export function secao({ id, titulo, quantos, vira, colunas, linhas, nota, corpo }) {
  const n = quantos ?? linhas?.length ?? 0;
  return `
<section id="${id}">
  <h2>${esc(titulo)} <span class="conta">${n} ${n === 1 ? "linha" : "linhas"}</span></h2>
  <p class="vira"><strong>O que isto vira no app:</strong> ${vira}</p>
  ${nota ? `<p class="nota">${nota}</p>` : ""}
  ${corpo ?? `<table>
    <thead><tr><th class="cod">Código</th>${colunas.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead>
    <tbody>
      ${linhas.map(([c, ...cels]) => `<tr><td class="cod">${c}</td>${cels.map(v => `<td>${esc(v)}</td>`).join("")}</tr>`).join("\n      ")}
    </tbody>
  </table>`}
</section>`;
}

/* A versão que está sendo revisada. Sem isso o revisor não sabe de que
   momento do banco é o papel na mão dele. */
export function versaoAtual() {
  try {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const tag = execSync("git describe --tags --always", { encoding: "utf8" }).trim();
    return tag.startsWith("v" + pkg.version) ? tag : `v${pkg.version} · ${tag}`;
  } catch { return "versão não identificada"; }
}

const CSS = `
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
  .fig { font-size: 20px; text-align: center; width: 1%; }
  .bloco { margin: 20px 0 28px; }
  .bloco h3 { font-size: 16px; margin: 0 0 6px; }
  .bloco h3 .conta { float: none; margin-left: 8px; }
  .lido { background: #fff; border-left: 4px solid #4C6FFF; padding: 10px 14px;
    margin: 0 0 8px; font-size: 15px; }
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
  }`;

/* Monta e grava a página. `caixa` é o quadro de instruções do começo, que
   muda de documento para documento porque quem revisa muda junto. */
export function pagina({ arquivo, titulo, total, unidade = "fatos", caixa, secoes, rodape = "", vindoDe }) {
  const hoje = new Date().toISOString().slice(0, 10);
  const navegacao = secoes.map(s => {
    const id = s.match(/id="([^"]+)"/)[1];
    const t = s.match(/<h2>([^<]*)/)[1].trim();
    return `<a href="#${id}">${esc(t)}</a>`;
  }).join("");

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<style>${CSS}
</style>
</head>
<body>
<div class="folha">

<h1>${esc(titulo)}</h1>
<p class="sub">${total} ${unidade} · ${versaoAtual()} · gerado em ${hoje}</p>

${caixa}

<nav>${navegacao}</nav>

${secoes.join("\n")}

<footer>
  <p><strong>Lumus — Kids Game Hub</strong> · ElCamargo Soluções em TI LTDA · Blumenau, SC<br>
  Gerado a partir de <code>${esc(vindoDe)}</code>.
  Os códigos seguem a ordem das tabelas: acrescentar uma linha no meio desloca
  as seguintes, então vale marcar tudo neste mesmo documento e só depois gerar
  o próximo. Cada linha traz o nome ao lado do código, que desfaz qualquer dúvida.</p>
  ${rodape}
</footer>

</div>
</body>
</html>
`;
  fs.mkdirSync("docs", { recursive: true });
  fs.writeFileSync(arquivo, html);
  console.log(`✓ ${arquivo} — ${total} ${unidade} em ${secoes.length} seções`);
}
