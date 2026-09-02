/**
 * KidsGameHub — o banco de perguntas da Bíblia
 * ElCamargo Soluções em TI LTDA
 *
 * Aqui as tabelas viram perguntas. Cada molde pega uma tabela de fatos e
 * devolve [pergunta, resposta certa, [3 erradas]] — o mesmo formato que o
 * quiz já usava, então nada mudou do lado do jogo.
 *
 * Por que moldes e não 2000 linhas escritas à mão: uma tabela de fatos é
 * conferível (dá para um pastor ler os 66 livros e os 170 personagens e
 * apontar o que está errado), enquanto 2000 perguntas soltas ninguém revisa.
 * E acrescentar um personagem acrescenta quatro perguntas de uma vez.
 *
 * REGRA que vale mais que o número total: pergunta com duas respostas certas
 * é pergunta errada. Por isso os moldes pulam nomes repetidos, livros com o
 * mesmo número de capítulos e tudo mais que não tenha resposta única.
 *
 * O total real é contado por scripts/check-bancos.mjs, que roda antes de todo
 * build. Se cair abaixo do mínimo, o build falha.
 */

import { LIVROS, AUTORES, GRUPOS_BIBLIA, LISTAS_BIBLIA } from "./biblia-livros.js";
import { PERSONAGENS, PARENTESCO, MAES, PAPEIS } from "./biblia-pessoas.js";
import { LUGARES, MILAGRES, PARABOLAS } from "./biblia-lugares.js";
import { VERSICULOS, CITACOES, NUMEROS, FATOS } from "./biblia-fatos.js";

