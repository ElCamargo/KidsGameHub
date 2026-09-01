/**
 * KidsGameHub — Ciências dos Animais
 * ElCamargo Soluções em TI LTDA
 *
 * O quiz mostra o bicho e pergunta algo sobre ele. Em vez de escrever milhares
 * de perguntas à mão, guardamos os FATOS de cada animal e deixamos cinco moldes
 * gerarem as perguntas. 85 animais × 5 moldes já passa de 400 perguntas
 * diferentes, e acrescentar um bicho acrescenta cinco perguntas de uma vez.
 *
 * Só o vocabulário precisa de tradução (grupo, dieta, casa, nascimento): os
 * moldes montam a frase e o continente já vem traduzido do próprio app.
 *
 * O campo n é quanto o bicho é conhecido — 1 é o que toda criança reconhece,
 * 4 é o que aparece em documentário. `onde` fica null quando o animal vive em
 * continente demais para ter resposta única.
 */

export const GRUPOS = {
  mamifero: { pt: "Mamífero",  en: "Mammal",     es: "Mamífero" },
  ave:      { pt: "Ave",       en: "Bird",       es: "Ave" },
  reptil:   { pt: "Réptil",    en: "Reptile",    es: "Reptil" },
  peixe:    { pt: "Peixe",     en: "Fish",       es: "Pez" },
  anfibio:  { pt: "Anfíbio",   en: "Amphibian",  es: "Anfibio" },
  inseto:   { pt: "Inseto",    en: "Insect",     es: "Insecto" },
  aracnideo:{ pt: "Aracnídeo", en: "Arachnid",   es: "Arácnido" },
  molusco:  { pt: "Molusco",   en: "Mollusc",    es: "Molusco" },
  crustaceo:{ pt: "Crustáceo", en: "Crustacean", es: "Crustáceo" },
};

export const DIETAS = {
  carnivoro: { pt: "Só carne",        en: "Meat only",        es: "Solo carne" },
  herbivoro: { pt: "Só plantas",      en: "Plants only",      es: "Solo plantas" },
  onivoro:   { pt: "Plantas e carne", en: "Plants and meat",  es: "Plantas y carne" },
  nectar:    { pt: "Néctar e pólen",  en: "Nectar and pollen",es: "Néctar y polen" },
};

export const CASAS = {
  selva:    { pt: "Na floresta tropical", en: "In the rainforest",  es: "En la selva" },
  savana:   { pt: "Na savana",            en: "In the savanna",     es: "En la sabana" },
  oceano:   { pt: "No mar",               en: "In the sea",         es: "En el mar" },
  rio:      { pt: "Em rios e lagos",      en: "In rivers and lakes",es: "En ríos y lagos" },
  deserto:  { pt: "No deserto",           en: "In the desert",      es: "En el desierto" },
  gelo:     { pt: "No gelo",              en: "On the ice",         es: "En el hielo" },
  montanha: { pt: "Nas montanhas",        en: "In the mountains",   es: "En las montañas" },
  floresta: { pt: "Na mata fria",         en: "In cool woodlands",  es: "En el bosque frío" },
  fazenda:  { pt: "Na fazenda",           en: "On the farm",        es: "En la granja" },
  jardim:   { pt: "No jardim",            en: "In the garden",      es: "En el jardín" },
};

export const NASCE = {
  ovo:     { pt: "De um ovo",          en: "From an egg",         es: "De un huevo" },
  filhote: { pt: "Já nasce filhote",   en: "Born as a live baby", es: "Nace ya como cría" },
  casulo:  { pt: "Sai de um casulo",   en: "Comes out of a cocoon", es: "Sale de un capullo" },
  girino:  { pt: "Começa como girino", en: "Starts as a tadpole", es: "Empieza como renacuajo" },
};

/* n, emoji, grupo, dieta, casa, nascimento, continente natural (ou null) */
const b = (n, e, grupo, dieta, casa, nasce, onde) => ({ n, e, grupo, dieta, casa, nasce, onde });

