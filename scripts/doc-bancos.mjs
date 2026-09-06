/**
 * KidsGameHub — os documentos de revisão dos demais bancos
 * ElCamargo Soluções em TI LTDA
 *
 * O banco bíblico já tinha o dele (scripts/doc-biblia.mjs). O resto do
 * conteúdo do app nunca teve, e é conteúdo que uma criança leva para a prova:
 * separação de sílaba, regra de ortografia, o que come cada bicho, a região de
 * cada estado, a capital de cada país.
 *
 * São TRÊS documentos, e a divisão não é por arquivo de dados: é por QUEM
 * revisa. Não adianta mandar 1.500 linhas para uma pessoa só.
 *
 *   docs/revisao-escola.html   professora de alfabetização — palavras, sílabas,
 *                              ortografia, textos de leitura
 *   docs/revisao-mundo.html    professora / quem gosta de mapa — animais,
 *                              ciências, curiosidades, Brasil, capitais
 *   docs/revisao-familia.html  pastor ou pais — o versículo do dia, o
 *                              devocional em família e as perguntas do caderno
 *
 * O terceiro fica FORA do documento bíblico de propósito: lá são perguntas de
 * quiz, aqui é Escritura que a família lê junta e conversa. Quem revisa uma
 * coisa não revisa a outra do mesmo jeito.
 *
 * Rodar: npm run doc-bancos
 */
import { pt, esc, cod, secao, pagina } from "./lib/doc-revisao.mjs";
import { PALAVRAS } from "../src/data/palavras.js";
import { ORTOGRAFIA } from "../src/data/ortografia.js";
import { LEITURAS } from "../src/data/leitura.js";
import { ANIMAIS, GRUPOS, DIETAS, CASAS, NASCE, MOLDES_CIENCIA } from "../src/data/ciencias.js";
import { CIENCIAS_MUNDO } from "../src/data/ciencias-mundo.js";
import { CURIOSIDADES, AGUAS } from "../src/data/curiosidades.js";
import { ESTADOS, FATOS as FATOS_BR, REGIOES } from "../src/data/brasil.js";
import { DATA, CAPITAIS, CAP_PT, BR_ESTADOS, US_ESTADOS } from "../src/data/geografia.js";
import { VERSOS } from "../src/data/versos.js";
import { PRINCIPIOS, DEVOCIONAIS } from "../src/data/devocional.js";
import { PERGUNTAS } from "../src/data/caderno.js";
import { T } from "../src/data/textos.js";

const CONT = T.pt.continents;
const nomes = new Intl.DisplayNames(["pt"], { type: "region" });
const pais = c => nomes.of(c) || c;
/* As três alternativas erradas, que é onde mora o erro mais traiçoeiro: a
   errada que também podia ser defendida como certa. */
const erradas = (o, a) => o.filter(x => x !== a).join(" · ");

/* ==================================================================
   1. A ESCOLA — alfabetização e reforço
   ================================================================== */
const escola = [];

escola.push(secao({
  id: "palavras", titulo: "Palavras e sílabas", quantos: PALAVRAS.length,
  vira: "quatro jogos — Monta a Palavra (a criança arrasta as sílabas), o ditado (ela ouve e escreve), a família silábica e a rima.",
  nota: "A separação de sílabas foi feita <strong>à mão</strong>, e é o que mais pede olho de professora: algoritmo erra baixinho, e sílaba errada é criança aprendendo a separar errado. A rima é o pedaço final que soa igual — só existe quando há outra palavra aqui que rime.",
  colunas: ["Figura", "Palavra", "Sílabas", "Rima", "Degrau"],
  linhas: PALAVRAS.map((p, i) => [cod("PAL", i + 1), p.e, p.w, p.s.join(" · "), p.r || "—", p.n]),
}));

