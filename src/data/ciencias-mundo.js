/**
 * KidsGameHub — Ciências além dos bichos
 * ElCamargo Soluções em TI LTDA
 *
 * Só dados: nenhuma lógica de jogo, nenhum componente.
 *
 * A área de Ciências do app era inteira sobre animais. A escola de 1º ao 5º
 * ano cobra outras quatro coisas na mesma medida: o corpo humano, as plantas,
 * a água e os materiais — mais a higiene, que não é prova, é vida.
 *
 * Diferente do banco dos animais, aqui a pergunta é escrita à mão e não sai de
 * molde: não há um "fato" por trás que valha para todos. O que uma planta
 * precisa não se deduz do que um coração faz.
 *
 * REGRAS AO ACRESCENTAR:
 * 1. A alternativa errada tem que ser plausível para quem não sabe. "O coração
 *    bombeia sangue" com as opções "bombeia / voa / canta" não mede nada.
 * 2. Nada que assuste. Doença, morte e acidente ficam de fora: a criança joga
 *    isso sozinha, sem adulto do lado para explicar.
 * 3. A explicação ensina o porquê, e não repete a resposta com outras palavras.
 *
 * O campo n é o degrau: 1 é o que se aprende no 1º ano, 4 é o de 5º.
 */
export const CIENCIAS_MUNDO = [
  /* ---------- o corpo ---------- */
  { tema: "corpo", n: 1, e: "❤️", q: "Que órgão bombeia o sangue pelo corpo?", a: "O coração",
    o: ["O coração", "O pulmão", "O estômago", "O cérebro"],
    porque: "O coração aperta e solta o tempo todo, empurrando o sangue por todo o corpo." },
  { tema: "corpo", n: 1, e: "🫁", q: "Que parte do corpo usamos para respirar?", a: "Os pulmões",
    o: ["Os pulmões", "O coração", "O fígado", "Os rins"],
    porque: "O ar entra pelo nariz e enche os pulmões, que tiram dele o oxigênio." },
  { tema: "corpo", n: 1, e: "🦴", q: "O que dá forma e sustenta o nosso corpo?", a: "Os ossos",
    o: ["Os ossos", "O cabelo", "A pele", "O sangue"],
    porque: "Os ossos formam o esqueleto, que segura o corpo em pé e protege os órgãos." },
  { tema: "corpo", n: 1, e: "🦷", q: "Para que servem os dentes?", a: "Para cortar e triturar a comida",
    o: ["Para cortar e triturar a comida", "Para respirar", "Para falar mais alto", "Para sentir cheiro"],
    porque: "Mastigar quebra o alimento em pedaços pequenos, e assim o corpo aproveita melhor." },
  { tema: "corpo", n: 2, e: "🧠", q: "Que órgão comanda tudo o que fazemos e pensamos?", a: "O cérebro",
    o: ["O cérebro", "O coração", "O estômago", "O pulmão"],
    porque: "O cérebro manda ordens para o corpo inteiro pelos nervos, e recebe de volta o que os sentidos captam." },
  { tema: "corpo", n: 2, e: "💪", q: "O que faz os ossos se moverem?", a: "Os músculos",
    o: ["Os músculos", "O sangue", "A pele", "As unhas"],
    porque: "O músculo encurta e puxa o osso: é assim que o braço dobra." },
  { tema: "corpo", n: 2, e: "🩸", q: "O que o sangue leva para todas as partes do corpo?", a: "Oxigênio e alimento",
    o: ["Oxigênio e alimento", "Só água", "Ar quente", "Luz"],
    porque: "O sangue é o caminhão do corpo: entrega oxigênio e nutrientes e recolhe o que sobra." },
  { tema: "corpo", n: 3, e: "🍽️", q: "Onde a comida começa a ser digerida depois de mastigada?", a: "No estômago",
    o: ["No estômago", "No pulmão", "No coração", "No cérebro"],
    porque: "No estômago a comida se mistura a um líquido que a desmancha antes de seguir para o intestino." },
  { tema: "corpo", n: 3, e: "🧴", q: "Qual é o maior órgão do corpo humano?", a: "A pele",
    o: ["A pele", "O fígado", "O pulmão", "O coração"],
    porque: "A pele cobre o corpo inteiro. Ela protege, sente e ajuda a controlar a temperatura." },
  { tema: "corpo", n: 3, e: "🦴", q: "Com quantos ossos, mais ou menos, um adulto fica?", a: "206",
    o: ["206", "50", "600", "1.000"],
    porque: "O bebê nasce com mais de 300 ossos, e alguns se juntam enquanto ele cresce." },
  { tema: "corpo", n: 4, e: "🫀", q: "Para onde vai o sangue quando sai do coração e vai buscar oxigênio?", a: "Para os pulmões",
    o: ["Para os pulmões", "Para o estômago", "Para os pés", "Para o cérebro"],
    porque: "O sangue passa pelos pulmões para pegar oxigênio e volta ao coração antes de sair para o corpo." },
  { tema: "corpo", n: 4, e: "🦵", q: "Como se chama o lugar onde dois ossos se encontram e dobram?", a: "Articulação",
    o: ["Articulação", "Músculo", "Nervo", "Tendão"],
    porque: "O joelho e o cotovelo são articulações: é onde o esqueleto pode dobrar." },

  /* ---------- as plantas ---------- */
  { tema: "plantas", n: 1, e: "🌱", q: "De que parte da planta nasce uma planta nova?", a: "Da semente",
    o: ["Da semente", "Da folha", "Do caule", "Da flor"],
    porque: "Dentro da semente já existe uma plantinha adormecida, esperando água e calor." },
  { tema: "plantas", n: 1, e: "🌿", q: "Que parte da planta segura ela na terra e puxa a água?", a: "A raiz",
    o: ["A raiz", "A folha", "A flor", "O fruto"],
    porque: "A raiz cresce para baixo, prende a planta e absorve a água com os sais do solo." },
  { tema: "plantas", n: 1, e: "💧", q: "Do que uma planta precisa para crescer?", a: "Água, luz e terra",
    o: ["Água, luz e terra", "Só água", "Escuro e frio", "Só vento"],
    porque: "Faltando um dos três a planta murcha — foi o que aconteceu no canteiro que ficou sem rega." },
  { tema: "plantas", n: 2, e: "🍃", q: "Em que parte da planta a luz do sol vira alimento?", a: "Na folha",
    o: ["Na folha", "Na raiz", "No caule", "Na semente"],
    porque: "A folha é achatada e verde justamente para pegar bastante luz." },
  { tema: "plantas", n: 2, e: "🌷", q: "Que parte da planta vira fruto depois?", a: "A flor",
    o: ["A flor", "A raiz", "A folha", "O caule"],
    porque: "Depois que a flor é polinizada, ela se transforma no fruto, com a semente dentro." },
  { tema: "plantas", n: 2, e: "🐝", q: "Quem carrega o pólen de uma flor para outra?", a: "As abelhas",
    o: ["As abelhas", "As minhocas", "Os peixes", "As formigas de casa"],
    porque: "A abelha vai buscar néctar e leva o pólen grudado no corpo, sem querer." },
  { tema: "plantas", n: 3, e: "☀️", q: "Como se chama o processo em que a planta usa a luz para se alimentar?", a: "Fotossíntese",
    o: ["Fotossíntese", "Digestão", "Respiração", "Germinação"],
    porque: "Na fotossíntese a planta junta água, gás carbônico e luz, e produz o próprio alimento." },
  { tema: "plantas", n: 3, e: "🌬️", q: "Que gás as plantas soltam no ar durante o dia?", a: "Oxigênio",
    o: ["Oxigênio", "Gás carbônico", "Vapor de gasolina", "Fumaça"],
    porque: "É por isso que floresta e mata limpam o ar: elas devolvem o oxigênio que respiramos." },
  { tema: "plantas", n: 3, e: "🪵", q: "Que parte leva a água da raiz até as folhas?", a: "O caule",
    o: ["O caule", "A flor", "O fruto", "A casca da semente"],
    porque: "O caule tem canais finos por dentro, como canudinhos, que levam a água para cima." },
  { tema: "plantas", n: 4, e: "🌰", q: "Como se chama o momento em que a semente brota?", a: "Germinação",
    o: ["Germinação", "Fotossíntese", "Polinização", "Floração"],
    porque: "Na germinação a semente absorve água, incha e a primeira raiz sai para fora." },
  { tema: "plantas", n: 4, e: "🌵", q: "Onde o cacto guarda a água que consegue?", a: "No caule",
    o: ["No caule", "Nos espinhos", "Na flor", "Nas raízes de cima"],
    porque: "O caule grosso do cacto é um reservatório, e os espinhos são folhas que viraram agulha para perder menos água." },

  /* ---------- a água e o tempo ---------- */
  { tema: "agua", n: 1, e: "🧊", q: "O que acontece com a água quando ela congela?", a: "Vira gelo",
    o: ["Vira gelo", "Vira vapor", "Desaparece", "Vira areia"],
    porque: "Abaixo de zero grau a água fica sólida: é o gelo." },
  { tema: "agua", n: 1, e: "☁️", q: "De que são feitas as nuvens?", a: "De gotinhas de água",
    o: ["De gotinhas de água", "De algodão", "De fumaça", "De areia"],
    porque: "O vapor que sobe esfria lá em cima e vira gotinhas, que juntas formam a nuvem." },
  { tema: "agua", n: 2, e: "♨️", q: "O que acontece com a água quando ela ferve?", a: "Vira vapor",
    o: ["Vira vapor", "Vira gelo", "Vira pedra", "Fica mais pesada"],
    porque: "Com muito calor a água passa de líquida para gasosa, e sobe como vapor." },
  { tema: "agua", n: 2, e: "🌧️", q: "Por que chove?", a: "As gotinhas da nuvem ficam pesadas e caem",
    o: ["As gotinhas da nuvem ficam pesadas e caem", "O céu abre um buraco", "O vento empurra o mar para cima", "O sol derrete a nuvem"],
    porque: "As gotinhas se juntam até ficarem pesadas demais para o ar segurar." },
  { tema: "agua", n: 3, e: "🔄", q: "Como se chama a viagem da água entre o mar, o céu e a terra?", a: "Ciclo da água",
    o: ["Ciclo da água", "Fotossíntese", "Maré", "Correnteza"],
    porque: "A água evapora, vira nuvem, chove, corre para o rio e volta ao mar — e recomeça." },
  { tema: "agua", n: 3, e: "🌊", q: "Em que estado a água está no mar?", a: "Líquido",
    o: ["Líquido", "Sólido", "Gasoso", "Nenhum"],
    porque: "Os três estados da água são sólido (gelo), líquido (mar e rio) e gasoso (vapor)." },
  { tema: "agua", n: 4, e: "🫗", q: "Quando a roupa seca no varal, para onde vai a água?", a: "Evapora para o ar",
    o: ["Evapora para o ar", "Escorre para o chão", "Some para sempre", "Vira poeira"],
    porque: "O sol e o vento fazem a água virar vapor, que se mistura ao ar. É evaporação." },
  { tema: "agua", n: 4, e: "🥤", q: "Por que o copo gelado fica molhado por fora?", a: "O vapor do ar vira gota no vidro frio",
    o: ["O vapor do ar vira gota no vidro frio", "A água atravessa o vidro", "O copo está furado", "O gelo escorre por cima"],
    porque: "Isso é condensação: o vapor que está no ar esfria ao encostar no copo e vira gotinha." },

  /* ---------- os sentidos ---------- */
  { tema: "sentidos", n: 1, e: "👁️", q: "Que sentido usamos com os olhos?", a: "A visão",
    o: ["A visão", "A audição", "O olfato", "O paladar"],
    porque: "Os olhos captam a luz, e é assim que enxergamos formas e cores." },
  { tema: "sentidos", n: 1, e: "👅", q: "Com que parte do corpo sentimos o gosto?", a: "A língua",
    o: ["A língua", "O nariz", "A orelha", "A mão"],
    porque: "A língua tem pontinhos que reconhecem doce, salgado, azedo e amargo." },
  { tema: "sentidos", n: 1, e: "👃", q: "Que sentido usamos para sentir cheiro?", a: "O olfato",
    o: ["O olfato", "O tato", "A audição", "A visão"],
    porque: "O nariz reconhece cheirinhos no ar — e ele ajuda a língua a sentir o sabor." },
  { tema: "sentidos", n: 2, e: "✋", q: "Que sentido usamos para saber se algo é liso ou áspero?", a: "O tato",
    o: ["O tato", "O paladar", "A audição", "O olfato"],
    porque: "A pele sente textura, calor e frio: é o tato, e ele funciona no corpo inteiro." },
  { tema: "sentidos", n: 2, e: "👂", q: "Quantos sentidos costumamos contar?", a: "5",
    o: ["5", "3", "7", "10"],
    porque: "Visão, audição, olfato, paladar e tato." },
  { tema: "sentidos", n: 3, e: "🔊", q: "O que chega ao ouvido e nos faz escutar?", a: "O som",
    o: ["O som", "A luz", "O cheiro", "O calor"],
    porque: "O som viaja pelo ar como uma vibração, e o ouvido transforma isso em sinal para o cérebro." },

  /* ---------- os materiais ---------- */
  { tema: "materiais", n: 2, e: "🧱", q: "Como se chama o estado da matéria que tem forma própria?", a: "Sólido",
    o: ["Sólido", "Líquido", "Gasoso", "Molhado"],
    porque: "O sólido mantém a forma; o líquido toma a forma do vasilhame; o gás ocupa tudo." },
  { tema: "materiais", n: 2, e: "🧲", q: "O que o ímã atrai?", a: "Ferro",
    o: ["Ferro", "Papel", "Madeira", "Vidro"],
    porque: "O ímã puxa alguns metais, principalmente o ferro. Papel e madeira ele nem sente." },
  { tema: "materiais", n: 3, e: "🪵", q: "Por que a madeira flutua na água?", a: "Porque é mais leve que a água",
    o: ["Porque é mais leve que a água", "Porque é seca", "Porque é marrom", "Porque tem casca"],
    porque: "O que flutua é o que pesa menos que o mesmo tanto de água. A pedra pesa mais e afunda." },
  { tema: "materiais", n: 3, e: "🕯️", q: "O que forma uma sombra?", a: "Um objeto barrando a luz",
    o: ["Um objeto barrando a luz", "O vento", "O escuro subindo", "A cor preta"],
    porque: "A luz anda em linha reta; onde o objeto barra, fica a sombra com o formato dele." },
  { tema: "materiais", n: 4, e: "🌡️", q: "O que acontece com o metal quando esquenta muito?", a: "Ele dilata, fica um pouco maior",
    o: ["Ele dilata, fica um pouco maior", "Ele encolhe", "Ele vira líquido na hora", "Nada muda"],
    porque: "O calor afasta as partes de dentro do material, e por isso ele aumenta um pouquinho." },
  { tema: "materiais", n: 4, e: "♻️", q: "O que quer dizer reciclar?", a: "Transformar o que foi usado em coisa nova",
    o: ["Transformar o que foi usado em coisa nova", "Jogar tudo no mesmo lugar", "Queimar o lixo", "Enterrar o lixo"],
    porque: "Papel vira papel de novo, e a garrafa vira outra garrafa: gasta-se menos e sobra menos lixo." },

  /* ---------- higiene e saúde ---------- */
  { tema: "higiene", n: 1, e: "🧼", q: "Quando é mais importante lavar as mãos?", a: "Antes de comer",
    o: ["Antes de comer", "Depois de dormir", "Antes de assistir TV", "Depois de rir"],
    porque: "A mão encosta em tudo. Lavar antes de comer impede que a sujeira vá junto com a comida." },
  { tema: "higiene", n: 1, e: "🪥", q: "Quantas vezes por dia se deve escovar os dentes?", a: "Depois de cada refeição",
    o: ["Depois de cada refeição", "Uma vez por semana", "Só quando doer", "Só de manhã"],
    porque: "O resto de comida no dente vira placa, e a placa é o que faz o buraquinho aparecer." },
  { tema: "higiene", n: 2, e: "😴", q: "Por que uma criança precisa dormir bem?", a: "O corpo cresce e a cabeça descansa",
    o: ["O corpo cresce e a cabeça descansa", "Para passar o tempo", "Para não comer à noite", "Para ficar com fome"],
    porque: "É dormindo que o corpo se recupera, cresce e guarda o que aprendeu no dia." },
  { tema: "higiene", n: 2, e: "🥦", q: "Por que comer verdura e fruta todo dia?", a: "Elas trazem vitaminas que o corpo precisa",
    o: ["Elas trazem vitaminas que o corpo precisa", "Porque são coloridas", "Para gastar dinheiro", "Porque são doces"],
    porque: "Vitamina é o que faz o corpo funcionar direito, e ela não fica guardada: precisa vir todo dia." },
];

/* Que degraus entram em cada faixa, como no resto do app. */
export const NIVEIS_DA_CIENCIA = {
  easy:   [1],
  medium: [1, 2],
  hard:   [2, 3],
  genius: [2, 3, 4],
  mestre: [3, 4],
  lenda:  [3, 4],
};