export const ANIMAIS = [
  /* --- os que toda criança reconhece --- */
  b(1, "🐶", "mamifero", "onivoro",   "fazenda", "filhote", null),
  b(1, "🐱", "mamifero", "carnivoro", "jardim",  "filhote", null),
  b(1, "🐮", "mamifero", "herbivoro", "fazenda", "filhote", null),
  b(1, "🐷", "mamifero", "onivoro",   "fazenda", "filhote", null),
  b(1, "🐴", "mamifero", "herbivoro", "fazenda", "filhote", null),
  b(1, "🐑", "mamifero", "herbivoro", "fazenda", "filhote", null),
  b(1, "🐐", "mamifero", "herbivoro", "montanha","filhote", null),
  b(1, "🐔", "ave",      "onivoro",   "fazenda", "ovo",     null),
  b(1, "🦆", "ave",      "onivoro",   "rio",     "ovo",     null),
  b(1, "🐭", "mamifero", "onivoro",   "jardim",  "filhote", null),
  b(1, "🐰", "mamifero", "herbivoro", "jardim",  "filhote", null),
  b(1, "🦁", "mamifero", "carnivoro", "savana",  "filhote", "af"),
  b(1, "🐯", "mamifero", "carnivoro", "selva",   "filhote", "as"),
  b(1, "🐘", "mamifero", "herbivoro", "savana",  "filhote", "af"),
  b(1, "🦒", "mamifero", "herbivoro", "savana",  "filhote", "af"),
  b(1, "🦓", "mamifero", "herbivoro", "savana",  "filhote", "af"),
  b(1, "🐵", "mamifero", "onivoro",   "selva",   "filhote", null),
  b(1, "🐻", "mamifero", "onivoro",   "floresta","filhote", null),
  b(1, "🐼", "mamifero", "herbivoro", "montanha","filhote", "as"),
  b(1, "🐧", "ave",      "carnivoro", "gelo",    "ovo",     null),
  b(1, "🐟", "peixe",    "onivoro",   "rio",     "ovo",     null),
  b(1, "🐠", "peixe",    "onivoro",   "oceano",  "ovo",     null),
  b(1, "🐬", "mamifero", "carnivoro", "oceano",  "filhote", null),
  b(1, "🐳", "mamifero", "carnivoro", "oceano",  "filhote", null),
  b(1, "🦈", "peixe",    "carnivoro", "oceano",  "filhote", null),
  b(1, "🐢", "reptil",   "onivoro",   "oceano",  "ovo",     null),
  b(1, "🐍", "reptil",   "carnivoro", "selva",   "ovo",     null),
  b(1, "🐸", "anfibio",  "carnivoro", "rio",     "girino",  null),
  b(1, "🐝", "inseto",   "nectar",    "jardim",  "ovo",     null),
  b(1, "🦋", "inseto",   "nectar",    "jardim",  "casulo",  null),
  b(1, "🐜", "inseto",   "onivoro",   "jardim",  "ovo",     null),
  b(1, "🕷️", "aracnideo","carnivoro", "jardim",  "ovo",     null),

  /* --- conhecidos --- */
  b(2, "🦊", "mamifero", "onivoro",   "floresta","filhote", null),
  b(2, "🐺", "mamifero", "carnivoro", "floresta","filhote", null),
  b(2, "🦌", "mamifero", "herbivoro", "floresta","filhote", null),
  b(2, "🐗", "mamifero", "onivoro",   "floresta","filhote", null),
  b(2, "🦇", "mamifero", "onivoro",   "selva",   "filhote", null),
  b(2, "🐊", "reptil",   "carnivoro", "rio",     "ovo",     null),
  b(2, "🦎", "reptil",   "carnivoro", "deserto", "ovo",     null),
  b(2, "🦉", "ave",      "carnivoro", "floresta","ovo",     null),
  b(2, "🦅", "ave",      "carnivoro", "montanha","ovo",     null),
  b(2, "🦜", "ave",      "herbivoro", "selva",   "ovo",     null),
  b(2, "🦩", "ave",      "onivoro",   "rio",     "ovo",     null),
  b(2, "🦚", "ave",      "onivoro",   "selva",   "ovo",     "as"),
  b(2, "🐙", "molusco",  "carnivoro", "oceano",  "ovo",     null),
  b(2, "🦀", "crustaceo","onivoro",   "oceano",  "ovo",     null),
  b(2, "🦐", "crustaceo","onivoro",   "oceano",  "ovo",     null),
  b(2, "🐌", "molusco",  "herbivoro", "jardim",  "ovo",     null),
  b(2, "🐪", "mamifero", "herbivoro", "deserto", "filhote", null),
  b(2, "🦏", "mamifero", "herbivoro", "savana",  "filhote", "af"),
  b(2, "🦛", "mamifero", "herbivoro", "rio",     "filhote", "af"),
  b(2, "🦍", "mamifero", "herbivoro", "selva",   "filhote", "af"),
  b(2, "🐨", "mamifero", "herbivoro", "floresta","filhote", "oc"),
  b(2, "🦘", "mamifero", "herbivoro", "savana",  "filhote", "oc"),
  b(2, "🐿️", "mamifero", "herbivoro", "floresta","filhote", null),
  b(2, "🦔", "mamifero", "onivoro",   "jardim",  "filhote", null),
  b(2, "🐢", "reptil",   "herbivoro", "deserto", "ovo",     null),
  b(2, "🦭", "mamifero", "carnivoro", "gelo",    "filhote", null),
  b(2, "🐻‍❄️", "mamifero","carnivoro", "gelo",    "filhote", null),
  b(2, "🦌", "mamifero", "herbivoro", "gelo",    "filhote", null),
  b(2, "🐞", "inseto",   "carnivoro", "jardim",  "ovo",     null),
  b(2, "🦗", "inseto",   "herbivoro", "jardim",  "ovo",     null),
  b(2, "🪲", "inseto",   "onivoro",   "floresta","ovo",     null),
  b(2, "🐦", "ave",      "onivoro",   "jardim",  "ovo",     null),

  /* --- para quem já presta atenção --- */
  b(3, "🦥", "mamifero", "herbivoro", "selva",   "filhote", "sa"),
  b(3, "🦦", "mamifero", "carnivoro", "rio",     "filhote", null),
  b(3, "🦨", "mamifero", "onivoro",   "floresta","filhote", "na"),
  b(3, "🦡", "mamifero", "onivoro",   "floresta","filhote", null),
  b(3, "🦫", "mamifero", "herbivoro", "rio",     "filhote", "na"),
  b(3, "🦙", "mamifero", "herbivoro", "montanha","filhote", "sa"),
  b(3, "🦣", "mamifero", "herbivoro", "gelo",    "filhote", null),
  b(3, "🦬", "mamifero", "herbivoro", "savana",  "filhote", "na"),
  b(3, "🐃", "mamifero", "herbivoro", "rio",     "filhote", "as"),
  b(3, "🦤", "ave",      "herbivoro", "floresta","ovo",     "af"),
  b(3, "🦢", "ave",      "herbivoro", "rio",     "ovo",     null),
  b(3, "🦃", "ave",      "onivoro",   "floresta","ovo",     "na"),
  b(3, "🕊️", "ave",      "herbivoro", "jardim",  "ovo",     null),
  b(3, "🦡", "mamifero", "onivoro",   "deserto", "filhote", null),
  b(3, "🐡", "peixe",    "carnivoro", "oceano",  "ovo",     null),
  b(3, "🦑", "molusco",  "carnivoro", "oceano",  "ovo",     null),
  b(3, "🦞", "crustaceo","onivoro",   "oceano",  "ovo",     null),
  b(3, "🦂", "aracnideo","carnivoro", "deserto", "filhote", null),
  b(3, "🪳", "inseto",   "onivoro",   "jardim",  "ovo",     null),
  b(3, "🐛", "inseto",   "herbivoro", "jardim",  "casulo",  null),
  b(3, "🪱", "inseto",   "onivoro",   "jardim",  "ovo",     null),
  b(3, "🦧", "mamifero", "herbivoro", "selva",   "filhote", "as"),

  /* --- só quem gosta de documentário --- */
  b(4, "🫎", "mamifero", "herbivoro", "floresta","filhote", "na"),
  b(4, "🫏", "mamifero", "herbivoro", "deserto", "filhote", "af"),
  b(4, "🦭", "mamifero", "carnivoro", "oceano",  "filhote", null),
  b(4, "🪸", "molusco",  "onivoro",   "oceano",  "ovo",     null),
  b(4, "🦠", "inseto",   "onivoro",   "rio",     "ovo",     null),
  b(4, "🐋", "mamifero", "carnivoro", "gelo",    "filhote", null),
  b(4, "🦩", "ave",      "onivoro",   "oceano",  "ovo",     "sa"),
  b(4, "🐓", "ave",      "onivoro",   "fazenda", "ovo",     null),
];

