/**
 * KidsGameHub — o banco de palavras da alfabetização
 * ElCamargo Soluções em TI LTDA
 *
 * Só dados: nenhuma lógica de jogo, nenhum componente.
 *
 * Cada palavra traz:
 *   e — a figura, que é como a criança que ainda não lê reconhece a palavra
 *   w — a palavra escrita
 *   s — as SÍLABAS, separadas à mão
 *   n — o degrau, de 1 (duas sílabas simples) a 4 (quatro sílabas ou encontros)
 *   r — a rima, quando existe outra palavra aqui que rime com ela
 *
 * POR QUE À MÃO, E NÃO POR ALGORITMO: separar sílaba em português tem regra
 * cheia de exceção — dígrafo que não separa (ch, lh, nh, qu, gu), dígrafo que
 * separa (rr, ss, sc), encontro com l e r que fica junto (bra, plu), ditongo
 * que não parte e hiato que parte. Um algoritmo erra baixinho, e aqui um erro
 * baixinho é uma criança aprendendo a separar errado. Escrito à mão, cada
 * linha é conferível — e o teste garante que as sílabas remontam a palavra.
 *
 * A rima é o pedaço final que soa igual, da vogal tônica em diante. Só existe
 * quando há par: rima sem parceira não vira pergunta.
 */
