/**
 * KidsGameHub — os textos de leitura
 * ElCamargo Soluções em TI LTDA
 *
 * Só dados: nenhuma lógica de jogo, nenhum componente.
 *
 * Do 2º ano em diante, interpretação de texto é o que mais cai em prova — e
 * não só em Português: o enunciado de Matemática, a pergunta de Ciências e a
 * questão de História são todos texto para interpretar. Era o maior buraco do
 * app.
 *
 * Cada texto traz:
 *   id — chave curta, usada pela revisão para saber que pergunta é qual
 *   n  — o degrau: 1 (três frases curtas) a 4 (seis frases, com inferência)
 *   e  — a figura, que dá o assunto antes de a criança ler a primeira palavra
 *   t  — o texto, que a voz do Lumus lê inteiro para quem ainda não lê
 *   p  — as perguntas
 *
 * Cada pergunta traz `tipo`:
 *   literal     — a resposta está escrita no texto, com essas palavras
 *   inferencia  — a resposta NÃO está escrita; sai de juntar duas coisas
 *   vocabulario — o que uma palavra quer dizer ALI, naquele texto
 *
 * REGRAS AO ACRESCENTAR, e elas não são de estilo:
 *
 * 1. As três alternativas erradas têm que ser **plausíveis para quem não
 *    leu** e **claramente erradas para quem leu**. Alternativa absurda a
 *    criança elimina sem ler o texto, e aí a pergunta não mediu leitura.
 * 2. Nada de pegadinha de palavra. Se duas alternativas podem ser defendidas
 *    lendo o texto, a pergunta está errada — não a criança.
 * 3. Texto curto, frase curta, nada de assustar: o Lumus é para criança de 5
 *    a 10 anos, e ela lê isso sozinha, sem adulto do lado para explicar.
 * 4. A explicação (`porque`) diz ONDE no texto está a resposta. Errar sem
 *    saber por quê ensina só que errou.
 */