/* Frases dos moldes. Só isto precisa de tradução — o resto vem das tabelas. */
const FRASES = {
  pt: {
    capitulos: "Quantos capítulos tem o livro de {x}?",
    qualLivroCap: "Qual destes livros tem {x} capítulos?",
    grupo: "A que grupo pertence o livro de {x}?",
    depois: "Qual livro vem logo depois de {x}?",
    antes: "Qual livro vem logo antes de {x}?",
    autor: "De quem é a autoria tradicional do livro de {x}?",
    quem: "Quem {x}?",
    oQueFez: "O que {x} fez?",
    livroDe: "Em que livro está a história de {x}?",
    papel: "Que papel {x} teve?",
    pai: "Quem era o pai de {x}?",
    mae: "Quem era a mãe de {x}?",
    onde: "Em que lugar da Bíblia isto aconteceu: “{x}”?",
    oQueAconteceu: "O que aconteceu neste lugar: {x}?",
    livroLugar: "Em que livro aparece este lugar: {x}?",
    ondeMilagre: "Onde a Bíblia diz que Jesus {x}?",
    oQueMilagre: "O que Jesus fez {x}?",
    evangelhoMilagre: "Em que Evangelho está o milagre em que Jesus {x}?",
    ensino: "Qual é o ensino da parábola “{x}”?",
    qualParabola: "Qual parábola ensina que {x}?",
    evangelhoParabola: "Em que Evangelho está a parábola “{x}”?",
    versiculoLivro: "Em que livro está escrito: “{x}”?",
    complete: "Complete: “{x} ...”",
    disse: "Quem disse: “{x}”?",
    porqueP: "{nome} {feito}. A história está no livro de {livro}.",
    porqueL: "{livro} é do grupo {grupo} e tem {cap} capítulos.",
    porqueLA: "{livro} é do grupo {grupo}, tem {cap} capítulos, e a autoria tradicional é de {autor}.",
    porqueG: "{lugar}: {evento}. Está no livro de {livro}.",
    porqueM: "Jesus {obra} {lugar}. O milagre está no Evangelho de {evangelho}.",
    porqueB: "A parábola {parabola} ensina que {ensina}. Está no Evangelho de {evangelho}.",
    porqueV: "“{verso}” — livro de {livro}.",
    porqueC: "Quem disse foi {quem}: “{fala}”.",
  },
  en: {
    capitulos: "How many chapters are in the book of {x}?",
    qualLivroCap: "Which of these books has {x} chapters?",
    grupo: "Which group does the book of {x} belong to?",
    depois: "Which book comes right after {x}?",
    antes: "Which book comes right before {x}?",
    autor: "Who is the traditional author of the book of {x}?",
    quem: "Who {x}?",
    oQueFez: "What did {x} do?",
    livroDe: "In which book is the story of {x}?",
    papel: "What role did {x} have?",
    pai: "Who was the father of {x}?",
    mae: "Who was the mother of {x}?",
    onde: "In which Bible place did this happen: “{x}”?",
    oQueAconteceu: "What happened at this place: {x}?",
    livroLugar: "In which book does this place appear: {x}?",
    ondeMilagre: "Where does the Bible say Jesus {x}?",
    oQueMilagre: "What did Jesus do {x}?",
    evangelhoMilagre: "In which Gospel is the miracle where Jesus {x}?",
    ensino: "What does the parable of {x} teach?",
    qualParabola: "Which parable teaches that {x}?",
    evangelhoParabola: "In which Gospel is the parable of {x}?",
    versiculoLivro: "In which book is it written: “{x}”?",
    complete: "Complete it: “{x} ...”",
    disse: "Who said: “{x}”?",
    porqueP: "{nome} {feito}. The story is in the book of {livro}.",
    porqueL: "{livro} belongs to the {grupo} and has {cap} chapters.",
    porqueLA: "{livro} belongs to the {grupo}, has {cap} chapters, and is traditionally attributed to {autor}.",
    porqueG: "{lugar}: {evento}. It is in the book of {livro}.",
    porqueM: "Jesus {obra} {lugar}. The miracle is in the Gospel of {evangelho}.",
    porqueB: "The parable of {parabola} teaches that {ensina}. It is in the Gospel of {evangelho}.",
    porqueV: "“{verso}” — book of {livro}.",
    porqueC: "It was {quem} who said: “{fala}”.",
  },
  es: {
    capitulos: "¿Cuántos capítulos tiene el libro de {x}?",
    qualLivroCap: "¿Cuál de estos libros tiene {x} capítulos?",
    grupo: "¿A qué grupo pertenece el libro de {x}?",
    depois: "¿Qué libro viene justo después de {x}?",
    antes: "¿Qué libro viene justo antes de {x}?",
    autor: "¿De quién es la autoría tradicional del libro de {x}?",
    quem: "¿Quién {x}?",
    oQueFez: "¿Qué hizo {x}?",
    livroDe: "¿En qué libro está la historia de {x}?",
    papel: "¿Qué papel tuvo {x}?",
    pai: "¿Quién era el padre de {x}?",
    mae: "¿Quién era la madre de {x}?",
    onde: "¿En qué lugar de la Biblia pasó esto: “{x}”?",
    oQueAconteceu: "¿Qué pasó en este lugar: {x}?",
    livroLugar: "¿En qué libro aparece este lugar: {x}?",
    ondeMilagre: "¿Dónde dice la Biblia que Jesús {x}?",
    oQueMilagre: "¿Qué hizo Jesús {x}?",
    evangelhoMilagre: "¿En qué Evangelio está el milagro en que Jesús {x}?",
    ensino: "¿Qué enseña la parábola “{x}”?",
    qualParabola: "¿Qué parábola enseña que {x}?",
    evangelhoParabola: "¿En qué Evangelio está la parábola “{x}”?",
    versiculoLivro: "¿En qué libro está escrito: “{x}”?",
    complete: "Completa: “{x} ...”",
    disse: "¿Quién dijo: “{x}”?",
    porqueP: "{nome} {feito}. La historia está en el libro de {livro}.",
    porqueL: "{livro} es del grupo {grupo} y tiene {cap} capítulos.",
    porqueLA: "{livro} es del grupo {grupo}, tiene {cap} capítulos, y la autoría tradicional es de {autor}.",
    porqueG: "{lugar}: {evento}. Está en el libro de {livro}.",
    porqueM: "Jesús {obra} {lugar}. El milagro está en el Evangelio de {evangelho}.",
    porqueB: "La parábola {parabola} enseña que {ensina}. Está en el Evangelio de {evangelho}.",
    porqueV: "“{verso}” — libro de {livro}.",
    porqueC: "Quien lo dijo fue {quem}: “{fala}”.",
  },
  fr: {
    capitulos: "Combien de chapitres compte le livre de {x} ?",
    qualLivroCap: "Lequel de ces livres compte {x} chapitres ?",
    grupo: "À quel groupe appartient le livre de {x} ?",
    depois: "Quel livre vient juste après {x} ?",
    antes: "Quel livre vient juste avant {x} ?",
    autor: "À qui la tradition attribue-t-elle le livre de {x} ?",
    quem: "Qui {x} ?",
    oQueFez: "Qu'a fait {x} ?",
    livroDe: "Dans quel livre se trouve l'histoire de {x} ?",
    papel: "Quel rôle a eu {x} ?",
    pai: "Qui était le père de {x} ?",
    mae: "Qui était la mère de {x} ?",
    onde: "Dans quel lieu de la Bible cela s'est-il passé : « {x} » ?",
    oQueAconteceu: "Que s'est-il passé dans ce lieu : {x} ?",
    livroLugar: "Dans quel livre apparaît ce lieu : {x} ?",
    ondeMilagre: "Où la Bible dit-elle que Jésus {x} ?",
    oQueMilagre: "Qu'a fait Jésus {x} ?",
    evangelhoMilagre: "Dans quel Évangile se trouve le miracle où Jésus {x} ?",
    ensino: "Qu'enseigne la parabole « {x} » ?",
    qualParabola: "Quelle parabole enseigne que {x} ?",
    evangelhoParabola: "Dans quel Évangile se trouve la parabole « {x} » ?",
    versiculoLivro: "Dans quel livre est-il écrit : « {x} » ?",
    complete: "Complète : « {x} ... »",
    disse: "Qui a dit : « {x} » ?",
    porqueP: "{nome} {feito}. L'histoire est dans le livre de {livro}.",
    porqueL: "{livro} appartient au groupe {grupo} et compte {cap} chapitres.",
    porqueLA: "{livro} appartient au groupe {grupo}, compte {cap} chapitres, et la tradition l'attribue à {autor}.",
    porqueG: "{lugar} : {evento}. C'est dans le livre de {livro}.",
    porqueM: "Jésus {obra} {lugar}. Le miracle est dans l'Évangile de {evangelho}.",
    porqueB: "La parabole {parabola} enseigne que {ensina}. Elle est dans l'Évangile de {evangelho}.",
    porqueV: "« {verso} » — livre de {livro}.",
    porqueC: "C'est {quem} qui a dit : « {fala} ».",
  },
  de: {
    capitulos: "Wie viele Kapitel hat das Buch {x}?",
    qualLivroCap: "Welches dieser Bücher hat {x} Kapitel?",
    grupo: "Zu welcher Gruppe gehört das Buch {x}?",
    depois: "Welches Buch kommt direkt nach {x}?",
    antes: "Welches Buch kommt direkt vor {x}?",
    autor: "Wem schreibt die Überlieferung das Buch {x} zu?",
    quem: "Wer {x}?",
    oQueFez: "Was hat {x} getan?",
    livroDe: "In welchem Buch steht die Geschichte von {x}?",
    papel: "Welche Rolle hatte {x}?",
    pai: "Wer war der Vater von {x}?",
    mae: "Wer war die Mutter von {x}?",
    onde: "An welchem Ort der Bibel geschah das: „{x}“?",
    oQueAconteceu: "Was geschah an diesem Ort: {x}?",
    livroLugar: "In welchem Buch kommt dieser Ort vor: {x}?",
    ondeMilagre: "Wo sagt die Bibel, dass Jesus {x}?",
    oQueMilagre: "Was tat Jesus {x}?",
    evangelhoMilagre: "In welchem Evangelium steht das Wunder, bei dem Jesus {x}?",
    ensino: "Was lehrt das Gleichnis „{x}“?",
    qualParabola: "Welches Gleichnis lehrt, dass {x}?",
    evangelhoParabola: "In welchem Evangelium steht das Gleichnis „{x}“?",
    versiculoLivro: "In welchem Buch steht geschrieben: „{x}“?",
    complete: "Ergänze: „{x} ...“",
    disse: "Wer sagte: „{x}“?",
    porqueP: "{nome} {feito}. Die Geschichte steht im Buch {livro}.",
    porqueL: "{livro} gehört zur Gruppe {grupo} und hat {cap} Kapitel.",
    porqueLA: "{livro} gehört zur Gruppe {grupo}, hat {cap} Kapitel, und die Überlieferung schreibt es {autor} zu.",
    porqueG: "{lugar}: {evento}. Es steht im Buch {livro}.",
    porqueM: "Jesus {obra} {lugar}. Das Wunder steht im Evangelium nach {evangelho}.",
    porqueB: "Das Gleichnis {parabola} lehrt, dass {ensina}. Es steht im Evangelium nach {evangelho}.",
    porqueV: "„{verso}“ — Buch {livro}.",
    porqueC: "Gesagt hat es {quem}: „{fala}“.",
  },
  it: {
    capitulos: "Quanti capitoli ha il libro di {x}?",
    qualLivroCap: "Quale di questi libri ha {x} capitoli?",
    grupo: "A quale gruppo appartiene il libro di {x}?",
    depois: "Quale libro viene subito dopo {x}?",
    antes: "Quale libro viene subito prima di {x}?",
    autor: "A chi la tradizione attribuisce il libro di {x}?",
    quem: "Chi {x}?",
    oQueFez: "Che cosa ha fatto {x}?",
    livroDe: "In quale libro si trova la storia di {x}?",
    papel: "Che ruolo ha avuto {x}?",
    pai: "Chi era il padre di {x}?",
    mae: "Chi era la madre di {x}?",
    onde: "In quale luogo della Bibbia è successo questo: «{x}»?",
    oQueAconteceu: "Che cosa è successo in questo luogo: {x}?",
    livroLugar: "In quale libro compare questo luogo: {x}?",
    ondeMilagre: "Dove dice la Bibbia che Gesù {x}?",
    oQueMilagre: "Che cosa ha fatto Gesù {x}?",
    evangelhoMilagre: "In quale Vangelo si trova il miracolo in cui Gesù {x}?",
    ensino: "Che cosa insegna la parabola «{x}»?",
    qualParabola: "Quale parabola insegna che {x}?",
    evangelhoParabola: "In quale Vangelo si trova la parabola «{x}»?",
    versiculoLivro: "In quale libro è scritto: «{x}»?",
    complete: "Completa: «{x} ...»",
    disse: "Chi ha detto: «{x}»?",
    porqueP: "{nome} {feito}. La storia è nel libro di {livro}.",
    porqueL: "{livro} è del gruppo {grupo} e ha {cap} capitoli.",
    porqueLA: "{livro} è del gruppo {grupo}, ha {cap} capitoli, e la tradizione lo attribuisce a {autor}.",
    porqueG: "{lugar}: {evento}. È nel libro di {livro}.",
    porqueM: "Gesù {obra} {lugar}. Il miracolo è nel Vangelo di {evangelho}.",
    porqueB: "La parabola {parabola} insegna che {ensina}. È nel Vangelo di {evangelho}.",
    porqueV: "«{verso}» — libro di {livro}.",
    porqueC: "L'ha detto {quem}: «{fala}».",
  },
};

