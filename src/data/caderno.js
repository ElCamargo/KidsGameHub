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
 *
 * Os seis idiomas do app estão todos aqui. Ao contrário dos versículos, este
 * texto é nosso: traduzir não depende de conferir edição nenhuma.
 */

/* Quatro perguntas por princípio, na ordem dos PRINCIPIOS de devocional.js.
   Servem depois de qualquer rodada — bandeira, conta, versículo ou memória —
   porque perguntam sobre quem jogou, não sobre o que foi jogado. */
export const PERGUNTAS = {
  soberania: [
    { pt: "O que você aprendeu hoje que mostra como o mundo é grande?",
      en: "What did you learn today that shows how big the world is?",
      es: "¿Qué aprendiste hoy que muestra lo grande que es el mundo?",
      fr: "Qu'as-tu appris aujourd'hui qui montre comme le monde est grand ?",
      de: "Was hast du heute gelernt, das zeigt, wie groß die Welt ist?",
      it: "Cosa hai imparato oggi che mostra quanto è grande il mondo?" },
    { pt: "Que coisa que você viu hoje só Deus poderia ter feito?",
      en: "What did you see today that only God could have made?",
      es: "¿Qué viste hoy que solo Dios pudo haber hecho?",
      fr: "Qu'as-tu vu aujourd'hui que seul Dieu aurait pu faire ?",
      de: "Was hast du heute gesehen, das nur Gott gemacht haben kann?",
      it: "Cosa hai visto oggi che solo Dio poteva aver fatto?" },
    { pt: "O que te deixou admirado hoje?",
      en: "What amazed you today?",
      es: "¿Qué te dejó admirado hoy?",
      fr: "Qu'est-ce qui t'a émerveillé aujourd'hui ?",
      de: "Was hat dich heute gestaunt gemacht?",
      it: "Che cosa ti ha stupito oggi?" },
    { pt: "Você descobriu algo maior do que imaginava? O quê?",
      en: "Did you find out something was bigger than you thought? What?",
      es: "¿Descubriste algo más grande de lo que imaginabas? ¿Qué?",
      fr: "As-tu découvert quelque chose de plus grand que tu ne pensais ? Quoi ?",
      de: "Hast du entdeckt, dass etwas größer ist, als du dachtest? Was?",
      it: "Hai scoperto qualcosa più grande di quanto immaginavi? Che cosa?" },
  ],
  individualidade: [
    { pt: "O que você aprendeu hoje que ninguém mais da sua casa sabe?",
      en: "What did you learn today that nobody else at home knows?",
      es: "¿Qué aprendiste hoy que nadie más en tu casa sabe?",
      fr: "Qu'as-tu appris aujourd'hui que personne d'autre chez toi ne sait ?",
      de: "Was hast du heute gelernt, das sonst niemand bei dir zu Hause weiß?",
      it: "Cosa hai imparato oggi che nessun altro a casa tua sa?" },
    { pt: "O que você faz melhor hoje do que fazia ontem?",
      en: "What do you do better today than you did yesterday?",
      es: "¿Qué haces hoy mejor que ayer?",
      fr: "Que fais-tu mieux aujourd'hui qu'hier ?",
      de: "Was kannst du heute besser als gestern?",
      it: "Cosa fai oggi meglio di ieri?" },
    { pt: "Que coisa diferente você descobriu hoje?",
      en: "What new thing did you discover today?",
      es: "¿Qué cosa nueva descubriste hoy?",
      fr: "Quelle chose nouvelle as-tu découverte aujourd'hui ?",
      de: "Was Neues hast du heute entdeckt?",
      it: "Che cosa di nuovo hai scoperto oggi?" },
    { pt: "O que só você reparou nesta rodada?",
      en: "What did only you notice this round?",
      es: "¿Qué notaste solo tú en esta ronda?",
      fr: "Qu'as-tu été le seul à remarquer dans cette manche ?",
      de: "Was hast nur du in dieser Runde bemerkt?",
      it: "Che cosa hai notato solo tu in questa partita?" },
  ],
  autogoverno: [
    { pt: "Teve alguma hora que você quis desistir e continuou? Conte.",
      en: "Was there a moment you wanted to quit and kept going? Tell it.",
      es: "¿Hubo un momento en que quisiste rendirte y seguiste? Cuéntalo.",
      fr: "Y a-t-il eu un moment où tu as voulu abandonner et tu as continué ? Raconte.",
      de: "Gab es einen Moment, in dem du aufgeben wolltest und weitergemacht hast? Erzähl.",
      it: "C'è stato un momento in cui volevi mollare e hai continuato? Raccontalo." },
    { pt: "O que você fez para não errar de novo?",
      en: "What did you do so you wouldn't get it wrong again?",
      es: "¿Qué hiciste para no equivocarte de nuevo?",
      fr: "Qu'as-tu fait pour ne pas te tromper à nouveau ?",
      de: "Was hast du getan, damit dir der Fehler nicht noch einmal passiert?",
      it: "Cosa hai fatto per non sbagliare di nuovo?" },
    { pt: "Como você se acalmou quando ficou difícil?",
      en: "How did you calm down when it got hard?",
      es: "¿Cómo te calmaste cuando se puso difícil?",
      fr: "Comment t'es-tu calmé quand c'est devenu difficile ?",
      de: "Wie hast du dich beruhigt, als es schwer wurde?",
      it: "Come ti sei calmato quando è diventato difficile?" },
    { pt: "Você parou para pensar antes de responder? O que mudou?",
      en: "Did you stop and think before answering? What changed?",
      es: "¿Te detuviste a pensar antes de responder? ¿Qué cambió?",
      fr: "T'es-tu arrêté pour réfléchir avant de répondre ? Qu'est-ce que ça a changé ?",
      de: "Hast du vor dem Antworten kurz nachgedacht? Was war anders?",
      it: "Ti sei fermato a pensare prima di rispondere? Che cosa è cambiato?" },
  ],
  carater: [
    { pt: "Você foi honesto hoje mesmo quando ninguém estava olhando?",
      en: "Were you honest today even when nobody was watching?",
      es: "¿Fuiste honesto hoy incluso cuando nadie miraba?",
      fr: "As-tu été honnête aujourd'hui même quand personne ne regardait ?",
      de: "Warst du heute ehrlich, auch als niemand hingeschaut hat?",
      it: "Sei stato onesto oggi anche quando nessuno guardava?" },
    { pt: "O que você aprendeu hoje que quer levar para a vida?",
      en: "What did you learn today that you want to keep for life?",
      es: "¿Qué aprendiste hoy que quieres llevar para la vida?",
      fr: "Qu'as-tu appris aujourd'hui que tu veux garder pour la vie ?",
      de: "Was hast du heute gelernt, das du fürs Leben behalten willst?",
      it: "Cosa hai imparato oggi che vuoi tenere per la vita?" },
    { pt: "Do que você se orgulha nesta rodada?",
      en: "What are you proud of this round?",
      es: "¿De qué estás orgulloso en esta ronda?",
      fr: "De quoi es-tu fier dans cette manche ?",
      de: "Worauf bist du in dieser Runde stolz?",
      it: "Di che cosa sei orgoglioso in questa partita?" },
    { pt: "O que você faria diferente na próxima vez?",
      en: "What would you do differently next time?",
      es: "¿Qué harías distinto la próxima vez?",
      fr: "Que ferais-tu autrement la prochaine fois ?",
      de: "Was würdest du beim nächsten Mal anders machen?",
      it: "Cosa faresti diversamente la prossima volta?" },
  ],
  alianca: [
    { pt: "Quem você quer ensinar o que aprendeu hoje?",
      en: "Who do you want to teach what you learned today?",
      es: "¿A quién quieres enseñar lo que aprendiste hoy?",
      fr: "À qui veux-tu apprendre ce que tu as appris aujourd'hui ?",
      de: "Wem willst du beibringen, was du heute gelernt hast?",
      it: "A chi vuoi insegnare quello che hai imparato oggi?" },
    { pt: "Alguém te ajudou hoje? Como?",
      en: "Did someone help you today? How?",
      es: "¿Alguien te ayudó hoy? ¿Cómo?",
      fr: "Quelqu'un t'a aidé aujourd'hui ? Comment ?",
      de: "Hat dir heute jemand geholfen? Wie?",
      it: "Qualcuno ti ha aiutato oggi? Come?" },
    { pt: "O que você aprendeu que serve para a sua família?",
      en: "What did you learn that is good for your family?",
      es: "¿Qué aprendiste que le sirve a tu familia?",
      fr: "Qu'as-tu appris qui peut servir à ta famille ?",
      de: "Was hast du gelernt, das deiner Familie nützt?",
      it: "Cosa hai imparato che serve alla tua famiglia?" },
    { pt: "Como você pode ajudar alguém com o que sabe agora?",
      en: "How can you help someone with what you know now?",
      es: "¿Cómo puedes ayudar a alguien con lo que ya sabes?",
      fr: "Comment peux-tu aider quelqu'un avec ce que tu sais maintenant ?",
      de: "Wie kannst du jemandem mit dem helfen, was du jetzt weißt?",
      it: "Come puoi aiutare qualcuno con quello che sai adesso?" },
  ],
  semeadura: [
    { pt: "O que você treinou hoje que vai te ajudar amanhã?",
      en: "What did you practice today that will help you tomorrow?",
      es: "¿Qué practicaste hoy que te ayudará mañana?",
      fr: "Qu'as-tu exercé aujourd'hui qui t'aidera demain ?",
      de: "Was hast du heute geübt, das dir morgen hilft?",
      it: "Cosa hai allenato oggi che ti aiuterà domani?" },
    { pt: "Onde o seu esforço apareceu nesta rodada?",
      en: "Where did your effort show up this round?",
      es: "¿Dónde se notó tu esfuerzo en esta ronda?",
      fr: "Où ton effort s'est-il vu dans cette manche ?",
      de: "Wo hat man deine Mühe in dieser Runde gesehen?",
      it: "Dove si è visto il tuo impegno in questa partita?" },
    { pt: "O que você errou hoje e não vai errar de novo?",
      en: "What did you get wrong today that you won't get wrong again?",
      es: "¿En qué te equivocaste hoy y ya no te equivocarás?",
      fr: "Quelle erreur as-tu faite aujourd'hui que tu ne referas plus ?",
      de: "Welchen Fehler von heute machst du nicht noch einmal?",
      it: "Che errore hai fatto oggi che non rifarai più?" },
    { pt: "Que semente pequena você plantou hoje?",
      en: "What small seed did you plant today?",
      es: "¿Qué semilla pequeña plantaste hoy?",
      fr: "Quelle petite graine as-tu plantée aujourd'hui ?",
      de: "Welches kleine Samenkorn hast du heute gesät?",
      it: "Quale piccolo seme hai piantato oggi?" },
  ],
  mordomia: [
    { pt: "O que você aprendeu hoje sobre cuidar do mundo?",
      en: "What did you learn today about taking care of the world?",
      es: "¿Qué aprendiste hoy sobre cuidar el mundo?",
      fr: "Qu'as-tu appris aujourd'hui sur le fait de prendre soin du monde ?",
      de: "Was hast du heute darüber gelernt, für die Welt zu sorgen?",
      it: "Cosa hai imparato oggi sul prendersi cura del mondo?" },
    { pt: "Como você cuidou do seu tempo hoje?",
      en: "How did you take care of your time today?",
      es: "¿Cómo cuidaste tu tiempo hoy?",
      fr: "Comment as-tu pris soin de ton temps aujourd'hui ?",
      de: "Wie bist du heute mit deiner Zeit umgegangen?",
      it: "Come hai avuto cura del tuo tempo oggi?" },
    { pt: "O que é seu e precisa ser mais bem cuidado?",
      en: "What is yours and needs better care?",
      es: "¿Qué es tuyo y necesita más cuidado?",
      fr: "Qu'est-ce qui est à toi et mérite plus de soin ?",
      de: "Was gehört dir und braucht mehr Pflege?",
      it: "Che cosa è tuo e ha bisogno di più cura?" },
    { pt: "O que você viu hoje que merece ser cuidado?",
      en: "What did you see today that deserves to be cared for?",
      es: "¿Qué viste hoy que merece ser cuidado?",
      fr: "Qu'as-tu vu aujourd'hui qui mérite d'être protégé ?",
      de: "Was hast du heute gesehen, das Fürsorge verdient?",
      it: "Che cosa hai visto oggi che merita di essere protetto?" },
  ],
};