export const LEITURAS = [
  /* ---------- 1: três frases curtas, tudo literal ---------- */
  {
    id: "gato-telhado", n: 1, e: "🐱",
    t: "Miau é um gato preto. Ele dorme no telhado da casa. De noite, ele mia para a lua.",
    p: [
      { tipo: "literal", q: "De que cor é o Miau?", a: "Preto",
        o: ["Preto", "Branco", "Cinza", "Laranja"], porque: "O texto diz: Miau é um gato preto." },
      { tipo: "literal", q: "Onde o Miau dorme?", a: "No telhado",
        o: ["No telhado", "Na cama", "No quintal", "Na árvore"], porque: "O texto diz que ele dorme no telhado da casa." },
      { tipo: "literal", q: "Quando ele mia para a lua?", a: "De noite",
        o: ["De noite", "De manhã", "Na hora do almoço", "Na segunda-feira"], porque: "O texto diz: de noite, ele mia para a lua." },
    ],
  },
  {
    id: "bola-quintal", n: 1, e: "⚽",
    t: "Pedro ganhou uma bola nova. Ele foi jogar no quintal com a irmã. A bola caiu dentro da horta.",
    p: [
      { tipo: "literal", q: "O que o Pedro ganhou?", a: "Uma bola",
        o: ["Uma bola", "Uma bicicleta", "Um cachorro", "Um livro"], porque: "O texto começa dizendo que Pedro ganhou uma bola nova." },
      { tipo: "literal", q: "Com quem ele foi jogar?", a: "Com a irmã",
        o: ["Com a irmã", "Com o pai", "Com o vizinho", "Sozinho"], porque: "O texto diz que ele foi jogar com a irmã." },
      { tipo: "literal", q: "Onde a bola caiu?", a: "Na horta",
        o: ["Na horta", "No telhado", "Na rua", "No rio"], porque: "A última frase diz que a bola caiu dentro da horta." },
    ],
  },
  {
    id: "bolo-cenoura", n: 1, e: "🎂",
    t: "Mamãe fez um bolo de cenoura. A casa inteira ficou com cheiro bom. Todos comeram no lanche da tarde.",
    p: [
      { tipo: "literal", q: "De que era o bolo?", a: "De cenoura",
        o: ["De cenoura", "De chocolate", "De banana", "De milho"], porque: "O texto diz: um bolo de cenoura." },
      { tipo: "literal", q: "Quem fez o bolo?", a: "A mamãe",
        o: ["A mamãe", "O papai", "A vovó", "O irmão"], porque: "A primeira frase diz que mamãe fez o bolo." },
      { tipo: "literal", q: "Quando eles comeram?", a: "No lanche da tarde",
        o: ["No lanche da tarde", "No café da manhã", "Na janta", "De madrugada"], porque: "O texto termina dizendo: no lanche da tarde." },
    ],
  },
  {
    id: "chuva-galinhas", n: 1, e: "🌧️",
    t: "Começou a chover forte. As galinhas correram para o galinheiro. O cachorro ficou deitado na varanda.",
    p: [
      { tipo: "literal", q: "Para onde as galinhas correram?", a: "Para o galinheiro",
        o: ["Para o galinheiro", "Para a varanda", "Para a horta", "Para o telhado"], porque: "O texto diz que as galinhas correram para o galinheiro." },
      { tipo: "literal", q: "Onde ficou o cachorro?", a: "Na varanda",
        o: ["Na varanda", "No galinheiro", "Dentro de casa", "Na chuva"], porque: "A última frase diz que o cachorro ficou na varanda." },
      { tipo: "inferencia", q: "Por que os bichos saíram do quintal?", a: "Porque começou a chover",
        o: ["Porque começou a chover", "Porque estava com fome", "Porque era de noite", "Porque o dono chamou"],
        porque: "O texto não diz o motivo, mas começa com a chuva forte — foi ela que fez todos correrem." },
    ],
  },
  {
    id: "feijao-algodao", n: 1, e: "🌱",
    t: "Ana plantou um feijão no algodão. Ela molhou um pouquinho todo dia. Em uma semana nasceu a primeira folha.",
    p: [
      { tipo: "literal", q: "O que a Ana plantou?", a: "Um feijão",
        o: ["Um feijão", "Uma flor", "Uma cenoura", "Um girassol"], porque: "O texto diz: Ana plantou um feijão no algodão." },
      { tipo: "literal", q: "O que a Ana fez todo dia?", a: "Molhou",
        o: ["Molhou", "Cavou", "Colheu", "Contou"], porque: "O texto diz que ela molhou um pouquinho todo dia." },
      { tipo: "literal", q: "Quanto tempo levou para nascer a folha?", a: "Uma semana",
        o: ["Uma semana", "Um dia", "Um mês", "Um ano"], porque: "O texto diz: em uma semana nasceu a primeira folha." },
    ],
  },

  /* ---------- 2: quatro frases, entra a primeira inferência ---------- */
  {
    id: "pipa-fio", n: 2, e: "🪁",
    t: "Tomás levou a pipa para o campo. O vento estava fraco e ela não subia. Ele esperou um pouco, sentado na grama. Quando o vento voltou, a pipa subiu bem alto.",
    p: [
      { tipo: "literal", q: "Para onde o Tomás levou a pipa?", a: "Para o campo",
        o: ["Para o campo", "Para a escola", "Para a praia", "Para o quintal"], porque: "A primeira frase diz que ele levou a pipa para o campo." },
      { tipo: "inferencia", q: "Por que a pipa não subia no começo?", a: "Porque o vento estava fraco",
        o: ["Porque o vento estava fraco", "Porque o fio arrebentou", "Porque estava chovendo", "Porque a pipa era pesada"],
        porque: "O texto diz que o vento estava fraco, e ela só subiu quando o vento voltou." },
      { tipo: "literal", q: "O que o Tomás fez enquanto esperava?", a: "Sentou na grama",
        o: ["Sentou na grama", "Foi para casa", "Correu com a pipa", "Chamou um amigo"], porque: "O texto diz que ele esperou sentado na grama." },
    ],
  },
  {
    id: "formiga-pao", n: 2, e: "🐜",
    t: "Uma formiga achou um pedaço de pão no chão da cozinha. Ela era pequena e o pedaço era grande. Ela chamou as outras formigas do formigueiro. Juntas, elas levaram o pão inteiro.",
    p: [
      { tipo: "literal", q: "O que a formiga achou?", a: "Um pedaço de pão",
        o: ["Um pedaço de pão", "Uma folha", "Um grão de açúcar", "Uma migalha de bolo"], porque: "O texto diz que ela achou um pedaço de pão no chão." },
      { tipo: "inferencia", q: "Por que ela chamou as outras?", a: "Porque sozinha não daria conta",
        o: ["Porque sozinha não daria conta", "Porque estava com medo", "Porque queria brincar", "Porque se perdeu"],
        porque: "O texto diz que ela era pequena e o pedaço era grande — por isso precisou de ajuda." },
      { tipo: "literal", q: "Como o pão foi levado?", a: "Por todas juntas",
        o: ["Por todas juntas", "Por ela sozinha", "Em pedaços", "Não foi levado"], porque: "A última frase diz: juntas, elas levaram o pão inteiro." },
    ],
  },
  {
    id: "feira-laranja", n: 2, e: "🧺",
    t: "No sábado, o vovô foi à feira com a Clara. Ele levou uma cesta de palha. Compraram laranja, alface e um queijo. Na volta, a cesta estava tão cheia que os dois carregaram juntos.",
    p: [
      { tipo: "literal", q: "Em que dia eles foram à feira?", a: "No sábado",
        o: ["No sábado", "No domingo", "Na segunda", "Na sexta"], porque: "O texto começa dizendo: no sábado." },
      { tipo: "literal", q: "O que eles compraram?", a: "Laranja, alface e queijo",
        o: ["Laranja, alface e queijo", "Pão, leite e ovo", "Banana e arroz", "Só laranja"], porque: "O texto lista: laranja, alface e um queijo." },
      { tipo: "inferencia", q: "Por que os dois carregaram a cesta juntos?", a: "Porque estava pesada",
        o: ["Porque estava pesada", "Porque a cesta quebrou", "Porque estavam com pressa", "Porque a Clara pediu"],
        porque: "O texto diz que a cesta estava tão cheia — cesta cheia fica pesada para um só." },
    ],
  },
  {
    id: "gato-perdido", n: 2, e: "🐈",
    t: "O gato da vizinha sumiu de manhã. A família toda procurou pela rua e chamou pelo nome. À tarde, a Bia ouviu um miado fraco. Ele estava preso atrás do portão do quintal.",
    p: [
      { tipo: "literal", q: "Quem ouviu o miado?", a: "A Bia",
        o: ["A Bia", "A vizinha", "O carteiro", "Ninguém"], porque: "O texto diz: à tarde, a Bia ouviu um miado fraco." },
      { tipo: "literal", q: "Onde o gato estava?", a: "Atrás do portão",
        o: ["Atrás do portão", "Em cima da árvore", "Na casa da vizinha", "Debaixo do carro"], porque: "A última frase diz que ele estava preso atrás do portão do quintal." },
      { tipo: "inferencia", q: "Por que demorou para acharem o gato?", a: "Porque o miado era fraco",
        o: ["Porque o miado era fraco", "Porque ninguém procurou", "Porque ele fugiu longe", "Porque era de noite"],
        porque: "Procuraram de manhã e só ouviram à tarde, e o texto diz que o miado era fraco." },
    ],
  },
  {
    id: "primeiro-dia", n: 2, e: "🏫",
    t: "Era o primeiro dia de aula do Bento. Ele segurou a mão da mãe até a porta da sala. A professora sorriu e mostrou o lugar dele. No fim do dia, ele já sabia o nome de dois colegas.",
    p: [
      { tipo: "literal", q: "Até onde o Bento segurou a mão da mãe?", a: "Até a porta da sala",
        o: ["Até a porta da sala", "Até o portão", "Até a carteira", "Até o recreio"], porque: "O texto diz: até a porta da sala." },
      { tipo: "literal", q: "Quantos colegas ele já conhecia no fim do dia?", a: "Dois",
        o: ["Dois", "Um", "Nenhum", "A turma toda"], porque: "A última frase diz que ele já sabia o nome de dois colegas." },
      { tipo: "inferencia", q: "Como o Bento estava no começo do dia?", a: "Inseguro",
        o: ["Inseguro", "Bravo", "Com sono", "Com fome"],
        porque: "Ele segurou a mão da mãe até a porta — quem faz isso está inseguro, e depois melhorou." },
    ],
  },

  /* ---------- 3: cinco frases, inferência e vocabulário ---------- */
  {
    id: "barquinho-papel", n: 3, e: "⛵",
    t: "Depois da chuva, ficou uma poça comprida na calçada. Léo dobrou uma folha e fez um barquinho de papel. Ele colocou o barco na água e soprou devagar. O barco atravessou a poça inteira. Aos poucos, o papel foi ficando mole e o barco afundou.",
    p: [
      { tipo: "literal", q: "Do que era o barco?", a: "De papel",
        o: ["De papel", "De madeira", "De plástico", "De folha de árvore"], porque: "O texto diz: um barquinho de papel." },
      { tipo: "inferencia", q: "Por que o barco afundou no fim?", a: "Porque o papel molhou",
        o: ["Porque o papel molhou", "Porque o Léo pisou nele", "Porque o vento parou", "Porque a poça secou"],
        porque: "O texto diz que o papel foi ficando mole — papel molhado não segura o barco." },
      { tipo: "vocabulario", q: "No texto, o que é uma poça?", a: "Água parada no chão",
        o: ["Água parada no chão", "Um barco pequeno", "Um pedaço de papel", "Um tipo de chuva"],
        porque: "A poça ficou na calçada depois da chuva: é água parada no chão." },
      { tipo: "literal", q: "Como o Léo fez o barco andar?", a: "Soprou",
        o: ["Soprou", "Empurrou com a mão", "Puxou com um fio", "Jogou uma pedra"], porque: "O texto diz que ele soprou devagar." },
    ],
  },
  {
    id: "lanche-dividido", n: 3, e: "🥪",
    t: "Na hora do recreio, o Davi abriu a lancheira e viu dois sanduíches. O colega do lado não tinha trazido nada e ficou olhando o chão. Davi ficou quieto um instante, pensando. Depois ele estendeu a mão com um dos sanduíches. Os dois comeram juntos, sentados no muro.",
    p: [
      { tipo: "literal", q: "Quantos sanduíches o Davi tinha?", a: "Dois",
        o: ["Dois", "Um", "Três", "Nenhum"], porque: "O texto diz que ele viu dois sanduíches na lancheira." },
      { tipo: "inferencia", q: "Por que o colega ficou olhando o chão?", a: "Estava com vergonha",
        o: ["Estava com vergonha", "Tinha perdido algo", "Estava com sono", "Estava procurando a lancheira"],
        porque: "Ele não tinha trazido nada e o Davi tinha dois — quem passa por isso costuma ficar sem graça." },
      { tipo: "inferencia", q: "Por que o Davi ficou quieto um instante?", a: "Estava decidindo o que fazer",
        o: ["Estava decidindo o que fazer", "Estava com raiva", "Estava contando os sanduíches", "Estava esperando o sinal"],
        porque: "O texto diz que ele ficou quieto pensando, e logo depois estendeu a mão." },
      { tipo: "vocabulario", q: "No texto, o que quer dizer estendeu a mão?", a: "Ofereceu",
        o: ["Ofereceu", "Bateu", "Escondeu", "Levantou o braço para pedir"],
        porque: "Ele estendeu a mão com um sanduíche e os dois comeram juntos: ele ofereceu." },
    ],
  },
  {
    id: "girassol-sol", n: 3, e: "🌻",
    t: "A vovó plantou girassóis no canteiro da frente. De manhã, as flores estavam viradas para o nascente. Ao meio-dia, estavam olhando para cima. No fim da tarde, tinham virado para o outro lado. A vovó disse que elas seguem o sol o dia inteiro.",
    p: [
      { tipo: "literal", q: "Onde a vovó plantou os girassóis?", a: "No canteiro da frente",
        o: ["No canteiro da frente", "No quintal de trás", "Num vaso", "Na horta"], porque: "O texto diz: no canteiro da frente." },
      { tipo: "inferencia", q: "Por que as flores mudam de posição?", a: "Porque acompanham o sol",
        o: ["Porque acompanham o sol", "Porque o vento empurra", "Porque a vovó vira elas", "Porque estão murchando"],
        porque: "A vovó explica no fim: elas seguem o sol o dia inteiro." },
      { tipo: "literal", q: "Para onde as flores olhavam ao meio-dia?", a: "Para cima",
        o: ["Para cima", "Para o nascente", "Para o chão", "Para a casa"], porque: "O texto diz que ao meio-dia estavam olhando para cima." },
      { tipo: "vocabulario", q: "No texto, o que é o nascente?", a: "O lado onde o sol nasce",
        o: ["O lado onde o sol nasce", "O nome da flor", "O canteiro da vovó", "O meio do dia"],
        porque: "De manhã as flores olhavam para o nascente, e elas seguem o sol: é o lado onde o sol nasce." },
    ],
  },
  {
    id: "trem-janela", n: 3, e: "🚂",
    t: "A família viajou de trem para visitar os tios. Clara escolheu o lugar da janela e não largou dali. Ela viu um rio, uma ponte e três vacas paradas no pasto. O irmão dormiu quase o caminho todo. Quando ele acordou, já estavam chegando.",
    p: [
      { tipo: "literal", q: "O que a Clara viu no pasto?", a: "Três vacas",
        o: ["Três vacas", "Dois cavalos", "Um rio", "Uma ponte"], porque: "O texto diz: três vacas paradas no pasto." },
      { tipo: "literal", q: "O que o irmão fez na viagem?", a: "Dormiu",
        o: ["Dormiu", "Leu um livro", "Ficou na janela", "Conversou com os tios"], porque: "O texto diz que ele dormiu quase o caminho todo." },
      { tipo: "inferencia", q: "Quem aproveitou mais a paisagem?", a: "A Clara",
        o: ["A Clara", "O irmão", "Os dois igualmente", "Os tios"],
        porque: "Clara ficou na janela vendo tudo e o irmão dormiu quase o caminho todo." },
      { tipo: "vocabulario", q: "No texto, o que é o pasto?", a: "O campo onde ficam os animais",
        o: ["O campo onde ficam os animais", "A janela do trem", "Um tipo de ponte", "A casa dos tios"],
        porque: "As vacas estavam paradas no pasto: é o campo onde os animais ficam." },
    ],
  },
  {
    id: "violao-vovo", n: 3, e: "🎸",
    t: "O violão do vovô ficava pendurado na parede da sala. Ninguém tocava desde que ele mudou de cidade. Um dia, o Téo pegou o violão e tentou uma nota. Saiu um som feio e ele quase desistiu. Ele treinou uma semana e, no domingo, tocou uma música inteira.",
    p: [
      { tipo: "literal", q: "Onde ficava o violão?", a: "Pendurado na parede",
        o: ["Pendurado na parede", "Dentro do armário", "Em cima da mesa", "Na casa do vovô"], porque: "A primeira frase diz que ele ficava pendurado na parede da sala." },
      { tipo: "inferencia", q: "Por que ninguém tocava o violão?", a: "Porque o vovô tinha mudado de cidade",
        o: ["Porque o vovô tinha mudado de cidade", "Porque estava quebrado", "Porque era proibido", "Porque ninguém gostava"],
        porque: "O texto diz: ninguém tocava desde que ele mudou de cidade." },
      { tipo: "inferencia", q: "O que fez o Téo conseguir tocar?", a: "Treinar todo dia",
        o: ["Treinar todo dia", "Trocar o violão", "Esperar o vovô voltar", "Ter sorte"],
        porque: "O primeiro som saiu feio, mas ele treinou uma semana e conseguiu." },
      { tipo: "literal", q: "Quando ele tocou a música inteira?", a: "No domingo",
        o: ["No domingo", "No mesmo dia", "No sábado", "Depois de um ano"], porque: "O texto termina dizendo: no domingo, tocou uma música inteira." },
    ],
  },

  /* ---------- 4: seis frases, o texto exige juntar as pontas ---------- */
  {
    id: "andorinhas", n: 4, e: "🐦",
    t: "Todo ano, no começo do frio, as andorinhas somem da cidade. Elas voam milhares de quilômetros até um lugar mais quente. Lá elas passam a estação e depois voltam. No mesmo telhado, no mesmo cantinho de sempre. Dona Rita marca no calendário o dia em que elas chegam. Ela diz que é o aviso de que o inverno acabou.",
    p: [
      { tipo: "literal", q: "Quando as andorinhas somem?", a: "No começo do frio",
        o: ["No começo do frio", "No começo do calor", "Quando chove", "Quando anoitece"], porque: "A primeira frase diz: no começo do frio." },
      { tipo: "inferencia", q: "Por que elas vão embora?", a: "Para fugir do frio",
        o: ["Para fugir do frio", "Para achar o telhado", "Porque o telhado quebrou", "Para visitar a Dona Rita"],
        porque: "Elas somem no frio e voam até um lugar mais quente." },
      { tipo: "inferencia", q: "Por que a chegada delas avisa que o inverno acabou?", a: "Porque elas só voltam quando esquenta",
        o: ["Porque elas só voltam quando esquenta", "Porque a Dona Rita chama elas", "Porque o calendário diz", "Porque elas trazem o sol"],
        porque: "Elas foram embora com o frio e voltam depois da estação: a volta é sinal de calor." },
      { tipo: "vocabulario", q: "No texto, o que quer dizer estação?", a: "Uma parte do ano",
        o: ["Uma parte do ano", "Um lugar de pegar trem", "Um tipo de ninho", "Uma viagem"],
        porque: "Elas passam a estação no lugar quente e depois voltam: é uma parte do ano, como o inverno." },
    ],
  },
  {
    id: "formigueiro-chuva", n: 4, e: "🌦️",
    t: "Choveu a noite inteira e o formigueiro do quintal alagou. De manhã, as formigas subiram pelo muro em fila. Cada uma levava um ovinho branco nas costas. Elas pararam num canto seco embaixo do beiral. Quando o sol apareceu, começaram a cavar de novo. Em dois dias havia um formigueiro novo ali.",
    p: [
      { tipo: "literal", q: "O que cada formiga levava nas costas?", a: "Um ovinho branco",
        o: ["Um ovinho branco", "Uma folha", "Um pedaço de pão", "Um graveto"], porque: "O texto diz que cada uma levava um ovinho branco nas costas." },
      { tipo: "inferencia", q: "Por que elas saíram do formigueiro?", a: "Porque ele alagou",
        o: ["Porque ele alagou", "Porque acabou a comida", "Porque estava lotado", "Porque alguém pisou nele"],
        porque: "Choveu a noite inteira e o formigueiro alagou — por isso subiram pelo muro." },
      { tipo: "inferencia", q: "Por que elas escolheram o canto embaixo do beiral?", a: "Porque estava seco",
        o: ["Porque estava seco", "Porque era mais perto", "Porque tinha comida", "Porque era escuro"],
        porque: "O texto diz: pararam num canto seco embaixo do beiral, depois de fugirem da água." },
      { tipo: "literal", q: "Quanto tempo levou o formigueiro novo?", a: "Dois dias",
        o: ["Dois dias", "Uma noite", "Uma semana", "Um mês"], porque: "A última frase diz: em dois dias havia um formigueiro novo." },
    ],
  },
  {
    id: "horta-vovo", n: 4, e: "🥕",
    t: "A vovó separou um canteiro pequeno para cada neto. Deu a mesma terra, a mesma semente e o mesmo regador. O canteiro do Ivo virou um pé de cenoura bonito. O da Malu quase não cresceu. Ela tinha molhado tudo de uma vez no primeiro dia e depois esqueceu. A vovó disse que planta não precisa de muita água — precisa de água todo dia.",
    p: [
      { tipo: "literal", q: "O que a vovó deu para cada neto?", a: "Terra, semente e regador",
        o: ["Terra, semente e regador", "Só a semente", "Uma cenoura pronta", "Um canteiro grande"], porque: "O texto diz: a mesma terra, a mesma semente e o mesmo regador." },
      { tipo: "inferencia", q: "Por que o canteiro da Malu não cresceu?", a: "Porque ela regou só uma vez",
        o: ["Porque ela regou só uma vez", "Porque a semente era ruim", "Porque a terra era fraca", "Porque o Ivo pegou a água dela"],
        porque: "Ela molhou tudo de uma vez e depois esqueceu — e a vovó explica que precisa ser todo dia." },
      { tipo: "inferencia", q: "O que a história quer ensinar?", a: "Que o cuidado precisa ser constante",
        o: ["Que o cuidado precisa ser constante", "Que cenoura é difícil de plantar", "Que a vovó gosta mais do Ivo", "Que regador grande é melhor"],
        porque: "As duas condições eram iguais; a diferença foi molhar todo dia em vez de tudo de uma vez." },
      { tipo: "vocabulario", q: "No texto, o que é um canteiro?", a: "Um pedaço de terra para plantar",
        o: ["Um pedaço de terra para plantar", "Um regador", "Um tipo de semente", "Um cesto de cenoura"],
        porque: "Cada neto ganhou um canteiro para plantar a sua semente." },
    ],
  },
  {
    id: "lua-fases", n: 4, e: "🌙",
    t: "Toda noite o Caio olhava a lua da janela do quarto. Num dia ela era um risquinho fino. Uma semana depois, era meia lua. Depois de mais uma semana, era um círculo inteiro e claro. Ele desenhou cada uma num caderno, com a data do lado. No fim do mês, o caderno mostrava a lua crescendo e minguando de novo.",
    p: [
      { tipo: "literal", q: "Onde o Caio olhava a lua?", a: "Da janela do quarto",
        o: ["Da janela do quarto", "Do quintal", "Do telhado", "Da rua"], porque: "A primeira frase diz: da janela do quarto." },
      { tipo: "literal", q: "O que ele fazia no caderno?", a: "Desenhava a lua com a data",
        o: ["Desenhava a lua com a data", "Escrevia histórias", "Fazia contas", "Colava figurinhas"], porque: "O texto diz que ele desenhou cada uma com a data do lado." },
      { tipo: "inferencia", q: "Para que servia anotar a data?", a: "Para saber quanto tempo levava cada mudança",
        o: ["Para saber quanto tempo levava cada mudança", "Para não perder o caderno", "Para mostrar na escola", "Para lembrar de olhar"],
        porque: "Com a data, o caderno mostrou a lua mudando ao longo do mês." },
      { tipo: "vocabulario", q: "No texto, o que é minguando?", a: "Ficando menor",
        o: ["Ficando menor", "Ficando maior", "Ficando escondida", "Ficando mais clara"],
        porque: "O caderno mostrava a lua crescendo e minguando: depois de crescer, ela volta a ficar menor." },
    ],
  },
  {
    id: "chave-perdida", n: 4, e: "🔑",
    t: "O papai procurou a chave do carro a manhã inteira. Olhou no bolso do casaco, na gaveta e embaixo do sofá. Estava quase desistindo quando a Sofia perguntou onde ele tinha ido por último. Ele lembrou que só tinha saído para levar o lixo. A chave estava pendurada do lado de fora, na fechadura do portão. Desde esse dia, ele passou a pendurar a chave sempre no mesmo gancho.",
    p: [
      { tipo: "literal", q: "Onde estava a chave?", a: "Na fechadura do portão",
        o: ["Na fechadura do portão", "No bolso do casaco", "Embaixo do sofá", "Na gaveta"], porque: "O texto diz: pendurada do lado de fora, na fechadura do portão." },
      { tipo: "inferencia", q: "O que a pergunta da Sofia ajudou o papai a fazer?", a: "Lembrar por onde tinha passado",
        o: ["Lembrar por onde tinha passado", "Achar o casaco", "Abrir a gaveta", "Chamar um chaveiro"],
        porque: "Ela perguntou onde ele tinha ido por último, e aí ele lembrou do lixo — e da chave." },
      { tipo: "inferencia", q: "Por que ele passou a usar sempre o mesmo gancho?", a: "Para não perder de novo",
        o: ["Para não perder de novo", "Porque a Sofia mandou", "Porque o portão quebrou", "Porque o gancho era novo"],
        porque: "Depois de perder a manhã inteira procurando, ele criou um lugar fixo para a chave." },
      { tipo: "literal", q: "Quanto tempo ele procurou?", a: "A manhã inteira",
        o: ["A manhã inteira", "Cinco minutos", "A tarde toda", "Dois dias"], porque: "A primeira frase diz que ele procurou a manhã inteira." },
    ],
  },
];

/* Que degraus entram em cada faixa. Como no resto do app, a faixa alta não
   abandona o texto curto: repetir o fácil no meio do difícil é o que faz a
   criança sentir que domina. */
export const NIVEIS_DA_LEITURA = {
  easy:   [1],
  medium: [1, 2],
  hard:   [2, 3],
  genius: [2, 3, 4],
  mestre: [3, 4],
  lenda:  [3, 4],
};
