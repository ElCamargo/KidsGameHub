/**
 * KidsGameHub — Meu Caderno
 * ElCamargo Soluções em TI LTDA
 *
 * O 4º R da Abordagem Educacional por Princípios: Registrar.
 *
 * O app inteiro mede reconhecimento — a criança acha a resposta certa entre
 * quatro. Isso é o primeiro degrau, e o mais raso. Quem REGISTRA o que
 * aprendeu leva o aprendizado embora; quem só marca alternativa, não.
 *
 * Este arquivo tem as duas coisas de que o caderno precisa:
 *
 *   PERGUNTAS  o passo Relacionar. Ao fim da rodada, uma pergunta liga o que
 *              acabou de ser jogado a um dos 7 princípios. Nunca é sobre o
 *              conteúdo da rodada ("qual a capital do Peru?") — é sobre o que
 *              aquilo tem a ver com a vida de quem jogou.
 *
 *   CARIMBOS   para quem ainda não escreve. Criança de 4 anos não digita, e
 *              era justamente ela que ficava de fora do caderno. Tocando dois
 *              ou três carimbos ela registra como foi — e o responsável lê.
 *
 * As perguntas não têm resposta certa. Não são corrigidas, não valem ponto e
 * ninguém as compara: são para a criança pensar e para o adulto conversar.
 */

/* Quatro perguntas por princípio, na ordem dos PRINCIPIOS de devocional.js.
   Servem depois de qualquer rodada — bandeira, conta, versículo ou memória —
   porque perguntam sobre quem jogou, não sobre o que foi jogado. */
export const PERGUNTAS = {
  soberania: [
    { pt: "O que você aprendeu hoje que mostra como o mundo é grande?",
      en: "What did you learn today that shows how big the world is?",
      es: "¿Qué aprendiste hoy que muestra lo grande que es el mundo?" },
    { pt: "Que coisa que você viu hoje só Deus poderia ter feito?",
      en: "What did you see today that only God could have made?",
      es: "¿Qué viste hoy que solo Dios pudo haber hecho?" },
    { pt: "O que te deixou admirado hoje?",
      en: "What amazed you today?",
      es: "¿Qué te dejó admirado hoy?" },
    { pt: "Você descobriu algo maior do que imaginava? O quê?",
      en: "Did you find out something was bigger than you thought? What?",
      es: "¿Descubriste algo más grande de lo que imaginabas? ¿Qué?" },
  ],
  individualidade: [
    { pt: "O que você aprendeu hoje que ninguém mais da sua casa sabe?",
      en: "What did you learn today that nobody else at home knows?",
      es: "¿Qué aprendiste hoy que nadie más en tu casa sabe?" },
    { pt: "O que você faz melhor hoje do que fazia ontem?",
      en: "What do you do better today than you did yesterday?",
      es: "¿Qué haces hoy mejor que ayer?" },
    { pt: "Que coisa diferente você descobriu hoje?",
      en: "What new thing did you discover today?",
      es: "¿Qué cosa nueva descubriste hoy?" },
    { pt: "O que só você reparou nesta rodada?",
      en: "What did only you notice this round?",
      es: "¿Qué notaste solo tú en esta ronda?" },
  ],
  autogoverno: [
    { pt: "Teve alguma hora que você quis desistir e continuou? Conte.",
      en: "Was there a moment you wanted to quit and kept going? Tell it.",
      es: "¿Hubo un momento en que quisiste rendirte y seguiste? Cuéntalo." },
    { pt: "O que você fez para não errar de novo?",
      en: "What did you do so you wouldn't get it wrong again?",
      es: "¿Qué hiciste para no equivocarte de nuevo?" },
    { pt: "Como você se acalmou quando ficou difícil?",
      en: "How did you calm down when it got hard?",
      es: "¿Cómo te calmaste cuando se puso difícil?" },
    { pt: "Você parou para pensar antes de responder? O que mudou?",
      en: "Did you stop and think before answering? What changed?",
      es: "¿Te detuviste a pensar antes de responder? ¿Qué cambió?" },
  ],
  carater: [
    { pt: "Você foi honesto hoje mesmo quando ninguém estava olhando?",
      en: "Were you honest today even when nobody was watching?",
      es: "¿Fuiste honesto hoy incluso cuando nadie miraba?" },
    { pt: "O que você aprendeu hoje que quer levar para a vida?",
      en: "What did you learn today that you want to keep for life?",
      es: "¿Qué aprendiste hoy que quieres llevar para la vida?" },
    { pt: "Do que você se orgulha nesta rodada?",
      en: "What are you proud of this round?",
      es: "¿De qué estás orgulloso en esta ronda?" },
    { pt: "O que você faria diferente na próxima vez?",
      en: "What would you do differently next time?",
      es: "¿Qué harías distinto la próxima vez?" },
  ],
  alianca: [
    { pt: "Quem você quer ensinar o que aprendeu hoje?",
      en: "Who do you want to teach what you learned today?",
      es: "¿A quién quieres enseñar lo que aprendiste hoy?" },
    { pt: "Alguém te ajudou hoje? Como?",
      en: "Did someone help you today? How?",
      es: "¿Alguien te ayudó hoy? ¿Cómo?" },
    { pt: "O que você aprendeu que serve para a sua família?",
      en: "What did you learn that is good for your family?",
      es: "¿Qué aprendiste que le sirve a tu familia?" },
    { pt: "Como você pode ajudar alguém com o que sabe agora?",
      en: "How can you help someone with what you know now?",
      es: "¿Cómo puedes ayudar a alguien con lo que ya sabes?" },
  ],
  semeadura: [
    { pt: "O que você treinou hoje que vai te ajudar amanhã?",
      en: "What did you practice today that will help you tomorrow?",
      es: "¿Qué practicaste hoy que te ayudará mañana?" },
    { pt: "Onde o seu esforço apareceu nesta rodada?",
      en: "Where did your effort show up this round?",
      es: "¿Dónde se notó tu esfuerzo en esta ronda?" },
    { pt: "O que você errou hoje e não vai errar de novo?",
      en: "What did you get wrong today that you won't get wrong again?",
      es: "¿En qué te equivocaste hoy y ya no te equivocarás?" },
    { pt: "Que semente pequena você plantou hoje?",
      en: "What small seed did you plant today?",
      es: "¿Qué semilla pequeña plantaste hoy?" },
  ],
  mordomia: [
    { pt: "O que você aprendeu hoje sobre cuidar do mundo?",
      en: "What did you learn today about taking care of the world?",
      es: "¿Qué aprendiste hoy sobre cuidar el mundo?" },
    { pt: "Como você cuidou do seu tempo hoje?",
      en: "How did you take care of your time today?",
      es: "¿Cómo cuidaste tu tiempo hoy?" },
    { pt: "O que é seu e precisa ser mais bem cuidado?",
      en: "What is yours and needs better care?",
      es: "¿Qué es tuyo y necesita más cuidado?" },
    { pt: "O que você viu hoje que merece ser cuidado?",
      en: "What did you see today that deserves to be cared for?",
      es: "¿Qué viste hoy que merece ser cuidado?" },
  ],
};