/* Para quem ainda não escreve. Não são "estrelas": são como foi, do ponto de
   vista de quem jogou. É o que o adulto não consegue ver do lado de fora. */
export const CARIMBOS = [
  { id: "fun",   e: "😀", pt: "Foi divertido", en: "It was fun", es: "Fue divertido",
    fr: "C'était amusant", de: "Es hat Spaß gemacht", it: "È stato divertente" },
  { id: "hard",  e: "🤔", pt: "Foi difícil", en: "It was hard", es: "Fue difícil",
    fr: "C'était difficile", de: "Es war schwer", it: "È stato difficile" },
  { id: "new",   e: "💡", pt: "Aprendi algo novo", en: "I learned something", es: "Aprendí algo nuevo",
    fr: "J'ai appris quelque chose", de: "Ich habe etwas gelernt", it: "Ho imparato qualcosa" },
  { id: "love",  e: "❤️", pt: "Gostei muito", en: "I loved it", es: "Me encantó",
    fr: "J'ai adoré", de: "Es hat mir sehr gefallen", it: "Mi è piaciuto tanto" },
  { id: "grit",  e: "💪", pt: "Não desisti", en: "I didn't give up", es: "No me rendí",
    fr: "Je n'ai pas abandonné", de: "Ich habe nicht aufgegeben", it: "Non ho mollato" },
  { id: "retry", e: "😅", pt: "Errei e tentei de novo", en: "I missed and tried again", es: "Fallé y lo intenté otra vez",
    fr: "Je me suis trompé et j'ai réessayé", de: "Ich habe daneben gelegen und es nochmal versucht", it: "Ho sbagliato e ho riprovato" },
  { id: "well",  e: "⭐", pt: "Me saí bem", en: "I did well", es: "Me fue bien",
    fr: "Je m'en suis bien sorti", de: "Ich war gut", it: "Sono andato bene" },
  { id: "with",  e: "🤝", pt: "Fiz com alguém", en: "I did it with someone", es: "Lo hice con alguien",
    fr: "Je l'ai fait avec quelqu'un", de: "Ich habe es mit jemandem gemacht", it: "L'ho fatto con qualcuno" },
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