escola.push(secao({
  id: "ortografia", titulo: "Ortografia", quantos: ORTOGRAFIA.length,
  vira: "a palavra aparece com uma lacuna e a criança escolhe o pedaço que falta. A regra vira a explicação de quando ela erra.",
  nota: "Duas coisas para conferir aqui. <strong>A figura tem que bastar</strong>: “ca__a” pode ser casa e pode ser caça, e é o 🏠 que diz qual é — figura ambígua é pergunta sem resposta única. E <strong>a regra tem que ser verdadeira</strong>: onde não existe regra, ela precisa dizer que é de memorizar, em vez de inventar uma.",
  colunas: ["Figura", "Palavra", "Como aparece", "Pedaço certo", "Alternativas erradas", "A regra que ensina"],
  linhas: ORTOGRAFIA.map((o, i) => [
    cod("ORT", i + 1), o.e, o.w, `${o.a}__${o.d}`, o.c, erradas(o.o, o.c), o.r,
  ]),
}));

/* A leitura não cabe em tabela: a pergunta só é conferível com o texto ao
   lado dela. Cada texto vira um bloco com as perguntas dele embaixo. */
const nQuestoes = LEITURAS.reduce((s, l) => s + l.p.length, 0);
const TIPO = { literal: "literal", inferencia: "inferência", vocabulario: "vocabulário" };
escola.push(secao({
  id: "leitura", titulo: "Textos de leitura", quantos: LEITURAS.length,
  vira: `${nQuestoes} perguntas de interpretação. A voz do Lumus lê o texto inteiro para quem ainda não lê sozinho.`,
  nota: "A regra do banco: as três erradas têm que ser <strong>plausíveis para quem não leu</strong> e <strong>claramente erradas para quem leu</strong>. Alternativa absurda a criança elimina sem ler, e aí a pergunta não mediu leitura nenhuma. E se duas alternativas podem ser defendidas lendo o texto, quem está errada é a pergunta.",
  corpo: LEITURAS.map((L, i) => `
  <div class="bloco">
    <h3>${cod("LEI", i + 1)} · ${L.e} <span class="conta">degrau ${L.n}</span></h3>
    <p class="lido">${esc(L.t)}</p>
    <table>
      <thead><tr><th class="cod">Código</th><th>Tipo</th><th>Pergunta</th><th>Resposta certa</th><th>Alternativas erradas</th><th>Onde está no texto</th></tr></thead>
      <tbody>
        ${L.p.map((q, j) => `<tr><td class="cod">${cod("LEI", i + 1)}.${j + 1}</td><td>${TIPO[q.tipo] || q.tipo}</td><td>${esc(q.q)}</td><td>${esc(q.a)}</td><td>${esc(erradas(q.o, q.a))}</td><td>${esc(q.porque)}</td></tr>`).join("\n        ")}
      </tbody>
    </table>
  </div>`).join(""),
}));

pagina({
  arquivo: "docs/revisao-escola.html",
  titulo: "Lumus — revisão do reforço escolar",
  vindoDe: "src/data/palavras.js, ortografia.js e leitura.js (npm run doc-bancos)",
  total: PALAVRAS.length + ORTOGRAFIA.length + LEITURAS.length + nQuestoes,
  unidade: "linhas para conferir",
  secoes: escola,
  caixa: `<div class="caixa">
  <h3>O que é isto, e o que se espera de quem lê</h3>
  <p style="margin-top:0">O Lumus é um app de jogos educativos para crianças, sem anúncio, sem cobrança
  e sem coleta de dados, dado de graça a famílias. Esta parte é a que acompanha a
  escola: alfabetização, ortografia e interpretação de texto, do 1º ao 5º ano.</p>

  <p><strong>As perguntas do app não são escritas uma a uma: elas são geradas a partir
  das tabelas abaixo.</strong> Uma sílaba separada errado aparece em quatro jogos
  diferentes. Por isso pedimos a revisão dos <em>dados</em>, e não das telas.</p>

  <h3>O que procurar</h3>
  <ol>
    <li><strong>A separação de sílabas está certa?</strong> É a linha mais importante deste
      documento — é o que a criança copia para o caderno.</li>
    <li><strong>A figura basta para saber que palavra é?</strong> Na ortografia, é a figura que
      faz a pergunta ter uma resposta só.</li>
    <li><strong>Dá para defender outra alternativa?</strong> Pergunta com duas respostas certas é
      pergunta errada — e a criança é reprovada por acertar.</li>
    <li><strong>A regra está dita do jeito que a escola ensina?</strong> Se a sua turma aprende
      com outras palavras, vale mais a sua.</li>
    <li><strong>O degrau está no lugar?</strong> 1 é 1º ano, 4 é 5º. Palavra fácil demais no
      degrau alto entedia; difícil demais no degrau baixo desiste.</li>
  </ol>

  <h3>Como marcar</h3>
  <p style="margin-bottom:0">Cada linha tem um código à esquerda (<span class="cod">PAL-014</span>,
  <span class="cod">LEI-003.2</span>…). Basta escrever o código e o que está errado —
  numa mensagem, num papel, do jeito que for mais fácil. Não é preciso abrir nada
  de programação.</p>
</div>`,
});