/* Para quem ainda não escreve. Não são "estrelas": são como foi, do ponto de
   vista de quem jogou. É o que o adulto não consegue ver do lado de fora. */
export const CARIMBOS = [
  { id: "fun",   e: "😀", pt: "Foi divertido",      en: "It was fun",            es: "Fue divertido" },
  { id: "hard",  e: "🤔", pt: "Foi difícil",        en: "It was hard",           es: "Fue difícil" },
  { id: "new",   e: "💡", pt: "Aprendi algo novo",  en: "I learned something",   es: "Aprendí algo nuevo" },
  { id: "love",  e: "❤️", pt: "Gostei muito",       en: "I loved it",            es: "Me encantó" },
  { id: "grit",  e: "💪", pt: "Não desisti",        en: "I didn't give up",      es: "No me rendí" },
  { id: "retry", e: "😅", pt: "Errei e tentei de novo", en: "I missed and tried again", es: "Fallé y lo intenté otra vez" },
  { id: "well",  e: "⭐", pt: "Me saí bem",         en: "I did well",            es: "Me fue bien" },
  { id: "with",  e: "🤝", pt: "Fiz com alguém",     en: "I did it with someone", es: "Lo hice con alguien" },
];

export const carimboPorId = id => CARIMBOS.find(c => c.id === id) || null;

/* Escolhe a pergunta. O mesmo número devolve sempre a mesma pergunta — senão
   ela trocaria a cada redesenho da tela, no meio de a criança responder.

   Quem chama passa algo estável da rodada (trilha + fase, ou o dia).
   IDS_PRINCIPIOS repete a ordem de PRINCIPIOS em devocional.js de propósito:
   os dois arquivos são dados, e um não deve depender do outro para carregar. */
const IDS_PRINCIPIOS = ["soberania", "individualidade", "autogoverno", "carater", "alianca", "semeadura", "mordomia"];

export function perguntaDoRegistro(semente = 0) {
  const s = Math.abs(Math.trunc(semente)) || 0;
  const principio = IDS_PRINCIPIOS[s % IDS_PRINCIPIOS.length];
  const lista = PERGUNTAS[principio];
  // divide antes do resto para a pergunta não andar junto com o princípio
  return { principio, pergunta: lista[Math.floor(s / IDS_PRINCIPIOS.length) % lista.length] };
}

/* Semente estável a partir de um texto qualquer (o id da trilha, por exemplo). */
export function semente(texto = "") {
  let h = 0;
  for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) % 100000;
  return h;
}