/* Os cinco moldes. `campo` diz de onde sai a resposta, `peso` é o quanto o
   molde por si só já é difícil — perguntar o grupo de um cachorro é fácil,
   perguntar o continente de qualquer bicho já exige mapa na cabeça. */
export const MOLDES_CIENCIA = [
  { id: "grupo", campo: "grupo", peso: 1 },
  { id: "dieta", campo: "dieta", peso: 1 },
  { id: "casa",  campo: "casa",  peso: 2 },
  { id: "nasce", campo: "nasce", peso: 2 },
  { id: "onde",  campo: "onde",  peso: 3 },
];

export const CIENCIA_NIVEL = {
  easy: [1], medium: [1, 2], hard: [2, 3], genius: [3, 4],
  mestre: [4], lenda: [4],
};

/* Monta a lista inteira de perguntas possíveis: um par (animal, molde) por
   pergunta. É esta lista que o quiz sorteia — e que o script de verificação
   conta, para ninguém precisar acreditar no número no meu comentário. */
export function perguntasCiencia() {
  const out = [];
  for (const a of ANIMAIS) {
    for (const m of MOLDES_CIENCIA) {
      const r = a[m.campo];
      if (!r) continue;                         // sem continente único, sem pergunta
      out.push({ e: a.e, molde: m.id, campo: m.campo, r, n: Math.min(4, Math.max(a.n, m.peso)) });
    }
  }
  return out;
}