const idioma = lang => (FRASES[lang] ? lang : "en");
const tx = (lang, chave, x) => FRASES[idioma(lang)][chave].replace("{x}", x);
const nome = (obj, lang) => obj[idioma(lang)] ?? obj.en;

/* tx() só troca {x}. O porquê tem vários campos, então vai por aqui. */
const porq = (lang, chave, campos) =>
  Object.entries(campos).reduce((f, [k, v]) => f.split(`{${k}}`).join(v), FRASES[idioma(lang)][chave]);
const maiuscula = s => s.charAt(0).toUpperCase() + s.slice(1);

/* Escolhe 3 erradas distintas da resposta certa, sem repetir. */
function erradas(pool, certa, quantas = 3) {
  const unicas = [...new Set(pool)].filter(x => x && x !== certa);
  const out = [];
  for (let i = unicas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unicas[i], unicas[j]] = [unicas[j], unicas[i]];
  }
  for (const x of unicas) { if (out.length >= quantas) break; out.push(x); }
  return out.length === quantas ? out : null;   // sem alternativas, sem pergunta
}

/* Dificuldade de cada livro: quanto mais conhecido, mais cedo ele aparece. */
const LIVROS_FAMOSOS = new Set(["Gênesis", "Êxodo", "Salmos", "Provérbios", "Isaías",
  "Mateus", "Marcos", "Lucas", "João", "Atos", "Apocalipse"]);
