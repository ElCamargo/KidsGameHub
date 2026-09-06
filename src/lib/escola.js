/**
 * KidsGameHub — a trilha do ano escolar
 * ElCamargo Soluções em TI LTDA
 *
 * O app se organiza por DIFICULDADE e por moeda; a escola se organiza por
 * ANO. Uma criança do 4º ano que abre a Tabuada cai no Fácil (×2, ×5, ×10),
 * que ela já sabe, e teria de vencer trinta fases — ou pagar lumicoins — para
 * chegar no 6, 7 e 8, que é o que a professora está cobrando esta semana.
 *
 * Aqui mora a ponte: para cada ano, QUE trilha e em QUE faixa. Entrando por
 * esta porta, aquela faixa abre e a fase não custa nada. Conteúdo de escola
 * não se tranca atrás de moeda: a criança que mais precisa é justamente a que
 * não tem tempo de jogo para juntar lumicoin.
 *
 * Só o que vem antes do 1º ano é sugestão nossa; do 1º ao 5º a ordem segue o
 * que a escola brasileira cobra — alfabetização e contagem no começo, tabuada
 * e horas no meio, divisão e troco no fim.
 *
 * Aqui não há tela nem componente: só a tabela e as contas em cima dela.
 */

/* Cada item aponta uma coisa jogável:
     jogo  — o id do CATALOG, que dá o nome e o ícone (o guarda confere)
     cont  — a trilha de fases; com ele vem a banda
     banda — a faixa de dificuldade que este ano cobra
     tela  — para o que não é trilha de fases (Monta a Palavra tem tela própria)  */
export const ANOS = ["pre", "a1", "a2", "a3", "a4", "a5"];

/* O ano da escola por idade. No Brasil entra-se no 1º ano aos 6. */
export const IDADE_DO_ANO = { pre: 5, a1: 6, a2: 7, a3: 8, a4: 9, a5: 10 };

export const CONTEUDO = {
  /* Educação infantil: som da palavra, primeira letra, contar e cor. Nada de
     leitura corrida — nesta idade a voz do aparelho é que lê. */
  pre: [
    { jogo: "montar", tela: "palLevels" },
    { jogo: "aliteracao", cont: "aliteracao", banda: "easy" },
    { jogo: "inicial", cont: "inicial", banda: "easy" },
    { jogo: "count", cont: "math", banda: "easy" },
    { jogo: "colors", cont: "arts", banda: "easy" },
  ],
  /* 1º ano: alfabetização de verdade — sílaba, letra inicial, rima — e a
     hora cheia, que é a primeira leitura de relógio que a escola pede. */
  a1: [
    { jogo: "montar", tela: "palLevels" },
    { jogo: "inicial", cont: "inicial", banda: "easy" },
    { jogo: "silabas", cont: "silabas", banda: "easy" },
    { jogo: "rimas", cont: "rimas", banda: "easy" },
    { jogo: "count", cont: "math", banda: "easy" },
    { jogo: "horas", cont: "horas", banda: "easy" },
  ],
  /* 2º ano: entra a tabuada fácil (2, 5 e 10, as que se contam nos dedos),
     a meia hora e o dinheiro em moedas. */
  a2: [
    { jogo: "ditado", tela: "ditLevels" },
    { jogo: "rimas", cont: "rimas", banda: "medium" },
    { jogo: "count", cont: "math", banda: "medium" },
    { jogo: "tabuada", cont: "tabuada", banda: "easy" },
    { jogo: "horas", cont: "horas", banda: "medium" },
    { jogo: "dinheiro", cont: "dinheiro", banda: "easy" },
  ],
  /* 3º ano: a tabuada abre para o resto, o dinheiro ganha nota, e começa
     ciências. */
  a3: [
    { jogo: "tabuada", cont: "tabuada", banda: "medium" },
    { jogo: "count", cont: "math", banda: "hard" },
    { jogo: "dinheiro", cont: "dinheiro", banda: "medium" },
    { jogo: "horas", cont: "horas", banda: "hard" },
    { jogo: "sciAnimals", cont: "ciencias", banda: "easy" },
  ],
  /* 4º ano: as tabuadas que travam todo mundo — 6, 7, 8 —, o troco, e a
     geografia do Brasil, que é quando os estados entram na prova. */
  a4: [
    { jogo: "tabuada", cont: "tabuada", banda: "hard" },
    { jogo: "dinheiro", cont: "dinheiro", banda: "hard" },
    { jogo: "count", cont: "math", banda: "genius" },
    { jogo: "sciAnimals", cont: "ciencias", banda: "medium" },
    { jogo: "capitals", cont: "cap_br", banda: "easy" },
  ],
  /* 5º ano: divisão (que é a tabuada lida ao contrário), troco de nota alta,
     e o mundo além do Brasil. */
  a5: [
    { jogo: "tabuada", cont: "tabuada", banda: "mestre" },
    { jogo: "dinheiro", cont: "dinheiro", banda: "genius" },
    { jogo: "count", cont: "math", banda: "mestre" },
    { jogo: "sciAnimals", cont: "ciencias", banda: "hard" },
    { jogo: "capitals", cont: "cap_br", banda: "medium" },
    { jogo: "curiosidades", cont: "curiosidades", banda: "easy" },
  ],
};

export const conteudoDoAno = ano => CONTEUDO[ano] || [];

/* Como o ano aparece escrito. Mora aqui, e não na tela, porque a tela da
   escola e a ficha do responsável precisam do mesmo nome — e se ele morasse
   numa delas, as duas passariam a importar uma à outra. */
export const nomeDoAno = (ano, t) =>
  ano === "pre" ? t.schoolPre : t.schoolYear.replace("{n}", ANOS.indexOf(ano));

/* Qual ano sugerir a quem não escolheu. Idade em branco cai no 1º ano, que é
   o meio da faixa que este app atende. */
export function anoPorIdade(idade) {
  if (idade == null || Number.isNaN(Number(idade))) return "a1";
  const n = Number(idade);
  if (n <= 5) return "pre";
  if (n >= 10) return "a5";
  return ANOS[n - 5];
}

/* Onde a faixa começa e termina na escada da trilha, contando fases a partir
   de 1. Null quando a trilha não tem aquela faixa — e aí o guarda reclama no
   build, porque item de escola apontando para o vazio é criança batendo numa
   tela trancada. */
export function faixaDaBanda(plan, banda) {
  const ini = plan.indexOf(banda);
  if (ini < 0) return null;
  return [ini + 1, plan.lastIndexOf(banda) + 1];
}

/* Em que fase entrar: onde a criança parou, se isso já está dentro da faixa
   do ano dela; senão, no primeiro degrau da faixa. Quem já venceu o 4º ano
   inteiro não volta para o começo dele. */
export function faseDeEntrada(plan, banda, feitas = 0) {
  const faixa = faixaDaBanda(plan, banda);
  if (!faixa) return 1;
  const [ini, fim] = faixa;
  const proxima = (feitas || 0) + 1;
  return proxima >= ini && proxima <= fim ? proxima : ini;
}