/* ==================================================================
   2. O MUNDO — ciências, curiosidades, Brasil e capitais
   ================================================================== */
const mundo = [];

mundo.push(secao({
  id: "animais", titulo: "Os animais", quantos: ANIMAIS.length,
  vira: `${MOLDES_CIENCIA.length} perguntas por bicho — de que grupo é, o que come, onde vive, como nasce e de que continente é. O bicho sem continente próprio não gera a quinta.`,
  nota: "O bicho <strong>é a figura</strong>: o app não escreve o nome dele, porque assim a mesma tabela serve aos seis idiomas. Então a primeira pergunta é se a figura deixa claro que animal é — 🦭 e 🦦 confundem, e aí a criança erra por causa do desenho, não por não saber.",
  colunas: ["Figura", "Grupo", "O que come", "Onde vive", "Como nasce", "Continente", "Degrau"],
  linhas: ANIMAIS.map((a, i) => [
    cod("ANI", i + 1), a.e, pt(GRUPOS[a.grupo]), pt(DIETAS[a.dieta]),
    pt(CASAS[a.casa]), pt(NASCE[a.nasce]), a.onde ? CONT[a.onde] : "— (vive em vários)", a.n,
  ]),
}));

mundo.push(secao({
  id: "ciencias", titulo: "Ciências além dos bichos", quantos: CIENCIAS_MUNDO.length,
  vira: "a própria pergunta, com as quatro alternativas. A explicação aparece quando a criança erra.",
  nota: "Aqui a pergunta é escrita à mão, e não sai de molde. Vale conferir se a explicação <strong>ensina o porquê</strong> em vez de repetir a resposta com outras palavras.",
  colunas: ["Tema", "Figura", "Pergunta", "Resposta certa", "Alternativas erradas", "A explicação"],
  linhas: CIENCIAS_MUNDO.map((x, i) => [
    cod("CIE", i + 1), x.tema, x.e, x.q, x.a, erradas(x.o, x.a), x.porque,
  ]),
}));

const TIPO_CUR = {
  pais: "em que país fica", cidade: "em que cidade fica",
  agua: "que mar ou oceano é", continente: "em que continente fica",
};
const respCur = c => c.t === "pais" ? pais(c.r)
  : c.t === "agua" ? pt(AGUAS[c.r])
  : c.t === "continente" ? CONT[c.r] : c.r;
mundo.push(secao({
  id: "curiosidades", titulo: "Curiosidades do mundo", quantos: CURIOSIDADES.length,
  vira: "uma pergunta por linha, do tipo indicado na coluna “o que se pergunta”.",
  nota: "A regra do banco é <strong>nada de fronteira dividida</strong>: o que fica em dois países (Everest, Iguaçu) entra como continente, nunca como país. Se encontrar aqui alguma coisa que fica em dois lugares e está marcada como país, é erro.",
  colunas: ["Figura", "O quê", "O que se pergunta", "Resposta certa"],
  linhas: CURIOSIDADES.map((c, i) => [
    cod("CUR", i + 1), c.e, pt(c.nome), TIPO_CUR[c.t], respCur(c),
  ]),
}));

