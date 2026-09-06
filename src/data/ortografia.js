/**
 * KidsGameHub — a ortografia que o caderno cobra
 * ElCamargo Soluções em TI LTDA
 *
 * Só dados: nenhuma lógica de jogo, nenhum componente.
 *
 * É onde o caderno leva vermelho: ç ou ss, s ou z, g ou j, m antes de p e b,
 * r ou rr, x ou ch. Quase tudo é regra fechada — e o que não é, é decoreba, e
 * a explicação diz isso com todas as letras em vez de inventar uma regra.
 *
 * DUAS DECISÕES QUE MUDAM O JOGO:
 *
 * 1. **A palavra nunca aparece escrita errado.** O exercício clássico de
 *    prova mostra "casa / caza / caça / cassa" e manda escolher — e a criança
 *    passa metade do tempo olhando grafia errada, que é o que ela vai copiar
 *    depois. Aqui aparece a palavra com uma LACUNA (ca__a) e as alternativas
 *    são só os pedaços. Nada errado entra pelo olho.
 *
 * 2. **Toda palavra tem figura, e isso não é enfeite.** "ca__a" pode virar
 *    casa e pode virar caça: as duas existem. É a figura 🏠 que diz qual é a
 *    palavra — e é ela que faz a pergunta ter uma resposta só. Palavra sem
 *    figura não entra neste banco.
 *
 * Cada item traz:
 *   e  — a figura, obrigatória (ver acima)
 *   w  — a palavra inteira, para a voz dizer e para o teste conferir
 *   a  — o pedaço antes da lacuna
 *   c  — o pedaço CERTO, que preenche a lacuna
 *   d  — o pedaço depois da lacuna
 *   o  — as quatro alternativas, incluindo a certa
 *   r  — a regra, que é o que a criança leva quando erra
 *   n  — o degrau, de 1 (m antes de p/b, dígrafos) a 4 (x ou ch, sem regra)
 */