const nivelLivro = l => LIVROS_FAMOSOS.has(l.pt) ? 2
  : (l.g === "menores" || l.g === "paulo" || l.g === "gerais") ? 4 : 3;

/* Números plausíveis para as alternativas de uma pergunta numérica. */
function numerosProximos(r, todos) {
  const cand = [r * 2, Math.round(r / 2), r + 1, r - 1, r + 3, r - 3, r + 10, r - 10,
    r + 7, ...todos].filter(x => Number.isFinite(x) && x > 0 && x !== r);
  return erradas(cand.map(String), String(r));
}

/* Constrói TODAS as perguntas de um idioma. Roda uma vez e fica em cache. */
function construir(lang) {
  const qs = [];
  const add = (n, pergunta, certa, erradas3, porque) => {
    if (!erradas3) return;
    qs.push({ n, q: [pergunta, certa, erradas3, porque] });
  };

  /* ---------- os 66 livros ---------- */
  const nomesLivros = LIVROS.map(l => nome(l, lang));
  const capsUnicos = new Map();
  for (const l of LIVROS) capsUnicos.set(l.cap, (capsUnicos.get(l.cap) || 0) + 1);

  LIVROS.forEach((l, i) => {
    const nv = nivelLivro(l);
    const nl = nome(l, lang);
    // O cartão de identidade do livro, o mesmo nas seis perguntas dele.
    const ficha = porq(lang, l.autor ? "porqueLA" : "porqueL", {
      livro: nl, grupo: nome(GRUPOS_BIBLIA[l.g], lang), cap: String(l.cap),
      autor: l.autor ? nome(AUTORES[l.autor], lang) : "",
    });

    add(nv, tx(lang, "capitulos", nl), String(l.cap),
      erradas(LIVROS.map(x => String(x.cap)), String(l.cap)), ficha);

    // Só quando o número de capítulos é único na Bíblia inteira: senão a
    // pergunta teria mais de uma resposta certa.
    if (capsUnicos.get(l.cap) === 1)
      add(Math.min(4, nv + 1), tx(lang, "qualLivroCap", String(l.cap)), nl, erradas(nomesLivros, nl), ficha);

    add(nv, tx(lang, "grupo", nl), nome(GRUPOS_BIBLIA[l.g], lang),
      erradas(Object.values(GRUPOS_BIBLIA).map(g => nome(g, lang)), nome(GRUPOS_BIBLIA[l.g], lang)), ficha);

    // Vizinhança na Bíblia não tem "porquê": a ordem é a ordem. A frase
    // montada da própria pergunta já diz tudo o que há para dizer.
    if (i < LIVROS.length - 1) {
      const prox = nome(LIVROS[i + 1], lang);
      add(Math.min(4, nv + 1), tx(lang, "depois", nl), prox, erradas(nomesLivros, prox));
    }
    if (i > 0) {
      const ant = nome(LIVROS[i - 1], lang);
      add(Math.min(4, nv + 1), tx(lang, "antes", nl), ant, erradas(nomesLivros, ant));
    }
    if (l.autor) {
      const a = nome(AUTORES[l.autor], lang);
      add(nv, tx(lang, "autor", nl), a,
        erradas(Object.values(AUTORES).map(x => nome(x, lang)), a), ficha);
    }
  });

  /* ---------- gente ---------- */
  // A conta de repetidos é feita NO IDIOMA da vez: "Miriã" e "Maria" são
  // nomes diferentes em português e viram as duas "María" em espanhol.
  const contagemNomes = new Map();
  for (const p of PERSONAGENS) {
    const k = nome(p.nome, lang);
    contagemNomes.set(k, (contagemNomes.get(k) || 0) + 1);
  }
  const todosNomes = PERSONAGENS.map(p => nome(p.nome, lang));
  const todosFeitos = PERSONAGENS.map(p => maiuscula(nome(p.feito, lang)));
  const todosPapeis = Object.values(PAPEIS).map(x => nome(x, lang));
  const livroPt = new Map(LIVROS.map(l => [l.pt, l]));

  for (const p of PERSONAGENS) {
    const pn = nome(p.nome, lang);
    const unico = contagemNomes.get(pn) === 1;
    const lv = livroPt.get(p.livro);
    // Uma frase só, usada nas quatro perguntas da pessoa: quem foi, o que fez
    // e onde está a história. É isto que a criança lê quando erra.
    const porque = lv
      ? FRASES[idioma(lang)].porqueP
          .replace("{nome}", pn)
          .replace("{feito}", nome(p.feito, lang))
          .replace("{livro}", nome(lv, lang))
      : undefined;

    // O feito é sempre único, então esta pergunta vale mesmo para nomes repetidos.
    add(p.n, tx(lang, "quem", nome(p.feito, lang)), pn, erradas(todosNomes, pn), porque);

    if (!unico) continue;      // daqui para baixo o nome tem que identificar a pessoa

    const feito = maiuscula(nome(p.feito, lang));
    add(Math.min(4, p.n + 1), tx(lang, "oQueFez", pn), feito, erradas(todosFeitos, feito), porque);

    if (lv) {
      const ln = nome(lv, lang);
      add(Math.min(4, p.n + 1), tx(lang, "livroDe", pn), ln, erradas(nomesLivros, ln), porque);
    }
    const pap = nome(PAPEIS[p.papel], lang);
    add(p.n, tx(lang, "papel", pn), pap, erradas(todosPapeis, pap), porque);
  }

  const paisPool = PARENTESCO.map(x => x[4 + (idioma(lang) === "pt" ? 0 : idioma(lang) === "en" ? 1 : 2)]);
  for (const [n, fpt, fen, fes, ppt, pen, pes] of PARENTESCO) {
    const filho = idioma(lang) === "pt" ? fpt : idioma(lang) === "en" ? fen : fes;
    const pai = idioma(lang) === "pt" ? ppt : idioma(lang) === "en" ? pen : pes;
    add(n, tx(lang, "pai", filho), pai, erradas(paisPool, pai));
  }
  const maesPool = MAES.map(x => x[4 + (idioma(lang) === "pt" ? 0 : idioma(lang) === "en" ? 1 : 2)]);
  for (const [n, fpt, fen, fes, mpt, men, mes] of MAES) {
    const filho = idioma(lang) === "pt" ? fpt : idioma(lang) === "en" ? fen : fes;
    const mae = idioma(lang) === "pt" ? mpt : idioma(lang) === "en" ? men : mes;
    add(n, tx(lang, "mae", filho), mae, erradas(maesPool, mae));
  }

  /* ---------- lugares ---------- */
  const contagemLugares = new Map();
  for (const g of LUGARES) {
    const k = nome(g.lugar, lang);
    contagemLugares.set(k, (contagemLugares.get(k) || 0) + 1);
  }
  const todosLugares = LUGARES.map(g => nome(g.lugar, lang));
  const todosEventos = LUGARES.map(g => maiuscula(nome(g.evento, lang)));

  for (const g of LUGARES) {
    const lg = nome(g.lugar, lang);
    const lv = livroPt.get(g.livro);
    const porqueLugar = lv ? porq(lang, "porqueG", {
      lugar: maiuscula(lg), evento: nome(g.evento, lang), livro: nome(lv, lang),
    }) : undefined;

    add(g.n, tx(lang, "onde", nome(g.evento, lang)), lg, erradas(todosLugares, lg), porqueLugar);
    if (contagemLugares.get(lg) !== 1) continue;
    const ev = maiuscula(nome(g.evento, lang));
    add(Math.min(4, g.n + 1), tx(lang, "oQueAconteceu", lg), ev, erradas(todosEventos, ev), porqueLugar);
    if (lv) {
      const ln = nome(lv, lang);
      add(Math.min(4, g.n + 1), tx(lang, "livroLugar", lg), ln, erradas(nomesLivros, ln), porqueLugar);
    }
  }

  /* ---------- milagres ---------- */
  const lugaresMilagre = MILAGRES.map(m => nome(m.lugar, lang));
  const obrasMilagre = MILAGRES.map(m => maiuscula(nome(m.obra, lang)));
  const evangelhos = ["Mateus", "Marcos", "Lucas", "João"].map(x => nome(livroPt.get(x), lang));
  for (const m of MILAGRES) {
    const lg = nome(m.lugar, lang);
    const ev = nome(livroPt.get(m.evangelho), lang);
    const porqueMilagre = porq(lang, "porqueM", {
      obra: nome(m.obra, lang), lugar: lg, evangelho: ev,
    });

    add(m.n, tx(lang, "ondeMilagre", nome(m.obra, lang)), lg, erradas(lugaresMilagre, lg), porqueMilagre);
    const ob = maiuscula(nome(m.obra, lang));
    add(m.n, tx(lang, "oQueMilagre", lg), ob, erradas(obrasMilagre, ob), porqueMilagre);
    add(Math.min(4, m.n + 1), tx(lang, "evangelhoMilagre", nome(m.obra, lang)), ev, erradas(evangelhos, ev), porqueMilagre);
  }

  /* ---------- parábolas ---------- */
  const nomesParabolas = PARABOLAS.map(b => nome(b.nome, lang));
  const ensinos = PARABOLAS.map(b => maiuscula(nome(b.ensina, lang)));
  for (const b of PARABOLAS) {
    const nm = nome(b.nome, lang);
    const en = maiuscula(nome(b.ensina, lang));
    const ev = nome(livroPt.get(b.evangelho), lang);
    const porqueParabola = porq(lang, "porqueB", {
      parabola: nm, ensina: nome(b.ensina, lang), evangelho: ev,
    });

    add(b.n, tx(lang, "ensino", nm), en, erradas(ensinos, en), porqueParabola);
    add(b.n, tx(lang, "qualParabola", nome(b.ensina, lang)), nm, erradas(nomesParabolas, nm), porqueParabola);
    add(Math.min(4, b.n + 1), tx(lang, "evangelhoParabola", nm), ev, erradas(evangelhos, ev), porqueParabola);
  }

  /* ---------- versículos ---------- */
  const finais = VERSICULOS.map(v => nome(v.fim, lang));
  for (const v of VERSICULOS) {
    const ini = nome(v.ini, lang), fim = nome(v.fim, lang);
    const lv = livroPt.get(v.livro);
    const porqueVerso = lv ? porq(lang, "porqueV", {
      verso: `${ini} ${fim}`, livro: nome(lv, lang),
    }) : undefined;

    if (lv) {
      const ln = nome(lv, lang);
      add(v.n, tx(lang, "versiculoLivro", `${ini} ${fim}`), ln, erradas(nomesLivros, ln), porqueVerso);
    }
    add(Math.min(4, v.n + 1), tx(lang, "complete", ini), fim, erradas(finais, fim), porqueVerso);
  }

  /* ---------- falas ---------- */
  const porNomePt = new Map(PERSONAGENS.map(p => [p.nome.pt, p]));
  for (const c of CITACOES) {
    const p = porNomePt.get(c.quem);
    if (!p) continue;                       // nome errado não vira pergunta
    const pn = nome(p.nome, lang);
    add(c.n, tx(lang, "disse", nome(c.fala, lang)), pn, erradas(todosNomes, pn),
      porq(lang, "porqueC", { quem: pn, fala: nome(c.fala, lang) }));
  }

  /* ---------- números ---------- */
  const todosNumeros = NUMEROS.map(x => x.r);
  for (const x of NUMEROS) add(x.n, nome(x.q, lang), String(x.r), numerosProximos(x.r, todosNumeros));

  /* ---------- listas fechadas ---------- */
  for (const chave of Object.keys(LISTAS_BIBLIA)) {
    const { pergunta, itens } = LISTAS_BIBLIA[chave];
    const todos = itens.map(i => nome(i, lang));
    itens.forEach((item, i) => {
      const certa = nome(item, lang);
      add(i < 3 ? 3 : 4, nome(pergunta, lang).replace("{n}", String(i + 1)), certa, erradas(todos, certa));
    });
  }

  /* ---------- fatos escritos à mão ---------- */
  for (const f of FATOS)
    add(f.n, nome(f.q, lang), nome(f.a, lang), f.d.map(d => nome(d, lang)));

  return qs;
}

/* Uma pergunta idêntica em texto não deve entrar duas vezes no banco. */
function semRepetir(qs) {
  const vistas = new Set();
  return qs.filter(x => {
    const chave = x.q[0] + "|" + x.q[1];
    if (vistas.has(chave)) return false;
    vistas.add(chave);
    return true;
  });
}

const cache = new Map();
export function todasPerguntasBiblia(lang) {
  const k = idioma(lang);
  if (!cache.has(k)) cache.set(k, semRepetir(construir(k)));
  return cache.get(k);
}

/* As faixas se sobrepõem: a criança revê o que já sabe enquanto encontra o
   que não sabe. */
const BIBLIA_NIVEL = {
  easy: [1, 2], medium: [2], hard: [2, 3], genius: [3, 4],
  mestre: [4], lenda: [4],
};

export function bancoBiblia(lang, band) {
  const niveis = BIBLIA_NIVEL[band] || BIBLIA_NIVEL.easy;
  const banco = todasPerguntasBiblia(lang).filter(x => niveis.includes(x.n)).map(x => x.q);
  return banco.length >= 4 ? banco : todasPerguntasBiblia(lang).map(x => x.q);
}