mundo.push(secao({
  id: "estados", titulo: "Os 27 estados", quantos: ESTADOS.length,
  vira: "a pergunta “em que região fica tal estado?”, e o seletor de onde a criança mora.",
  colunas: ["Estado", "Sigla", "Região", "Degrau"],
  linhas: ESTADOS.map((e, i) => [cod("EST", i + 1), e.w, e.uf, REGIOES[e.r].nome, e.n]),
}));

mundo.push(secao({
  id: "brasil", titulo: "Fatos do Brasil", quantos: FATOS_BR.length,
  vira: "a própria pergunta, com as quatro alternativas e a explicação de quando erra.",
  colunas: ["Tema", "Figura", "Pergunta", "Resposta certa", "Alternativas erradas", "A explicação"],
  linhas: FATOS_BR.map((x, i) => [
    cod("BRA", i + 1), x.tema, x.e, x.q, x.a, erradas(x.o, x.a), x.porque,
  ]),
}));

/* As capitais do jogo: só os países que estão em DATA, continente a
   continente, que é a ordem em que o jogo os apresenta. */
const paisesDoJogo = Object.entries(DATA).flatMap(([k, m]) => Object.keys(m).map(c => [k, c]));
mundo.push(secao({
  id: "capitais", titulo: "Capitais dos países", quantos: paisesDoJogo.length,
  vira: "a pergunta “qual é a capital de tal país?”, e o mapa das capitais.",
  nota: "O <strong>nome do país</strong> não está guardado no app: vem do próprio sistema do aparelho, e por isso o jogo fala uns cem idiomas de graça. Só a capital tem grafia nossa. Capitais que mudaram de nome ou de cidade valem um olhar.",
  colunas: ["Continente", "País", "Capital"],
  linhas: paisesDoJogo.map(([k, c], i) => [cod("CAP", i + 1), CONT[k], pais(c), CAP_PT[c] || CAPITAIS[c]]),
}));

mundo.push(secao({
  id: "capitais-br", titulo: "Capitais dos estados brasileiros", quantos: BR_ESTADOS.length,
  vira: "a mesma pergunta das capitais, na fase que começa pelo Brasil.",
  colunas: ["Estado", "Capital"],
  linhas: BR_ESTADOS.map(([e, c], i) => [cod("CBR", i + 1), e, c]),
}));

mundo.push(secao({
  id: "capitais-us", titulo: "Capitais dos estados americanos", quantos: US_ESTADOS.length,
  vira: "a fase final das capitais, no nível mais alto.",
  nota: "Estes ficam em inglês de propósito: é o nome oficial do estado, e traduzir “New York” para “Nova York” criaria uma grafia que não existe em documento nenhum.",
  colunas: ["Estado", "Capital"],
  linhas: US_ESTADOS.map(([e, c], i) => [cod("CUS", i + 1), e, c]),
}));

