/**
 * KidsGameHub — a voz do Lumus
 * ElCamargo Soluções em TI LTDA
 *
 * Ler a pergunta em voz alta para quem ainda não lê. É o pedaço do app que
 * mais muda quem consegue jogar: uma criança de quatro anos não lê "Qual
 * destes voa?", mas escuta.
 *
 * DUAS REGRAS QUE NÃO SE NEGOCIAM:
 *
 *   1. Só voz do próprio aparelho. O navegador tem vozes que falam pela
 *      internet — elas são melhores e estão proibidas aqui. O filtro é
 *      `localService`. Sem voz local instalada, o botão simplesmente não
 *      aparece: melhor não ter do que ter só com Wi-Fi, porque a criança que
 *      mais precisa de voz é justamente a que joga em modo avião.
 *   2. Nada é gravado, enviado ou medido. Isto é síntese local, ponto.
 *
 * DOIS TONS, de propósito:
 *
 *   LUMUS  — o mascote falando com a criança: agudo, animado, um pouco
 *            devagar, porque criança pequena precisa de tempo entre as
 *            palavras.
 *   PALAVRA — a leitura do versículo no Momento em Família: grave, pausada,
 *            firme. Uma voz de pai lendo para a família, não de locutor.
 */

/* pitch: 0 a 2 (1 é o normal) · rate: 0.1 a 10 (1 é o normal) */
export const TONS = {
  lumus:   { pitch: 1.35, rate: 0.92 },
  palavra: { pitch: 0.85, rate: 0.80 },
};

/* O navegador costuma devolver lista vazia na primeira chamada e só depois
   dispara "voiceschanged". Guardamos o que veio e reperguntamos. */
let cache = [];

function todas() {
  try {
    const v = window.speechSynthesis?.getVoices?.() || [];
    if (v.length) cache = v;
  } catch { }
  return cache;
}

export function iniciarVozes(aoMudar) {
  if (!disponivel()) return () => { };
  todas();
  const ouvir = () => { todas(); aoMudar?.(); };
  try { window.speechSynthesis.addEventListener("voiceschanged", ouvir); } catch { }
  return () => { try { window.speechSynthesis.removeEventListener("voiceschanged", ouvir); } catch { } };
}

export const disponivel = () =>
  typeof window !== "undefined" && !!window.speechSynthesis && typeof window.SpeechSynthesisUtterance === "function";

/* A melhor voz local para um idioma, ou nada.

   Ordem: idioma e região exatos (pt-BR antes de pt-PT para quem joga em
   português do Brasil), depois qualquer voz do idioma. Vozes de rede ficam
   fora sempre — é a regra 1 lá de cima. */
export function vozDe(lang) {
  const locais = todas().filter(v => v.localService);
  if (!locais.length) return null;
  const preferida = { pt: "pt-BR", en: "en-US", es: "es-ES", fr: "fr-FR", de: "de-DE", it: "it-IT" }[lang];
  const norm = s => (s || "").toLowerCase().replace("_", "-");
  return locais.find(v => norm(v.lang) === norm(preferida))
      || locais.find(v => norm(v.lang).startsWith(lang + "-"))
      || locais.find(v => norm(v.lang) === lang)
      || null;
}

export const temVoz = lang => !!vozDe(lang);

export function parar() {
  try { window.speechSynthesis?.cancel?.(); } catch { }
}

/* Fala, sempre cortando o que estava falando: duas frases sobrepostas não se
   entendem, e a criança já mudou de pergunta. */
export function falar(texto, { lang = "pt", tom = "lumus" } = {}) {
  if (!disponivel() || !texto) return false;
  const voz = vozDe(lang);
  if (!voz) return false;
  parar();
  try {
    const u = new window.SpeechSynthesisUtterance(String(texto));
    u.voice = voz;
    u.lang = voz.lang;
    const { pitch, rate } = TONS[tom] || TONS.lumus;
    u.pitch = pitch;
    u.rate = rate;
    window.speechSynthesis.speak(u);
    return true;
  } catch { return false; }
}

/* A pergunta inteira como a criança precisa ouvir: o enunciado e, depois, as
   alternativas. Sem as alternativas, quem não lê ouve a pergunta e continua
   sem saber em que tocar. */
export function textoDaPergunta(q, t) {
  if (!q) return "";
  const partes = [];
  if (q.ask) partes.push(q.ask);
  else if (q.prompt && q.kind !== "emojiAsk") partes.push(q.prompt);
  else if (q.flag) partes.push(t?.whichCountry || "");
  // Emoji não se fala: o leitor de voz lê "rosto sorridente" e atrapalha.
  const legivel = o => typeof o === "string" && /[\p{L}\p{N}]/u.test(o);
  const alts = (q.options || []).filter(legivel);
  if (alts.length) partes.push(alts.join(", "));
  return juntar(partes);
}

/* Junta as partes com ponto, sem criar "?." — o sintetizador lê a pontuação
   dobrada como uma pausa esquisita no meio da frase. */
export function juntar(partes) {
  return partes
    .map(p => String(p || "").trim())
    .filter(Boolean)
    .reduce((txt, p) => txt ? `${txt}${/[.?!…:]$/.test(txt) ? "" : "."} ${p}` : p, "");
}