export const PALAVRAS = [
  /* ---------- 1: duas sílabas simples ---------- */
  { e: "⚽", w: "bola", s: ["bo", "la"], n: 1, r: "ola" },
  { e: "🏠", w: "casa", s: ["ca", "sa"], n: 1, r: "asa" },
  { e: "🎲", w: "dado", s: ["da", "do"], n: 1 },
  { e: "🧚", w: "fada", s: ["fa", "da"], n: 1, r: "ada" },
  { e: "🐱", w: "gato", s: ["ga", "to"], n: 1, r: "ato" },
  { e: "🎒", w: "mala", s: ["ma", "la"], n: 1 },
  { e: "🪑", w: "mesa", s: ["me", "sa"], n: 1 },
  { e: "🦆", w: "pato", s: ["pa", "to"], n: 1, r: "ato" },
  { e: "🐀", w: "rato", s: ["ra", "to"], n: 1, r: "ato" },
  { e: "🐸", w: "sapo", s: ["sa", "po"], n: 1 },
  { e: "🐄", w: "vaca", s: ["va", "ca"], n: 1, r: "aca" },
  { e: "🔪", w: "faca", s: ["fa", "ca"], n: 1, r: "aca" },
  { e: "☝️", w: "dedo", s: ["de", "do"], n: 1, r: "edo" },
  { e: "🎀", w: "fita", s: ["fi", "ta"], n: 1 },
  { e: "🛵", w: "moto", s: ["mo", "to"], n: 1 },
  { e: "🪁", w: "pipa", s: ["pi", "pa"], n: 1 },
  { e: "🔔", w: "sino", s: ["si", "no"], n: 1, r: "ino" },
  { e: "🎂", w: "bolo", s: ["bo", "lo"], n: 1 },
  { e: "🔥", w: "fogo", s: ["fo", "go"], n: 1, r: "ogo" },
  { e: "🎮", w: "jogo", s: ["jo", "go"], n: 1, r: "ogo" },
  { e: "💧", w: "gota", s: ["go", "ta"], n: 1, r: "ota" },
  { e: "🥾", w: "bota", s: ["bo", "ta"], n: 1, r: "ota" },
  { e: "🐓", w: "galo", s: ["ga", "lo"], n: 1 },
  { e: "🌹", w: "rosa", s: ["ro", "sa"], n: 1 },
  { e: "🛋️", w: "sofá", s: ["so", "fá"], n: 1 },
  { e: "👶", w: "bebê", s: ["be", "bê"], n: 1 },
  { e: "🦡", w: "tatu", s: ["ta", "tu"], n: 1 },
  { e: "🍇", w: "uva", s: ["u", "va"], n: 1, r: "uva" },
  { e: "🧤", w: "luva", s: ["lu", "va"], n: 1, r: "uva" },
  { e: "🌛", w: "lua", s: ["lu", "a"], n: 1 },
  { e: "🪶", w: "asa", s: ["a", "sa"], n: 1, r: "asa" },
  { e: "🧊", w: "gelo", s: ["ge", "lo"], n: 1, r: "elo" },
  { e: "🕯️", w: "vela", s: ["ve", "la"], n: 1, r: "ela" },
  { e: "🛏️", w: "cama", s: ["ca", "ma"], n: 1 },
  { e: "🧃", w: "suco", s: ["su", "co"], n: 1 },
  { e: "🥫", w: "lata", s: ["la", "ta"], n: 1, r: "ata" },
  { e: "🐺", w: "lobo", s: ["lo", "bo"], n: 1 },

  /* ---------- 2: duas ou três sílabas, com ditongo, nasal ou encontro ---------- */
  { e: "🚪", w: "porta", s: ["por", "ta"], n: 2 },
  { e: "🐍", w: "cobra", s: ["co", "bra"], n: 2 },
  { e: "🍽️", w: "prato", s: ["pra", "to"], n: 2, r: "ato" },
  { e: "🚗", w: "carro", s: ["car", "ro"], n: 2 },
  { e: "🐷", w: "porco", s: ["por", "co"], n: 2 },
  { e: "🐻", w: "urso", s: ["ur", "so"], n: 2 },
  { e: "🦴", w: "osso", s: ["os", "so"], n: 2 },
  { e: "🪣", w: "balde", s: ["bal", "de"], n: 2 },
  { e: "🥛", w: "leite", s: ["lei", "te"], n: 2 },
  { e: "🧦", w: "meia", s: ["mei", "a"], n: 2 },
  { e: "🐟", w: "peixe", s: ["pei", "xe"], n: 2 },
  { e: "🎁", w: "caixa", s: ["cai", "xa"], n: 2 },
  { e: "🧀", w: "queijo", s: ["quei", "jo"], n: 2 },
  { e: "🦁", w: "leão", s: ["le", "ão"], n: 2, r: "ão" },
  { e: "🍋", w: "limão", s: ["li", "mão"], n: 2, r: "ão" },
  { e: "🍎", w: "maçã", s: ["ma", "çã"], n: 2 },
  { e: "🥁", w: "tambor", s: ["tam", "bor"], n: 2 },
  { e: "🪺", w: "ninho", s: ["ni", "nho"], n: 2 },
  { e: "🌽", w: "milho", s: ["mi", "lho"], n: 2 },
  { e: "🍌", w: "banana", s: ["ba", "na", "na"], n: 2 },
  { e: "🐒", w: "macaco", s: ["ma", "ca", "co"], n: 2 },
  { e: "🐴", w: "cavalo", s: ["ca", "va", "lo"], n: 2 },
  { e: "🪟", w: "janela", s: ["ja", "ne", "la"], n: 2, r: "ela" },
  { e: "🍳", w: "panela", s: ["pa", "ne", "la"], n: 2, r: "ela" },
  { e: "🍅", w: "tomate", s: ["to", "ma", "te"], n: 2, r: "ate" },
  { e: "👞", w: "sapato", s: ["sa", "pa", "to"], n: 2, r: "ato" },
  { e: "🧸", w: "boneca", s: ["bo", "ne", "ca"], n: 2 },
  { e: "💇", w: "cabelo", s: ["ca", "be", "lo"], n: 2, r: "elo" },
  { e: "🧅", w: "cebola", s: ["ce", "bo", "la"], n: 2, r: "ola" },
  { e: "🛍️", w: "sacola", s: ["sa", "co", "la"], n: 2, r: "ola" },
  { e: "🥔", w: "batata", s: ["ba", "ta", "ta"], n: 2, r: "ata" },
  { e: "👦", w: "menino", s: ["me", "ni", "no"], n: 2, r: "ino" },

  /* ---------- 3: três sílabas, com dígrafo ou encontro ---------- */
  { e: "🐝", w: "abelha", s: ["a", "be", "lha"], n: 3, r: "elha" },
  { e: "🐑", w: "ovelha", s: ["o", "ve", "lha"], n: 3, r: "elha" },
  { e: "🦒", w: "girafa", s: ["gi", "ra", "fa"], n: 3 },
  { e: "🐕", w: "cachorro", s: ["ca", "chor", "ro"], n: 3 },
  { e: "🐛", w: "lagarta", s: ["la", "gar", "ta"], n: 3 },
  { e: "🗡️", w: "espada", s: ["es", "pa", "da"], n: 3, r: "ada" },
  { e: "🏫", w: "escola", s: ["es", "co", "la"], n: 3, r: "ola" },
  { e: "⭐", w: "estrela", s: ["es", "tre", "la"], n: 3, r: "ela" },
  { e: "🪞", w: "espelho", s: ["es", "pe", "lho"], n: 3 },
  { e: "🐐", w: "cabrito", s: ["ca", "bri", "to"], n: 3, r: "ito" },
  { e: "🍢", w: "palito", s: ["pa", "li", "to"], n: 3, r: "ito" },
  { e: "🥕", w: "cenoura", s: ["ce", "nou", "ra"], n: 3, r: "oura" },
  { e: "🧹", w: "vassoura", s: ["vas", "sou", "ra"], n: 3, r: "oura" },
  { e: "🌻", w: "girassol", s: ["gi", "ras", "sol"], n: 3 },
  { e: "🌰", w: "castanha", s: ["cas", "ta", "nha"], n: 3 },
  { e: "🐜", w: "formiga", s: ["for", "mi", "ga"], n: 3 },
  { e: "🪴", w: "planta", s: ["plan", "ta"], n: 3 },
  { e: "🪵", w: "tronco", s: ["tron", "co"], n: 3 },
  { e: "🌵", w: "cacto", s: ["cac", "to"], n: 3 },
  { e: "🦜", w: "tucano", s: ["tu", "ca", "no"], n: 3, r: "ano" },
  { e: "🎹", w: "piano", s: ["pi", "a", "no"], n: 3, r: "ano" },
  { e: "🍒", w: "cereja", s: ["ce", "re", "ja"], n: 3 },

  /* ---------- 4: quatro sílabas ---------- */
  { e: "🦋", w: "borboleta", s: ["bor", "bo", "le", "ta"], n: 4, r: "eta" },
  { e: "🚲", w: "bicicleta", s: ["bi", "ci", "cle", "ta"], n: 4, r: "eta" },
  { e: "🐘", w: "elefante", s: ["e", "le", "fan", "te"], n: 4 },
  { e: "🐦", w: "pássaro", s: ["pás", "sa", "ro"], n: 4 },
  { e: "🍉", w: "melancia", s: ["me", "lan", "ci", "a"], n: 4 },
  { e: "🍫", w: "chocolate", s: ["cho", "co", "la", "te"], n: 4, r: "ate" },
  { e: "🐢", w: "tartaruga", s: ["tar", "ta", "ru", "ga"], n: 4 },
  { e: "🪀", w: "brinquedo", s: ["brin", "que", "do"], n: 4, r: "edo" },
  { e: "🦩", w: "flamingo", s: ["fla", "min", "go"], n: 4 },
  { e: "🚁", w: "helicóptero", s: ["he", "li", "cóp", "te", "ro"], n: 4 },
  { e: "🦕", w: "dinossauro", s: ["di", "nos", "sau", "ro"], n: 4 },
  { e: "🐊", w: "crocodilo", s: ["cro", "co", "di", "lo"], n: 4 },
  { e: "🍍", w: "abacaxi", s: ["a", "ba", "ca", "xi"], n: 4 },
];

/* Os dígrafos que nunca se separam. Entram no jogo da letra inicial como
   exceção: a criança que vê "chave" e ouve /ʃ/ não deve procurar o C. */
export const DIGRAFOS_INICIAIS = ["ch", "lh", "nh", "qu", "gu"];

/* As letras que o jogo da letra inicial oferece como alternativa errada. K, W
   e Y ficam de fora: não começam palavra nenhuma deste banco. */
export const ALFABETO = "abcdefghijlmnopqrstuvxz".split("");