pagina({
  arquivo: "docs/revisao-mundo.html",
  titulo: "Lumus — revisão de ciências, mundo e Brasil",
  vindoDe: "src/data/ciencias.js, ciencias-mundo.js, curiosidades.js, brasil.js e geografia.js (npm run doc-bancos)",
  total: ANIMAIS.length + CIENCIAS_MUNDO.length + CURIOSIDADES.length + ESTADOS.length
    + FATOS_BR.length + paisesDoJogo.length + BR_ESTADOS.length + US_ESTADOS.length,
  unidade: "fatos",
  secoes: mundo,
  caixa: `<div class="caixa">
  <h3>O que é isto, e o que se espera de quem lê</h3>
  <p style="margin-top:0">O Lumus é um app de jogos educativos para crianças, sem anúncio, sem cobrança
  e sem coleta de dados, dado de graça a famílias. Esta parte é o mundo: os bichos,
  o corpo, as plantas, a água, os monumentos, o Brasil e as capitais.</p>

  <p><strong>As perguntas do app não são escritas uma a uma: elas são geradas a partir
  das tabelas abaixo.</strong> Um bicho no grupo errado vira cinco perguntas erradas de
  uma vez. Por isso pedimos a revisão dos <em>fatos</em>.</p>

  <h3>O que procurar</h3>
  <ol>
    <li><strong>Está certo?</strong> O grupo do bicho, o que ele come, onde vive, a região do
      estado, a capital do país.</li>
    <li><strong>Dá para defender outra resposta?</strong> É o erro mais comum e o mais injusto:
      a criança sabe, responde certo, e o app diz que errou. O golfinho vive no mar e
      no rio; o urso come planta e carne. Onde couber “depende”, avise.</li>
    <li><strong>A figura diz que coisa é?</strong> Nos animais e nas curiosidades, é só a figura —
      se ela confunde, a criança erra pelo desenho, não pelo conteúdo.</li>
    <li><strong>Assusta?</strong> Doença, morte e acidente ficam de fora de propósito: a criança
      joga sozinha, sem adulto do lado para explicar.</li>
  </ol>

  <h3>Como marcar</h3>
  <p style="margin-bottom:0">Cada linha tem um código à esquerda (<span class="cod">ANI-014</span>,
  <span class="cod">CAP-032</span>…). Basta escrever o código e o que está errado —
  numa mensagem, num papel, do jeito que for mais fácil. Não é preciso abrir nada
  de programação.</p>
</div>`,
});

/* ==================================================================
   3. A FAMÍLIA — versículo do dia, devocional e caderno
   ================================================================== */
const familia = [];

familia.push(secao({
  id: "principios", titulo: "Os sete princípios", quantos: PRINCIPIOS.length,
  vira: "a espinha do devocional: cada semana fica num princípio, e os sete dias daquela semana o aprofundam. As perguntas do caderno seguem os mesmos sete.",
  nota: "Aqui a revisão é <strong>doutrinária</strong>, e é a mais importante deste documento: estas sete frases são o resumo que a criança leva. Vieram da Abordagem Educacional por Princípios.",
  colunas: ["Princípio", "A ideia, em uma frase"],
  linhas: PRINCIPIOS.map((p, i) => [cod("PRI", i + 1), p.pt, p.ideaPt]),
}));

familia.push(secao({
  id: "versiculos", titulo: "O versículo do dia", quantos: VERSOS.length,
  vira: "um versículo por dia na tela inicial, o mesmo para todos os perfis do aparelho — para a criança poder decorar o de hoje.",
  nota: "É <strong>Escritura citada</strong>. O texto em português é da <strong>Almeida</strong>, em domínio público (o inglês é a King James, o espanhol a Reina-Valera 1909). Vale conferir a fidelidade da citação e a referência. Só Salmos e Provérbios, curtos e de encorajamento: nada de doutrina que divida igrejas, porque o app vai para o mundo todo.",
  colunas: ["Versículo", "Referência"],
  linhas: VERSOS.map((v, i) => [cod("VDD", i + 1), v.pt, v.ref.pt]),
}));

const linhasDev = [];
for (const p of PRINCIPIOS) {
  (DEVOCIONAIS[p.id] || []).forEach((d, j) => {
    linhasDev.push([cod("DEV", linhasDev.length + 1), p.pt, j + 1, d.v.pt, d.ref.pt, d.q.pt, d.a.pt]);
  });
}
familia.push(secao({
  id: "devocional", titulo: "O devocional em família", quantos: linhasDev.length,
  vira: "um por dia na tela do Momento em Família: o versículo, uma pergunta para conversar e uma atitude para hoje.",
  nota: "Três coisas para olhar. O <strong>versículo</strong> é Escritura citada, como acima. A <strong>pergunta</strong> não tem resposta certa, e é de propósito — é para conversar, não para acertar. E a <strong>atitude</strong> tem que caber no dia de hoje: “ame mais” não é atitude, “diga obrigado a quem fez o seu almoço” é.",
  colunas: ["Princípio", "Dia", "Versículo", "Referência", "A pergunta para conversar", "A atitude de hoje"],
  linhas: linhasDev,
}));