export const ORTOGRAFIA = [
  /* ---------- 1: antes de P e B vem M, e os dígrafos ---------- */
  { e: "💣", w: "bomba", a: "bo", c: "m", d: "ba", o: ["m", "n", "nh", "ch"], n: 1, r: "Antes de P e B sempre vem M: bomba." },
  { e: "🥁", w: "tambor", a: "ta", c: "m", d: "bor", o: ["m", "n", "nh", "lh"], n: 1, r: "Antes de P e B sempre vem M: tambor." },
  { e: "🕊️", w: "pomba", a: "po", c: "m", d: "ba", o: ["m", "n", "nh", "ch"], n: 1, r: "Antes de P e B sempre vem M: pomba." },
  { e: "⛺", w: "campo", a: "ca", c: "m", d: "po", o: ["m", "n", "nh", "lh"], n: 1, r: "Antes de P e B sempre vem M: campo." },
  { e: "🔔", w: "campainha", a: "ca", c: "m", d: "painha", o: ["m", "n", "nh", "ch"], n: 1, r: "Antes de P e B sempre vem M: campainha." },
  { e: "🍫", w: "bombom", a: "bo", c: "m", d: "bom", o: ["m", "n", "nh", "lh"], n: 1, r: "Antes de P e B sempre vem M: bombom." },
  { e: "🌽", w: "milho", a: "mi", c: "lh", d: "o", o: ["lh", "nh", "ch", "li"], n: 1, r: "LH é um som só, o de milho e de olho." },
  { e: "🪺", w: "ninho", a: "ni", c: "nh", d: "o", o: ["nh", "lh", "ch", "ni"], n: 1, r: "NH é um som só, o de ninho e de banho." },
  { e: "🐔", w: "galinha", a: "gali", c: "nh", d: "a", o: ["nh", "lh", "ch", "n"], n: 1, r: "NH é um som só, o de galinha e de sonho." },
  { e: "👂", w: "orelha", a: "ore", c: "lh", d: "a", o: ["lh", "nh", "ch", "l"], n: 1, r: "LH é um som só, o de orelha e de folha." },
  { e: "🔑", w: "chave", a: "", c: "ch", d: "ave", o: ["ch", "lh", "nh", "x"], n: 1, r: "CH é um som só, o de chave e de chuva." },
  { e: "🌧️", w: "chuva", a: "", c: "ch", d: "uva", o: ["ch", "nh", "lh", "x"], n: 1, r: "CH é um som só, o de chuva e de chão." },
  { e: "🎩", w: "chapéu", a: "", c: "ch", d: "apéu", o: ["ch", "lh", "nh", "x"], n: 1, r: "CH é um som só, o de chapéu e de chave." },
  { e: "🛁", w: "banho", a: "ba", c: "nh", d: "o", o: ["nh", "lh", "ch", "n"], n: 1, r: "NH é um som só, o de banho e de ninho." },
  { e: "🥄", w: "colher", a: "co", c: "lh", d: "er", o: ["lh", "nh", "ch", "l"], n: 1, r: "LH é um som só, o de colher e de milho." },
  { e: "🐛", w: "bicho", a: "bi", c: "ch", d: "o", o: ["ch", "lh", "nh", "x"], n: 1, r: "CH é um som só, o de bicho e de chave." },

  /* ---------- 2: o Ç, o SS entre vogais, e o U mudo do QU e do GU ---------- */
  { e: "🍎", w: "maçã", a: "ma", c: "ç", d: "ã", o: ["ç", "ss", "s", "c"], n: 2, r: "O Ç só aparece antes de A, O e U: maçã." },
  { e: "🎀", w: "laço", a: "la", c: "ç", d: "o", o: ["ç", "ss", "s", "c"], n: 2, r: "O Ç só aparece antes de A, O e U: laço." },
  { e: "🕳️", w: "poço", a: "po", c: "ç", d: "o", o: ["ç", "ss", "s", "c"], n: 2, r: "O Ç só aparece antes de A, O e U: poço." },
  { e: "🍬", w: "açúcar", a: "a", c: "ç", d: "úcar", o: ["ç", "ss", "s", "c"], n: 2, r: "O Ç só aparece antes de A, O e U: açúcar." },
  { e: "🦒", w: "pescoço", a: "pesco", c: "ç", d: "o", o: ["ç", "ss", "s", "c"], n: 2, r: "O Ç só aparece antes de A, O e U: pescoço." },
  { e: "🍽️", w: "louça", a: "lou", c: "ç", d: "a", o: ["ç", "ss", "s", "c"], n: 2, r: "O Ç só aparece antes de A, O e U: louça." },
  { e: "🐦", w: "pássaro", a: "pá", c: "ss", d: "aro", o: ["ss", "s", "ç", "c"], n: 2, r: "Entre duas vogais, o som forte de S se escreve SS: pássaro." },
  { e: "🧹", w: "vassoura", a: "va", c: "ss", d: "oura", o: ["ss", "s", "ç", "c"], n: 2, r: "Entre duas vogais, o som forte de S se escreve SS: vassoura." },
  { e: "🌻", w: "girassol", a: "gira", c: "ss", d: "ol", o: ["ss", "s", "ç", "c"], n: 2, r: "Entre duas vogais, o som forte de S se escreve SS: girassol." },
  { e: "🍝", w: "massa", a: "ma", c: "ss", d: "a", o: ["ss", "s", "ç", "c"], n: 2, r: "Entre duas vogais, o som forte de S se escreve SS: massa." },
  { e: "🧀", w: "queijo", a: "", c: "qu", d: "eijo", o: ["qu", "c", "k", "gu"], n: 2, r: "Antes de E e I, o som de K se escreve QU, e o U não soa: queijo." },
  { e: "🖼️", w: "quadro", a: "", c: "qu", d: "adro", o: ["qu", "c", "k", "gu"], n: 2, r: "Aqui o U do QU soa: quadro." },
  { e: "🐿️", w: "esquilo", a: "es", c: "qu", d: "ilo", o: ["qu", "c", "k", "gu"], n: 2, r: "Antes de E e I, o som de K se escreve QU: esquilo." },
  { e: "🎸", w: "guitarra", a: "", c: "gu", d: "itarra", o: ["gu", "g", "j", "qu"], n: 2, r: "Antes de E e I, o som de G duro pede o U mudo: guitarra." },
  { e: "🚀", w: "foguete", a: "fo", c: "gu", d: "ete", o: ["gu", "g", "j", "qu"], n: 2, r: "Antes de E e I, o som de G duro pede o U mudo: foguete." },
  { e: "🎉", w: "guirlanda", a: "", c: "gu", d: "irlanda", o: ["gu", "g", "j", "qu"], n: 2, r: "Antes de E e I, o som de G duro pede o U mudo: guirlanda." },

  /* ---------- 3: o S que soa Z, o RR entre vogais, e o G e o J ---------- */
  { e: "🏠", w: "casa", a: "ca", c: "s", d: "a", o: ["s", "z", "ss", "ç"], n: 3, r: "Entre vogais, o S soa como Z, mas continua S: casa." },
  { e: "🌹", w: "rosa", a: "ro", c: "s", d: "a", o: ["s", "z", "ss", "ç"], n: 3, r: "Entre vogais, o S soa como Z, mas continua S: rosa." },
  { e: "👕", w: "camisa", a: "cami", c: "s", d: "a", o: ["s", "z", "ss", "ç"], n: 3, r: "Entre vogais, o S soa como Z, mas continua S: camisa." },
  { e: "👚", w: "blusa", a: "blu", c: "s", d: "a", o: ["s", "z", "ss", "ç"], n: 3, r: "Entre vogais, o S soa como Z, mas continua S: blusa." },
  { e: "🔵", w: "azul", a: "a", c: "z", d: "ul", o: ["z", "s", "ss", "ç"], n: 3, r: "Aqui o som de Z se escreve com Z mesmo: azul." },
  { e: "📢", w: "buzina", a: "bu", c: "z", d: "ina", o: ["z", "s", "ss", "ç"], n: 3, r: "Aqui o som de Z se escreve com Z mesmo: buzina." },
  { e: "🍳", w: "cozinha", a: "co", c: "z", d: "inha", o: ["z", "s", "ss", "ç"], n: 3, r: "Aqui o som de Z se escreve com Z mesmo: cozinha." },
  { e: "🦓", w: "zebra", a: "", c: "z", d: "ebra", o: ["z", "s", "ss", "x"], n: 3, r: "No começo da palavra, este som é sempre Z: zebra." },
  { e: "🚗", w: "carro", a: "ca", c: "rr", d: "o", o: ["rr", "r", "l", "h"], n: 3, r: "Entre vogais, o R forte se escreve RR: carro." },
  { e: "🌍", w: "terra", a: "te", c: "rr", d: "a", o: ["rr", "r", "l", "h"], n: 3, r: "Entre vogais, o R forte se escreve RR: terra." },
  { e: "🐕", w: "cachorro", a: "cacho", c: "rr", d: "o", o: ["rr", "r", "l", "h"], n: 3, r: "Entre vogais, o R forte se escreve RR: cachorro." },
  { e: "🔩", w: "ferro", a: "fe", c: "rr", d: "o", o: ["rr", "r", "l", "h"], n: 3, r: "Entre vogais, o R forte se escreve RR: ferro." },
  { e: "🦒", w: "girafa", a: "", c: "g", d: "irafa", o: ["g", "j", "gu", "ch"], n: 3, r: "Antes de E e I, o G soa como J — e em girafa é com G." },
  { e: "🧊", w: "gelo", a: "", c: "g", d: "elo", o: ["g", "j", "gu", "ch"], n: 3, r: "Antes de E e I, o G soa como J — e em gelo é com G." },
  { e: "🪟", w: "janela", a: "", c: "j", d: "anela", o: ["j", "g", "ch", "x"], n: 3, r: "Antes de A, O e U este som é sempre J: janela." },
  { e: "🎲", w: "jogo", a: "", c: "j", d: "ogo", o: ["j", "g", "ch", "x"], n: 3, r: "Antes de A, O e U este som é sempre J: jogo." },

  /* ---------- 4: X ou CH, e o S que vale por dois ---------- */
  { e: "📦", w: "caixa", a: "cai", c: "x", d: "a", o: ["x", "ch", "s", "ss"], n: 4, r: "Depois de ditongo (ai, ei, ou) vem X: caixa." },
  { e: "🐟", w: "peixe", a: "pei", c: "x", d: "e", o: ["x", "ch", "s", "ss"], n: 4, r: "Depois de ditongo (ai, ei, ou) vem X: peixe." },
  { e: "🪆", w: "bruxa", a: "bru", c: "x", d: "a", o: ["x", "ch", "s", "ss"], n: 4, r: "Não há regra aqui: bruxa é com X, e esta se decora." },
  { e: "🗑️", w: "lixo", a: "li", c: "x", d: "o", o: ["x", "ch", "s", "ss"], n: 4, r: "Não há regra aqui: lixo é com X, e esta se decora." },
  { e: "🚕", w: "táxi", a: "tá", c: "x", d: "i", o: ["x", "ch", "s", "ss"], n: 4, r: "Não há regra aqui: táxi é com X, e esta se decora." },
  { e: "☕", w: "xícara", a: "", c: "x", d: "ícara", o: ["x", "ch", "s", "z"], n: 4, r: "Não há regra aqui: xícara é com X, e esta se decora." },
  { e: "🚿", w: "chuveiro", a: "", c: "ch", d: "uveiro", o: ["ch", "x", "s", "ss"], n: 4, r: "Não há regra aqui: chuveiro é com CH, e esta se decora." },
  { e: "🎒", w: "mochila", a: "mo", c: "ch", d: "ila", o: ["ch", "x", "s", "ss"], n: 4, r: "Não há regra aqui: mochila é com CH, e esta se decora." },
  { e: "🔒", w: "fechadura", a: "fe", c: "ch", d: "adura", o: ["ch", "x", "s", "ss"], n: 4, r: "Não há regra aqui: fechadura é com CH, e esta se decora." },
  { e: "🧣", w: "cachecol", a: "ca", c: "ch", d: "ecol", o: ["ch", "x", "s", "ss"], n: 4, r: "Não há regra aqui: cachecol é com CH, e esta se decora." },
  { e: "🍵", w: "chaleira", a: "", c: "ch", d: "aleira", o: ["ch", "x", "s", "ss"], n: 4, r: "Não há regra aqui: chaleira é com CH, e esta se decora." },
  { e: "🏊", w: "piscina", a: "pi", c: "sc", d: "ina", o: ["sc", "s", "ss", "c"], n: 4, r: "Aqui o som de S vem de SC, com o C mudo: piscina." },
  { e: "🧅", w: "cebola", a: "", c: "c", d: "ebola", o: ["c", "s", "ss", "ç"], n: 4, r: "Antes de E e I, o C soa como S — e em cebola é com C." },
  { e: "🎪", w: "circo", a: "", c: "c", d: "irco", o: ["c", "s", "ss", "ç"], n: 4, r: "Antes de E e I, o C soa como S — e em circo é com C." },
  { e: "🍈", w: "melancia", a: "melan", c: "c", d: "ia", o: ["c", "s", "ss", "ç"], n: 4, r: "Antes de E e I, o C soa como S — e em melancia é com C." },
  { e: "🚲", w: "bicicleta", a: "bi", c: "c", d: "icleta", o: ["c", "s", "ss", "ç"], n: 4, r: "Antes de E e I, o C soa como S — e em bicicleta é com C." },
];

/* Que degraus entram em cada faixa, como no resto do app. */
export const NIVEIS_DA_ORTOGRAFIA = {
  easy:   [1],
  medium: [1, 2],
  hard:   [2, 3],
  genius: [2, 3, 4],
  mestre: [3, 4],
  lenda:  [3, 4],
};
