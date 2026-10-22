/**
 * KidsGameHub — o som de fundo
 * ElCamargo Soluções em TI LTDA
 *
 * Nenhum arquivo de áudio: o som nasce na hora, no Web Audio. Trilha sonora
 * gravada custaria megabytes, e o app inteiro tem que caber num celular de
 * entrada — então aqui não entra nem um byte de áudio no pacote.
 *
 * A escala é PENTATÔNICA de propósito. Nela não existe intervalo que soe
 * errado: qualquer nota que caia depois de outra continua bonita. Numa escala
 * maior comum, uma sequência sorteada cedo ou tarde acerta um meio-tom e sai
 * uma nota torta no meio da rodada — com criança pequena do lado.
 *
 * Regras que este arquivo cumpre e que não são detalhe:
 *   - toca baixo, e só dentro de uma fase; menu é silêncio;
 *   - cala enquanto o Clarim está lendo a pergunta — a voz é que importa;
 *   - entra e sai com desvanecimento, nunca de estalo;
 *   - só acorda depois de um toque da criança, que é o que os navegadores
 *     exigem para deixar um site fazer barulho.
 */

/* Dó maior pentatônico, duas oitavas, em hertz. */
export const NOTAS = [261.63, 293.66, 329.63, 392.00, 440.00,
                      523.25, 587.33, 659.25, 783.99, 880.00];

/* Fundo é fundo: alto o bastante para dar presença, baixo o bastante para a
   mãe do lado não desligar. Baixou de 0,055 junto com o timbre novo: a nota
   agora soa mais tempo, e a mesma altura somada pesava. */
const VOLUME = 0.045;

/* De quanto em quanto tempo cai uma nota, conforme o tempo da pergunta acaba.
   Só acelera de verdade no fim — acelerar desde o começo deixaria a criança
   apressada a rodada inteira, e pressa é o contrário do que queremos. Sem
   cronômetro (fase Fácil, memória, quebra-cabeça) fica no passo calmo.

   Era uma nota a cada 0,9 s, chegando a 0,26 s no aperto, e soava marcado
   demais — quem ouvia de fora sentia um martelinho. Agora 1,3 s, e no fim do
   tempo não passa de 0,9 s: o aviso de pressa continua, mas sussurrado. */
export function intervaloDaNota(fracaoRestante) {
  if (fracaoRestante == null || Number.isNaN(fracaoRestante)) return 1300;
  const f = Math.min(1, Math.max(0, fracaoRestante));
  return Math.round(1300 - 400 * Math.pow(1 - f, 2));
}

/* A próxima nota é vizinha da anterior, e só de vez em quando pula dois
   degraus. É isso que faz soar como melodia em vez de sorteio. */
export function proximaNota(indice, sorte = Math.random) {
  const passo = (sorte() < 0.5 ? -1 : 1) * (sorte() < 0.25 ? 2 : 1);
  return Math.min(NOTAS.length - 1, Math.max(0, indice + passo));
}

export const temSom = () =>
  typeof window !== "undefined" && !!(window.AudioContext || window.webkitAudioContext);

let ctx = null, mestre = null, timer = null, indice = 4;
let pegarFracao = () => null;
let vozFalando = () => false;

function acordar() {
  if (!temSom()) return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!ctx) {
    try {
      ctx = new AC();
      mestre = ctx.createGain();
      mestre.gain.value = 0;
      mestre.connect(ctx.destination);
    } catch { ctx = null; return null; }
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => { });
  return ctx;
}

/* Uma nota de caixinha de música: onda senoidal, que é a mais pura e não tem
   aresta nenhuma, com ataque curto e cauda longa de 1,6 s. Uma nota ainda está
   soando quando a próxima chega, e é isso que tira o picotado.

   Antes era triângulo com cauda de 0,9 s, um som de marimba. Escolhido de
   ouvido em 22/10/2026, entre quatro versões tocadas lado a lado: a atual, um
   lo-fi, um violino suave e esta. */
function tocarNota(freq, quando) {
  const osc = ctx.createOscillator();
  const filtro = ctx.createBiquadFilter();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  filtro.type = "lowpass";
  filtro.frequency.value = 1800;
  g.gain.setValueAtTime(0.0001, quando);
  g.gain.linearRampToValueAtTime(1, quando + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, quando + 1.6);
  osc.connect(filtro); filtro.connect(g); g.connect(mestre);
  osc.start(quando);
  osc.stop(quando + 1.7);
}

function bater() {
  if (!ctx) return;
  // Enquanto o Clarim lê, o fundo se cala inteiro: a pergunta é que importa.
  if (!vozFalando()) {
    indice = proximaNota(indice);
    tocarNota(NOTAS[indice], ctx.currentTime + 0.02);
  }
  timer = setTimeout(bater, intervaloDaNota(pegarFracao()));
}

/* `fracao` devolve quanto sobra do tempo da pergunta (1 a 0), ou null quando
   não há cronômetro. `calado` diz se a voz está falando agora. */
export function tocar({ fracao, calado } = {}) {
  if (!acordar()) return false;
  if (fracao) pegarFracao = fracao;
  if (calado) vozFalando = calado;
  const agora = ctx.currentTime;
  mestre.gain.cancelScheduledValues(agora);
  mestre.gain.setValueAtTime(mestre.gain.value, agora);
  mestre.gain.linearRampToValueAtTime(VOLUME, agora + 1.2);
  if (!timer) bater();
  return true;
}

export function parar() {
  clearTimeout(timer);
  timer = null;
  if (!ctx || !mestre) return;
  const agora = ctx.currentTime;
  mestre.gain.cancelScheduledValues(agora);
  mestre.gain.setValueAtTime(mestre.gain.value, agora);
  mestre.gain.linearRampToValueAtTime(0, agora + 0.4);
}