const linhasCad = [];
for (const p of PRINCIPIOS) {
  (PERGUNTAS[p.id] || []).forEach(q => {
    linhasCad.push([cod("CAD", linhasCad.length + 1), p.pt, q.pt]);
  });
}
familia.push(secao({
  id: "caderno", titulo: "As perguntas do caderno", quantos: linhasCad.length,
  vira: "ao fim de uma rodada de qualquer jogo, uma delas aparece e liga o que a criança acabou de jogar a um dos princípios. Ela escreve a resposta no caderno dela.",
  nota: "Não são corrigidas, não valem ponto e ninguém as compara: são para a criança pensar e para o adulto conversar. Se alguma soar como prova, é erro.",
  colunas: ["Princípio", "Pergunta"],
  linhas: linhasCad,
}));

pagina({
  arquivo: "docs/revisao-familia.html",
  titulo: "Lumus — revisão do devocional e do versículo do dia",
  vindoDe: "src/data/versos.js, devocional.js e caderno.js (npm run doc-bancos)",
  total: PRINCIPIOS.length + VERSOS.length + linhasDev.length + linhasCad.length,
  unidade: "linhas para conferir",
  secoes: familia,
  caixa: `<div class="caixa">
  <h3>O que é isto, e o que se espera de quem lê</h3>
  <p style="margin-top:0">O Lumus é um app de jogos educativos para crianças, sem anúncio, sem cobrança
  e sem coleta de dados, dado de graça a famílias. Além dos jogos, ele tem um
  <strong>Momento em Família</strong>: um devocional curto por dia, para fazer junto.</p>

  <p>Este documento é <strong>diferente do da Bíblia</strong>, e por isso vem separado. Lá são
  perguntas de quiz, com resposta certa e errada. Aqui é Escritura que a família lê
  junta e uma conversa que ela puxa — o erro aqui não reprova ninguém numa prova,
  entra na casa das pessoas.</p>

  <h3>O que procurar</h3>
  <ol>
    <li><strong>A citação está fiel, e a referência confere?</strong> O português é da Almeida em
      domínio público; o inglês, King James; o espanhol, Reina-Valera 1909.</li>
    <li><strong>Tem alguma coisa que divida igrejas?</strong> A regra é ficar em terreno comum —
      Salmos, Provérbios e os princípios. Escatologia, batismo e governo eclesiástico
      ficam de fora: a mesa de cada família é da igreja dela. Se algo passou, aponte.</li>
    <li><strong>As sete frases dos princípios</strong> são o resumo que a criança leva. É a parte
      que mais pede olho pastoral.</li>
    <li><strong>A atitude do dia cabe hoje?</strong> Pequena, concreta, e sem depender de dinheiro
      ou de carro — a família que vai usar isso pode não ter nenhum dos dois.</li>
  </ol>

  <h3>Como marcar</h3>
  <p style="margin-bottom:0">Cada linha tem um código à esquerda (<span class="cod">VDD-004</span>,
  <span class="cod">DEV-012</span>…). Basta escrever o código e o que está errado —
  numa mensagem, num papel, do jeito que for mais fácil. Não é preciso abrir nada
  de programação.</p>
</div>`,
  rodape: `<p>O devocional e o versículo do dia existem hoje em português, inglês e espanhol.
  Francês, alemão e italiano dependem de uma edição em domínio público conferida para
  cada língua, e estão no roadmap. Não é erro do banco.</p>`,
});
