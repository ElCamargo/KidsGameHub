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
import { pt, cod, secao, pagina } from "./lib/doc-revisao.mjs";
import { LIVROS, AUTORES, GRUPOS_BIBLIA, LISTAS_BIBLIA } from "../src/data/biblia-livros.js";
import { PERSONAGENS, PARENTESCO, MAES, PAPEIS } from "../src/data/biblia-pessoas.js";
import { LUGARES, MILAGRES, PARABOLAS } from "../src/data/biblia-lugares.js";
import { VERSICULOS, CITACOES, NUMEROS, FATOS } from "../src/data/biblia-fatos.js";

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

pagina({
  arquivo: "docs/revisao-biblia.html",
  titulo: "Lumus — revisão do banco bíblico",
  vindoDe: "src/data/biblia-*.js (npm run doc-biblia)",
  total, secoes,
  caixa: `<div class="caixa">
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
</div>`,
  rodape: `<p>Os textos em francês, alemão e italiano ainda não existem para os versículos e
  as falas — está no roadmap, e depende de uma edição em domínio público conferida
  para cada língua. Não é erro do banco.</p>`,
});
