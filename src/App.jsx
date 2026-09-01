import React, { useState, useEffect, useRef, useCallback } from "react";

/* Bancos de perguntas. Ficam fora deste arquivo porque são DADOS, não lógica:
   um pastor pode revisar biblia-pessoas.js sem abrir o jogo, e o App.jsx não
   dobra de tamanho a cada cem perguntas novas. */
import { bancoBiblia } from "./data/biblia.js";
import { CURIOSIDADES, CURIOSIDADE_NIVEL, AGUAS } from "./data/curiosidades.js";
import { perguntasCiencia, CIENCIA_NIVEL, GRUPOS, DIETAS, CASAS, NASCE } from "./data/ciencias.js";

/* ============================================================
   LUMUS — Kids Game Hub
   "Iluminar a mente"
   © ElCamargo Soluções em TI LTDA — https://github.com/ElCamargo/KidsGameHub
   Licença MIT (ver LICENSE)
   ------------------------------------------------------------
   Jogo 1: Bandeiras do Mundo
   Persistência via window.storage (ver src/lib/storage.js).
   ============================================================ */

/* ---------- i18n ---------- */
/* Assinatura da criadora, exibida na abertura e na área dos pais. */
const MADE_BY = "ElCamargo Soluções em TI LTDA";

/* Idiomas embutidos no app; os demais vêm por download (ver LANG_CATALOG). */

const T = {
  pt: {
    tagline: "Viaje pelo mundo brincando",
    play: "Jogar",
    start: "Começar",
    hi: "Oi",
    createAvatar: "Crie seu personagem",
    name: "Seu nome",
    skin: "Pele", hair: "Cabelo", cap: "Boné", glasses: "Óculos", shirt: "Camisa",
    none: "Nenhum",
    remove: "Tirar",
    shopHint: "Chapéus, óculos e estampas você ganha na loja jogando!",
    slots: { hairStyle: "Cabelo", cap: "Chapéu", glasses: "Óculos", shirt: "Camisa", shirtPattern: "Estampa" },
    ready: "Pronto!",
    map: "Mapa",
    shop: "Loja",
    awards: "Conquistas",
    coins: "moedas",
    nextCoins: "Próximas moedas em",
    locked: "Bloqueado",
    unlockFor: "Abrir por",
    levels: { easy: "Fácil", medium: "Médio", hard: "Difícil", genius: "Gênio" },
    stage: "Fase",
    cost: "Custa",
    notEnough: "Moedas insuficientes. Espere as moedas grátis!",
    question: "Pergunta",
    whichCountry: "Que país é essa bandeira?",
    whichRegion: "Que estado ou região é essa bandeira?",
    hints: "Dicas",
    remove1: "Tirar 1 errada",
    remove2: "Tirar 2 erradas",
    remove3: "Tirar 3 erradas",
    noRush: "SEM PRESSA",
    timeUp: "Acabou o tempo!",
    correct: "Isso aí!",
    wrong: "Quase!",
    roundOver: "Fim da rodada",
    score: "Pontos",
    accuracy: "Acertos",
    reward: "Prêmio",
    perfect: "PERFEITO!",
    again: "Jogar de novo",
    backMap: "Voltar ao mapa",
    nextStage: "Próxima fase",
    free: "Grátis",
    buy: "Comprar",
    owned: "Você tem",
    equip: "Usar",
    equipped: "Usando",
    streak: "Sequência",
    tutorial: "Como jogar",
    tut1: "A bandeira aparece aqui em cima.",
    tut2: "Escolha o nome certo entre as 4 opções.",
    tut3: "Você tem 15 segundos. Rápido!",
    tut4: "Sem saber? Use moedas para tirar respostas erradas.",
    gotIt: "Entendi!",
    travel: "Boa viagem!",
    continents: {
      sa: "América do Sul", na: "América do Norte", eu: "Europa",
      af: "África", as: "Ásia", oc: "Oceania",
    },
    mascotHub: "Escolha um continente para explorar!",
    mascotStage: "Vamos lá! Você consegue!",
    home: "Escolha um jogo",
    soon: "Em breve",
    cat: { geo: "Geografia", math: "Matemática", nature: "Natureza", art: "Arte", eng: "Idiomas", faith: "Fé e Bíblia" },
    games: { flags: "Bandeiras do Mundo", memory: "Memória do Mundo", capitals: "Capitais", count: "Contas e Números", animals: "Memória dos Animais", animalQuiz: "Quiz dos Animais", color: "Pintar e Colorir", colors: "Cores e Formas", artMem: "Memória das Formas", words: "Palavras do Mundo", wordMem: "Memória de Palavras", bible: "Quiz da Bíblia", bibleMem: "Memória da Bíblia", curiosidades: "Curiosidades do Mundo", sciAnimals: "Curiosidades dos Animais" },
    mascotHome: "Oi! Que tal aprender brincando?",
    profileTitle: "Meu perfil",
    statRounds: "Rodadas", statPerfect: "100%", statFlags: "Bandeiras", statDays: "Dias seguidos",
    worldProgress: "Meu mundo", achievementsGot: "Conquistas",
    installTitle: "Deixe o Lumus na tela inicial",
    installIOS: "No Safari, toque em Compartilhar e depois em \"Adicionar à Tela de Início\".",
    installAndroid: "No menu do Chrome (⋮), toque em \"Instalar aplicativo\".",
    installWhy: "Assim ele abre em tela cheia, como qualquer outro app.",
    installLater: "Agora não",
    record: "Recorde", newRecord: "Novo recorde!", pairs: "Pares", moves: "Jogadas",
    memStarsHint: "As estrelas vêm do tempo: quanto mais rápido, mais estrelas.",
    badges: "Insígnias",
    gallery: "Minha galeria", newDrawing: "Escolha um desenho", finish: "Terminei!",
    paintAll: "Pinte tudo para terminar", dailyCap: "Moedas de hoje já ganhas — mas pode pintar à vontade!",
    quit: "Sair", quitAsk: "Sair da rodada? As moedas gastas não voltam.", howMuch: "Quanto é?",
    reset: "Reiniciar", resetAsk: "Zerar o progresso deste jogador? O nome e o avatar continuam.",
    saveAnyway: "Salvar assim", emptyGallery: "Nada aqui ainda. Escolha um desenho e pinte!",
    bicho: { voa: "Qual destes voa?", agua: "Qual destes vive na água?", fazenda: "Qual destes vive na fazenda?",
      ave: "Qual destes é uma ave?", mamifero: "Qual destes é um mamífero?", inseto: "Qual destes é um inseto?",
      selva: "Qual destes vive na selva?", reptil: "Qual destes é um réptil?", ovos: "Qual destes põe ovos?",
      peixe: "Qual destes é um peixe?", patas4: "Qual destes tem quatro patas?", gelo: "Qual destes vive no gelo?",
      anfibio: "Qual destes é um anfíbio?", nao_mamifero: "Qual destes NÃO é um mamífero?",
      nao_reptil: "Qual destes NÃO é um réptil?", nao_inseto: "Qual destes NÃO é um inseto?",
      nao_ave: "Qual destes NÃO é uma ave?" },
    generateMore: "Gerar mais 9",
    cores: { vermelho: "vermelho", laranja: "laranja", amarelo: "amarelo", verde: "verde", azul: "azul", roxo: "roxo", marrom: "marrom", preto: "preto", branco: "branco" },
    formas: { circulo: "círculo", quadrado: "quadrado", coracao: "coração" },
    artQ: { cor: "Qual é {x}?", forma: "Qual é o {x}?", ambos: "Qual é o {f} {c}?", nao: "Qual NÃO é {x}?" },
    howSayIn: "Como se diz isso em {x}?", whichLang: "Qual idioma quer aprender?",
    langHint: "Baixe mais idiomas em 🌐 Idioma para aprender outros.",
    whichCapital: "Qual é a capital?", capBrasil: "Estados do Brasil", capEUA: "Estados dos EUA",
    curQ: { pais: "Em que país encontramos {x}?", cidade: "Em que cidade encontramos {x}?", agua: "Em que mar ou oceano encontramos {x}?", continente: "Em que continente encontramos {x}?" },
    sciQ: { grupo: "A que grupo pertence este animal?", dieta: "O que este animal come?", casa: "Onde este animal vive?", nasce: "Como nasce o filhote deste animal?", onde: "Em que continente este animal vive na natureza?" },
    needTen: "Vença 10 fases da região anterior", claim: "Resgatar", claimReady: "Moedas prontas!",
    claimTitle: "Suas moedas chegaram!",
    needPrev: "Abra o jogo anterior",
    players: "Quem vai jogar?", newPlayer: "Novo jogador", switchPlayer: "Trocar jogador",
    language: "Idioma", use: "Usar",
    deleteAsk: "Apagar este jogador e todo o progresso dele?", cancel: "Cancelar", del: "Apagar",
    parents: "Área dos pais",
    parentsInfo: "Sem anúncios. Sem links externos. Sem coleta de dados. Funciona offline.",
  },
  en: {
    tagline: "Travel the world by playing",
    play: "Play", start: "Start", hi: "Hi",
    createAvatar: "Create your character", name: "Your name",
    skin: "Skin", hair: "Hair", cap: "Cap", glasses: "Glasses", shirt: "Shirt",
    none: "None", remove: "Take off",
    shopHint: "Earn hats, glasses and prints in the shop by playing!",
    slots: { hairStyle: "Hair", cap: "Hat", glasses: "Glasses", shirt: "Shirt", shirtPattern: "Print" },
    ready: "Ready!", map: "Map", shop: "Shop", awards: "Awards",
    coins: "coins", nextCoins: "Free coins in", locked: "Locked", unlockFor: "Unlock for",
    levels: { easy: "Easy", medium: "Medium", hard: "Hard", genius: "Genius" },
    stage: "Stage", cost: "Costs",
    notEnough: "Not enough coins. Wait for your free coins!",
    question: "Question", whichCountry: "Which country is this flag?",
    whichRegion: "Which state or region is this flag?",
    hints: "Hints", remove1: "Remove 1 wrong", remove2: "Remove 2 wrong", remove3: "Remove 3 wrong",
    noRush: "NO RUSH", timeUp: "Time's up!", correct: "Yes!", wrong: "So close!",
    roundOver: "Round over", score: "Score", accuracy: "Correct", reward: "Reward",
    perfect: "PERFECT!", again: "Play again", backMap: "Back to map", nextStage: "Next stage",
    free: "Free",
    buy: "Buy", owned: "You own", equip: "Wear", equipped: "Wearing", streak: "Streak",
    tutorial: "How to play",
    tut1: "The flag shows up here.",
    tut2: "Pick the right name out of 4.",
    tut3: "You get 15 seconds. Be quick!",
    tut4: "Stuck? Spend coins to remove wrong answers.",
    gotIt: "Got it!", travel: "Have a good trip!",
    continents: { sa: "South America", na: "North America", eu: "Europe", af: "Africa", as: "Asia", oc: "Oceania" },
    mascotHub: "Pick a continent to explore!",
    mascotStage: "Let's go! You can do it!",
    home: "Pick a game", soon: "Coming soon",
    cat: { geo: "Geography", math: "Math", nature: "Nature", art: "Art", eng: "Languages", faith: "Faith and Bible" },
    games: { flags: "Flags of the World", memory: "World Memory", capitals: "Capitals", count: "Sums and Numbers", animals: "Animal Memory", animalQuiz: "Animal Quiz", color: "Paint and Color", colors: "Colors and Shapes", artMem: "Shape Memory", words: "World Words", wordMem: "Word Memory", bible: "Bible Quiz", bibleMem: "Bible Memory", curiosidades: "World Fun Facts", sciAnimals: "Animal Science" },
    mascotHome: "Hi! Want to learn by playing?",
    profileTitle: "My profile",
    statRounds: "Rounds", statPerfect: "100%", statFlags: "Flags", statDays: "Day streak",
    worldProgress: "My world", achievementsGot: "Awards",
    installTitle: "Keep Lumus on your home screen",
    installIOS: "In Safari, tap Share and then \"Add to Home Screen\".",
    installAndroid: "In the Chrome menu (⋮), tap \"Install app\".",
    installWhy: "It then opens full screen, like any other app.",
    installLater: "Not now",
    record: "Record", newRecord: "New record!", pairs: "Pairs", moves: "Moves",
    memStarsHint: "Stars come from the clock: the faster you are, the more you get.",
    badges: "Badges",
    gallery: "My gallery", newDrawing: "Pick a drawing", finish: "Done!",
    paintAll: "Paint everything to finish", dailyCap: "Today's coins are done — keep painting anyway!",
    quit: "Quit", quitAsk: "Leave this round? Spent coins are not refunded.", howMuch: "How much is it?",
    reset: "Reset", resetAsk: "Reset this player's progress? Name and avatar stay.",
    saveAnyway: "Save it like this", emptyGallery: "Nothing here yet. Pick a drawing and paint!",
    bicho: { voa: "Which one flies?", agua: "Which one lives in water?", fazenda: "Which one lives on a farm?",
      ave: "Which one is a bird?", mamifero: "Which one is a mammal?", inseto: "Which one is an insect?",
      selva: "Which one lives in the jungle?", reptil: "Which one is a reptile?", ovos: "Which one lays eggs?",
      peixe: "Which one is a fish?", patas4: "Which one has four legs?", gelo: "Which one lives on the ice?",
      anfibio: "Which one is an amphibian?", nao_mamifero: "Which one is NOT a mammal?",
      nao_reptil: "Which one is NOT a reptile?", nao_inseto: "Which one is NOT an insect?",
      nao_ave: "Which one is NOT a bird?" },
    generateMore: "Generate 9 more",
    cores: { vermelho: "red", laranja: "orange", amarelo: "yellow", verde: "green", azul: "blue", roxo: "purple", marrom: "brown", preto: "black", branco: "white" },
    formas: { circulo: "circle", quadrado: "square", coracao: "heart" },
    artQ: { cor: "Which one is {x}?", forma: "Which one is the {x}?", ambos: "Which is the {c} {f}?", nao: "Which one is NOT {x}?" },
    howSayIn: "How do you say this in {x}?", whichLang: "Which language do you want to learn?",
    langHint: "Download more languages under 🌐 Language to learn others.",
    whichCapital: "What is the capital?", capBrasil: "States of Brazil", capEUA: "US States",
    curQ: { pais: "In which country do we find {x}?", cidade: "In which city do we find {x}?", agua: "In which sea or ocean do we find {x}?", continente: "On which continent do we find {x}?" },
    sciQ: { grupo: "Which group does this animal belong to?", dieta: "What does this animal eat?", casa: "Where does this animal live?", nasce: "How is this animal's baby born?", onde: "On which continent does this animal live in the wild?" },
    needTen: "Clear 10 stages of the previous region", claim: "Claim", claimReady: "Coins ready!",
    claimTitle: "Your coins have arrived!",
    needPrev: "Unlock the previous game",
    players: "Who's playing?", newPlayer: "New player", switchPlayer: "Switch player",
    language: "Language", use: "Use",
    deleteAsk: "Delete this player and all their progress?", cancel: "Cancel", del: "Delete",
    parents: "Parents", parentsInfo: "No ads. No external links. No data collection. Works offline.",
  },
  es: {
    tagline: "Viaja por el mundo jugando",
    play: "Jugar", start: "Empezar", hi: "Hola",
    createAvatar: "Crea tu personaje", name: "Tu nombre",
    skin: "Piel", hair: "Pelo", cap: "Gorra", glasses: "Gafas", shirt: "Camisa",
    none: "Ninguno", remove: "Quitar",
    shopHint: "¡Gorros, gafas y estampados se ganan jugando!",
    slots: { hairStyle: "Pelo", cap: "Gorro", glasses: "Gafas", shirt: "Camisa", shirtPattern: "Estampado" },
    ready: "¡Listo!", map: "Mapa", shop: "Tienda", awards: "Logros",
    coins: "monedas", nextCoins: "Monedas gratis en", locked: "Bloqueado", unlockFor: "Abrir por",
    levels: { easy: "Fácil", medium: "Medio", hard: "Difícil", genius: "Genio" },
    stage: "Nivel", cost: "Cuesta",
    notEnough: "No hay monedas. ¡Espera las gratis!",
    question: "Pregunta", whichCountry: "¿De qué país es esta bandera?",
    whichRegion: "¿De qué estado o región es esta bandera?",
    hints: "Pistas", remove1: "Quitar 1 mala", remove2: "Quitar 2 malas", remove3: "Quitar 3 malas",
    noRush: "SIN PRISA", timeUp: "¡Se acabó!", correct: "¡Muy bien!", wrong: "¡Casi!",
    roundOver: "Fin de la ronda", score: "Puntos", accuracy: "Aciertos", reward: "Premio",
    perfect: "¡PERFECTO!", again: "Jugar otra vez", backMap: "Volver al mapa", nextStage: "Siguiente nivel",
    free: "Gratis",
    buy: "Comprar", owned: "Tienes", equip: "Usar", equipped: "Usando", streak: "Racha",
    tutorial: "Cómo jugar",
    tut1: "La bandera aparece arriba.",
    tut2: "Elige el nombre correcto entre 4.",
    tut3: "Tienes 15 segundos. ¡Rápido!",
    tut4: "¿No sabes? Gasta monedas para quitar respuestas malas.",
    gotIt: "¡Entendido!", travel: "¡Buen viaje!",
    continents: { sa: "América del Sur", na: "América del Norte", eu: "Europa", af: "África", as: "Asia", oc: "Oceanía" },
    mascotHub: "¡Elige un continente!",
    mascotStage: "¡Vamos! ¡Tú puedes!",
    home: "Elige un juego", soon: "Muy pronto",
    cat: { geo: "Geografía", math: "Matemáticas", nature: "Naturaleza", art: "Arte", eng: "Idiomas", faith: "Fe y Biblia" },
    games: { flags: "Banderas del Mundo", memory: "Memoria del Mundo", capitals: "Capitales", count: "Cuentas y Números", animals: "Memoria de Animales", animalQuiz: "Quiz de Animales", color: "Pintar y Colorear", colors: "Colores y Formas", artMem: "Memoria de Formas", words: "Palabras del Mundo", wordMem: "Memoria de Palabras", bible: "Quiz de la Biblia", bibleMem: "Memoria Bíblica", curiosidades: "Curiosidades del Mundo", sciAnimals: "Ciencia de los Animales" },
    mascotHome: "¡Hola! ¿Aprendemos jugando?",
    profileTitle: "Mi perfil",
    statRounds: "Rondas", statPerfect: "100%", statFlags: "Banderas", statDays: "Días seguidos",
    worldProgress: "Mi mundo", achievementsGot: "Logros",
    installTitle: "Deja Lumus en tu pantalla de inicio",
    installIOS: "En Safari, toca Compartir y luego \"Añadir a pantalla de inicio\".",
    installAndroid: "En el menú de Chrome (⋮), toca \"Instalar aplicación\".",
    installWhy: "Así se abre a pantalla completa, como cualquier otra app.",
    installLater: "Ahora no",
    record: "Récord", newRecord: "¡Nuevo récord!", pairs: "Parejas", moves: "Jugadas",
    memStarsHint: "Las estrellas vienen del tiempo: cuanto más rápido, más estrellas.",
    badges: "Insignias",
    gallery: "Mi galería", newDrawing: "Elige un dibujo", finish: "¡Terminé!",
    paintAll: "Pinta todo para terminar", dailyCap: "Ya ganaste las monedas de hoy, ¡pero sigue pintando!",
    quit: "Salir", quitAsk: "¿Salir de la ronda? Las monedas gastadas no vuelven.", howMuch: "¿Cuánto es?",
    reset: "Reiniciar", resetAsk: "¿Borrar el progreso de este jugador? El nombre y el avatar quedan.",
    saveAnyway: "Guardar así", emptyGallery: "Nada aquí todavía. ¡Elige un dibujo y pinta!",
    bicho: { voa: "¿Cuál de estos vuela?", agua: "¿Cuál vive en el agua?", fazenda: "¿Cuál vive en la granja?",
      ave: "¿Cuál es un ave?", mamifero: "¿Cuál es un mamífero?", inseto: "¿Cuál es un insecto?",
      selva: "¿Cuál vive en la selva?", reptil: "¿Cuál es un reptil?", ovos: "¿Cuál pone huevos?",
      peixe: "¿Cuál es un pez?", patas4: "¿Cuál tiene cuatro patas?", gelo: "¿Cuál vive en el hielo?",
      anfibio: "¿Cuál es un anfibio?", nao_mamifero: "¿Cuál NO es un mamífero?",
      nao_reptil: "¿Cuál NO es un reptil?", nao_inseto: "¿Cuál NO es un insecto?",
      nao_ave: "¿Cuál NO es un ave?" },
    generateMore: "Generar 9 más",
    cores: { vermelho: "rojo", laranja: "naranja", amarelo: "amarillo", verde: "verde", azul: "azul", roxo: "morado", marrom: "marrón", preto: "negro", branco: "blanco" },
    formas: { circulo: "círculo", quadrado: "cuadrado", coracao: "corazón" },
    artQ: { cor: "¿Cuál es {x}?", forma: "¿Cuál es el {x}?", ambos: "¿Cuál es el {f} {c}?", nao: "¿Cuál NO es {x}?" },
    howSayIn: "¿Cómo se dice esto en {x}?", whichLang: "¿Qué idioma quieres aprender?",
    langHint: "Descarga más idiomas en 🌐 Idioma para aprender otros.",
    whichCapital: "¿Cuál es la capital?", capBrasil: "Estados de Brasil", capEUA: "Estados de EE. UU.",
    curQ: { pais: "¿En qué país encontramos {x}?", cidade: "¿En qué ciudad encontramos {x}?", agua: "¿En qué mar u océano encontramos {x}?", continente: "¿En qué continente encontramos {x}?" },
    sciQ: { grupo: "¿A qué grupo pertenece este animal?", dieta: "¿Qué come este animal?", casa: "¿Dónde vive este animal?", nasce: "¿Cómo nace la cría de este animal?", onde: "¿En qué continente vive este animal en la naturaleza?" },
    needTen: "Supera 10 niveles de la región anterior", claim: "Reclamar", claimReady: "¡Monedas listas!",
    claimTitle: "¡Llegaron tus monedas!",
    needPrev: "Abre el juego anterior",
    players: "¿Quién juega?", newPlayer: "Nuevo jugador", switchPlayer: "Cambiar jugador",
    language: "Idioma", use: "Usar",
    deleteAsk: "¿Borrar este jugador y todo su progreso?", cancel: "Cancelar", del: "Borrar",
    parents: "Padres", parentsInfo: "Sin anuncios. Sin enlaces externos. Sin datos. Funciona sin internet.",
  },
};

/* ---------- Pacotes de idioma baixáveis ----------
   Só a INTERFACE precisa de tradução (~70 frases). Os nomes dos países
   vêm de Intl.DisplayNames, que já fala ~100 idiomas de fábrica.
   Todos os 6 idiomas viajam embutidos no app: nada é baixado de servidor
   nenhum, nem de CDN próprio — a promessa de zero requisição a terceiros
   vale também para o texto. */

const LANG_CATALOG = {
  pt: "Português", en: "English", es: "Español",
  fr: "Français", de: "Deutsch", it: "Italiano",
};

const PACKS = {
  fr: {
    tagline: "Voyage autour du monde en jouant", play: "Jouer", start: "Commencer", hi: "Salut",
    createAvatar: "Crée ton personnage", name: "Ton prénom",
    skin: "Peau", hair: "Cheveux", cap: "Chapeau", glasses: "Lunettes", shirt: "T-shirt",
    none: "Aucun", remove: "Enlever",
    slots: { hairStyle: "Cheveux", cap: "Chapeau", glasses: "Lunettes", shirt: "T-shirt", shirtPattern: "Motif" },
    shopHint: "Gagne chapeaux, lunettes et motifs en jouant !", ready: "Prêt !",
    map: "Carte", shop: "Boutique", awards: "Trophées", coins: "pièces",
    nextCoins: "Pièces gratuites dans", locked: "Verrouillé", unlockFor: "Ouvrir pour",
    levels: { easy: "Facile", medium: "Moyen", hard: "Difficile", genius: "Génie" },
    stage: "Niveau", cost: "Coûte", notEnough: "Pas assez de pièces. Attends les pièces gratuites !",
    question: "Question", whichCountry: "Quel pays est ce drapeau ?", whichRegion: "Quelle région est ce drapeau ?",
    hints: "Indices", remove1: "Enlever 1 fausse", remove2: "Enlever 2 fausses", remove3: "Enlever 3 fausses",
    noRush: "SANS PRESSION", timeUp: "Temps écoulé !", correct: "Bravo !", wrong: "Presque !",
    roundOver: "Fin de la manche", score: "Points", accuracy: "Bonnes réponses", reward: "Récompense",
    perfect: "PARFAIT !", again: "Rejouer", backMap: "Retour à la carte", nextStage: "Niveau suivant",
    free: "Gratuit",
    buy: "Acheter", owned: "Tu as", equip: "Porter", equipped: "Porté", streak: "Série",
    tutorial: "Comment jouer", tut1: "Le drapeau apparaît ici.", tut2: "Choisis le bon nom parmi 4.",
    tut3: "Tu as quelques secondes. Vite !", tut4: "Bloqué ? Dépense des pièces pour enlever de mauvaises réponses.",
    gotIt: "Compris !", travel: "Bon voyage !",
    continents: { sa: "Amérique du Sud", na: "Amérique du Nord", eu: "Europe", af: "Afrique", as: "Asie", oc: "Océanie" },
    mascotHub: "Choisis un continent à explorer !", mascotStage: "C'est parti ! Tu peux le faire !",
    home: "Choisis un jeu", soon: "Bientôt",
    cat: { geo: "Géographie", math: "Maths", nature: "Nature", art: "Art", eng: "Langues", faith: "Foi et Bible" },
    games: { flags: "Drapeaux du Monde", memory: "Mémoire du Monde", capitals: "Capitales", count: "Calculs et Nombres", animals: "Mémoire des Animaux", animalQuiz: "Quiz des Animaux", color: "Peindre et Colorier", colors: "Couleurs et Formes", artMem: "Mémoire des Formes", words: "Mots du Monde", wordMem: "Mémoire des Mots", bible: "Quiz de la Bible", bibleMem: "Mémoire Biblique", curiosidades: "Curiosités du Monde", sciAnimals: "Sciences des Animaux" },
    mascotHome: "Salut ! On apprend en jouant ?",
    profileTitle: "Mon profil",
    statRounds: "Manches", statPerfect: "100%", statFlags: "Drapeaux", statDays: "Jours d'affilée",
    worldProgress: "Mon monde", achievementsGot: "Trophées",
    installTitle: "Garde Lumus sur ton écran d'accueil",
    installIOS: "Dans Safari, touche Partager puis \"Sur l'écran d'accueil\".",
    installAndroid: "Dans le menu de Chrome (⋮), touche \"Installer l'application\".",
    installWhy: "Il s'ouvre alors en plein écran, comme toute autre application.",
    installLater: "Plus tard",
    record: "Record", newRecord: "Nouveau record !", pairs: "Paires", moves: "Coups",
    memStarsHint: "Les étoiles viennent du chrono : plus tu es rapide, plus tu en gagnes.",
    badges: "Badges",
    gallery: "Ma galerie", newDrawing: "Choisis un dessin", finish: "Fini !",
    paintAll: "Colorie tout pour finir", dailyCap: "Les pièces du jour sont gagnées — continue à colorier !",
    quit: "Quitter", quitAsk: "Quitter la manche ? Les pièces dépensées ne reviennent pas.", howMuch: "Combien ça fait ?",
    reset: "Réinitialiser", resetAsk: "Remettre à zéro la progression ? Le nom et l'avatar restent.",
    saveAnyway: "Garder comme ça", emptyGallery: "Rien ici pour l'instant. Choisis un dessin !",
    bicho: { voa: "Lequel vole ?", agua: "Lequel vit dans l'eau ?", fazenda: "Lequel vit à la ferme ?",
      ave: "Lequel est un oiseau ?", mamifero: "Lequel est un mammifère ?", inseto: "Lequel est un insecte ?",
      selva: "Lequel vit dans la jungle ?", reptil: "Lequel est un reptile ?", ovos: "Lequel pond des œufs ?",
      peixe: "Lequel est un poisson ?", patas4: "Lequel a quatre pattes ?", gelo: "Lequel vit sur la glace ?",
      anfibio: "Lequel est un amphibien ?", nao_mamifero: "Lequel n'est PAS un mammifère ?",
      nao_reptil: "Lequel n'est PAS un reptile ?", nao_inseto: "Lequel n'est PAS un insecte ?",
      nao_ave: "Lequel n'est PAS un oiseau ?" },
    generateMore: "Générer 9 de plus",
    cores: { vermelho: "rouge", laranja: "orange", amarelo: "jaune", verde: "vert", azul: "bleu", roxo: "violet", marrom: "marron", preto: "noir", branco: "blanc" },
    formas: { circulo: "cercle", quadrado: "carré", coracao: "cœur" },
    artQ: { cor: "Lequel est {x} ?", forma: "Lequel est le {x} ?", ambos: "Lequel est le {f} {c} ?", nao: "Lequel n'est PAS {x} ?" },
    howSayIn: "Comment dit-on ça en {x} ?", whichLang: "Quelle langue veux-tu apprendre ?",
    langHint: "Télécharge d'autres langues dans 🌐 Langue.",
    whichCapital: "Quelle est la capitale ?", capBrasil: "États du Brésil", capEUA: "États des USA",
    curQ: { pais: "Dans quel pays trouve-t-on {x} ?", cidade: "Dans quelle ville trouve-t-on {x} ?", agua: "Dans quelle mer ou quel océan trouve-t-on {x} ?", continente: "Sur quel continent trouve-t-on {x} ?" },
    sciQ: { grupo: "À quel groupe appartient cet animal ?", dieta: "Que mange cet animal ?", casa: "Où vit cet animal ?", nasce: "Comment naît le petit de cet animal ?", onde: "Sur quel continent cet animal vit-il à l'état sauvage ?" },
    needTen: "Termine 10 niveaux de la région précédente", claim: "Récupérer", claimReady: "Pièces prêtes !",
    claimTitle: "Tes pièces sont arrivées !",
    needPrev: "Débloque le jeu précédent",
    players: "Qui joue ?", newPlayer: "Nouveau joueur", switchPlayer: "Changer de joueur",
    language: "Langue", use: "Utiliser",
    deleteAsk: "Supprimer ce joueur et toute sa progression ?", cancel: "Annuler", del: "Supprimer",
    parents: "Espace parents", parentsInfo: "Sans pub. Sans liens externes. Sans collecte de données. Fonctionne hors ligne.",
  },
  de: {
    tagline: "Spielend um die Welt reisen", play: "Spielen", start: "Los", hi: "Hallo",
    createAvatar: "Erstelle deine Figur", name: "Dein Name",
    skin: "Haut", hair: "Haare", cap: "Hut", glasses: "Brille", shirt: "Shirt",
    none: "Keins", remove: "Abnehmen",
    slots: { hairStyle: "Haare", cap: "Hut", glasses: "Brille", shirt: "Shirt", shirtPattern: "Muster" },
    shopHint: "Hüte, Brillen und Muster verdienst du beim Spielen!", ready: "Fertig!",
    map: "Karte", shop: "Shop", awards: "Trophäen", coins: "Münzen",
    nextCoins: "Gratis-Münzen in", locked: "Gesperrt", unlockFor: "Öffnen für",
    levels: { easy: "Leicht", medium: "Mittel", hard: "Schwer", genius: "Genie" },
    stage: "Stufe", cost: "Kostet", notEnough: "Nicht genug Münzen. Warte auf die Gratis-Münzen!",
    question: "Frage", whichCountry: "Welches Land ist diese Flagge?", whichRegion: "Welche Region ist diese Flagge?",
    hints: "Tipps", remove1: "1 falsche entfernen", remove2: "2 falsche entfernen", remove3: "3 falsche entfernen",
    noRush: "OHNE ZEITDRUCK", timeUp: "Zeit ist um!", correct: "Richtig!", wrong: "Fast!",
    roundOver: "Runde vorbei", score: "Punkte", accuracy: "Richtig", reward: "Belohnung",
    perfect: "PERFEKT!", again: "Nochmal spielen", backMap: "Zurück zur Karte", nextStage: "Nächste Stufe",
    free: "Gratis",
    buy: "Kaufen", owned: "Du hast", equip: "Tragen", equipped: "Getragen", streak: "Serie",
    tutorial: "So wird gespielt", tut1: "Die Flagge erscheint hier.", tut2: "Wähle den richtigen Namen von 4.",
    tut3: "Du hast ein paar Sekunden. Schnell!", tut4: "Keine Ahnung? Gib Münzen aus, um falsche Antworten zu entfernen.",
    gotIt: "Verstanden!", travel: "Gute Reise!",
    continents: { sa: "Südamerika", na: "Nordamerika", eu: "Europa", af: "Afrika", as: "Asien", oc: "Ozeanien" },
    mascotHub: "Wähle einen Kontinent!", mascotStage: "Los geht's! Du schaffst das!",
    home: "Wähle ein Spiel", soon: "Bald",
    cat: { geo: "Geografie", math: "Mathe", nature: "Natur", art: "Kunst", eng: "Sprachen", faith: "Glaube und Bibel" },
    games: { flags: "Flaggen der Welt", memory: "Welt-Memory", capitals: "Hauptstädte", count: "Rechnen und Zahlen", animals: "Tier-Memory", animalQuiz: "Tier-Quiz", color: "Malen und Ausmalen", colors: "Farben und Formen", artMem: "Formen-Memory", words: "Wörter der Welt", wordMem: "Wort-Memory", bible: "Bibel-Quiz", bibleMem: "Bibel-Memory", curiosidades: "Wissenswertes der Welt", sciAnimals: "Tierkunde" },
    mascotHome: "Hallo! Lust, spielend zu lernen?",
    profileTitle: "Mein Profil",
    statRounds: "Runden", statPerfect: "100%", statFlags: "Flaggen", statDays: "Tage in Folge",
    worldProgress: "Meine Welt", achievementsGot: "Trophäen",
    installTitle: "Lumus auf den Startbildschirm legen",
    installIOS: "In Safari auf Teilen tippen und dann \"Zum Home-Bildschirm\".",
    installAndroid: "Im Chrome-Menü (⋮) auf \"App installieren\" tippen.",
    installWhy: "Dann öffnet sie im Vollbild, wie jede andere App.",
    installLater: "Später",
    record: "Rekord", newRecord: "Neuer Rekord!", pairs: "Paare", moves: "Züge",
    memStarsHint: "Sterne kommen von der Uhr: je schneller, desto mehr.",
    badges: "Abzeichen",
    gallery: "Meine Galerie", newDrawing: "Wähle ein Bild", finish: "Fertig!",
    paintAll: "Male alles aus, um fertig zu werden", dailyCap: "Die Münzen von heute sind vergeben — mal ruhig weiter!",
    quit: "Beenden", quitAsk: "Runde verlassen? Ausgegebene Münzen gibt es nicht zurück.", howMuch: "Wie viel ist das?",
    reset: "Zurücksetzen", resetAsk: "Fortschritt zurücksetzen? Name und Avatar bleiben.",
    saveAnyway: "So speichern", emptyGallery: "Noch nichts hier. Wähle ein Bild und male!",
    bicho: { voa: "Welches fliegt?", agua: "Welches lebt im Wasser?", fazenda: "Welches lebt auf dem Bauernhof?",
      ave: "Welches ist ein Vogel?", mamifero: "Welches ist ein Säugetier?", inseto: "Welches ist ein Insekt?",
      selva: "Welches lebt im Dschungel?", reptil: "Welches ist ein Reptil?", ovos: "Welches legt Eier?",
      peixe: "Welches ist ein Fisch?", patas4: "Welches hat vier Beine?", gelo: "Welches lebt auf dem Eis?",
      anfibio: "Welches ist eine Amphibie?", nao_mamifero: "Welches ist KEIN Säugetier?",
      nao_reptil: "Welches ist KEIN Reptil?", nao_inseto: "Welches ist KEIN Insekt?",
      nao_ave: "Welches ist KEIN Vogel?" },
    generateMore: "9 weitere erzeugen",
    cores: { vermelho: "rot", laranja: "orange", amarelo: "gelb", verde: "grün", azul: "blau", roxo: "lila", marrom: "braun", preto: "schwarz", branco: "weiß" },
    formas: { circulo: "Kreis", quadrado: "Quadrat", coracao: "Herz" },
    artQ: { cor: "Welches ist {x}?", forma: "Welches ist das {x}?", ambos: "Welches ist das {c} {f}?", nao: "Welches ist NICHT {x}?" },
    howSayIn: "Wie heißt das auf {x}?", whichLang: "Welche Sprache möchtest du lernen?",
    langHint: "Lade unter 🌐 Sprache weitere Sprachen herunter.",
    whichCapital: "Wie heißt die Hauptstadt?", capBrasil: "Bundesstaaten Brasiliens", capEUA: "US-Bundesstaaten",
    curQ: { pais: "In welchem Land finden wir {x}?", cidade: "In welcher Stadt finden wir {x}?", agua: "In welchem Meer oder Ozean finden wir {x}?", continente: "Auf welchem Kontinent finden wir {x}?" },
    sciQ: { grupo: "Zu welcher Gruppe gehört dieses Tier?", dieta: "Was frisst dieses Tier?", casa: "Wo lebt dieses Tier?", nasce: "Wie kommt das Junge dieses Tieres zur Welt?", onde: "Auf welchem Kontinent lebt dieses Tier in freier Natur?" },
    needTen: "Schaffe 10 Stufen der vorigen Region", claim: "Abholen", claimReady: "Münzen bereit!",
    claimTitle: "Deine Münzen sind da!",
    needPrev: "Vorheriges Spiel freischalten",
    players: "Wer spielt?", newPlayer: "Neuer Spieler", switchPlayer: "Spieler wechseln",
    language: "Sprache", use: "Verwenden",
    deleteAsk: "Diesen Spieler und den ganzen Fortschritt löschen?", cancel: "Abbrechen", del: "Löschen",
    parents: "Elternbereich", parentsInfo: "Keine Werbung. Keine externen Links. Keine Datensammlung. Offline nutzbar.",
  },
  it: {
    tagline: "Viaggia per il mondo giocando", play: "Gioca", start: "Inizia", hi: "Ciao",
    createAvatar: "Crea il tuo personaggio", name: "Il tuo nome",
    skin: "Pelle", hair: "Capelli", cap: "Cappello", glasses: "Occhiali", shirt: "Maglietta",
    none: "Nessuno", remove: "Togli",
    slots: { hairStyle: "Capelli", cap: "Cappello", glasses: "Occhiali", shirt: "Maglietta", shirtPattern: "Fantasia" },
    shopHint: "Cappelli, occhiali e fantasie si guadagnano giocando!", ready: "Pronto!",
    map: "Mappa", shop: "Negozio", awards: "Premi", coins: "monete",
    nextCoins: "Monete gratis tra", locked: "Bloccato", unlockFor: "Apri con",
    levels: { easy: "Facile", medium: "Medio", hard: "Difficile", genius: "Genio" },
    stage: "Livello", cost: "Costa", notEnough: "Monete insufficienti. Aspetta quelle gratis!",
    question: "Domanda", whichCountry: "Di che paese è questa bandiera?", whichRegion: "Di che regione è questa bandiera?",
    hints: "Aiuti", remove1: "Togli 1 sbagliata", remove2: "Togli 2 sbagliate", remove3: "Togli 3 sbagliate",
    noRush: "SENZA FRETTA", timeUp: "Tempo scaduto!", correct: "Bravo!", wrong: "Quasi!",
    roundOver: "Fine del turno", score: "Punti", accuracy: "Giuste", reward: "Premio",
    perfect: "PERFETTO!", again: "Gioca ancora", backMap: "Torna alla mappa", nextStage: "Livello successivo",
    free: "Gratis",
    buy: "Compra", owned: "Hai", equip: "Indossa", equipped: "Indossato", streak: "Serie",
    tutorial: "Come si gioca", tut1: "La bandiera appare qui.", tut2: "Scegli il nome giusto tra 4.",
    tut3: "Hai pochi secondi. Veloce!", tut4: "Non lo sai? Spendi monete per togliere risposte sbagliate.",
    gotIt: "Ho capito!", travel: "Buon viaggio!",
    continents: { sa: "Sud America", na: "Nord America", eu: "Europa", af: "Africa", as: "Asia", oc: "Oceania" },
    mascotHub: "Scegli un continente!", mascotStage: "Andiamo! Ce la puoi fare!",
    home: "Scegli un gioco", soon: "Presto",
    cat: { geo: "Geografia", math: "Matematica", nature: "Natura", art: "Arte", eng: "Lingue", faith: "Fede e Bibbia" },
    games: { flags: "Bandiere del Mondo", memory: "Memoria del Mondo", capitals: "Capitali", count: "Calcoli e Numeri", animals: "Memoria degli Animali", animalQuiz: "Quiz degli Animali", color: "Dipingi e Colora", colors: "Colori e Forme", artMem: "Memoria delle Forme", words: "Parole del Mondo", wordMem: "Memoria delle Parole", bible: "Quiz della Bibbia", bibleMem: "Memoria Biblica", curiosidades: "Curiosità del Mondo", sciAnimals: "Scienze degli Animali" },
    mascotHome: "Ciao! Impariamo giocando?",
    profileTitle: "Il mio profilo",
    statRounds: "Turni", statPerfect: "100%", statFlags: "Bandiere", statDays: "Giorni di fila",
    worldProgress: "Il mio mondo", achievementsGot: "Premi",
    installTitle: "Tieni Lumus nella schermata Home",
    installIOS: "In Safari tocca Condividi e poi \"Aggiungi a Home\".",
    installAndroid: "Nel menu di Chrome (⋮) tocca \"Installa app\".",
    installWhy: "Così si apre a schermo intero, come ogni altra app.",
    installLater: "Non ora",
    record: "Record", newRecord: "Nuovo record!", pairs: "Coppie", moves: "Mosse",
    memStarsHint: "Le stelle vengono dal tempo: più sei veloce, più ne prendi.",
    badges: "Distintivi",
    gallery: "La mia galleria", newDrawing: "Scegli un disegno", finish: "Finito!",
    paintAll: "Colora tutto per finire", dailyCap: "Le monete di oggi sono finite — ma continua a colorare!",
    quit: "Esci", quitAsk: "Uscire dal turno? Le monete spese non tornano.", howMuch: "Quanto fa?",
    reset: "Azzera", resetAsk: "Azzerare i progressi di questo giocatore? Nome e avatar restano.",
    saveAnyway: "Salva così", emptyGallery: "Ancora niente qui. Scegli un disegno e colora!",
    bicho: { voa: "Quale vola?", agua: "Quale vive nell'acqua?", fazenda: "Quale vive nella fattoria?",
      ave: "Quale è un uccello?", mamifero: "Quale è un mammifero?", inseto: "Quale è un insetto?",
      selva: "Quale vive nella giungla?", reptil: "Quale è un rettile?", ovos: "Quale depone le uova?",
      peixe: "Quale è un pesce?", patas4: "Quale ha quattro zampe?", gelo: "Quale vive sul ghiaccio?",
      anfibio: "Quale è un anfibio?", nao_mamifero: "Quale NON è un mammifero?",
      nao_reptil: "Quale NON è un rettile?", nao_inseto: "Quale NON è un insetto?",
      nao_ave: "Quale NON è un uccello?" },
    generateMore: "Genera altri 9",
    cores: { vermelho: "rosso", laranja: "arancione", amarelo: "giallo", verde: "verde", azul: "blu", roxo: "viola", marrom: "marrone", preto: "nero", branco: "bianco" },
    formas: { circulo: "cerchio", quadrado: "quadrato", coracao: "cuore" },
    artQ: { cor: "Quale è {x}?", forma: "Quale è il {x}?", ambos: "Quale è il {f} {c}?", nao: "Quale NON è {x}?" },
    howSayIn: "Come si dice in {x}?", whichLang: "Quale lingua vuoi imparare?",
    langHint: "Scarica altre lingue in 🌐 Lingua.",
    whichCapital: "Qual è la capitale?", capBrasil: "Stati del Brasile", capEUA: "Stati degli USA",
    curQ: { pais: "In quale paese troviamo {x}?", cidade: "In quale città troviamo {x}?", agua: "In quale mare o oceano troviamo {x}?", continente: "In quale continente troviamo {x}?" },
    sciQ: { grupo: "A quale gruppo appartiene questo animale?", dieta: "Cosa mangia questo animale?", casa: "Dove vive questo animale?", nasce: "Come nasce il cucciolo di questo animale?", onde: "In quale continente vive questo animale in natura?" },
    needTen: "Supera 10 livelli della regione precedente", claim: "Riscuoti", claimReady: "Monete pronte!",
    claimTitle: "Le tue monete sono arrivate!",
    needPrev: "Sblocca il gioco precedente",
    players: "Chi gioca?", newPlayer: "Nuovo giocatore", switchPlayer: "Cambia giocatore",
    language: "Lingua", use: "Usa",
    deleteAsk: "Eliminare questo giocatore e tutti i suoi progressi?", cancel: "Annulla", del: "Elimina",
    parents: "Area genitori", parentsInfo: "Niente pubblicità. Niente link esterni. Nessun dato raccolto. Funziona offline.",
  },
};

/* Carrega um idioma. Ordem: já carregado → cache do aparelho → pacote
   embutido. Nunca deixa o app sem texto e nunca sai para a rede. */
async function loadLang(code) {
  if (T[code]) return true;
  try {
    const c = await window.storage.get(`lumus:lang:${code}`);
    if (c?.value) { T[code] = JSON.parse(c.value); return true; }
  } catch { }
  if (PACKS[code]) {
    T[code] = PACKS[code];
    try { window.storage.set(`lumus:lang:${code}`, JSON.stringify(PACKS[code])); } catch { }
    return true;
  }
  return false;
}

/* Já está rodando como app instalado? Então não há o que convidar. */
function jaInstalado() {
  try {
    return window.matchMedia("(display-mode: standalone)").matches
      || window.navigator.standalone === true;
  } catch { return false; }
}
function ehIOS() {
  try { return /iphone|ipad|ipod/i.test(navigator.userAgent); } catch { return false; }
}

/* Idioma do aparelho, se o app já falar */
function deviceLang() {
  try {
    const l = (navigator.language || "en").slice(0, 2).toLowerCase();
    return LANG_CATALOG[l] ? l : "en";
  } catch { return "en"; }
}

/* ---------- Dados: países por continente + tier de dificuldade ----------
   tier 1 = muito conhecido ... 4 = raro.
   Nomes vêm de Intl.DisplayNames → i18n automático em ~100 idiomas.        */
const DATA = {
  sa: { AR:1, BR:1, CL:1, UY:2, PY:2, BO:2, PE:2, EC:2, CO:1, VE:2, GY:4, SR:4 },
  na: { US:1, CA:1, MX:1, CU:2, JM:2, HT:3, DO:3, GT:3, CR:2, PA:3, HN:3, NI:3, SV:3, BZ:4, BS:4, TT:4,
        // ilhas do Caribe
        AG:4, BB:4, DM:4, GD:4, KN:4, LC:4, VC:4, PR:3 },
  eu: { PT:1, ES:1, FR:1, IT:1, DE:1, GB:1, IE:2, NL:2, BE:2, CH:2, AT:2, GR:2, SE:2, NO:2, FI:2, DK:2, PL:3, RU:1, UA:2, HU:3, CZ:3, RO:3, HR:3, IS:3, RS:4, BG:4, SK:4, SI:4, LT:4, LV:4, EE:4, AL:4, MT:4, LU:4,
        CY:4, ME:4, MC:4, AD:4, SM:4 },
  af: { ZA:1, EG:1, NG:2, KE:2, MA:2, AO:2, MZ:2, GH:2, ET:3, SN:3, CM:3, TZ:3, DZ:3, TN:3, CD:3, CI:3, ZW:4, NA:4, UG:4, ZM:4, ML:4, MG:3, BW:4, RW:4,
        // ilhas africanas
        CV:4, MU:4, SC:4, KM:4, ST:4 },
  as: { CN:1, JP:1, IN:1, KR:1, TH:2, VN:2, ID:2, PH:2, MY:2, SG:2, SA:2, AE:2, IL:2, TR:2, PK:3, BD:3, NP:3, LK:3, IR:3, IQ:3, MN:4, KZ:4, UZ:4, KH:4, LA:4, MM:4, QA:4, JO:4, LB:4, SY:4, AF:4, BT:4,
        // ilhas asiáticas
        MV:4, BN:4, TL:4, BH:4 },
  oc: { AU:1, NZ:1, FJ:3, PG:4, WS:4, TO:4, VU:4, SB:4,
        KI:4, TV:4, NR:4, MH:4, FM:4, PW:4 },
};

/* Nível Gênio: bandeiras subnacionais (estados / regiões).
   ATENÇÃO: o pacote flag-icons, de onde scripts/prepare-flags.mjs copia os SVGs,
   só traz 7 subnacionais: gb-eng, gb-sct, gb-wls, gb-nir, es-ct, es-pv e es-ga.
   Todos os us-* daqui, mais es-an, es-cn e es-ib, ficam sem arquivo e caem no
   desenho de reserva do jogo. Para acender qualquer uma delas — inclusive
   estados do Brasil, províncias do Canadá ou bandeiras de cidade — basta salvar
   o SVG em public/flags/ com o mesmo código; nada é buscado na internet. */
const SUBFLAGS = {
  eu: [
    { code: "gb-eng", pt: "Inglaterra", en: "England", es: "Inglaterra" },
    { code: "gb-sct", pt: "Escócia", en: "Scotland", es: "Escocia" },
    { code: "gb-wls", pt: "País de Gales", en: "Wales", es: "Gales" },
    { code: "gb-nir", pt: "Irlanda do Norte", en: "Northern Ireland", es: "Irlanda del Norte" },
    { code: "es-ct", pt: "Catalunha", en: "Catalonia", es: "Cataluña" },
    { code: "es-pv", pt: "País Basco", en: "Basque Country", es: "País Vasco" },
    { code: "es-ga", pt: "Galícia", en: "Galicia", es: "Galicia" },
    { code: "es-an", pt: "Andaluzia", en: "Andalusia", es: "Andalucía" },
    { code: "es-cn", pt: "Ilhas Canárias", en: "Canary Islands", es: "Islas Canarias" },
    { code: "es-ib", pt: "Ilhas Baleares", en: "Balearic Islands", es: "Islas Baleares" },
  ],
  na: [
    { code: "us-ca", pt: "Califórnia", en: "California", es: "California" },
    { code: "us-tx", pt: "Texas", en: "Texas", es: "Texas" },
    { code: "us-ny", pt: "Nova York", en: "New York", es: "Nueva York" },
    { code: "us-fl", pt: "Flórida", en: "Florida", es: "Florida" },
    { code: "us-ak", pt: "Alasca", en: "Alaska", es: "Alaska" },
    { code: "us-hi", pt: "Havaí", en: "Hawaii", es: "Hawái" },
    { code: "us-az", pt: "Arizona", en: "Arizona", es: "Arizona" },
    { code: "us-nm", pt: "Novo México", en: "New Mexico", es: "Nuevo México" },
    { code: "us-co", pt: "Colorado", en: "Colorado", es: "Colorado" },
    { code: "us-md", pt: "Maryland", en: "Maryland", es: "Maryland" },
    { code: "us-oh", pt: "Ohio", en: "Ohio", es: "Ohio" },
    { code: "us-la", pt: "Luisiana", en: "Louisiana", es: "Luisiana" },
  ],
};

/* Catálogo do hub: categorias e seus jogos. Só "flags" está pronto. */
const CATALOG = [
  { id: "geo", icon: "🌍", color: "#4C6FFF", games: [
      { id: "flags", icon: "🚩", color: "#00B894", preco: 0, ready: true },
      { id: "memory", icon: "🧠", color: "#4C6FFF", preco: 150, ready: true },
      { id: "capitals", icon: "🏛️", color: "#6A5AE0", preco: 500, ready: true },
      { id: "curiosidades", icon: "🗺️", color: "#00C2CB", preco: 800, ready: true },
  ]},
  { id: "math", icon: "🔢", color: "#F9A826", games: [
      { id: "count", icon: "🧮", color: "#F9A826", preco: 0, ready: true },
  ]},
  { id: "nature", icon: "🦁", color: "#00C2CB", games: [
      { id: "animals", icon: "🐾", color: "#00C2CB", preco: 0, ready: true },
      { id: "animalQuiz", icon: "🦉", color: "#00B894", preco: 300, ready: true },
      { id: "sciAnimals", icon: "🔬", color: "#6A5AE0", preco: 600, ready: true },
  ]},
  { id: "art", icon: "🎨", color: "#E84393", games: [
      { id: "color", icon: "🖍️", color: "#E84393", preco: 0, ready: true },
      { id: "colors", icon: "🌈", color: "#F9A826", preco: 200, ready: true },
      { id: "artMem", icon: "🧩", color: "#9B59B6", preco: 500, ready: true },
  ]},
  { id: "eng", icon: "🔤", color: "#4C6FFF", games: [
      { id: "words", icon: "🔤", color: "#4C6FFF", preco: 0, ready: true },
      { id: "wordMem", icon: "🃏", color: "#6A5AE0", preco: 350, ready: true },
  ]},
  { id: "faith", icon: "✝️", color: "#8D6E3A", games: [
      { id: "bible", icon: "✝️", color: "#8D6E3A", preco: 0, ready: true },
      { id: "bibleMem", icon: "🕊️", color: "#00C2CB", preco: 350, ready: true },
  ]},
];

/* Os grátis já nascem abertos */
const JOGOS_GRATIS = CATALOG.flatMap(c => c.games.filter(g => !g.preco).map(g => g.id));



/* Dentro de cada área os jogos abrem em ordem: o primeiro é livre e cada
   seguinte custa mais que o anterior. As áreas em si nunca ficam trancadas,
   então sempre há algo novo para fazer em outro canto do hub. */
const PRECO_GERAR = 100;   // 9 desenhos novos no jogo de pintar

/* Dentro de cada jogo a progressão também se compra, como os continentes
   das bandeiras: o primeiro trecho é livre e os seguintes vão custando mais. */
/* Cada trilha compra os próprios níveis: abrir o Gênio da Europa não abre o
   da Ásia. Os preços saem do que a própria trilha rende — zerar o nível
   anterior com 100% quase paga o seguinte, e a folga vai diminuindo:
     Fácil   5 fases × 55 líquidos = 275  →  Médio  custa 200 (sobra)
     Médio   4 fases × 55          = 220  →  Difícil custa 250 (falta pouco)
     Difícil 3 fases × 55          = 165  →  Gênio  custa 300 (exige repetir)   */
const BAND_PRECO = { easy: 0, medium: 200, hard: 250, genius: 300 };
const MEM_PRECO  = { easy: 0, medium: 100, hard: 150, genius: 200 };   // ~3 a 5 rodadas boas cada
const CAP_PRECO  = {                                                    // regiões das capitais
  cap_br: 0, cap_sa: 100, cap_na: 150, cap_eu: 250,
  cap_af: 350, cap_as: 450, cap_oc: 550, cap_us: 700,
};

/* Países-ilha, para a conquista "Caçador de ilhas" */
const ISLANDS = new Set(["CU","JM","HT","DO","BS","TT","AG","BB","DM","GD","KN","LC","VC","PR",
  "IE","IS","MT","CY","GB","MG","CV","MU","SC","KM","ST","JP","ID","PH","LK","MV","BN","TL","BH","SG",
  "AU","NZ","FJ","PG","WS","TO","VU","SB","KI","TV","NR","MH","FM","PW"]);

/* Ordem de desbloqueio + meio de transporte para chegar lá */
const ROUTE = [
  { id: "sa", cost: 0, emoji: "🚗", color: "#00B894" },
  { id: "na", cost: 150, emoji: "🚗", color: "#FF7043" },
  { id: "eu", cost: 300, emoji: "✈️", color: "#4C6FFF" },
  { id: "af", cost: 450, emoji: "🚢", color: "#F9A826" },
  { id: "as", cost: 600, emoji: "✈️", color: "#E84393" },
  { id: "oc", cost: 800, emoji: "🚢", color: "#00C2CB" },
];

/* ---------- Escada de fases ----------
   Toda trilha sobe pelas mesmas quatro faixas, na mesma proporção: um terço
   Fácil, um quarto Médio, um quinto Difícil, o resto Gênio. O que muda de um
   jogo para outro é só o NÚMERO de degraus: as bandeiras de um continente têm
   banco pequeno e param em 15, a Bíblia tem milhares de perguntas e vai a 100.
   Assim a sensação é a mesma em todo o app — muda o tamanho da escada, não o
   jeito de subir. */
const DIFFS = ["easy", "medium", "hard", "genius"];

/* O relógio só entra no Médio e vai apertando dentro de cada faixa.
   Em 15 fases isso devolve exatamente a curva antiga: 16-14-12-10 · 9-8-7 · 6-5-4. */
const FAIXA_TEMPO = { medium: [16, 10], hard: [9, 7], genius: [6, 4] };

function montarEscada(total) {
  const nE = Math.round(total * 0.34);
  const nM = Math.round(total * 0.26);
  const nH = Math.round(total * 0.20);
  const nG = total - nE - nM - nH;
  const porFaixa = { easy: nE, medium: nM, hard: nH, genius: nG };
  const plan = DIFFS.flatMap(d => Array(porFaixa[d]).fill(d));
  const times = [];
  let i = 0;
  for (const d of DIFFS) {
    const k = porFaixa[d];
    for (let j = 0; j < k; j++, i++) {
      if (d === "easy") { times.push(null); continue; }
      const [ini, fim] = FAIXA_TEMPO[d];
      times.push(k > 1 ? Math.round(ini - (ini - fim) * (j / (k - 1))) : ini);
    }
  }
  return { total, plan, times };
}

const ESCADA_PADRAO = montarEscada(15);
/* Só as trilhas de banco grande esticam. O resto herda os 15 degraus. */
const ESCADAS = {
  curiosidades: montarEscada(30),
  ciencias: montarEscada(25),
  bible: montarEscada(100),
};
const escadaDe = cont => ESCADAS[cont] || ESCADA_PADRAO;
const totalDe = cont => escadaDe(cont).total;
const bandFor = (cont, stage) => escadaDe(cont).plan[Math.min(stage, totalDe(cont)) - 1];
const tempoDe = (cont, stage) => escadaDe(cont).times[Math.min(stage, totalDe(cont)) - 1];
const BAND_COLOR = { easy: "#00B894", medium: "#4C6FFF", hard: "#F9A826", genius: "#E84393" };

/* ---------- Economia ---------- */
const ECON = {
  start: 50,                       // com o que se começa
  roundCost: 10,
  refillAmount: 100,               // liberadas a cada 3h, mas só entram se resgatar
  refillMs: 3 * 60 * 60 * 1000,
  cap: Infinity,                   // sem teto: o contador só anda quando se resgata
  hint1: 8, hint2: 20, hint3: 80,
  reward: { 1: 25, 2: 45, 3: 65 },  // por estrela, +5 extra se não usar dica
  memReward: { 1: 10, 2: 25, 3: 50 },
  colorReward: 10,                 // por desenho terminado
  colorDailyCap: 200,              // 20 desenhos premiados por dia (20 × 10)
};

/* ---------- Loja de avatar ---------- */
const SHOP_CATS = ["hairStyle", "cap", "glasses", "shirt", "shirtPattern"];

/* Raridades: poucos itens baratos para dar gosto logo no começo,
   e uma escada longa até os lendários, que exigem muito jogo. */
const RARITY = {
  comum:     { cor: "#8B93AD", label: "•" },
  raro:      { cor: "#4C6FFF", label: "◆" },
  epico:     { cor: "#9B59B6", label: "★" },
  lendario:  { cor: "#F9A826", label: "👑" },
};

const SHOP_ITEMS = [
  // ---- de graça: ninguém precisa juntar moeda para se parecer consigo ----
  { id: "h_bob", type: "hairStyle", val: "bob", price: 0, r: "comum" },
  { id: "h_wavy", type: "hairStyle", val: "wavy", price: 0, r: "comum" },
  // ---- comuns (30–90) ----
  { id: "h_buzz", type: "hairStyle", val: "buzz", price: 30, r: "comum" },
  { id: "c_red", type: "cap", val: "cap|#E74C3C", price: 40, r: "comum" },
  { id: "c_blue", type: "cap", val: "cap|#3498DB", price: 40, r: "comum" },
  { id: "h_curly", type: "hairStyle", val: "curly", price: 60, r: "comum" },
  { id: "s_purple", type: "shirt", val: "#9B59B6", price: 60, r: "comum" },
  { id: "g_round", type: "glasses", val: "round", price: 80, r: "comum" },
  { id: "p_stripe", type: "shirtPattern", val: "stripe", price: 90, r: "comum" },
  // ---- raros (250–700) ----
  { id: "h_pony", type: "hairStyle", val: "ponytail", price: 250, r: "raro" },
  { id: "c_green", type: "cap", val: "cap|#00B894", price: 300, r: "raro" },
  { id: "s_navy", type: "shirt", val: "#2C3E50", price: 350, r: "raro" },
  { id: "s_lime", type: "shirt", val: "#7BC950", price: 350, r: "raro" },
  { id: "g_nerd", type: "glasses", val: "nerd", price: 450, r: "raro" },
  { id: "p_dots", type: "shirtPattern", val: "dots", price: 500, r: "raro" },
  { id: "c_bow", type: "cap", val: "bow|#FF69B4", price: 700, r: "raro" },
  // ---- épicos (1200–2500) ----
  { id: "h_afro", type: "hairStyle", val: "afro", price: 1200, r: "epico" },
  { id: "c_beanie", type: "cap", val: "beanie|#9B59B6", price: 1400, r: "epico" },
  { id: "c_beanie2", type: "cap", val: "beanie|#E84393", price: 1400, r: "epico" },
  { id: "g_sun", type: "glasses", val: "sun", price: 1800, r: "epico" },
  { id: "p_star", type: "shirtPattern", val: "star", price: 2200, r: "epico" },
  { id: "c_explorer", type: "cap", val: "explorer", price: 2500, r: "epico" },
  // ---- lendários (4500–9000) ----
  { id: "g_heart", type: "glasses", val: "heart", price: 4500, r: "lendario" },
  { id: "p_heart", type: "shirtPattern", val: "heart", price: 5500, r: "lendario" },
  { id: "p_rainbow", type: "shirtPattern", val: "rainbow", price: 7000, r: "lendario" },
  { id: "c_crown", type: "cap", val: "crown", price: 9000, r: "lendario" },
];



/* ---------- Conquistas ----------
   Cada conquista tem categoria e nível. A categoria organiza a tela — são
   mais de 50 e sem agrupamento viram uma lista que ninguém lê. O nível vale
   moedas: quanto mais longe a criança precisa ir, maior o prêmio quando
   acende. As moedas entram uma única vez, na primeira vez. */
const PREMIO_CONQUISTA = { 1: 30, 2: 60, 3: 120, 4: 250 };

const CONQ_CATS = [
  { id: "geral",  icon: "🎯", pt: "Geral",      en: "General",    es: "General" },
  { id: "geo",    icon: "🌍", pt: "Geografia",  en: "Geography",  es: "Geografía" },
  { id: "cap",    icon: "🏛️", pt: "Capitais",   en: "Capitals",   es: "Capitales" },
  { id: "nature", icon: "🦁", pt: "Natureza",   en: "Nature",     es: "Naturaleza" },
  { id: "math",   icon: "🔢", pt: "Matemática", en: "Math",       es: "Matemáticas" },
  { id: "art",    icon: "🎨", pt: "Arte",       en: "Art",        es: "Arte" },
  { id: "lang",   icon: "🔤", pt: "Idiomas",    en: "Languages",  es: "Idiomas" },
  { id: "bible",  icon: "✝️", pt: "Bíblia",     en: "Bible",      es: "Biblia" },
  { id: "mem",    icon: "🧠", pt: "Memória",    en: "Memory",     es: "Memoria" },
  { id: "habit",  icon: "📅", pt: "Dedicação",  en: "Dedication", es: "Constancia" },
];

const ACHIEVEMENTS = [
  /* --- geral --- */
  { id: "first", cat: "geral", n: 1, icon: "🎬", pt: "Primeira rodada", en: "First round", es: "Primera ronda", test: s => s.rounds >= 1 },
  { id: "perfect1", cat: "geral", n: 1, icon: "💯", pt: "Um 100%", en: "One perfect round", es: "Una ronda perfecta", test: s => s.perfect >= 1 },
  { id: "perfect5", cat: "geral", n: 2, icon: "🏆", pt: "Cinco 100%", en: "Five perfect rounds", es: "Cinco rondas perfectas", test: s => s.perfect >= 5 },
  { id: "perfect20", cat: "geral", n: 3, icon: "👑", pt: "Vinte 100%", en: "Twenty perfect rounds", es: "Veinte perfectas", test: s => s.perfect >= 20 },
  { id: "streak5", cat: "geral", n: 1, icon: "🔥", pt: "5 acertos seguidos", en: "5 in a row", es: "5 seguidas", test: s => s.bestStreak >= 5 },
  { id: "streak20", cat: "geral", n: 3, icon: "⚡", pt: "20 acertos seguidos", en: "20 in a row", es: "20 seguidas", test: s => s.bestStreak >= 20 },
  { id: "coins500", cat: "geral", n: 2, icon: "🪙", pt: "500 moedas ganhas", en: "500 coins earned", es: "500 monedas", test: s => s.earned >= 500 },
  { id: "rich", cat: "geral", n: 3, icon: "💰", pt: "2000 moedas no cofre", en: "2000 coins saved", es: "2000 monedas ahorradas", test: s => s.maxCoins >= 2000 },
  { id: "nohint", cat: "geral", n: 2, icon: "🧠", pt: "10 rodadas sem dica", en: "10 rounds, no hints", es: "10 rondas sin pistas", test: s => s.noHintRounds >= 10 },
  { id: "genius", cat: "geral", n: 2, icon: "🎓", pt: "Fase Gênio vencida", en: "Genius stage cleared", es: "Nivel Genio superado", test: s => s.geniusCleared >= 1 },
  { id: "flash20", cat: "geral", n: 1, icon: "💨", pt: "20 respostas relâmpago", en: "20 lightning answers", es: "20 respuestas relámpago", test: s => s.flash >= 20 },
  { id: "flash100", cat: "geral", n: 3, icon: "🚀", pt: "100 respostas relâmpago", en: "100 lightning answers", es: "100 respuestas relámpago", test: s => s.flash >= 100 },
  { id: "cleanperfect", cat: "geral", n: 2, icon: "✨", pt: "100% sem usar dica", en: "Perfect with no hints", es: "Perfecta sin pistas", test: s => s.perfectNoHint >= 1 },
  { id: "speedking", cat: "geral", n: 3, icon: "⏱️", pt: "100% na última fase", en: "Perfect on the last stage", es: "Perfecta en el último nivel", test: s => s.lastStagePerfect >= 1 },
  { id: "stars45", cat: "geral", n: 3, icon: "🌠", pt: "45 estrelas", en: "45 stars", es: "45 estrellas", test: s => s.stars >= 45 },
  { id: "stars200", cat: "geral", n: 4, icon: "💫", pt: "200 estrelas", en: "200 stars", es: "200 estrellas", test: s => s.stars >= 200 },
  { id: "marathon", cat: "geral", n: 3, icon: "🏃", pt: "50 rodadas jogadas", en: "50 rounds played", es: "50 rondas jugadas", test: s => s.rounds >= 50 },
  { id: "marathon300", cat: "geral", n: 4, icon: "🏅", pt: "300 rodadas jogadas", en: "300 rounds played", es: "300 rondas jugadas", test: s => s.rounds >= 300 },

  /* --- geografia --- */
  { id: "trav2", cat: "geo", n: 1, icon: "🗺️", pt: "2 continentes", en: "2 continents", es: "2 continentes", test: s => s.continents >= 2 },
  { id: "trav6", cat: "geo", n: 3, icon: "🌍", pt: "Mapa-múndi completo", en: "Whole world map", es: "Mapamundi completo", test: s => s.continents >= 6 },
  { id: "flags100", cat: "geo", n: 1, icon: "🎯", pt: "100 bandeiras certas", en: "100 flags right", es: "100 banderas", test: s => s.correct >= 100 },
  { id: "flags500", cat: "geo", n: 3, icon: "🎖️", pt: "500 bandeiras certas", en: "500 flags right", es: "500 banderas", test: s => s.correct >= 500 },
  { id: "islands", cat: "geo", n: 2, icon: "🏝️", pt: "25 bandeiras de ilhas", en: "25 island flags", es: "25 banderas de islas", test: s => s.islandRight >= 25 },
  { id: "regions", cat: "geo", n: 2, icon: "🏴", pt: "20 estados e regiões", en: "20 states and regions", es: "20 estados y regiones", test: s => s.subRight >= 20 },
  { id: "cont1done", cat: "geo", n: 2, icon: "🥇", pt: "Um continente inteiro", en: "A whole continent", es: "Un continente entero", test: s => s.contDone >= 1 },
  { id: "cont3done", cat: "geo", n: 4, icon: "🌟", pt: "Três continentes inteiros", en: "Three whole continents", es: "Tres continentes enteros", test: s => s.contDone >= 3 },
  { id: "cur1", cat: "geo", n: 1, icon: "🧭", pt: "Primeira curiosidade", en: "First fun fact", es: "Primera curiosidad", test: s => (s.curRight || 0) >= 1 },
  { id: "cur100", cat: "geo", n: 2, icon: "🗽", pt: "100 curiosidades certas", en: "100 fun facts right", es: "100 curiosidades correctas", test: s => (s.curRight || 0) >= 100 },
  { id: "cur500", cat: "geo", n: 3, icon: "🗿", pt: "500 curiosidades certas", en: "500 fun facts right", es: "500 curiosidades correctas", test: s => (s.curRight || 0) >= 500 },
  { id: "curEnd", cat: "geo", n: 4, icon: "🌐", pt: "Curiosidades até o fim", en: "Fun facts to the end", es: "Curiosidades hasta el final", test: s => (s.curStage || 0) >= 30 },

  /* --- capitais --- */
  { id: "cap1", cat: "cap", n: 1, icon: "🏛️", pt: "Primeira capital certa", en: "First capital right", es: "Primera capital correcta", test: s => (s.capRight || 0) >= 1 },
  { id: "capBR", cat: "cap", n: 2, icon: "🇧🇷", pt: "Brasil: 10 fases de capitais", en: "Brazil: 10 capital stages", es: "Brasil: 10 niveles", test: s => (s.capBrDone || 0) >= 10 },
  { id: "cap200", cat: "cap", n: 3, icon: "🗼", pt: "200 capitais certas", en: "200 capitals right", es: "200 capitales correctas", test: s => (s.capRight || 0) >= 200 },
  { id: "cap800", cat: "cap", n: 4, icon: "🌆", pt: "800 capitais certas", en: "800 capitals right", es: "800 capitales correctas", test: s => (s.capRight || 0) >= 800 },

  /* --- natureza --- */
  { id: "bicho1", cat: "nature", n: 1, icon: "🦉", pt: "Primeiro acerto nos animais", en: "First animal right", es: "Primer animal correcto", test: s => (s.bichoRight || 0) >= 1 },
  { id: "bicho100", cat: "nature", n: 2, icon: "🦜", pt: "100 animais certos", en: "100 animals right", es: "100 animales correctos", test: s => (s.bichoRight || 0) >= 100 },
  { id: "sci1", cat: "nature", n: 1, icon: "🔬", pt: "Primeira ciência certa", en: "First science answer", es: "Primera respuesta de ciencias", test: s => (s.sciRight || 0) >= 1 },
  { id: "sci100", cat: "nature", n: 2, icon: "🐘", pt: "100 respostas de ciências", en: "100 science answers", es: "100 respuestas de ciencias", test: s => (s.sciRight || 0) >= 100 },
  { id: "sci500", cat: "nature", n: 3, icon: "🐋", pt: "500 respostas de ciências", en: "500 science answers", es: "500 respuestas de ciencias", test: s => (s.sciRight || 0) >= 500 },
  { id: "sciEnd", cat: "nature", n: 4, icon: "🧬", pt: "Ciências até o fim", en: "Science to the end", es: "Ciencias hasta el final", test: s => (s.sciStage || 0) >= 25 },

  /* --- matemática --- */
  { id: "math1", cat: "math", n: 1, icon: "🧮", pt: "Primeira conta certa", en: "First sum right", es: "Primera cuenta correcta", test: s => (s.mathRight || 0) >= 1 },
  { id: "math100", cat: "math", n: 2, icon: "➕", pt: "100 contas certas", en: "100 sums right", es: "100 cuentas correctas", test: s => (s.mathRight || 0) >= 100 },
  { id: "math500", cat: "math", n: 3, icon: "✖️", pt: "500 contas certas", en: "500 sums right", es: "500 cuentas correctas", test: s => (s.mathRight || 0) >= 500 },
  { id: "mathGenius", cat: "math", n: 3, icon: "🎓", pt: "Fase 15 de matemática", en: "Math stage 15", es: "Nivel 15 de matemáticas", test: s => (s.mathStage || 0) >= 15 },

  /* --- arte --- */
  { id: "art1", cat: "art", n: 1, icon: "🖍️", pt: "Primeiro desenho pintado", en: "First drawing painted", es: "Primer dibujo pintado", test: s => (s.colorDone || 0) >= 1 },
  { id: "art10", cat: "art", n: 2, icon: "🎨", pt: "10 desenhos pintados", en: "10 drawings painted", es: "10 dibujos pintados", test: s => (s.colorDone || 0) >= 10 },
  { id: "art50", cat: "art", n: 3, icon: "🖼️", pt: "50 desenhos pintados", en: "50 drawings painted", es: "50 dibujos pintados", test: s => (s.colorDone || 0) >= 50 },

  /* --- idiomas --- */
  { id: "eng1", cat: "lang", n: 1, icon: "🔤", pt: "Primeira palavra nova", en: "First new word", es: "Primera palabra nueva", test: s => (s.engRight || 0) >= 1 },
  { id: "eng100", cat: "lang", n: 2, icon: "📘", pt: "100 palavras novas", en: "100 new words", es: "100 palabras nuevas", test: s => (s.engRight || 0) >= 100 },
  { id: "eng500", cat: "lang", n: 3, icon: "📗", pt: "500 palavras novas", en: "500 new words", es: "500 palabras nuevas", test: s => (s.engRight || 0) >= 500 },

  /* --- bíblia --- */
  { id: "bib1", cat: "bible", n: 1, icon: "✝️", pt: "Primeira resposta da Bíblia", en: "First Bible answer", es: "Primera respuesta bíblica", test: s => (s.bibRight || 0) >= 1 },
  { id: "bib100", cat: "bible", n: 2, icon: "📖", pt: "100 respostas da Bíblia", en: "100 Bible answers", es: "100 respuestas bíblicas", test: s => (s.bibRight || 0) >= 100 },
  { id: "bib500", cat: "bible", n: 3, icon: "📜", pt: "500 respostas da Bíblia", en: "500 Bible answers", es: "500 respuestas bíblicas", test: s => (s.bibRight || 0) >= 500 },
  { id: "bib2000", cat: "bible", n: 4, icon: "🕊️", pt: "2000 respostas da Bíblia", en: "2000 Bible answers", es: "2000 respuestas bíblicas", test: s => (s.bibRight || 0) >= 2000 },
  { id: "bibStage25", cat: "bible", n: 2, icon: "🌿", pt: "Bíblia: fase 25", en: "Bible: stage 25", es: "Biblia: nivel 25", test: s => (s.bibStage || 0) >= 25 },
  { id: "bibStage60", cat: "bible", n: 3, icon: "🔥", pt: "Bíblia: fase 60", en: "Bible: stage 60", es: "Biblia: nivel 60", test: s => (s.bibStage || 0) >= 60 },
  { id: "bibStage100", cat: "bible", n: 4, icon: "👑", pt: "Bíblia: as 100 fases", en: "Bible: all 100 stages", es: "Biblia: los 100 niveles", test: s => (s.bibStage || 0) >= 100 },

  /* --- memória --- */
  { id: "mem1", cat: "mem", n: 1, icon: "🃏", pt: "Primeira memória", en: "First memory game", es: "Primera memoria", test: s => s.memRounds >= 1 },
  { id: "mem3s", cat: "mem", n: 2, icon: "🧩", pt: "3 estrelas na memória", en: "3 stars in memory", es: "3 estrellas en memoria", test: s => s.mem3 >= 1 },
  { id: "memPerf", cat: "mem", n: 3, icon: "🎴", pt: "Memória sem errar par", en: "Memory with no wasted move", es: "Memoria sin fallar", test: s => s.memPerfect >= 1 },

  /* --- dedicação --- */
  { id: "day3", cat: "habit", n: 1, icon: "📅", pt: "3 dias seguidos jogando", en: "3 days in a row", es: "3 días seguidos", test: s => s.dayStreak >= 3 },
  { id: "day7", cat: "habit", n: 2, icon: "🗓️", pt: "7 dias seguidos jogando", en: "7 days in a row", es: "7 días seguidos", test: s => s.dayStreak >= 7 },
  { id: "day30", cat: "habit", n: 4, icon: "🏵️", pt: "30 dias seguidos jogando", en: "30 days in a row", es: "30 días seguidos", test: s => s.dayStreak >= 30 },
];

const premioDe = a => PREMIO_CONQUISTA[a.n] || 0;
/* Bolinhas em vez de palavras: funciona em qualquer idioma e a criança
   entende a escada só de olhar. */
const NIVEL_LABEL = { 1: "●", 2: "●●", 3: "●●●", 4: "●●●●" };


/* Insígnias: raras de propósito. São o que distingue quem jogou muito. */
const BADGES = [
  { id: "b_explorer", icon: "🧭", cor: "#00B894", pt: "Explorador", en: "Explorer", es: "Explorador", fr: "Explorateur", de: "Entdecker", it: "Esploratore",
    dPt: "Abriu 3 continentes", test: s => s.continents >= 3 },
  { id: "b_navigator", icon: "⛵", cor: "#4C6FFF", pt: "Navegador", en: "Navigator", es: "Navegante", fr: "Navigateur", de: "Navigator", it: "Navigatore",
    dPt: "Abriu o mapa-múndi inteiro", test: s => s.continents >= 6 },
  { id: "b_scholar", icon: "📚", cor: "#6A5AE0", pt: "Estudioso", en: "Scholar", es: "Erudito", fr: "Érudit", de: "Gelehrter", it: "Studioso",
    dPt: "1000 bandeiras certas", test: s => s.correct >= 1000 },
  { id: "b_lightning", icon: "⚡", cor: "#F9A826", pt: "Relâmpago", en: "Lightning", es: "Relámpago", fr: "Éclair", de: "Blitz", it: "Fulmine",
    dPt: "250 respostas relâmpago", test: s => s.flash >= 250 },
  { id: "b_star", icon: "🌟", cor: "#E84393", pt: "Estrela", en: "Star", es: "Estrella", fr: "Étoile", de: "Stern", it: "Stella",
    dPt: "100 estrelas conquistadas", test: s => s.stars >= 100 },
  { id: "b_mind", icon: "🧠", cor: "#00C2CB", pt: "Mente Afiada", en: "Sharp Mind", es: "Mente Ágil", fr: "Esprit Vif", de: "Scharfer Geist", it: "Mente Acuta",
    dPt: "10 memórias com 3 estrelas", test: s => s.mem3 >= 10 },
  { id: "b_faithful", icon: "📅", cor: "#8D6E3A", pt: "Constante", en: "Steady", es: "Constante", fr: "Assidu", de: "Beständig", it: "Costante",
    dPt: "30 dias seguidos", test: s => s.dayStreak >= 30 },
  { id: "b_cartographer", icon: "🏛️", cor: "#6A5AE0", pt: "Cartógrafo", en: "Cartographer", es: "Cartógrafo", fr: "Cartographe", de: "Kartograf", it: "Cartografo",
    dPt: "500 capitais certas", test: s => (s.capRight || 0) >= 500 },
  { id: "b_polyglot", icon: "🔤", cor: "#4C6FFF", pt: "Poliglota", en: "Polyglot", es: "Políglota", fr: "Polyglotte", de: "Polyglott", it: "Poliglotta",
    dPt: "500 palavras em inglês", test: s => (s.engRight || 0) >= 500 },
  { id: "b_artist", icon: "🎨", cor: "#E84393", pt: "Artista", en: "Artist", es: "Artista", fr: "Artiste", de: "Künstler", it: "Artista",
    dPt: "100 desenhos pintados", test: s => (s.colorDone || 0) >= 100 },
  { id: "b_legend", icon: "👑", cor: "#D4A017", pt: "Lenda", en: "Legend", es: "Leyenda", fr: "Légende", de: "Legende", it: "Leggenda",
    dPt: "300 rodadas e 50 perfeitas", test: s => s.rounds >= 300 && s.perfect >= 50 },
];

/* ---------- Helpers ---------- */
/* Bandeiras servidas pelo próprio app (public/flags), preparadas por
   scripts/prepare-flags.mjs. Nenhuma requisição sai para terceiros. */
const BASE = (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "/";
const flagUrl = c => `${BASE}flags/${c.toLowerCase()}.svg`;

function countryName(code, lang) {
  try {
    return new Intl.DisplayNames([lang], { type: "region" }).of(code);
  } catch { return code; }
}
const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[b[i], b[j]] = [b[j], b[i]]; } return b; };
const tempoFmt = seg => `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, "0")}`;
const fmt = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return `${h}h ${String(m).padStart(2, "0")}m`; };

/* ---------- Avatar SVG ----------
   Um único desenho serve para o jogo E para a vitrine da loja,
   então o que a criança vê na loja é exatamente o que ela leva. */
const SKINS = ["#FFDBAC", "#F1C27D", "#E0AC69", "#C68642", "#8D5524", "#5C3317"];
const HAIRS = ["#2C1B10", "#6B3E26", "#C68642", "#E8B923", "#D64545", "#7B4EBE", "#2E86DE"];
const SHIRTS = ["#4C6FFF", "#00B894", "#FF7043", "#E84393", "#F9A826", "#00C2CB"];
const HAIR_STYLES = ["short", "buzz", "curly", "long", "bob", "wavy", "ponytail", "afro", null];

/* O cabelo é desenhado em duas camadas: HairBack fica ATRÁS do rosto (é a
   silhueta) e HairFront por cima (é a franja). Como o rosto é desenhado no
   meio das duas, basta a silhueta cobrir tudo — o que sobra por trás da
   cabeça é justamente o que a criança vê. */
function HairBack({ style, color }) {
  if (style === "afro") return <circle cx="50" cy="36" r="31" fill={color} />;
  if (style === "long") return <path d="M20 40 Q20 14 50 14 Q80 14 80 40 L80 76 Q71 70 71 52 L29 52 Q29 70 20 76 Z" fill={color} />;
  // Chanel: passa das orelhas e para na altura do queixo.
  if (style === "bob") return <path d="M17 46 Q17 10 50 10 Q83 10 83 46 L83 66 Q83 72 77 72 Q71 72 71 65 L71 44 L29 44 L29 65 Q29 72 23 72 Q17 72 17 66 Z" fill={color} />;
  // Comprido ondulado: duas mechas caem sobre os ombros, com a ponta em onda.
  if (style === "wavy") return <path d="M16 46 Q16 8 50 8 Q84 8 84 46 L84 80 Q84 87 79 85 Q74 90 71 84 L71 44 L29 44 L29 84 Q26 90 21 85 Q16 87 16 80 Z" fill={color} />;
  if (style === "ponytail") return <ellipse cx="80" cy="48" rx="9" ry="15" fill={color} />;
  return null;
}
function HairFront({ style, color }) {
  if (!style) return null;
  if (style === "buzz") return <path d="M25 40 Q28 22 50 22 Q72 22 75 40 Q62 32 50 32 Q38 32 25 40 Z" fill={color} />;
  // Franja reta, cortada na altura das sobrancelhas.
  if (style === "bob") return <path d="M23 40 Q24 12 50 12 Q76 12 77 40 Q77 31 50 29 Q23 31 23 40 Z" fill={color} />;
  // Franja repartida de lado.
  if (style === "wavy") return <path d="M22 41 Q23 11 50 11 Q78 11 79 41 Q73 24 54 28 Q36 32 22 41 Z" fill={color} />;
  if (style === "curly") return (
    <g fill={color}>
      <circle cx="30" cy="31" r="11" /><circle cx="44" cy="23" r="12" />
      <circle cx="58" cy="23" r="12" /><circle cx="71" cy="32" r="11" />
    </g>
  );
  return <path d="M24 40 Q26 16 50 16 Q74 16 76 40 Q66 28 50 30 Q34 32 24 40 Z" fill={color} />;
}

function Glasses({ kind }) {
  if (kind === "round") return <g stroke="#2b2b2b" strokeWidth="2.5" fill="none"><circle cx="40" cy="45" r="8" /><circle cx="60" cy="45" r="8" /><path d="M48 45 H52" /></g>;
  if (kind === "nerd") return <g stroke="#2b2b2b" strokeWidth="3.5" fill="none"><rect x="30" y="38" width="18" height="14" rx="4" /><rect x="52" y="38" width="18" height="14" rx="4" /><path d="M48 45 H52" /></g>;
  if (kind === "sun") return <g><rect x="29" y="38" width="19" height="13" rx="5" fill="#2b2b2b" /><rect x="52" y="38" width="19" height="13" rx="5" fill="#2b2b2b" /><path d="M48 44 H52" stroke="#2b2b2b" strokeWidth="3" /><path d="M31 41 L36 41" stroke="#fff" strokeWidth="2" opacity=".6" /></g>;
  if (kind === "heart") return (
    <g stroke="#E84393" strokeWidth="2.5" fill="none">
      <path d="M40 40 c -1.6 -3.6 -8 -2.6 -8 1.8 c 0 3.6 5.2 6 8 8.4 c 2.8 -2.4 8 -4.8 8 -8.4 c 0 -4.4 -6.4 -5.4 -8 -1.8 z" transform="translate(-1,0)" />
      <path d="M60 40 c -1.6 -3.6 -8 -2.6 -8 1.8 c 0 3.6 5.2 6 8 8.4 c 2.8 -2.4 8 -4.8 8 -8.4 c 0 -4.4 -6.4 -5.4 -8 -1.8 z" transform="translate(3,0)" />
    </g>
  );
  return null;
}

function Headwear({ value }) {
  if (!value) return null;
  const [shape, color] = String(value).split("|");
  if (shape === "crown") return (
    <g>
      <path d="M24 32 L24 14 L36 24 L50 10 L64 24 L76 14 L76 32 Z" fill="#F1C40F" stroke="#D4A017" strokeWidth="2" strokeLinejoin="round" />
      <rect x="23" y="31" width="54" height="8" rx="4" fill="#F1C40F" stroke="#D4A017" strokeWidth="2" />
      <circle cx="50" cy="35" r="3" fill="#E74C3C" /><circle cx="34" cy="35" r="2.4" fill="#4C6FFF" /><circle cx="66" cy="35" r="2.4" fill="#00B894" />
    </g>
  );
  if (shape === "explorer") return (
    <g>
      <path d="M6 40 Q50 30 94 40 Q50 50 6 40 Z" fill="#8D6E3A" />
      <path d="M28 38 Q30 14 50 14 Q70 14 72 38 Z" fill="#A98047" />
      <path d="M28 34 H72 V39 H28 Z" fill="#5C4326" />
    </g>
  );
  if (shape === "beanie") return (
    <g>
      <path d="M24 34 Q24 12 50 12 Q76 12 76 34 Z" fill={color} />
      <rect x="21" y="32" width="58" height="9" rx="4.5" fill="#fff" opacity=".85" />
      <circle cx="50" cy="10" r="5" fill="#fff" opacity=".85" />
    </g>
  );
  if (shape === "bow") return (
    <g fill={color}>
      <path d="M50 24 L34 15 L34 33 Z" /><path d="M50 24 L66 15 L66 33 Z" /><circle cx="50" cy="24" r="5" />
    </g>
  );
  // boné
  return (
    <g>
      <path d="M22 34 Q24 12 50 12 Q76 12 78 34 Z" fill={color} />
      <path d="M22 34 Q10 36 8 42 Q30 42 50 36 Z" fill={color} opacity=".85" />
      <circle cx="50" cy="13" r="3.5" fill="#fff" opacity=".8" />
    </g>
  );
}

function ShirtPattern({ kind }) {
  if (kind === "stripe") return <path d="M23 86 H77 M22 94 H78" stroke="#fff" strokeWidth="5" opacity=".75" />;
  if (kind === "dots") return (
    <g fill="#fff" opacity=".8">
      <circle cx="36" cy="85" r="3" /><circle cx="50" cy="92" r="3" /><circle cx="64" cy="85" r="3" />
      <circle cx="43" cy="98" r="3" /><circle cx="57" cy="98" r="3" />
    </g>
  );
  if (kind === "star") return <path d="M50 80 L54 89 L64 90 L56 96 L59 100 L50 95 L41 100 L44 96 L36 90 L46 89 Z" fill="#FFE066" />;
  if (kind === "heart") return <path d="M50 100 C40 93 34 89 34 84 c 0 -5 7 -6 9 -1 c 2 -5 9 -4 9 1 c 0 5 -6 9 -2 16 z" fill="#fff" opacity=".85" transform="translate(-1,-4)" />;
  if (kind === "rainbow") return (
    <g fill="none" strokeWidth="4" strokeLinecap="round">
      <path d="M34 100 A16 16 0 0 1 66 100" stroke="#E74C3C" />
      <path d="M40 100 A10 10 0 0 1 60 100" stroke="#F9A826" />
      <path d="M46 100 A4 4 0 0 1 54 100" stroke="#00B894" />
    </g>
  );
  return null;
}

function Avatar({ a, size = 96 }) {
  const hs = a.hairStyle === undefined ? "short" : a.hairStyle;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <path d="M20 100 Q20 74 50 74 Q80 74 80 100 Z" fill={a.shirt} />
      <ShirtPattern kind={a.shirtPattern} />
      <rect x="43" y="64" width="14" height="14" rx="6" fill={a.skin} />
      <HairBack style={hs} color={a.hair} />
      <ellipse cx="50" cy="44" rx="26" ry="27" fill={a.skin} />
      <circle cx="23" cy="46" r="5" fill={a.skin} />
      <circle cx="77" cy="46" r="5" fill={a.skin} />
      <HairFront style={hs} color={a.hair} />
      <ellipse cx="40" cy="45" rx="4" ry="5" fill="#2b2b2b" />
      <ellipse cx="60" cy="45" rx="4" ry="5" fill="#2b2b2b" />
      <circle cx="41.5" cy="43" r="1.4" fill="#fff" />
      <circle cx="61.5" cy="43" r="1.4" fill="#fff" />
      <circle cx="32" cy="53" r="4.5" fill="#FF8FA3" opacity=".55" />
      <circle cx="68" cy="53" r="4.5" fill="#FF8FA3" opacity=".55" />
      <path d="M42 57 Q50 64 58 57" stroke="#2b2b2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Glasses kind={a.glasses} />
      <Headwear value={a.cap} />
    </svg>
  );
}

/* ---------- Marca ----------
   Fica no topo de todas as telas, discreta o bastante para não competir com
   o título de cada uma, mas presente o suficiente para fixar o nome. */
function Marca() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10, opacity: .6 }}>
      <svg width="17" height="17" viewBox="0 0 100 100" aria-hidden="true">
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
          const r = (a * Math.PI) / 180;
          return <line key={a} x1={50 + Math.cos(r) * 40} y1={44 + Math.sin(r) * 40}
            x2={50 + Math.cos(r) * 52} y2={44 + Math.sin(r) * 52}
            stroke="#F9A826" strokeWidth="7" strokeLinecap="round" />;
        })}
        <circle cx="50" cy="44" r="29" fill="#FFD659" />
        <rect x="38" y="72" width="24" height="8" rx="4" fill="#B8C2DA" />
        <rect x="41" y="83" width="18" height="7" rx="3.5" fill="#96A2C3" />
      </svg>
      <span className="display" style={{ color: "#C9D2FF", fontSize: 13, letterSpacing: 3 }}>LUMUS</span>
    </div>
  );
}

/* ---------- Mundi, o mascote ---------- */
function Mundi({ size = 72, bounce = true }) {
  return (
    <div className={bounce ? "mundi-bob" : ""} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="46" r="34" fill="#4C6FFF" />
        <path d="M22 36 Q34 30 44 38 Q52 46 44 54 Q32 58 24 52 Z" fill="#00B894" />
        <path d="M58 26 Q72 28 76 40 Q70 48 60 44 Q54 34 58 26 Z" fill="#00B894" />
        <path d="M56 56 Q72 54 78 62 Q68 74 58 70 Q52 62 56 56 Z" fill="#00B894" />
        <circle cx="40" cy="44" r="7" fill="#fff" /><circle cx="41" cy="45" r="3.4" fill="#222" />
        <circle cx="62" cy="44" r="7" fill="#fff" /><circle cx="63" cy="45" r="3.4" fill="#222" />
        <path d="M42 60 Q50 68 60 60" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M38 82 L34 94 M62 82 L66 94" stroke="#F9A826" strokeWidth="6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ---------- UI base ---------- */
const Btn = ({ children, onClick, color = "#4C6FFF", disabled, full, small }) => (
  <button onClick={onClick} disabled={disabled}
    className={`chunky ${full ? "w-full" : ""}`}
    style={{
      background: disabled ? "#B9C0CC" : color,
      padding: small ? "10px 16px" : "16px 22px",
      fontSize: small ? 15 : 19,
      opacity: disabled ? .8 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
    }}>{children}</button>
);

const Coin = ({ n }) => (
  <span className="inline-flex items-center gap-1 font-extrabold">
    <span style={{ fontSize: "1.05em" }}>🪙</span>{n}
  </span>
);

/* ============================================================
   APP
   ============================================================ */
/* Se algo quebrar, mostra um aviso amigável em vez de tela branca — e deixa
   claro que o progresso continua salvo, que é o medo real de quem joga. */
class Guarda extends React.Component {
  constructor(p) { super(p); this.state = { erro: null }; }
  static getDerivedStateFromError(e) { return { erro: e }; }
  componentDidCatch(e, info) { console.error("Lumus:", e, info); }
  render() {
    if (!this.state.erro) return this.props.children;
    return (
      <div style={{
        minHeight: "100vh", background: "#1B2A6B", display: "grid", placeItems: "center",
        padding: 28, textAlign: "center", fontFamily: "system-ui, sans-serif",
      }}>
        <div>
          <div style={{ fontSize: 56 }}>🔧</div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, margin: "12px 0 6px" }}>
            Algo deu errado
          </div>
          <div style={{ color: "#C9D2FF", fontWeight: 600, fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
            Seu progresso continua salvo. Feche e abra o Lumus de novo.
          </div>
          <button onClick={() => window.location.reload()}
            style={{
              marginTop: 20, border: "none", borderRadius: 18, padding: "14px 26px",
              background: "#00B894", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer",
            }}>
            Tentar de novo
          </button>
        </div>
      </div>
    );
  }
}

function AppInterno() {
  const [loaded, setLoaded] = useState(false);
  const [lang, setLang] = useState("pt");
  const [screen, setScreen] = useState("boot"); // boot|create|map|stages|game|result|shop|awards
  const [player, setPlayer] = useState({
    name: "", avatar: { skin: SKINS[1], hair: HAIRS[0], hairStyle: "short", cap: null, glasses: null, shirt: SHIRTS[0], shirtPattern: null },
  });
  const [coins, setCoins] = useState(ECON.start);
  const [lastRefill, setLastRefill] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [unlocked, setUnlocked] = useState(["sa"]);
  const [progress, setProgress] = useState({});
  const [owned, setOwned] = useState([]);
  const [stars, setStars] = useState({});     // {continente: {fase: 1..3}}
  const [records, setRecords] = useState({}); // {continente: {fase: segundos}}
  const [memBest, setMemBest] = useState({}); // {nivel: {stars, time}}
  const [stats, setStats] = useState({
    rounds: 0, perfect: 0, bestStreak: 0, streak: 0, earned: 0, correct: 0,
    noHintRounds: 0, geniusCleared: 0, continents: 1,
    flash: 0, perfectNoHint: 0, lastStagePerfect: 0, islandRight: 0, subRight: 0,
    contDone: 0, dayStreak: 1, lastDay: "", maxCoins: ECON.start,
      stars: 0, memRounds: 0, memPerfect: 0, mem3: 0, colorDone: 0, mathRight: 0, mathStage: 0, bichoRight: 0, engRight: 0, bibRight: 0, capRight: 0,
  });
  const [seenAch, setSeenAch] = useState([]);
  const [toast, setToast] = useState(null);
  const [travelFx, setTravelFx] = useState(null);
  const [tutorial, setTutorial] = useState(false);
  const [installTip, setInstallTip] = useState(false);
  const [voltaPara, setVoltaPara] = useState("home"); // de onde a loja/conquistas foram abertas

  const [sel, setSel] = useState({ cont: "sa", stage: 1 });
  const [round, setRound] = useState(null);
  const [mem, setMem] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [colorDay, setColorDay] = useState({ dia: "", moedas: 0 });
  const [pintando, setPintando] = useState(null);
  const [memTema, setMemTema] = useState("flags");
  const [gerados, setGerados] = useState([]);
  const [jogosAbertos, setJogosAbertos] = useState(JOGOS_GRATIS);
  const [secoes, setSecoes] = useState([]); // níveis e regiões já comprados
  const [destinoIdioma, setDestinoIdioma] = useState("quiz"); // quiz ou memória

  const t = T[lang];

  /* ----- perfis: vários jogadores no mesmo aparelho -----
     Índice leve em "lumus:profiles" (id, nome, avatar) para desenhar a
     tela de escolha sem abrir todos os saves. O progresso de cada um fica
     em "lumus:p:<id>", separado — irmão não mexe no do irmão. */
  const [profiles, setProfiles] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const blankSave = () => ({
    coins: ECON.start, lastRefill: Date.now(), unlocked: ["sa"], progress: {}, owned: [], seenAch: [],
    stars: {}, records: {}, memBest: {}, gallery: [], colorDay: { dia: "", moedas: 0 }, gerados: [], jogosAbertos: JOGOS_GRATIS, secoes: [],
    stats: {
      rounds: 0, perfect: 0, bestStreak: 0, streak: 0, earned: 0, correct: 0,
      noHintRounds: 0, geniusCleared: 0, continents: 1,
      flash: 0, perfectNoHint: 0, lastStagePerfect: 0, islandRight: 0, subRight: 0,
      contDone: 0, dayStreak: 1, lastDay: "", maxCoins: ECON.start,
      stars: 0, memRounds: 0, memPerfect: 0, mem3: 0, colorDone: 0, mathRight: 0, mathStage: 0, bichoRight: 0, engRight: 0, bibRight: 0, capRight: 0,
    },
  });

  function applySave(d, name, avatar) {
    setPlayer({ name, avatar });
    // Cada jogador tem o seu idioma: um irmão pode jogar em inglês e o outro
    // em português no mesmo aparelho.
    if (d.lang && T[d.lang]) setLang(d.lang);
    else if (d.lang) loadLang(d.lang).then(ok => ok && setLang(d.lang));
    setCoins(d.coins); setLastRefill(d.lastRefill); setUnlocked(d.unlocked);
    const oldFmt = Object.keys(d.progress || {}).some(k => k.includes(":"));
    setProgress(oldFmt ? {} : (d.progress || {}));
    setOwned(d.owned || []); setStats(d.stats); setSeenAch(d.seenAch || []);
    setStars(d.stars || {}); setRecords(d.records || {}); setMemBest(d.memBest || {});
    setGallery(d.gallery || []); setColorDay(d.colorDay || { dia: "", moedas: 0 });
    setGerados(d.gerados || []); setJogosAbertos([...new Set([...JOGOS_GRATIS, ...(d.jogosAbertos || [])])]);
    setSecoes(d.secoes || []);
  }

  useEffect(() => {
    (async () => {
      let list = [];
      try {
        const r = await window.storage.get("lumus:profiles");
        if (r?.value) list = JSON.parse(r.value);
      } catch { }
      // O app já se chamou Mundi: traz o que foi salvo com o nome antigo.
      if (!list.length) {
        try {
          const velho = await window.storage.get("mundi:profiles");
          if (velho?.value) {
            list = JSON.parse(velho.value);
            window.storage.set("lumus:profiles", velho.value);
            for (const pr of list) {
              try {
                const sv = await window.storage.get(`mundi:p:${pr.id}`);
                if (sv?.value) window.storage.set(`lumus:p:${pr.id}`, sv.value);
              } catch { }
            }
          }
        } catch { }
      }
      let chosen = null;
      try { const l = await window.storage.get("lumus:lang"); chosen = l?.value || null; } catch { }
      const want = chosen || deviceLang();
      if (await loadLang(want)) setLang(want);
      setProfiles(list);
      if (list.length) setScreen("profiles");
      else {
        // Primeiro acesso: já nasce com identificador, senão o jogador
        // criado agora não teria onde ser gravado.
        setActiveId(`p${Date.now()}`);
        setScreen("create");
      }
      // Convite para instalar: só fora do app instalado e só até ser dispensado.
      if (!jaInstalado()) {
        let visto = false;
        try { const v = await window.storage.get("lumus:installTip"); visto = !!v?.value; } catch { }
        if (!visto) setInstallTip(true);
      }
      setLoaded(true);
    })();
  }, []);

  /* ----- memória ----- */
  function comecarMemoria(nivel, tema = memTema) {
    if (coins < ECON.roundCost) { setToast(t.notEnough); return; }
    setCoins(c => c - ECON.roundCost);
    const cfg = MEM_LEVELS[nivel];
    let cartas;
    const alvoMem = alvoDe(tema);
    if (alvoMem) {
      // aqui o par é figura + palavra: casar os dois é o que ensina
      const vs = shuffle(VOCAB).slice(0, cfg.pares);
      cartas = shuffle(vs.flatMap(v => [
        { key: v.w.en, face: v.e, tipo: "emoji" },
        { key: v.w.en, face: v.w[alvoMem], tipo: "word" },
      ]));
    } else {
      const fonte =
        tema === "animals" ? [...new Set(ANIMAIS)]
        : tema === "arts" ? todosEmojis().map(o => o.e)
        : tema === "bible" ? BIBLIA_EMOJI
        : [...new Set(unlocked.flatMap(c => Object.keys(DATA[c])))];
      const tipo = tema === "flags" ? "flag" : "emoji";
      const escolhidas = shuffle([...new Set(fonte)]).slice(0, cfg.pares);
      cartas = shuffle(escolhidas.flatMap(k => [{ key: k, face: k, tipo }, { key: k, face: k, tipo }]));
    }
    setMem({ nivel, cartas, tema });
    setScreen("mem");
  }

  function fimMemoria({ seg, jogadas }) {
    const nivel = mem.nivel;
    const st = memEstrelas(nivel, seg);
    const reward = st ? ECON.memReward[st] : 0;
    setCoins(c => Math.min(ECON.cap, c + reward));
    const chave = `${mem.tema}:${nivel}`;
    const antes = memBest[chave];
    const recorde = !antes || seg < antes.time;
    setMemBest(b => ({
      ...b,
      [chave]: { stars: Math.max(antes?.stars || 0, st), time: recorde ? seg : antes.time },
    }));
    const today = new Date().toISOString().slice(0, 10);
    const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    setStats(x => ({
      ...x,
      earned: x.earned + reward,
      memRounds: x.memRounds + 1,
      mem3: x.mem3 + (st === 3 ? 1 : 0),
      memPerfect: x.memPerfect + (jogadas === MEM_LEVELS[nivel].pares ? 1 : 0),
      maxCoins: Math.max(x.maxCoins, Math.min(ECON.cap, coins + reward)),
      dayStreak: x.lastDay === today ? x.dayStreak : x.lastDay === yest ? x.dayStreak + 1 : 1,
      lastDay: today,
    }));
    setMem(m => ({ ...m, done: true, seg, jogadas, st, reward, recorde }));
    setScreen("memResult");
  }

  /* ----- colorir ----- */
  function gerarMais(cobrar = true) {
    if (cobrar) {
      if (coins < PRECO_GERAR) { setToast(t.notEnough); return; }
      setCoins(c => c - PRECO_GERAR);
    }
    // Guardamos só as sementes: 9 desenhos novos custam 9 números.
    const novos = Array.from({ length: 9 }, () => Math.floor(Math.random() * 2 ** 31));
    setGerados(g => [...g, ...novos].slice(-90));
    setToast("✨ +9");
  }

  /* Abre o próximo jogo da área, se o anterior dela já estiver aberto */
  const temSecao = k => secoes.includes(k);
  function comprarSecao(k, preco) {
    if (temSecao(k) || !preco) return;
    if (coins < preco) { setToast(t.notEnough); return; }
    setCoins(c => c - preco);
    setSecoes(x => [...x, k]);
    setToast("🔓");
  }

  function abrirJogo(id) {
    const area = CATALOG.find(c => c.games.some(g => g.id === id));
    if (!area) return;
    const i = area.games.findIndex(g => g.id === id);
    const jogo = area.games[i];
    if (jogosAbertos.includes(id) || !jogo.preco) return;
    const anteriorOk = i === 0 || jogosAbertos.includes(area.games[i - 1].id);
    if (!anteriorOk) return;
    if (coins < jogo.preco) { setToast(t.notEnough); return; }
    setCoins(c => c - jogo.preco);
    setJogosAbertos(g => [...g, id]);
    setToast(`🔓 ${t.games[id]}`);
  }

  function salvarDesenho(fills, completo) {
    const hoje = new Date().toISOString().slice(0, 10);
    const dia = colorDay.dia === hoje ? colorDay : { dia: hoje, moedas: 0 };
    // 10 moedas por desenho, até 20 desenhos por dia — mas pintar continua livre.
    const premio = (completo && dia.moedas < ECON.colorDailyCap) ? ECON.colorReward : 0;
    if (premio) {
      setCoins(c => Math.min(ECON.cap, c + premio));
      setColorDay({ dia: hoje, moedas: dia.moedas + premio });
      setStats(x => ({ ...x, earned: x.earned + premio }));
    } else setColorDay(dia);
    setGallery(g => [...g, { id: pintando.art.id, fills, data: hoje }].slice(-81));  // 9 páginas de 9
    if (completo) setStats(x => ({ ...x, colorDone: (x.colorDone || 0) + 1 }));
    setToast(premio ? `🎨 +${premio} 🪙` : "🎨 💾");
    setPintando(null);
    setScreen("gallery");
  }

  /* Puxar a tela para baixo recarrega a página no Chrome Android — e no meio
     de uma partida isso perde a rodada e as moedas. Nos menus continua valendo. */
  const EM_PARTIDA = ["game", "mem", "color"];
  useEffect(() => {
    const jogando = EM_PARTIDA.includes(screen);
    const el = document.documentElement;
    el.style.overscrollBehaviorY = jogando ? "none" : "auto";
    document.body.style.overscrollBehaviorY = jogando ? "none" : "auto";
    const avisar = e => { e.preventDefault(); e.returnValue = ""; };
    if (jogando) window.addEventListener("beforeunload", avisar);
    return () => {
      window.removeEventListener("beforeunload", avisar);
      el.style.overscrollBehaviorY = "auto";
      document.body.style.overscrollBehaviorY = "auto";
    };
  }, [screen]);

  /* O tempo libera o resgate; o contador só reinicia quando se resgata.
     Assim ninguém perde moedas por ficar dias sem abrir o app. */
  const podeResgatar = now - lastRefill >= ECON.refillMs;
  function resgatar() {
    if (!podeResgatar) return;
    setCoins(c => c + ECON.refillAmount);
    setLastRefill(Date.now());
    setStats(x => ({ ...x, earned: x.earned + ECON.refillAmount, maxCoins: Math.max(x.maxCoins, coins + ECON.refillAmount) }));
    setToast(`🎁 +${ECON.refillAmount} 🪙`);
  }

  function abrir(tela, origem) { setVoltaPara(origem); setScreen(tela); }

  function dispensarInstallTip() {
    setInstallTip(false);
    try { window.storage.set("lumus:installTip", "1"); } catch { }
  }

  async function openProfile(pr) {
    try {
      const r = await window.storage.get(`lumus:p:${pr.id}`);
      applySave(r?.value ? JSON.parse(r.value) : blankSave(), pr.name, pr.avatar);
    } catch { applySave(blankSave(), pr.name, pr.avatar); }
    setActiveId(pr.id);
    setScreen("home");
  }

  function newProfile() {
    const d = blankSave();
    setActiveId(`p${Date.now()}`);
    applySave(d, "", { skin: SKINS[1], hair: HAIRS[0], hairStyle: "short", cap: null, glasses: null, shirt: SHIRTS[0], shirtPattern: null });
    setScreen("create");
  }

  function resetProfile(id) {
    const zerado = blankSave();
    try { window.storage.set(`lumus:p:${id}`, JSON.stringify(zerado)); } catch { }
    if (id === activeId) {
      applySave(zerado, player.name, player.avatar);
      setToast("↺");
    }
  }

  function deleteProfile(id) {
    const next = profiles.filter(p => p.id !== id);
    setProfiles(next);
    try {
      window.storage.set("lumus:profiles", JSON.stringify(next));
      window.storage.delete(`lumus:p:${id}`);
    } catch { }
    if (id === activeId) { setActiveId(null); setScreen(next.length ? "profiles" : "create"); }
  }

  async function pickLang(code) {
    const ok = await loadLang(code);
    if (!ok) return false;
    setLang(code);
    try { if (!activeId) window.storage.set("lumus:lang", code); } catch { }  // padrão para novos jogadores
    return true;
  }

  /* grava o jogador ativo a cada mudança */
  useEffect(() => {
    if (!loaded || !activeId || screen === "create" || screen === "boot" || screen === "profiles") return;
    const d = { lang, coins, lastRefill, unlocked, progress, owned, stats, seenAch, stars, records, memBest, gallery, colorDay, gerados, jogosAbertos, secoes };
    try { window.storage.set(`lumus:p:${activeId}`, JSON.stringify(d)); } catch { }
    setProfiles(ps => {
      const has = ps.some(p => p.id === activeId);
      const next = has
        ? ps.map(p => p.id === activeId ? { ...p, name: player.name, avatar: player.avatar } : p)
        : [...ps, { id: activeId, name: player.name, avatar: player.avatar }];
      try { window.storage.set("lumus:profiles", JSON.stringify(next)); } catch { }
      return next;
    });
  }, [loaded, activeId, screen, lang, coins, unlocked, progress, owned, stats, player, seenAch, stars, records, memBest, gallery, colorDay, gerados, jogosAbertos, secoes]);

  /* ----- relógio + refill ----- */
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => { if (toast) { const x = setTimeout(() => setToast(null), 2200); return () => clearTimeout(x); } }, [toast]);

  /* ----- conquistas -----
     Acendeu, paga. O prêmio vem do nível da conquista e entra uma vez só —
     seenAch é a garantia de que ninguém recebe duas vezes pela mesma. */
  useEffect(() => {
    const novas = ACHIEVEMENTS.filter(a => a.test(stats) && !seenAch.includes(a.id));
    if (!novas.length) return;
    const premio = novas.reduce((soma, a) => soma + premioDe(a), 0);
    const a = novas[0];
    setToast(`${a.icon} ${a[lang] || a.en}${premio ? ` · +${premio} 🪙` : ""}`);
    setSeenAch(s => [...s, ...novas.map(x => x.id)]);
    if (premio) {
      setCoins(c => Math.min(ECON.cap, c + premio));
      setStats(s2 => ({ ...s2, earned: s2.earned + premio }));
    }
  }, [stats]);

  /* ----- montar rodada ----- */
  // REGRA DE OURO: nunca sai do continente escolhido.
  // A dificuldade vem de QUAIS bandeiras daquele continente entram no sorteio:
  // as mais conhecidas primeiro, as raras nas fases finais.
  function poolFor(cont, diff) {
    const ranked = Object.entries(DATA[cont])
      .sort((a, b) => (a[1] - b[1]) || (Math.random() - .5))
      .map(([c]) => c);
    const n = ranked.length;
    const cut = (from, to) => ranked.slice(Math.floor(n * from), Math.ceil(n * to));
    let pool;
    if (diff === "easy") pool = cut(0, .55);
    else if (diff === "medium") pool = cut(0, .8);
    else if (diff === "hard") pool = cut(.25, 1);
    else pool = cut(.45, 1);
    // continentes pequenos: usa o continente inteiro em vez de sair dele
    return pool.length >= 10 ? pool : ranked;
  }

  function buildRound(cont, stage) {
    const diff = bandFor(cont, stage);
    const pool = poolFor(cont, diff);
    const wide = Object.keys(DATA[cont]); // distratores também só do continente
    const subs = (SUBFLAGS[cont] || []);
    const subDeck = shuffle(subs);
    let subAt = 0;
    // Gênio (13-15): metade da rodada vira estado/região.
    // Difícil (10-12): só a última pergunta, como aperitivo.
    const subSlots = new Set();
    if (subs.length) {
      if (diff === "genius") [1, 3, 5, 7, 9].forEach(n => subSlots.add(n));  // 5 de 10
      else if (diff === "hard" && stage >= 12) subSlots.add(9);
    }
    // Rodadas curtas para os pequenos, longas para quem já pegou o jeito
    const qCount = (diff === "easy" || diff === "medium") ? 5 : 10;
    const deck = shuffle(pool).slice(0, qCount); // bandeiras SEMPRE diferentes
    const qs = [];
    for (let i = 0; i < qCount; i++) {
      const useSub = subSlots.has(i) && subAt < subDeck.length;
      if (useSub) {
        const s = subDeck[subAt++];
        const others = shuffle(subs.filter(x => x.code !== s.code)).slice(0, 3);
        qs.push({
          flag: s.code, answer: s[lang], sub: true,
          options: shuffle([s[lang], ...others.map(o => o[lang])]).slice(0, 4),
        });
      } else {
        const code = deck[i];
        const ans = countryName(code, lang);
        const distr = shuffle(wide).filter(c => c !== code && countryName(c, lang) !== ans).slice(0, 3);
        qs.push({
          flag: code, answer: ans,
          options: shuffle([ans, ...distr.map(c => countryName(c, lang))]),
        });
      }
    }
    // Modo Fácil: sem cronômetro. Depois o tempo cai a cada fase.
    const time = tempoDe(cont, stage);
    return { cont, diff, stage, qs, time, t0: Date.now(), i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
  }

  function startRound() {
    if (coins < ECON.roundCost) { setToast(t.notEnough); return; }
    setCoins(c => c - ECON.roundCost);
    const quiz = quizDe(sel.cont);
    setRound(quiz ? quiz.montar(sel.stage, t, lang, sel.cont) : buildRound(sel.cont, sel.stage));
    setScreen("game");
  }

  function finishRound(r) {
    const pct = Math.round((r.right / r.qs.length) * 100);
    // As estrelas contam ERROS, não porcentagem: numa rodada de 5 perguntas
    // a régua de porcentagem pula de 80% para 100% e as 2 estrelas somem.
    const erros = r.qs.length - r.right;
    const limite1 = r.qs.length >= 10 ? 3 : 2;   // erros ainda aceitos para 1 estrela
    const st = erros === 0 ? 3 : erros === 1 ? 2 : erros <= limite1 ? 1 : 0;
    let reward = ECON.reward[st] || 0;
    if (r.hintsUsed === 0 && st > 0) reward += 5;
    setCoins(c => Math.min(ECON.cap, c + reward));
    const today = new Date().toISOString().slice(0, 10);
    const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const clearedAll = st > 0 && r.stage === totalDe(r.cont);
    setStats(s => ({
      ...s,
      rounds: s.rounds + 1,
      perfect: s.perfect + (pct === 100 ? 1 : 0),
      streak: st > 0 ? s.streak + 1 : 0,
      bestStreak: Math.max(s.bestStreak, r.bestStreak || s.streak),
      earned: s.earned + reward,
      correct: s.correct + (quizDe(r.cont) ? 0 : r.right),
      bichoRight: (s.bichoRight || 0) + (r.cont === "bichos" ? r.right : 0),
      engRight: (s.engRight || 0) + (alvoDe(r.cont) ? r.right : 0),
      bibRight: (s.bibRight || 0) + (r.cont === "bible" ? r.right : 0),
      capRight: (s.capRight || 0) + (r.cont.startsWith("cap_") ? r.right : 0),
      curRight: (s.curRight || 0) + (r.cont === "curiosidades" ? r.right : 0),
      curStage: r.cont === "curiosidades" && st > 0 ? Math.max(s.curStage || 0, r.stage) : (s.curStage || 0),
      sciRight: (s.sciRight || 0) + (r.cont === "ciencias" ? r.right : 0),
      sciStage: r.cont === "ciencias" && st > 0 ? Math.max(s.sciStage || 0, r.stage) : (s.sciStage || 0),
      bibStage: r.cont === "bible" && st > 0 ? Math.max(s.bibStage || 0, r.stage) : (s.bibStage || 0),
      capBrDone: r.cont === "cap_br" && st > 0 ? Math.max(s.capBrDone || 0, r.stage) : (s.capBrDone || 0),
      mathRight: (s.mathRight || 0) + (r.cont === "math" ? r.right : 0),
      mathStage: r.cont === "math" && st > 0 ? Math.max(s.mathStage || 0, r.stage) : (s.mathStage || 0),
      noHintRounds: s.noHintRounds + (r.hintsUsed === 0 ? 1 : 0),
      geniusCleared: s.geniusCleared + (r.diff === "genius" && st > 0 ? 1 : 0),
      flash: s.flash + r.flash,
      islandRight: s.islandRight + r.islandRight,
      subRight: s.subRight + r.subRight,
      perfectNoHint: s.perfectNoHint + (pct === 100 && r.hintsUsed === 0 ? 1 : 0),
      lastStagePerfect: s.lastStagePerfect + (pct === 100 && r.stage === totalDe(r.cont) ? 1 : 0),
      contDone: s.contDone + (clearedAll ? 1 : 0),
      maxCoins: Math.max(s.maxCoins, Math.min(ECON.cap, coins + reward)),
      dayStreak: s.lastDay === today ? s.dayStreak : s.lastDay === yest ? s.dayStreak + 1 : 1,
      lastDay: today,
    }));
    const seg = Math.round((Date.now() - (r.t0 || Date.now())) / 1000);
    if (st > 0) {
      setProgress(p => ({ ...p, [r.cont]: Math.max(p[r.cont] || 0, r.stage) }));
      setStars(x => {
        const antes = x[r.cont]?.[r.stage] || 0;
        setStats(s2 => ({ ...s2, stars: s2.stars + Math.max(0, st - antes) }));
        return { ...x, [r.cont]: { ...(x[r.cont] || {}), [r.stage]: Math.max(antes, st) } };
      });
      setRecords(x => {
        const antes = x[r.cont]?.[r.stage];
        return { ...x, [r.cont]: { ...(x[r.cont] || {}), [r.stage]: antes ? Math.min(antes, seg) : seg } };
      });
    }
    const recAntigo = records[r.cont]?.[r.stage];
    setRound({ ...r, done: true, pct, reward, st, seg, novoRecorde: st > 0 && (!recAntigo || seg < recAntigo) });
    setScreen("result");
  }

  function unlockContinent(id, cost) {
    if (coins < cost) { setToast(t.notEnough); return; }
    setCoins(c => c - cost);
    setUnlocked(u => [...u, id]);
    setStats(s => ({ ...s, continents: s.continents + 1 }));
    const r = ROUTE.find(x => x.id === id);
    setTravelFx(r.emoji);
    setTimeout(() => setTravelFx(null), 2600);
  }

  const nextRefill = ECON.refillMs - (now - lastRefill);

  /* ============================================================ */
  const styles = `
    .app{font-family:'Nunito',system-ui,-apple-system,sans-serif;}
    .display{font-family:'Baloo 2','Nunito',system-ui,sans-serif;letter-spacing:.4px;}
    .chunky{border:none;border-radius:20px;color:#fff;font-family:'Baloo 2',system-ui,sans-serif;
      font-weight:800;box-shadow:0 5px 0 rgba(0,0,0,.22);transition:transform .08s, box-shadow .08s;}
    .chunky:active:not(:disabled){transform:translateY(4px);box-shadow:0 1px 0 rgba(0,0,0,.22);}
    .card{border-radius:26px;background:#fff;box-shadow:0 6px 0 rgba(20,25,60,.13);}
    @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    .mundi-bob{animation:bob 2.2s ease-in-out infinite}
    @keyframes pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
    .pop{animation:pop .3s ease-out}
    @keyframes cross{0%{left:-18%;transform:scaleX(1)}100%{left:104%;transform:scaleX(1)}}
    .crossing{position:absolute;top:38%;font-size:56px;animation:cross 2.6s ease-in-out forwards}
    @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
    .shake{animation:shake .32s}
    @media (prefers-reduced-motion: reduce){.mundi-bob,.pop,.crossing,.shake{animation:none!important}}

    /* No celular tudo é uma coluna de 460 — é o formato certo para o polegar.
       No desktop a mesma coluna vira uma folha larga e as listas ganham
       colunas em vez de esticar cada card até virar uma faixa. */
    .shell{max-width:460px;margin:0 auto;}
    .grid2{display:grid;gap:10px;grid-template-columns:1fr 1fr;}
    .grid3{display:grid;gap:9px;grid-template-columns:1fr 1fr 1fr;}
    .lista{display:grid;gap:10px;}
    /* Telas de jogar seguem estreitas de propósito: bandeira, cartas e desenho
       perto dos olhos, sem obrigar a criança a varrer 900px com a vista. */
    .narrow{max-width:520px;margin:0 auto;}
    @media (min-width:860px){
      .shell{max-width:920px;}
      .grid2{grid-template-columns:repeat(auto-fill,minmax(210px,1fr));}
      .grid3{grid-template-columns:repeat(auto-fill,minmax(155px,1fr));}
      .lista{grid-template-columns:repeat(auto-fill,minmax(300px,1fr));}
    }
  `;

  if (!loaded) return <div style={{ padding: 40, textAlign: "center" }}>🌍</div>;

  return (
    <div className="app" style={{ background: "linear-gradient(175deg,#1B2A6B 0%,#3C4FC4 45%,#6A5AE0 100%)", minHeight: "100vh", padding: "14px 12px 28px" }}>
      <style>{styles}</style>
      <div className="shell">

        {toast && (
          <div className="pop" style={{ position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 60, background: "#fff", color: "#1B2A6B", padding: "12px 20px", borderRadius: 999, fontWeight: 800, boxShadow: "0 6px 20px rgba(0,0,0,.3)" }}>{toast}</div>
        )}
        {travelFx && (
          <div style={{ position: "fixed", inset: 0, zIndex: 55, pointerEvents: "none", overflow: "hidden" }}>
            <div className="crossing">{travelFx}</div>
          </div>
        )}

        {installTip && (
          <Modal onClose={dispensarInstallTip}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 44 }}>📲</div>
              <div className="display" style={{ fontSize: 22, color: "#1B2A6B", marginTop: 4 }}>{t.installTitle}</div>
              <div style={{ color: "#3B4468", fontWeight: 700, fontSize: 15, lineHeight: 1.7, margin: "12px 0" }}>
                {ehIOS() ? t.installIOS : t.installAndroid}
              </div>
              <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 12, marginBottom: 14 }}>{t.installWhy}</div>
              <Btn full color="#00B894" onClick={dispensarInstallTip}>{t.gotIt}</Btn>
              <button onClick={dispensarInstallTip}
                style={{ background: "none", border: "none", color: "#8B93AD", fontWeight: 800, fontSize: 13, marginTop: 10, cursor: "pointer" }}>
                {t.installLater}
              </button>
            </div>
          </Modal>
        )}

        {!["boot", "create", "profiles"].includes(screen) && <Marca />}

        {screen === "create" && <Create {...{ t, lang, onLang: () => setScreen("lang"), player, setPlayer, onDone: () => setScreen("home") }} />}
        {screen === "profiles" && <Profiles {...{ t, profiles, openProfile, newProfile, deleteProfile, resetProfile, setScreen }} />}
        {screen === "gallery" && <Gallery {...{ t, gallery, setScreen, gerados, gerarMais, coins,
          abrirDesenho: (art, fills) => { setPintando({ art, fills }); setScreen("color"); } }} />}
        {screen === "color" && pintando && <Coloring {...{ t, art: pintando.art, fillsIniciais: pintando.fills,
          onSalvar: salvarDesenho, onSair: () => { setPintando(null); setScreen("gallery"); },
          ganhouHoje: colorDay.dia === new Date().toISOString().slice(0, 10) ? colorDay.moedas : 0 }} />}
        {screen === "capMap" && <CapMap {...{ t, lang, progress, coins, setSel, setScreen, temSecao, comprarSecao }} />}
        {screen === "langGame" && <LangGame {...{ t, lang, setScreen,
          escolher: alvo => {
            if (destinoIdioma === "mem") { setMemTema(`idiomas_${alvo}`); setScreen("memLevels"); return; }
            const k = `idiomas_${alvo}`;
            setSel({ cont: k, stage: Math.min(totalDe(k), (progress[k] || 0) + 1) });
            setScreen("stages");
          } }} />}
        {screen === "memLevels" && <MemLevels {...{ t, coins, memBest, setScreen, comecar: comecarMemoria, tema: memTema, temSecao, comprarSecao,
          titulo: alvoDe(memTema) ? `${t.games.wordMem} · ${LANG_CATALOG[alvoDe(memTema)]}`
            : { flags: t.games.memory, animals: t.games.animals, arts: t.games.artMem, bible: t.games.bibleMem }[memTema],
          icone: alvoDe(memTema) ? "🃏" : { flags: "🧠", animals: "🐾", arts: "🧩", bible: "🕊️" }[memTema] }} />}
        {screen === "mem" && mem && <MemoryGame {...{ t, lang, nivel: mem.nivel, cartas: mem.cartas,
          onFinish: fimMemoria, onQuit: () => setScreen("memLevels") }} />}
        {screen === "memResult" && mem && (
          <div style={{ paddingTop: 20 }}>
            <div className="card pop" style={{ padding: 22, textAlign: "center" }}>
              <div style={{ fontSize: 54 }}>{mem.st === 3 ? "🏆" : mem.st ? "🎉" : "💪"}</div>
              <div className="display" style={{ fontSize: 26, color: "#1B2A6B" }}>{t.roundOver}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 4, margin: "10px 0 6px" }}>
                {[1, 2, 3].map(i => <span key={i} style={{ fontSize: 34, opacity: mem.st >= i ? 1 : .2 }}>⭐</span>)}
              </div>
              <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 13, marginBottom: 14 }}>
                ⏱️ {tempoFmt(mem.seg)} · {t.moves}: {mem.jogadas}{mem.recorde ? ` · 🏆 ${t.newRecord}` : ""}
              </div>
              <div className="display" style={{ fontSize: 22, color: "#F9A826", marginBottom: 16 }}>🪙 {mem.reward}</div>
              <div style={{ display: "grid", gap: 9 }}>
                <Btn full color="#4C6FFF" onClick={() => comecarMemoria(mem.nivel, mem.tema)} disabled={coins < ECON.roundCost}>{t.again}</Btn>
                <Btn full color="#8B93AD" onClick={() => setScreen("memLevels")}>←</Btn>
              </div>
            </div>
          </div>
        )}
        {screen === "player" && <PlayerCard {...{ t, lang, player, coins, stats, progress, unlocked, seenAch, setScreen, abrir, podeResgatar, resgatar }} />}
        {screen === "lang" && <LangScreen {...{ t, lang, pickLang, setScreen, back: activeId ? "home" : "profiles" }} />}
        {screen === "home" && <Home {...{ t, player, coins, nextRefill, setScreen, profiles, abrir, podeResgatar, resgatar, jogosAbertos, abrirJogo,
          onPickGame: (g) => {
            const memTemas = { memory: "flags", animals: "animals", artMem: "arts", bibleMem: "bible" };
            const quizzes = { count: "math", animalQuiz: "bichos", colors: "arts", bible: "bible",
              curiosidades: "curiosidades", sciAnimals: "ciencias" };
            if (g === "capitals") { setScreen("capMap"); return; }
            if (g === "words" || g === "wordMem") { setDestinoIdioma(g === "wordMem" ? "mem" : "quiz"); setScreen("langGame"); return; }
            if (g === "color") { if (!gerados.length) gerarMais(false); setScreen("gallery"); return; }
            if (memTemas[g]) { setMemTema(memTemas[g]); setScreen("memLevels"); return; }
            if (quizzes[g]) {
              const k = quizzes[g];
              setSel({ cont: k, stage: Math.min(totalDe(k), (progress[k] || 0) + 1) });
              setScreen("stages"); return;
            }
            setScreen("map"); if (!stats.rounds) setTutorial(true);
          } }} />}
        {screen === "map" && <MapScreen {...{ t, lang, player, coins, nextRefill, unlocked, progress, unlockContinent, setSel, setScreen, stats, tutorial, setTutorial }} />}
        {screen === "stages" && <Stages {...{ t, lang, sel, setSel, progress, coins, startRound, setScreen, player, stars, records, temSecao, comprarSecao }} />}
        {screen === "game" && round && <Game {...{ t, lang, round, setRound, coins, setCoins, finishRound, player, setScreen,
          onQuit: () => { setRound(null); setScreen("stages"); } }} />}
        {screen === "result" && round && <Result {...{ t, round, player, setScreen, setSel, sel, startRound, coins }} />}
        {screen === "shop" && <Shop {...{ t, lang, coins, setCoins, owned, setOwned, player, setPlayer, setScreen, voltaPara }} />}
        {screen === "awards" && <Awards {...{ t, lang, stats, seenAch, setScreen, player, voltaPara }} />}
      </div>
    </div>
  );
}

export default function App() {
  return <Guarda><AppInterno /></Guarda>;
}

/* ---------- Criação do avatar ----------
   Aqui só o básico e de graça. Chapéu, óculos e estampa vêm da loja,
   para a criança ter o que conquistar com as moedas. */
function Create({ t, lang, onLang, player, setPlayer, onDone }) {
  const a = player.avatar;
  const set = (k, v) => setPlayer(p => ({ ...p, avatar: { ...p.avatar, [k]: v } }));
  const Swatches = ({ label, items, k }) => (
    <div style={{ marginBottom: 14 }}>
      <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {items.map((v, i) => (
          <button key={i} onClick={() => set(k, v)} style={{
            width: 40, height: 40, borderRadius: 14,
            border: a[k] === v ? "4px solid #1B2A6B" : "3px solid #E4E8F5",
            background: v, cursor: "pointer",
          }} />
        ))}
      </div>
    </div>
  );
  return (
    <div className="narrow">
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div className="display" style={{ color: "#fff", fontSize: 44, lineHeight: 1 }}>LUMUS</div>
        <div style={{ color: "#C9D2FF", fontWeight: 700, fontSize: 14 }}>{t.tagline}</div>
        <button onClick={onLang} className="chunky" style={{ marginTop: 10, padding: "7px 16px", fontSize: 13, background: "rgba(255,255,255,.22)" }}>
          🌐 {LANG_CATALOG[lang] || lang}
        </button>
      </div>
      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ background: "#EEF1FF", borderRadius: 24, padding: 6 }}><Avatar a={a} size={92} /></div>
          <div style={{ flex: 1 }}>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 20 }}>{t.createAvatar}</div>
            <input value={player.name} onChange={e => setPlayer(p => ({ ...p, name: e.target.value }))}
              placeholder={t.name} maxLength={12}
              style={{ marginTop: 8, width: "100%", padding: "10px 12px", borderRadius: 14, border: "3px solid #E4E8F5", fontWeight: 800, fontSize: 16, outline: "none" }} />
          </div>
        </div>

        <Swatches label={t.skin} items={SKINS} k="skin" />
        <Swatches label={t.hair} items={HAIRS} k="hair" />

        <div style={{ marginBottom: 14 }}>
          <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginBottom: 6 }}>{t.slots.hairStyle}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["short", "buzz", "long", null].map((v, i) => (
              <button key={i} onClick={() => set("hairStyle", v)} style={{
                width: 56, height: 56, borderRadius: 16, padding: 0, overflow: "hidden",
                border: a.hairStyle === v ? "4px solid #1B2A6B" : "3px solid #E4E8F5",
                background: "#EEF1FF", cursor: "pointer", display: "grid", placeItems: "center",
              }}><Avatar a={{ ...a, hairStyle: v, cap: null, glasses: null }} size={50} /></button>
            ))}
          </div>
        </div>

        <Swatches label={t.shirt} items={SHIRTS} k="shirt" />

        <div style={{ color: "#6C7695", fontWeight: 700, fontSize: 12, marginBottom: 12 }}>🛍️ {t.shopHint}</div>
        <Btn full color="#00B894" onClick={onDone} disabled={!player.name.trim()}>{t.ready} 🎉</Btn>
      </div>
    </div>
  );
}

/* ---------- Topo com moedas ---------- */
function TopBar({ t, player, coins, nextRefill, right, onAvatar, onSwitch, quantos, podeResgatar, resgatar }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <button onClick={onAvatar} aria-label={t.profileTitle}
        style={{ background: "rgba(255,255,255,.16)", borderRadius: 20, padding: 4, border: "none", cursor: onAvatar ? "pointer" : "default" }}>
        <Avatar a={player.avatar} size={44} />
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="display" style={{ color: "#fff", fontSize: 17, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.name}</div>
        {nextRefill != null && !podeResgatar && <div style={{ color: "#B9C6FF", fontSize: 11, fontWeight: 700 }}>{t.nextCoins} {fmt(nextRefill)}</div>}
        {podeResgatar && <div style={{ color: "#9BF3D6", fontSize: 11, fontWeight: 800 }}>🎁 {t.claimReady}</div>}
      </div>
      {onSwitch && (
        <button onClick={onSwitch} aria-label={t.switchPlayer} className="chunky"
          style={{ background: "rgba(255,255,255,.18)", padding: "9px 11px", fontSize: 16, position: "relative" }}>
          👥
          {quantos > 1 && (
            <span style={{
              position: "absolute", top: -5, right: -5, background: "#E84393", color: "#fff",
              borderRadius: 999, fontSize: 10, fontWeight: 900, padding: "1px 5px",
            }}>{quantos}</span>
          )}
        </button>
      )}
      <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "8px 12px", fontWeight: 900, fontSize: 16 }}><Coin n={coins} /></div>
      {podeResgatar && <Btn small color="#00B894" onClick={resgatar}>🎁</Btn>}
      {right}
    </div>
  );
}

/* Animais em emoji: nada para baixar, nada de licença, e o desenho já
   vem pronto em qualquer aparelho. Serve à memória e, depois, ao quiz. */
const BIBLIA_EMOJI = ["🕊️","✝️","📖","🐑","🌈","🐟","🍞","🔥","⭐","⛵","🌿","🦁","👑","🎺","🕯️","⛰️"];

const ANIMAIS = [
  "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯",
  "🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦉",
  "🦇","🐺","🐗","🐴","🦄","🐝","🦋","🐌","🐞","🐢",
  "🐍","🦎","🦖","🐙","🦑","🦀","🐠","🐟","🐬","🐳",
  "🦈","🐊","🐘","🦏","🦒","🦓","🐪","🦩","🦜","🦔",
];

/* ---------- Jogo da memória ----------
   Mesmas quatro dificuldades do jogo de bandeiras, mas aqui a estrela
   vem do relógio: saber não basta, tem que lembrar rápido. */
const MEM_LEVELS = {
  easy:   { cols: 2, rows: 3, pares: 3,  estrelas: [300, 240, 150] },
  medium: { cols: 3, rows: 4, pares: 6,  estrelas: [300, 240, 150] },
  hard:   { cols: 4, rows: 4, pares: 8,  estrelas: [240, 180, 120] },
  genius: { cols: 4, rows: 6, pares: 12, estrelas: [180, 120,  60] },
};
const memEstrelas = (nivel, seg) => {
  const [um, dois, tres] = MEM_LEVELS[nivel].estrelas;
  return seg <= tres ? 3 : seg <= dois ? 2 : seg <= um ? 1 : 0;
};

function MemoryGame({ t, lang, nivel, cartas, onFinish, onQuit }) {
  const [viradas, setViradas] = useState([]);   // índices virados agora
  const [achadas, setAchadas] = useState([]);   // índices já casados
  const [jogadas, setJogadas] = useState(0);
  const [seg, setSeg] = useState(0);
  const travado = useRef(false);
  const cfg = MEM_LEVELS[nivel];

  useEffect(() => {
    const i = setInterval(() => setSeg(x => x + 1), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (achadas.length && achadas.length === cartas.length) {
      const id = setTimeout(() => onFinish({ seg, jogadas }), 600);
      return () => clearTimeout(id);
    }
  }, [achadas]);

  function tocar(i) {
    if (travado.current || viradas.includes(i) || achadas.includes(i)) return;
    const novas = [...viradas, i];
    setViradas(novas);
    if (novas.length === 2) {
      setJogadas(j => j + 1);
      travado.current = true;
      const [a, b] = novas;
      const igual = cartas[a].key === cartas[b].key && a !== b;
      setTimeout(() => {
        if (igual) setAchadas(x => [...x, a, b]);
        setViradas([]);
        travado.current = false;
      }, igual ? 420 : 850);
    }
  }

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={onQuit}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 18, flex: 1 }}>{t.levels[nivel]}</div>
        <div style={{ background: "rgba(255,255,255,.18)", color: "#fff", borderRadius: 999, padding: "6px 14px", fontWeight: 900 }}>
          ⏱️ {tempoFmt(seg)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cfg.cols},1fr)`, gap: 8 }}>
        {cartas.map((c, i) => {
          const aberta = viradas.includes(i) || achadas.includes(i);
          const casada = achadas.includes(i);
          return (
            <button key={i} onClick={() => tocar(i)} className="chunky"
              style={{
                aspectRatio: "1", borderRadius: 16, padding: 4, overflow: "hidden",
                background: casada ? "#00B894" : aberta ? "#fff" : "#6A5AE0",
                display: "grid", placeItems: "center", fontSize: 26,
                transition: "background .2s",
              }}>
              {!aberta ? "❓"
                : c.tipo === "flag"
                  ? <img src={flagUrl(c.face)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  : c.tipo === "word"
                    ? <span style={{ fontSize: "min(3.4vw,15px)", color: "#1B2A6B", fontWeight: 900, lineHeight: 1.1, wordBreak: "break-word" }}>{c.face}</span>
                    : <span style={{ fontSize: "min(9vw,40px)" }}>{c.face}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: "center", color: "#C9D2FF", fontWeight: 800, fontSize: 12, marginTop: 12 }}>
        {t.pairs}: {achadas.length / 2}/{cfg.pares} · {t.moves}: {jogadas}
      </div>
    </div>
  );
}

/* ---------- Escolha de nível da memória ---------- */
function MemLevels({ t, coins, memBest, setScreen, comecar, tema = "flags", titulo, icone, temSecao, comprarSecao }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>{icone} {titulo}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>
      <div className="lista">
        {DIFFS.map((d, di) => {
          const cfg = MEM_LEVELS[d];
          const b = memBest[`${tema}:${d}`];
          const chave = `m:${tema}:${d}`;
          const preco = MEM_PRECO[d];
          const aberto = !preco || temSecao(chave);
          const anteriorOk = di === 0 || !MEM_PRECO[DIFFS[di - 1]] || temSecao(`m:${tema}:${DIFFS[di - 1]}`);
          return (
            <div key={d} className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, opacity: aberto || anteriorOk ? 1 : .45 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: aberto ? BAND_COLOR[d] : "#B9C0CC", display: "grid", placeItems: "center", color: "#fff", fontWeight: 900, fontSize: 13 }}>
                {aberto ? `${cfg.cols}×${cfg.rows}` : "🔒"}
              </div>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ color: "#1B2A6B", fontSize: 18 }}>{t.levels[d]}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#6C7695" }}>
                  {aberto ? (
                    <>
                      {[1, 2, 3].map(i2 => <span key={i2} style={{ opacity: (b?.stars || 0) >= i2 ? 1 : .25 }}>★</span>)}
                      {b?.time != null && ` · ⏱️ ${tempoFmt(b.time)}`}
                    </>
                  ) : anteriorOk ? `${t.unlockFor} 🪙${preco}` : t.needPrev}
                </div>
              </div>
              {aberto ? (
                <Btn small color={BAND_COLOR[d]} disabled={coins < ECON.roundCost} onClick={() => comecar(d)}>
                  🪙{ECON.roundCost}
                </Btn>
              ) : anteriorOk ? (
                <Btn small color={coins >= preco ? "#E84393" : "#8B93AD"} disabled={coins < preco}
                  onClick={() => comprarSecao(chave, preco)}>🔓 🪙{preco}</Btn>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ color: "#A7B3EA", fontSize: 11, fontWeight: 700, marginTop: 14, textAlign: "center", lineHeight: 1.7 }}>
        ⭐ {t.memStarsHint}
      </div>
    </div>
  );
}

/* ---------- Matemática ----------
   As contas são geradas por algoritmo, não por lista fixa: cada rodada é
   diferente e a dificuldade sobe fase a fase, parando no conteúdo de 5º ano. */
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

function fazerConta(stage) {
  const band = bandFor("math", stage);
  const n = stage;
  if (band === "easy") {
    const teto = 5 + n * 3;                       // 8 → 20
    if (Math.random() < 0.5) {
      const a = rnd(1, teto), b = rnd(1, teto);
      return { prompt: `${a} + ${b}`, answer: a + b };
    }
    const a = rnd(2, teto), b = rnd(1, a);
    return { prompt: `${a} − ${b}`, answer: a - b };
  }
  if (band === "medium") {
    const r = Math.random();
    if (r < 0.35) { const a = rnd(10, 60), b = rnd(10, 40); return { prompt: `${a} + ${b}`, answer: a + b }; }
    if (r < 0.65) { const a = rnd(20, 99), b = rnd(1, a - 1); return { prompt: `${a} − ${b}`, answer: a - b }; }
    const a = rnd(2, 5), b = rnd(2, 10);
    return { prompt: `${a} × ${b}`, answer: a * b };
  }
  if (band === "hard") {
    const r = Math.random();
    if (r < 0.4) { const a = rnd(2, 10), b = rnd(2, 10); return { prompt: `${a} × ${b}`, answer: a * b }; }
    if (r < 0.7) { const b = rnd(2, 10), q = rnd(2, 10); return { prompt: `${b * q} ÷ ${b}`, answer: q }; }
    // subtração sempre com o maior primeiro: nada de resultado negativo
    const x = rnd(100, 900), y = rnd(50, 400);
    const a = Math.max(x, y), b = Math.min(x, y);
    return Math.random() < 0.5
      ? { prompt: `${a} + ${b}`, answer: a + b }
      : { prompt: `${a} − ${b}`, answer: a - b };
  }
  // gênio: fração de quantidade, porcentagem, decimal, ordem das operações
  const r = Math.random();
  if (r < 0.25) { const d = [2, 3, 4, 5][rnd(0, 3)], q = rnd(2, 12); return { prompt: `1/${d} de ${d * q}`, answer: q }; }
  if (r < 0.5)  { const p = [10, 20, 25, 50][rnd(0, 3)], base = rnd(2, 20) * 10; return { prompt: `${p}% de ${base}`, answer: Math.round(base * p / 100) }; }
  if (r < 0.75) { const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 9); return { prompt: `${a} + ${b} × ${c}`, answer: a + b * c }; }
  const a = rnd(11, 99) / 10, b = rnd(11, 99) / 10;
  return { prompt: `${a.toFixed(1)} + ${b.toFixed(1)}`.replace(/\./g, ","), answer: Number((a + b).toFixed(1)) };
}

function opcoesConta(certa) {
  const set = new Set([certa]);
  let guarda = 0;
  while (set.size < 4 && guarda++ < 60) {
    const delta = [1, -1, 2, -2, 3, -3, 10, -10][rnd(0, 7)];
    let alt = Math.round((certa + delta) * 10) / 10;
    if (alt < 0) alt = Math.abs(alt) + 1;
    if (alt !== certa) set.add(alt);
  }
  while (set.size < 4) set.add(certa + set.size * 7);
  const fmtN = v => String(v).replace(".", ",");
  return { answer: fmtN(certa), options: shuffle([...set].map(fmtN)) };
}

function montarRodadaMath(stage) {
  const band = bandFor("math", stage);
  const qCount = (band === "easy" || band === "medium") ? 5 : 10;
  const qs = [];
  const vistas = new Set();
  let guarda = 0;
  while (qs.length < qCount && guarda++ < 200) {
    const c = fazerConta(stage);
    if (vistas.has(c.prompt)) continue;
    vistas.add(c.prompt);
    const { answer, options } = opcoesConta(c.answer);
    qs.push({ kind: "math", prompt: c.prompt, answer, options });
  }
  const time = tempoDe("math", stage);
  return { cont: "math", diff: band, stage, qs, time, t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Quiz dos Animais ----------
   As respostas são os próprios bichos, não palavras. Assim a criança que
   ainda não lê bem responde olhando, e a tradução custa só as perguntas. */
const BICHOS = [
  { e: "🐶", tags: ["mamifero", "patas4", "fazenda", "domestico"] },
  { e: "🐱", tags: ["mamifero", "patas4", "domestico"] },
  { e: "🐭", tags: ["mamifero", "patas4"] },
  { e: "🐰", tags: ["mamifero", "patas4", "domestico"] },
  { e: "🦊", tags: ["mamifero", "patas4", "selva"] },
  { e: "🐻", tags: ["mamifero", "patas4", "selva"] },
  { e: "🐼", tags: ["mamifero", "patas4", "selva"] },
  { e: "🐯", tags: ["mamifero", "patas4", "selva"] },
  { e: "🦁", tags: ["mamifero", "patas4", "selva"] },
  { e: "🐮", tags: ["mamifero", "patas4", "fazenda"] },
  { e: "🐷", tags: ["mamifero", "patas4", "fazenda"] },
  { e: "🐴", tags: ["mamifero", "patas4", "fazenda"] },
  { e: "🐑", tags: ["mamifero", "patas4", "fazenda"] },
  { e: "🐘", tags: ["mamifero", "patas4", "selva"] },
  { e: "🦒", tags: ["mamifero", "patas4", "selva"] },
  { e: "🦓", tags: ["mamifero", "patas4", "selva"] },
  { e: "🦏", tags: ["mamifero", "patas4", "selva"] },
  { e: "🐺", tags: ["mamifero", "patas4"] },
  { e: "🦇", tags: ["mamifero", "voa"] },
  { e: "🐳", tags: ["mamifero", "agua"] },
  { e: "🐬", tags: ["mamifero", "agua"] },
  { e: "🐔", tags: ["ave", "ovos", "fazenda"] },
  { e: "🐧", tags: ["ave", "ovos", "gelo", "agua"] },
  { e: "🦆", tags: ["ave", "ovos", "voa", "agua", "fazenda"] },
  { e: "🦉", tags: ["ave", "ovos", "voa"] },
  { e: "🦜", tags: ["ave", "ovos", "voa", "selva"] },
  { e: "🦩", tags: ["ave", "ovos", "voa", "agua"] },
  { e: "🐦", tags: ["ave", "ovos", "voa"] },
  { e: "🐢", tags: ["reptil", "ovos", "patas4", "agua"] },
  { e: "🐍", tags: ["reptil", "ovos"] },
  { e: "🦎", tags: ["reptil", "ovos", "patas4"] },
  { e: "🐊", tags: ["reptil", "ovos", "patas4", "agua"] },
  { e: "🐟", tags: ["peixe", "ovos", "agua"] },
  { e: "🐠", tags: ["peixe", "ovos", "agua"] },
  { e: "🦈", tags: ["peixe", "ovos", "agua"] },
  { e: "🐝", tags: ["inseto", "voa", "ovos"] },
  { e: "🦋", tags: ["inseto", "voa", "ovos"] },
  { e: "🐞", tags: ["inseto", "voa", "ovos"] },
  { e: "🐜", tags: ["inseto", "ovos"] },
  { e: "🦗", tags: ["inseto", "ovos"] },
  { e: "🐸", tags: ["anfibio", "ovos", "agua"] },
  { e: "🐙", tags: ["agua", "ovos"] },
  { e: "🦀", tags: ["agua", "ovos"] },
  { e: "🐌", tags: ["ovos"] },
];

/* Cada pergunta é uma etiqueta a procurar. As difíceis são as menos óbvias. */
const PERGUNTAS_BICHO = {
  easy:   [["voa", 0], ["agua", 0], ["fazenda", 0]],
  medium: [["ave", 0], ["mamifero", 0], ["inseto", 0], ["selva", 0]],
  hard:   [["reptil", 0], ["ovos", 0], ["peixe", 0], ["patas4", 0], ["gelo", 0]],
  genius: [["anfibio", 0], ["mamifero", 1], ["reptil", 1], ["inseto", 1], ["ave", 1]],
};

function montarRodadaBichos(stage, t) {
  const band = bandFor("bichos", stage);
  const qCount = (band === "easy" || band === "medium") ? 5 : 10;
  const qs = [];
  const usadas = new Set();
  let guarda = 0;
  while (qs.length < qCount && guarda++ < 300) {
    const [tag, negar] = PERGUNTAS_BICHO[band][Math.floor(Math.random() * PERGUNTAS_BICHO[band].length)];
    const com = BICHOS.filter(b => b.tags.includes(tag));
    const sem = BICHOS.filter(b => !b.tags.includes(tag));
    const certos = negar ? sem : com;
    const errados = negar ? com : sem;
    if (certos.length < 1 || errados.length < 3) continue;
    const certo = certos[Math.floor(Math.random() * certos.length)];
    const chave = `${tag}${negar}${certo.e}`;
    if (usadas.has(chave)) continue;
    usadas.add(chave);
    const distr = shuffle(errados).slice(0, 3);
    qs.push({
      kind: "emojiPick",
      prompt: t.bicho[negar ? `nao_${tag}` : tag],
      answer: certo.e,
      options: shuffle([certo.e, ...distr.map(d => d.e)]),
    });
  }
  const time = tempoDe("bichos", stage);
  return { cont: "bichos", diff: band, stage, qs, time, t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Inglês ----------
   O emoji mostra a coisa, a resposta é a palavra em inglês. Como a resposta
   já É o conteúdo aprendido, não há nada para traduzir nas alternativas. */
const VOCAB = [
  { e: "🐶", n: 1, w: { pt: "cachorro", en: "dog", es: "perro", fr: "chien", de: "Hund", it: "cane" } },
  { e: "🐱", n: 1, w: { pt: "gato", en: "cat", es: "gato", fr: "chat", de: "Katze", it: "gatto" } },
  { e: "☀️", n: 1, w: { pt: "sol", en: "sun", es: "sol", fr: "soleil", de: "Sonne", it: "sole" } },
  { e: "🌙", n: 1, w: { pt: "lua", en: "moon", es: "luna", fr: "lune", de: "Mond", it: "luna" } },
  { e: "⭐", n: 1, w: { pt: "estrela", en: "star", es: "estrella", fr: "étoile", de: "Stern", it: "stella" } },
  { e: "🌳", n: 1, w: { pt: "árvore", en: "tree", es: "árbol", fr: "arbre", de: "Baum", it: "albero" } },
  { e: "🏠", n: 1, w: { pt: "casa", en: "house", es: "casa", fr: "maison", de: "Haus", it: "casa" } },
  { e: "🚗", n: 1, w: { pt: "carro", en: "car", es: "coche", fr: "voiture", de: "Auto", it: "auto" } },
  { e: "📖", n: 1, w: { pt: "livro", en: "book", es: "libro", fr: "livre", de: "Buch", it: "libro" } },
  { e: "⚽", n: 1, w: { pt: "bola", en: "ball", es: "pelota", fr: "ballon", de: "Ball", it: "palla" } },
  { e: "🍎", n: 1, w: { pt: "maçã", en: "apple", es: "manzana", fr: "pomme", de: "Apfel", it: "mela" } },
  { e: "🐟", n: 1, w: { pt: "peixe", en: "fish", es: "pez", fr: "poisson", de: "Fisch", it: "pesce" } },
  { e: "🐦", n: 1, w: { pt: "pássaro", en: "bird", es: "pájaro", fr: "oiseau", de: "Vogel", it: "uccello" } },
  { e: "🥛", n: 1, w: { pt: "leite", en: "milk", es: "leche", fr: "lait", de: "Milch", it: "latte" } },
  { e: "💧", n: 1, w: { pt: "água", en: "water", es: "agua", fr: "eau", de: "Wasser", it: "acqua" } },
  { e: "🐘", n: 2, w: { pt: "elefante", en: "elephant", es: "elefante", fr: "éléphant", de: "Elefant", it: "elefante" } },
  { e: "🦋", n: 2, w: { pt: "borboleta", en: "butterfly", es: "mariposa", fr: "papillon", de: "Schmetterling", it: "farfalla" } },
  { e: "🌈", n: 2, w: { pt: "arco-íris", en: "rainbow", es: "arcoíris", fr: "arc-en-ciel", de: "Regenbogen", it: "arcobaleno" } },
  { e: "🚲", n: 2, w: { pt: "bicicleta", en: "bicycle", es: "bicicleta", fr: "vélo", de: "Fahrrad", it: "bicicletta" } },
  { e: "🌸", n: 2, w: { pt: "flor", en: "flower", es: "flor", fr: "fleur", de: "Blume", it: "fiore" } },
  { e: "☁️", n: 2, w: { pt: "nuvem", en: "cloud", es: "nube", fr: "nuage", de: "Wolke", it: "nuvola" } },
  { e: "🔑", n: 2, w: { pt: "chave", en: "key", es: "llave", fr: "clé", de: "Schlüssel", it: "chiave" } },
  { e: "🕐", n: 2, w: { pt: "relógio", en: "clock", es: "reloj", fr: "horloge", de: "Uhr", it: "orologio" } },
  { e: "🪑", n: 2, w: { pt: "cadeira", en: "chair", es: "silla", fr: "chaise", de: "Stuhl", it: "sedia" } },
  { e: "🚪", n: 2, w: { pt: "porta", en: "door", es: "puerta", fr: "porte", de: "Tür", it: "porta" } },
  { e: "👟", n: 2, w: { pt: "sapato", en: "shoe", es: "zapato", fr: "chaussure", de: "Schuh", it: "scarpa" } },
  { e: "🎩", n: 2, w: { pt: "chapéu", en: "hat", es: "sombrero", fr: "chapeau", de: "Hut", it: "cappello" } },
  { e: "🍞", n: 2, w: { pt: "pão", en: "bread", es: "pan", fr: "pain", de: "Brot", it: "pane" } },
  { e: "🧀", n: 2, w: { pt: "queijo", en: "cheese", es: "queso", fr: "fromage", de: "Käse", it: "formaggio" } },
  { e: "🐝", n: 2, w: { pt: "abelha", en: "bee", es: "abeja", fr: "abeille", de: "Biene", it: "ape" } },
  { e: "🦒", n: 3, w: { pt: "girafa", en: "giraffe", es: "jirafa", fr: "girafe", de: "Giraffe", it: "giraffa" } },
  { e: "🐊", n: 3, w: { pt: "crocodilo", en: "crocodile", es: "cocodrilo", fr: "crocodile", de: "Krokodil", it: "coccodrillo" } },
  { e: "☂️", n: 3, w: { pt: "guarda-chuva", en: "umbrella", es: "paraguas", fr: "parapluie", de: "Regenschirm", it: "ombrello" } },
  { e: "✈️", n: 3, w: { pt: "avião", en: "airplane", es: "avión", fr: "avion", de: "Flugzeug", it: "aereo" } },
  { e: "🍓", n: 3, w: { pt: "morango", en: "strawberry", es: "fresa", fr: "fraise", de: "Erdbeere", it: "fragola" } },
  { e: "🕯️", n: 3, w: { pt: "vela", en: "candle", es: "vela", fr: "bougie", de: "Kerze", it: "candela" } },
  { e: "🕷️", n: 3, w: { pt: "aranha", en: "spider", es: "araña", fr: "araignée", de: "Spinne", it: "ragno" } },
  { e: "🐳", n: 3, w: { pt: "baleia", en: "whale", es: "ballena", fr: "baleine", de: "Wal", it: "balena" } },
  { e: "🚀", n: 3, w: { pt: "foguete", en: "rocket", es: "cohete", fr: "fusée", de: "Rakete", it: "razzo" } },
  { e: "🍯", n: 3, w: { pt: "mel", en: "honey", es: "miel", fr: "miel", de: "Honig", it: "miele" } },
  { e: "⛰️", n: 3, w: { pt: "montanha", en: "mountain", es: "montaña", fr: "montagne", de: "Berg", it: "montagna" } },
  { e: "🌉", n: 3, w: { pt: "ponte", en: "bridge", es: "puente", fr: "pont", de: "Brücke", it: "ponte" } },
  { e: "🦉", n: 3, w: { pt: "coruja", en: "owl", es: "búho", fr: "hibou", de: "Eule", it: "gufo" } },
  { e: "🧦", n: 3, w: { pt: "meias", en: "socks", es: "calcetines", fr: "chaussettes", de: "Socken", it: "calzini" } },
  { e: "🪞", n: 3, w: { pt: "espelho", en: "mirror", es: "espejo", fr: "miroir", de: "Spiegel", it: "specchio" } },
];

const VOCAB_NIVEL = { easy: [1], medium: [1, 2], hard: [2, 3], genius: [3] };

function montarRodadaIdioma(stage, t, alvo) {
  const band = bandFor(`idiomas_${alvo}`, stage);
  const qCount = (band === "easy" || band === "medium") ? 5 : 10;
  const pool = VOCAB.filter(v => VOCAB_NIVEL[band].includes(v.n));
  const escolhidos = shuffle(pool).slice(0, qCount);
  const qs = escolhidos.map(v => {
    const certa = v.w[alvo];
    // alternativas erradas também no idioma-alvo, senão a resposta se entrega
    const distr = shuffle(VOCAB.filter(o => o.w[alvo] !== certa)).slice(0, 3);
    return {
      kind: "emojiAsk", prompt: v.e,
      ask: t.howSayIn.replace("{x}", LANG_CATALOG[alvo]),
      answer: certa, options: shuffle([certa, ...distr.map(d => d.w[alvo])]),
    };
  });
  return { cont: `idiomas_${alvo}`, diff: band, stage, qs, time: tempoDe(`idiomas_${alvo}`, stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Cores e Formas ----------
   Emoji já traz forma e cor combinadas, então dá para perguntar as duas
   coisas sem desenhar nada e sem depender de leitura na resposta. */
const FORMAS = {
  circulo: { vermelho: "🔴", laranja: "🟠", amarelo: "🟡", verde: "🟢", azul: "🔵", roxo: "🟣", marrom: "🟤", preto: "⚫", branco: "⚪" },
  quadrado: { vermelho: "🟥", laranja: "🟧", amarelo: "🟨", verde: "🟩", azul: "🟦", roxo: "🟪", marrom: "🟫", preto: "⬛", branco: "⬜" },
  coracao: { vermelho: "❤️", laranja: "🧡", amarelo: "💛", verde: "💚", azul: "💙", roxo: "💜", marrom: "🤎", preto: "🖤", branco: "🤍" },
};
const CORES_LISTA = ["vermelho", "laranja", "amarelo", "verde", "azul", "roxo", "marrom", "preto", "branco"];
const FORMAS_LISTA = ["circulo", "quadrado", "coracao"];
const todosEmojis = () => FORMAS_LISTA.flatMap(f => CORES_LISTA.map(c => ({ f, c, e: FORMAS[f][c] })));

function montarRodadaArte(stage, t) {
  const band = bandFor("arts", stage);
  const qCount = (band === "easy" || band === "medium") ? 5 : 10;
  const todos = todosEmojis();
  const qs = [];
  let guarda = 0;
  while (qs.length < qCount && guarda++ < 300) {
    const alvo = todos[Math.floor(Math.random() * todos.length)];
    let prompt, errados;
    if (band === "easy") {            // só a cor, tudo em círculos
      prompt = t.artQ.cor.replace("{x}", t.cores[alvo.c]);
      errados = todos.filter(o => o.f === "circulo" && o.c !== alvo.c);
      if (alvo.f !== "circulo") continue;
    } else if (band === "medium") {   // só a forma, cores variadas
      prompt = t.artQ.forma.replace("{x}", t.formas[alvo.f]);
      errados = todos.filter(o => o.f !== alvo.f);
    } else if (band === "hard") {     // forma e cor juntas
      prompt = t.artQ.ambos.replace("{f}", t.formas[alvo.f]).replace("{c}", t.cores[alvo.c]);
      errados = todos.filter(o => o.f !== alvo.f || o.c !== alvo.c);
    } else {                          // o que NÃO é
      prompt = t.artQ.nao.replace("{x}", t.cores[alvo.c]);
      const fora = todos.filter(o => o.c !== alvo.c);
      const certo2 = fora[Math.floor(Math.random() * fora.length)];
      const iguais = todos.filter(o => o.c === alvo.c);
      qs.push({ kind: "emojiPick", prompt, answer: certo2.e, options: shuffle([certo2.e, ...shuffle(iguais).slice(0, 3).map(o => o.e)]) });
      continue;
    }
    qs.push({ kind: "emojiPick", prompt, answer: alvo.e, options: shuffle([alvo.e, ...shuffle(errados).slice(0, 3).map(o => o.e)]) });
  }
  return { cont: "arts", diff: band, stage, qs, time: tempoDe("arts", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Curiosidades do Mundo ----------
   O emoji faz as vezes de foto e a pergunta vem do tipo da curiosidade.
   Nada de imagem de terceiro: a "foto" é um glifo que o próprio sistema
   desenha, então continua funcionando em modo avião e sem baixar nada.

   As alternativas erradas saem do MESMO universo da certa — outros países
   citados no banco, outros mares, outros continentes. Sem isso a resposta se
   entrega: bastaria escolher a única opção que é um país. */
const CONTINENTES_IDS = ["sa", "na", "eu", "af", "as", "oc"];

function rotuloCuriosidade(tipo, valor, t, lang) {
  if (tipo === "pais") return countryName(valor, lang);
  if (tipo === "agua") return AGUAS[valor][lang] || AGUAS[valor].en;
  if (tipo === "continente") return t.continents[valor];
  return valor;                                   // cidade: nome próprio
}

function universoCuriosidade(tipo) {
  if (tipo === "agua") return Object.keys(AGUAS);
  if (tipo === "continente") return CONTINENTES_IDS;
  return [...new Set(CURIOSIDADES.filter(o => o.t === tipo).map(o => o.r))];
}

function montarRodadaCuriosidades(stage, t, lang) {
  const band = bandFor("curiosidades", stage);
  const qCount = (band === "easy" || band === "medium") ? 5 : 10;
  const pool = CURIOSIDADES.filter(c => CURIOSIDADE_NIVEL[band].includes(c.n));
  const escolhidas = shuffle(pool).slice(0, qCount);
  const qs = [];
  for (const c of escolhidas) {
    const certa = rotuloCuriosidade(c.t, c.r, t, lang);
    const outros = universoCuriosidade(c.t)
      .map(x => rotuloCuriosidade(c.t, x, t, lang))
      .filter(x => x && x !== certa);
    const distr = shuffle([...new Set(outros)]).slice(0, 3);
    if (distr.length < 3) continue;
    qs.push({
      kind: "emojiAsk", prompt: c.e,
      ask: t.curQ[c.t].replace("{x}", c.nome[lang] || c.nome.en),
      answer: certa, options: shuffle([certa, ...distr]),
    });
  }
  return { cont: "curiosidades", diff: band, stage, qs, time: tempoDe("curiosidades", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Ciências dos Animais ----------
   Mesma ideia, mas as perguntas são geradas: 94 animais × 5 moldes. Ver
   src/data/ciencias.js — lá estão os fatos, aqui só a montagem da rodada. */
const PERGUNTAS_CIENCIA = perguntasCiencia();
const DICS_CIENCIA = { grupo: GRUPOS, dieta: DIETAS, casa: CASAS, nasce: NASCE };

function montarRodadaCiencias(stage, t, lang) {
  const band = bandFor("ciencias", stage);
  const qCount = (band === "easy" || band === "medium") ? 5 : 10;
  const pool = PERGUNTAS_CIENCIA.filter(x => CIENCIA_NIVEL[band].includes(x.n));
  const escolhidas = shuffle(pool).slice(0, qCount);
  const qs = [];
  for (const x of escolhidas) {
    const dic = DICS_CIENCIA[x.campo];
    const rotulo = v => dic ? (dic[v][lang] || dic[v].en) : t.continents[v];
    const universo = dic ? Object.keys(dic) : CONTINENTES_IDS;
    const certa = rotulo(x.r);
    const distr = shuffle(universo.map(rotulo).filter(o => o && o !== certa)).slice(0, 3);
    if (distr.length < 3) continue;
    qs.push({
      kind: "emojiAsk", prompt: x.e, ask: t.sciQ[x.molde],
      answer: certa, options: shuffle([certa, ...distr]),
    });
  }
  return { cont: "ciencias", diff: band, stage, qs, time: tempoDe("ciencias", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Bíblia ----------
   Foco em fatos narrativos: quem fez o quê, onde, em que livro. Deixei de
   fora questões de doutrina, que variam entre igrejas e não cabem num quiz
   infantil. As perguntas devem ser revisadas por um adulto antes de publicar. */
const BIBLIA = {
  pt: {
    easy: [
      ["Quem construiu a arca?", "Noé", ["Moisés", "Davi", "Pedro"]],
      ["Quem enfrentou o gigante Golias?", "Davi", ["Sansão", "José", "Josué"]],
      ["Onde Jesus nasceu?", "Belém", ["Nazaré", "Jerusalém", "Cafarnaum"]],
      ["Quem foi jogado na cova dos leões?", "Daniel", ["Elias", "Jonas", "Jó"]],
      ["Quem foi engolido por um grande peixe?", "Jonas", ["Paulo", "Tiago", "Isaías"]],
      ["Qual é o primeiro livro da Bíblia?", "Gênesis", ["Êxodo", "Salmos", "João"]],
      ["Quem era a mãe de Jesus?", "Maria", ["Marta", "Rute", "Ana"]],
      ["Quantos dias durou a criação, com o descanso?", "7", ["3", "12", "40"]],
      ["Quem abriu o Mar Vermelho pela mão de Deus?", "Moisés", ["Arão", "Josué", "Samuel"]],
      ["O que Deus criou no primeiro dia?", "A luz", ["Os animais", "O sol", "O homem"]],
    ],
    medium: [
      ["Quantos discípulos Jesus escolheu?", "12", ["7", "10", "40"]],
      ["Quem batizou Jesus?", "João Batista", ["Pedro", "André", "Tiago"]],
      ["Qual foi o primeiro milagre de Jesus?", "Transformar água em vinho", ["Andar sobre as águas", "Curar um cego", "Multiplicar os pães"]],
      ["Quem negou Jesus três vezes?", "Pedro", ["Tomé", "Judas", "Filipe"]],
      ["Quantos livros tem a Bíblia?", "66", ["27", "40", "100"]],
      ["Quem recebeu os Dez Mandamentos?", "Moisés", ["Abraão", "Isaque", "Josué"]],
      ["Qual rei escreveu muitos Salmos?", "Davi", ["Saul", "Salomão", "Ezequias"]],
      ["Quem foi o rei mais sábio de Israel?", "Salomão", ["Davi", "Josias", "Acabe"]],
      ["Em que rio Jesus foi batizado?", "Jordão", ["Nilo", "Eufrates", "Tigre"]],
      ["Quem traiu Jesus?", "Judas Iscariotes", ["Pedro", "Tomé", "Mateus"]],
      ["Quantos irmãos José tinha?", "11", ["3", "7", "12"]],
      ["Quem derrubou os muros de Jericó?", "Josué", ["Gideão", "Sansão", "Baraque"]],
    ],
    hard: [
      ["Quantos Evangelhos existem?", "4", ["2", "5", "7"]],
      ["Qual é o último livro da Bíblia?", "Apocalipse", ["Judas", "Atos", "Hebreus"]],
      ["Quem escreveu a maior parte das cartas do Novo Testamento?", "Paulo", ["Pedro", "João", "Lucas"]],
      ["Quantos anos o povo de Israel andou pelo deserto?", "40", ["7", "12", "70"]],
      ["Quem foi o primeiro rei de Israel?", "Saul", ["Davi", "Samuel", "Salomão"]],
      ["Qual profeta foi levado ao céu num carro de fogo?", "Elias", ["Eliseu", "Isaías", "Enoque"]],
      ["Quem era o pai de Isaque?", "Abraão", ["Jacó", "Ló", "Labão"]],
      ["Como se chamava o jardim onde viveram Adão e Eva?", "Éden", ["Getsêmani", "Siló", "Carmelo"]],
      ["Quantas pragas caíram sobre o Egito?", "10", ["7", "12", "3"]],
      ["Quem sucedeu Moisés como líder do povo?", "Josué", ["Calebe", "Arão", "Gideão"]],
    ],
    genius: [
      ["Qual é o menor livro do Novo Testamento em versículos?", "3 João", ["Filemom", "Judas", "Tito"]],
      ["Quantos capítulos tem o livro de Salmos?", "150", ["100", "120", "180"]],
      ["Qual apóstolo era médico e escreveu um Evangelho?", "Lucas", ["Marcos", "Mateus", "João"]],
      ["Em que monte Moisés recebeu a Lei?", "Sinai", ["Nebo", "Carmelo", "Hermom"]],
      ["Qual era a profissão de Pedro antes de seguir Jesus?", "Pescador", ["Carpinteiro", "Cobrador de impostos", "Fabricante de tendas"]],
      ["Qual profeta menor teve seu livro citado por Jesus sobre Nínive?", "Jonas", ["Amós", "Naum", "Oseias"]],
      ["Quantos anos Matusalém viveu, segundo Gênesis?", "969", ["777", "900", "1000"]],
      ["Qual é o primeiro livro dos Profetas Maiores?", "Isaías", ["Jeremias", "Ezequiel", "Daniel"]],
      ["Quem era o irmão mais velho de Moisés?", "Arão", ["Miriã", "Josué", "Cale"]],
      ["Em que cidade os seguidores de Jesus foram chamados cristãos pela primeira vez?", "Antioquia", ["Jerusalém", "Roma", "Éfeso"]],
    ],
  },
  en: {
    easy: [
      ["Who built the ark?", "Noah", ["Moses", "David", "Peter"]],
      ["Who faced the giant Goliath?", "David", ["Samson", "Joseph", "Joshua"]],
      ["Where was Jesus born?", "Bethlehem", ["Nazareth", "Jerusalem", "Capernaum"]],
      ["Who was thrown into the lions' den?", "Daniel", ["Elijah", "Jonah", "Job"]],
      ["Who was swallowed by a great fish?", "Jonah", ["Paul", "James", "Isaiah"]],
      ["What is the first book of the Bible?", "Genesis", ["Exodus", "Psalms", "John"]],
      ["Who was the mother of Jesus?", "Mary", ["Martha", "Ruth", "Hannah"]],
      ["How many days did creation take, counting the rest?", "7", ["3", "12", "40"]],
      ["Who parted the Red Sea by God's hand?", "Moses", ["Aaron", "Joshua", "Samuel"]],
      ["What did God create on the first day?", "Light", ["Animals", "The sun", "Man"]],
    ],
    medium: [
      ["How many disciples did Jesus choose?", "12", ["7", "10", "40"]],
      ["Who baptized Jesus?", "John the Baptist", ["Peter", "Andrew", "James"]],
      ["What was the first miracle of Jesus?", "Turning water into wine", ["Walking on water", "Healing a blind man", "Feeding the crowd"]],
      ["Who denied Jesus three times?", "Peter", ["Thomas", "Judas", "Philip"]],
      ["How many books are in the Bible?", "66", ["27", "40", "100"]],
      ["Who received the Ten Commandments?", "Moses", ["Abraham", "Isaac", "Joshua"]],
      ["Which king wrote many Psalms?", "David", ["Saul", "Solomon", "Hezekiah"]],
      ["Who was the wisest king of Israel?", "Solomon", ["David", "Josiah", "Ahab"]],
      ["In which river was Jesus baptized?", "Jordan", ["Nile", "Euphrates", "Tigris"]],
      ["Who betrayed Jesus?", "Judas Iscariot", ["Peter", "Thomas", "Matthew"]],
      ["How many brothers did Joseph have?", "11", ["3", "7", "12"]],
      ["Who brought down the walls of Jericho?", "Joshua", ["Gideon", "Samson", "Barak"]],
    ],
    hard: [
      ["How many Gospels are there?", "4", ["2", "5", "7"]],
      ["What is the last book of the Bible?", "Revelation", ["Jude", "Acts", "Hebrews"]],
      ["Who wrote most of the New Testament letters?", "Paul", ["Peter", "John", "Luke"]],
      ["How many years did Israel wander in the desert?", "40", ["7", "12", "70"]],
      ["Who was the first king of Israel?", "Saul", ["David", "Samuel", "Solomon"]],
      ["Which prophet was taken to heaven in a chariot of fire?", "Elijah", ["Elisha", "Isaiah", "Enoch"]],
      ["Who was Isaac's father?", "Abraham", ["Jacob", "Lot", "Laban"]],
      ["What was the garden where Adam and Eve lived?", "Eden", ["Gethsemane", "Shiloh", "Carmel"]],
      ["How many plagues struck Egypt?", "10", ["7", "12", "3"]],
      ["Who succeeded Moses as leader?", "Joshua", ["Caleb", "Aaron", "Gideon"]],
    ],
    genius: [
      ["Which is the shortest New Testament book by verses?", "3 John", ["Philemon", "Jude", "Titus"]],
      ["How many chapters are in Psalms?", "150", ["100", "120", "180"]],
      ["Which Gospel writer was a physician?", "Luke", ["Mark", "Matthew", "John"]],
      ["On which mountain did Moses receive the Law?", "Sinai", ["Nebo", "Carmel", "Hermon"]],
      ["What was Peter's job before following Jesus?", "Fisherman", ["Carpenter", "Tax collector", "Tentmaker"]],
      ["Which prophet did Jesus cite about Nineveh?", "Jonah", ["Amos", "Nahum", "Hosea"]],
      ["How many years did Methuselah live, per Genesis?", "969", ["777", "900", "1000"]],
      ["Which is the first of the Major Prophets?", "Isaiah", ["Jeremiah", "Ezekiel", "Daniel"]],
      ["Who was Moses' older brother?", "Aaron", ["Miriam", "Joshua", "Caleb"]],
      ["In which city were followers first called Christians?", "Antioch", ["Jerusalem", "Rome", "Ephesus"]],
    ],
  },
  es: {
    easy: [
      ["¿Quién construyó el arca?", "Noé", ["Moisés", "David", "Pedro"]],
      ["¿Quién enfrentó al gigante Goliat?", "David", ["Sansón", "José", "Josué"]],
      ["¿Dónde nació Jesús?", "Belén", ["Nazaret", "Jerusalén", "Cafarnaúm"]],
      ["¿Quién fue echado al foso de los leones?", "Daniel", ["Elías", "Jonás", "Job"]],
      ["¿Quién fue tragado por un gran pez?", "Jonás", ["Pablo", "Santiago", "Isaías"]],
      ["¿Cuál es el primer libro de la Biblia?", "Génesis", ["Éxodo", "Salmos", "Juan"]],
      ["¿Quién era la madre de Jesús?", "María", ["Marta", "Rut", "Ana"]],
      ["¿Cuántos días duró la creación, con el descanso?", "7", ["3", "12", "40"]],
      ["¿Quién abrió el Mar Rojo por la mano de Dios?", "Moisés", ["Aarón", "Josué", "Samuel"]],
      ["¿Qué creó Dios el primer día?", "La luz", ["Los animales", "El sol", "El hombre"]],
    ],
    medium: [
      ["¿Cuántos discípulos eligió Jesús?", "12", ["7", "10", "40"]],
      ["¿Quién bautizó a Jesús?", "Juan el Bautista", ["Pedro", "Andrés", "Santiago"]],
      ["¿Cuál fue el primer milagro de Jesús?", "Convertir agua en vino", ["Caminar sobre el agua", "Sanar a un ciego", "Multiplicar los panes"]],
      ["¿Quién negó a Jesús tres veces?", "Pedro", ["Tomás", "Judas", "Felipe"]],
      ["¿Cuántos libros tiene la Biblia?", "66", ["27", "40", "100"]],
      ["¿Quién recibió los Diez Mandamientos?", "Moisés", ["Abraham", "Isaac", "Josué"]],
      ["¿Qué rey escribió muchos Salmos?", "David", ["Saúl", "Salomón", "Ezequías"]],
      ["¿Quién fue el rey más sabio de Israel?", "Salomón", ["David", "Josías", "Acab"]],
      ["¿En qué río fue bautizado Jesús?", "Jordán", ["Nilo", "Éufrates", "Tigris"]],
      ["¿Quién traicionó a Jesús?", "Judas Iscariote", ["Pedro", "Tomás", "Mateo"]],
      ["¿Cuántos hermanos tenía José?", "11", ["3", "7", "12"]],
      ["¿Quién derribó los muros de Jericó?", "Josué", ["Gedeón", "Sansón", "Barac"]],
    ],
    hard: [
      ["¿Cuántos Evangelios hay?", "4", ["2", "5", "7"]],
      ["¿Cuál es el último libro de la Biblia?", "Apocalipsis", ["Judas", "Hechos", "Hebreos"]],
      ["¿Quién escribió la mayoría de las cartas del Nuevo Testamento?", "Pablo", ["Pedro", "Juan", "Lucas"]],
      ["¿Cuántos años anduvo Israel por el desierto?", "40", ["7", "12", "70"]],
      ["¿Quién fue el primer rey de Israel?", "Saúl", ["David", "Samuel", "Salomón"]],
      ["¿Qué profeta fue llevado al cielo en un carro de fuego?", "Elías", ["Eliseo", "Isaías", "Enoc"]],
      ["¿Quién era el padre de Isaac?", "Abraham", ["Jacob", "Lot", "Labán"]],
      ["¿Cómo se llamaba el jardín de Adán y Eva?", "Edén", ["Getsemaní", "Silo", "Carmelo"]],
      ["¿Cuántas plagas cayeron sobre Egipto?", "10", ["7", "12", "3"]],
      ["¿Quién sucedió a Moisés como líder?", "Josué", ["Caleb", "Aarón", "Gedeón"]],
    ],
    genius: [
      ["¿Cuál es el libro más corto del Nuevo Testamento en versículos?", "3 Juan", ["Filemón", "Judas", "Tito"]],
      ["¿Cuántos capítulos tiene Salmos?", "150", ["100", "120", "180"]],
      ["¿Qué evangelista era médico?", "Lucas", ["Marcos", "Mateo", "Juan"]],
      ["¿En qué monte recibió Moisés la Ley?", "Sinaí", ["Nebo", "Carmelo", "Hermón"]],
      ["¿Cuál era el oficio de Pedro?", "Pescador", ["Carpintero", "Recaudador", "Fabricante de tiendas"]],
      ["¿Qué profeta citó Jesús sobre Nínive?", "Jonás", ["Amós", "Nahúm", "Oseas"]],
      ["¿Cuántos años vivió Matusalén, según Génesis?", "969", ["777", "900", "1000"]],
      ["¿Cuál es el primero de los Profetas Mayores?", "Isaías", ["Jeremías", "Ezequiel", "Daniel"]],
      ["¿Quién era el hermano mayor de Moisés?", "Aarón", ["María", "Josué", "Caleb"]],
      ["¿En qué ciudad se llamó cristianos por primera vez a los discípulos?", "Antioquía", ["Jerusalén", "Roma", "Éfeso"]],
    ],
  },
};

function montarRodadaBiblia(stage, lang) {
  const band = bandFor("bible", stage);
  const banco = bancoBiblia(lang, band);
  const qCount = (band === "easy" || band === "medium") ? 5 : 10;
  const escolhidas = shuffle(banco).slice(0, Math.min(qCount, banco.length));
  const qs = escolhidas.map(([pergunta, certa, erradas]) => ({
    kind: "texto", prompt: pergunta, answer: certa, options: shuffle([certa, ...erradas]),
  }));
  return { cont: "bible", diff: band, stage, qs, time: tempoDe("bible", stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* ---------- Capitais ----------
   Começa pelos estados do Brasil, passa pelas capitais dos países continente
   a continente, e termina nos estados dos Estados Unidos. Os nomes dos países
   vêm do sistema; só as capitais precisam de grafia própria por idioma. */
const BR_ESTADOS = [
  ["Acre", "Rio Branco"],
  ["Alagoas", "Maceió"],
  ["Amapá", "Macapá"],
  ["Amazonas", "Manaus"],
  ["Bahia", "Salvador"],
  ["Ceará", "Fortaleza"],
  ["Distrito Federal", "Brasília"],
  ["Espírito Santo", "Vitória"],
  ["Goiás", "Goiânia"],
  ["Maranhão", "São Luís"],
  ["Mato Grosso", "Cuiabá"],
  ["Mato Grosso do Sul", "Campo Grande"],
  ["Minas Gerais", "Belo Horizonte"],
  ["Pará", "Belém"],
  ["Paraíba", "João Pessoa"],
  ["Paraná", "Curitiba"],
  ["Pernambuco", "Recife"],
  ["Piauí", "Teresina"],
  ["Rio de Janeiro", "Rio de Janeiro"],
  ["Rio Grande do Norte", "Natal"],
  ["Rio Grande do Sul", "Porto Alegre"],
  ["Rondônia", "Porto Velho"],
  ["Roraima", "Boa Vista"],
  ["Santa Catarina", "Florianópolis"],
  ["São Paulo", "São Paulo"],
  ["Sergipe", "Aracaju"],
  ["Tocantins", "Palmas"],
];

const US_ESTADOS = [
  ["California", "Sacramento"],
  ["Texas", "Austin"],
  ["New York", "Albany"],
  ["Florida", "Tallahassee"],
  ["Illinois", "Springfield"],
  ["Ohio", "Columbus"],
  ["Georgia", "Atlanta"],
  ["Michigan", "Lansing"],
  ["Washington", "Olympia"],
  ["Arizona", "Phoenix"],
  ["Colorado", "Denver"],
  ["Oregon", "Salem"],
  ["Nevada", "Carson City"],
  ["Utah", "Salt Lake City"],
  ["Alaska", "Juneau"],
  ["Hawaii", "Honolulu"],
  ["Louisiana", "Baton Rouge"],
  ["Tennessee", "Nashville"],
  ["Kentucky", "Frankfort"],
  ["Missouri", "Jefferson City"],
  ["Kansas", "Topeka"],
  ["Nebraska", "Lincoln"],
  ["Minnesota", "Saint Paul"],
  ["Wisconsin", "Madison"],
  ["Indiana", "Indianapolis"],
  ["Virginia", "Richmond"],
  ["Maryland", "Annapolis"],
  ["Massachusetts", "Boston"],
  ["Pennsylvania", "Harrisburg"],
  ["New Jersey", "Trenton"],
];

const CAPITAIS = { AR: "Buenos Aires", BR: "Brasília", CL: "Santiago", UY: "Montevideo", PY: "Asunción", BO: "Sucre", PE: "Lima", EC: "Quito", CO: "Bogotá", VE: "Caracas", GY: "Georgetown", SR: "Paramaribo", US: "Washington, D.C.", CA: "Ottawa", MX: "Mexico City", CU: "Havana", JM: "Kingston", HT: "Port-au-Prince", DO: "Santo Domingo", GT: "Guatemala City", CR: "San José", PA: "Panama City", HN: "Tegucigalpa", NI: "Managua", SV: "San Salvador", BZ: "Belmopan", BS: "Nassau", TT: "Port of Spain", AG: "Saint John's", BB: "Bridgetown", DM: "Roseau", GD: "Saint George's", KN: "Basseterre", LC: "Castries", VC: "Kingstown", PR: "San Juan", PT: "Lisbon", ES: "Madrid", FR: "Paris", IT: "Rome", DE: "Berlin", GB: "London", IE: "Dublin", NL: "Amsterdam", BE: "Brussels", CH: "Bern", AT: "Vienna", GR: "Athens", SE: "Stockholm", NO: "Oslo", FI: "Helsinki", DK: "Copenhagen", PL: "Warsaw", RU: "Moscow", UA: "Kyiv", HU: "Budapest", CZ: "Prague", RO: "Bucharest", HR: "Zagreb", IS: "Reykjavík", RS: "Belgrade", BG: "Sofia", SK: "Bratislava", SI: "Ljubljana", LT: "Vilnius", LV: "Riga", EE: "Tallinn", AL: "Tirana", MT: "Valletta", LU: "Luxembourg", CY: "Nicosia", ME: "Podgorica", MC: "Monaco", AD: "Andorra la Vella", SM: "San Marino", ZA: "Pretoria", EG: "Cairo", NG: "Abuja", KE: "Nairobi", MA: "Rabat", AO: "Luanda", MZ: "Maputo", GH: "Accra", ET: "Addis Ababa", SN: "Dakar", CM: "Yaoundé", TZ: "Dodoma", DZ: "Algiers", TN: "Tunis", CD: "Kinshasa", CI: "Yamoussoukro", ZW: "Harare", NA: "Windhoek", UG: "Kampala", ZM: "Lusaka", ML: "Bamako", MG: "Antananarivo", BW: "Gaborone", RW: "Kigali", CV: "Praia", MU: "Port Louis", SC: "Victoria", KM: "Moroni", ST: "São Tomé", CN: "Beijing", JP: "Tokyo", IN: "New Delhi", KR: "Seoul", TH: "Bangkok", VN: "Hanoi", ID: "Jakarta", PH: "Manila", MY: "Kuala Lumpur", SG: "Singapore", SA: "Riyadh", AE: "Abu Dhabi", IL: "Jerusalem", TR: "Ankara", PK: "Islamabad", BD: "Dhaka", NP: "Kathmandu", LK: "Sri Jayawardenepura Kotte", IR: "Tehran", IQ: "Baghdad", MN: "Ulaanbaatar", KZ: "Astana", UZ: "Tashkent", KH: "Phnom Penh", LA: "Vientiane", MM: "Naypyidaw", QA: "Doha", JO: "Amman", LB: "Beirut", SY: "Damascus", AF: "Kabul", BT: "Thimphu", MV: "Malé", BN: "Bandar Seri Begawan", TL: "Dili", BH: "Manama", AU: "Canberra", NZ: "Wellington", FJ: "Suva", PG: "Port Moresby", WS: "Apia", TO: "Nuku'alofa", VU: "Port Vila", SB: "Honiara", KI: "Tarawa", TV: "Funafuti", NR: "Yaren", MH: "Majuro", FM: "Palikir", PW: "Ngerulmud" };

/* Só as capitais que mudam de grafia. O resto usa a forma canônica. */
const CAP_PT = { MX: "Cidade do México", US: "Washington", HT: "Porto Príncipe", TT: "Porto de Espanha", PT: "Lisboa", IT: "Roma", GB: "Londres", BE: "Bruxelas", CH: "Berna", AT: "Viena", GR: "Atenas", SE: "Estocolmo", DK: "Copenhague", PL: "Varsóvia", RU: "Moscou", UA: "Kiev", CZ: "Praga", RO: "Bucareste", HR: "Zagreb", RS: "Belgrado", LU: "Luxemburgo", CY: "Nicósia", AD: "Andorra-a-Velha", MC: "Mônaco", EG: "Cairo", ET: "Adis Abeba", DZ: "Argel", CI: "Yamoussoukro", MU: "Port Louis", CN: "Pequim", JP: "Tóquio", IN: "Nova Délhi", KR: "Seul", VN: "Hanói", ID: "Jacarta", SA: "Riade", IL: "Jerusalém", NP: "Catmandu", IR: "Teerã", IQ: "Bagdá", MN: "Ulan Bator", KH: "Pnom Pene", LB: "Beirute", SY: "Damasco", MV: "Malé", SG: "Singapura", IS: "Reiquiavique", BO: "Sucre", UY: "Montevidéu", PY: "Assunção", CR: "San José", PA: "Cidade do Panamá", GT: "Cidade da Guatemala" };
const CAP_ES = { US: "Washington", MX: "Ciudad de México", HT: "Puerto Príncipe", TT: "Puerto España", PT: "Lisboa", IT: "Roma", GB: "Londres", BE: "Bruselas", CH: "Berna", AT: "Viena", GR: "Atenas", SE: "Estocolmo", DK: "Copenhague", PL: "Varsovia", RU: "Moscú", UA: "Kiev", CZ: "Praga", RO: "Bucarest", RS: "Belgrado", LU: "Luxemburgo", CY: "Nicosia", AD: "Andorra la Vieja", MC: "Mónaco", EG: "El Cairo", ET: "Adís Abeba", DZ: "Argel", CN: "Pekín", JP: "Tokio", IN: "Nueva Delhi", KR: "Seúl", VN: "Hanói", ID: "Yakarta", SA: "Riad", IL: "Jerusalén", NP: "Katmandú", IR: "Teherán", IQ: "Bagdad", MN: "Ulán Bator", KH: "Nom Pen", LB: "Beirut", SY: "Damasco", SG: "Singapur", IS: "Reikiavik", PY: "Asunción", PA: "Ciudad de Panamá", GT: "Ciudad de Guatemala" };

const capNome = (code, lang) =>
  (lang === "pt" && CAP_PT[code]) || (lang === "es" && CAP_ES[code]) || CAPITAIS[code];

/* A ordem em que o mundo se abre. Cada região exige 10 fases da anterior. */
const CAP_REGIOES = [
  { id: "cap_br", icone: "🇧🇷", cor: "#00B894" },
  { id: "cap_sa", icone: "🌎", cor: "#00C2CB" },
  { id: "cap_na", icone: "🌎", cor: "#FF7043" },
  { id: "cap_eu", icone: "🌍", cor: "#4C6FFF" },
  { id: "cap_af", icone: "🌍", cor: "#F9A826" },
  { id: "cap_as", icone: "🌏", cor: "#E84393" },
  { id: "cap_oc", icone: "🌏", cor: "#6A5AE0" },
  { id: "cap_us", icone: "🇺🇸", cor: "#9B59B6" },
];

function paresCapitais(regiao, lang) {
  if (regiao === "cap_br") return BR_ESTADOS.map(([n, c]) => [n, c]);
  if (regiao === "cap_us") return US_ESTADOS.map(([n, c]) => [n, c]);
  const cont = regiao.slice(4);
  return Object.keys(DATA[cont]).map(code => [countryName(code, lang), capNome(code, lang)]);
}

function montarRodadaCapitais(stage, t, lang, cont) {
  const band = bandFor(cont, stage);
  const qCount = (band === "easy" || band === "medium") ? 5 : 10;
  const pares = paresCapitais(cont, lang).filter(([n, c]) => n && c);
  // As fases fáceis usam os primeiros da lista; as difíceis, o conjunto todo
  const fatia = band === "easy" ? Math.ceil(pares.length * 0.5)
    : band === "medium" ? Math.ceil(pares.length * 0.75) : pares.length;
  const pool = shuffle(pares).slice(0, Math.max(qCount + 3, fatia));
  const escolhidos = shuffle(pool).slice(0, qCount);
  const qs = escolhidos.map(([lugar, capital]) => {
    const distr = shuffle(pares.filter(([, c]) => c !== capital)).slice(0, 3);
    return {
      kind: "texto", prompt: lugar, ask: t.whichCapital,
      answer: capital, options: shuffle([capital, ...distr.map(d => d[1])]),
    };
  });
  return { cont, diff: band, stage, qs, time: tempoDe(cont, stage), t0: Date.now(),
    i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, flash: 0, islandRight: 0, subRight: 0 };
}

/* Jogos de perguntas que não ficam no mapa-múndi */
const alvoDe = cont => (cont || "").startsWith("idiomas_") ? cont.slice(8) : null;
const quizDe = cont => QUIZZES[cont] || (alvoDe(cont) ? QUIZZES.idiomas : (cont || "").startsWith("cap_") ? QUIZZES.capitais : null);

const QUIZZES = {
  math:    { icone: "🔢", cor: "#F9A826", nome: t => t.games.count,      montar: (st, t, lang) => montarRodadaMath(st) },
  bichos:  { icone: "🦉", cor: "#00B894", nome: t => t.games.animalQuiz, montar: (st, t) => montarRodadaBichos(st, t) },
  idiomas: { icone: "🔤", cor: "#4C6FFF", nome: t => t.games.words,      montar: (st, t, lang, cont) => montarRodadaIdioma(st, t, alvoDe(cont)) },
  arts:    { icone: "🌈", cor: "#E84393", nome: t => t.games.colors,     montar: (st, t) => montarRodadaArte(st, t) },
  bible:   { icone: "✝️", cor: "#8D6E3A", nome: t => t.games.bible,      montar: (st, t, lang) => montarRodadaBiblia(st, lang) },
  capitais:{ icone: "🏛️", cor: "#6A5AE0", nome: t => t.games.capitals,   montar: (st, t, lang, cont) => montarRodadaCapitais(st, t, lang, cont) },
  curiosidades: { icone: "🗺️", cor: "#00C2CB", nome: t => t.games.curiosidades, montar: (st, t, lang) => montarRodadaCuriosidades(st, t, lang) },
  ciencias:     { icone: "🔬", cor: "#6A5AE0", nome: t => t.games.sciAnimals,   montar: (st, t, lang) => montarRodadaCiencias(st, t, lang) },
};

/* ---------- Colorir ----------
   Desenhos só de contorno: toca numa cor, toca numa área, pinta.
   Nada de texto, nada de leitura — feito para quem ainda não lê. */
const PALETA = [
  "#E74C3C", "#FF7043", "#F9A826", "#FFE066", "#7BC950", "#00B894",
  "#00C2CB", "#4C6FFF", "#6A5AE0", "#9B59B6", "#E84393", "#FF8FA3",
  "#8D5524", "#C68642", "#2C3E50", "#95A5A6", "#FFFFFF", "#2b2b2b",
];

/* Cada área é uma peça pintável. t: c=círculo, e=elipse, r=retângulo, p=polígono, d=path */
const DESENHOS = [
  { id: "bd_tri_h", emoji: "🏳️", cat: "flag", vb: "0 0 200 134", areas: [
      { t: "r", x: 0, y: 0, w: 200, h: 45 },
      { t: "r", x: 0, y: 45, w: 200, h: 44 },
      { t: "r", x: 0, y: 89, w: 200, h: 45 },
    ] },
  { id: "bd_tri_v", emoji: "🏳️", cat: "flag", vb: "0 0 200 134", areas: [
      { t: "r", x: 0, y: 0, w: 67, h: 134 },
      { t: "r", x: 67, y: 0, w: 66, h: 134 },
      { t: "r", x: 133, y: 0, w: 67, h: 134 },
    ] },
  { id: "bd_circ", emoji: "🏳️", cat: "flag", vb: "0 0 200 134", areas: [
      { t: "r", x: 0, y: 0, w: 200, h: 134 },
      { t: "c", cx: 100, cy: 67, r: 38 },
    ] },
  { id: "bd_cruz", emoji: "🏳️", cat: "flag", vb: "0 0 200 134", areas: [
      { t: "r", x: 0, y: 0, w: 200, h: 134 },
      { t: "r", x: 58, y: 0, w: 30, h: 134 },
      { t: "r", x: 0, y: 52, w: 200, h: 30 },
    ] },
  { id: "bd_tringulo", emoji: "🏳️", cat: "flag", vb: "0 0 200 134", areas: [
      { t: "r", x: 0, y: 0, w: 200, h: 67 },
      { t: "r", x: 0, y: 67, w: 200, h: 67 },
      { t: "p", pts: "0,0 78,67 0,134" },
    ] },
  { id: "bd_5faixas", emoji: "🏳️", cat: "flag", vb: "0 0 200 134", areas: [
      { t: "r", x: 0, y: 0, w: 200, h: 27 },
      { t: "r", x: 0, y: 27, w: 200, h: 27 },
      { t: "r", x: 0, y: 54, w: 200, h: 26 },
      { t: "r", x: 0, y: 80, w: 200, h: 27 },
      { t: "r", x: 0, y: 107, w: 200, h: 27 },
    ] },
  { id: "bd_cantao", emoji: "🏳️", cat: "flag", vb: "0 0 200 134", areas: [
      { t: "r", x: 0, y: 0, w: 200, h: 134 },
      { t: "r", x: 0, y: 0, w: 86, h: 60 },
      { t: "p", pts: "43.0,10.0 47.9,23.2 62.0,23.8 51.0,32.6 54.8,46.2 43.0,38.4 31.2,46.2 35.0,32.6 24.0,23.8 38.1,23.2" },
    ] },
  { id: "bd_lua", emoji: "🏳️", cat: "flag", vb: "0 0 200 134", areas: [
      { t: "r", x: 0, y: 0, w: 200, h: 134 },
      { t: "c", cx: 92, cy: 67, r: 34 },
      { t: "c", cx: 106, cy: 60, r: 28 },
      { t: "p", pts: "140.0,38.0 143.5,47.2 153.3,47.7 145.6,53.8 148.2,63.3 140.0,57.9 131.8,63.3 134.4,53.8 126.7,47.7 136.5,47.2" },
    ] },
  { id: "bd_losango", emoji: "🏳️", cat: "flag", vb: "0 0 200 134", areas: [
      { t: "r", x: 0, y: 0, w: 200, h: 134 },
      { t: "p", pts: "100,14 186,67 100,120 14,67" },
      { t: "c", cx: 100, cy: 67, r: 26 },
    ] },
  { id: "bd_diagonal", emoji: "🏳️", cat: "flag", vb: "0 0 200 134", areas: [
      { t: "p", pts: "0,0 200,0 0,134" },
      { t: "p", pts: "200,0 200,134 0,134" },
      { t: "c", cx: 100, cy: 67, r: 22 },
    ] },
  { id: "bd_sol", emoji: "🏳️", cat: "flag", vb: "0 0 200 134", areas: [
      { t: "r", x: 0, y: 0, w: 200, h: 134 },
      { t: "c", cx: 100, cy: 67, r: 30 },
      { t: "p", pts: "134.0,67.0 151.4,58.9 151.4,75.1" },
      { t: "p", pts: "124.0,91.0 142.1,97.6 130.6,109.1" },
      { t: "p", pts: "100.0,101.0 108.1,118.4 91.9,118.4" },
      { t: "p", pts: "76.0,91.0 69.4,109.1 57.9,97.6" },
      { t: "p", pts: "66.0,67.0 48.6,75.1 48.6,58.9" },
      { t: "p", pts: "76.0,43.0 57.9,36.4 69.4,24.9" },
      { t: "p", pts: "100.0,33.0 91.9,15.6 108.1,15.6" },
      { t: "p", pts: "124.0,43.0 130.6,24.9 142.1,36.4" },
    ] },
  { id: "bd_quadro", emoji: "🏳️", cat: "flag", vb: "0 0 200 134", areas: [
      { t: "r", x: 0, y: 0, w: 66, h: 134 },
      { t: "r", x: 66, y: 0, w: 68, h: 134 },
      { t: "r", x: 134, y: 0, w: 66, h: 134 },
      { t: "r", x: 78, y: 45, w: 44, h: 44 },
    ] },
  { id: "gato", emoji: "🐱", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "p", pts: "58,58 66,20 92,44" },
      { t: "p", pts: "142,58 134,20 108,44" },
      { t: "e", cx: 100, cy: 78, rx: 46, ry: 40 },
      { t: "e", cx: 100, cy: 148, rx: 40, ry: 38 },
      { t: "d", d: "M138 160 q40 6 34 -34 q-2 -14 -14 -12 q-10 2 -6 14 q4 14 -14 20 z" },
      { t: "c", cx: 84, cy: 74, r: 8 },
      { t: "c", cx: 116, cy: 74, r: 8 },
      { t: "e", cx: 100, cy: 92, rx: 7, ry: 5 },
    ] },
  { id: "peixe", emoji: "🐟", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "e", cx: 96, cy: 100, rx: 58, ry: 40 },
      { t: "p", pts: "154,100 194,68 194,132" },
      { t: "p", pts: "88,62 116,40 120,66" },
      { t: "p", pts: "88,138 116,160 120,134" },
      { t: "c", cx: 62, cy: 88, r: 9 },
      { t: "c", cx: 30, cy: 50, r: 10 },
      { t: "c", cx: 48, cy: 28, r: 7 },
    ] },
  { id: "borboleta", emoji: "🦋", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "e", cx: 60, cy: 70, rx: 38, ry: 32 },
      { t: "e", cx: 140, cy: 70, rx: 38, ry: 32 },
      { t: "e", cx: 66, cy: 130, rx: 32, ry: 28 },
      { t: "e", cx: 134, cy: 130, rx: 32, ry: 28 },
      { t: "e", cx: 100, cy: 100, rx: 11, ry: 52 },
      { t: "c", cx: 100, cy: 44, r: 12 },
    ] },
  { id: "cachorro", emoji: "🐶", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "e", cx: 46, cy: 86, rx: 20, ry: 34 },
      { t: "e", cx: 154, cy: 86, rx: 20, ry: 34 },
      { t: "e", cx: 100, cy: 150, rx: 44, ry: 38 },
      { t: "c", cx: 100, cy: 80, r: 40 },
      { t: "e", cx: 100, cy: 104, rx: 24, ry: 18 },
      { t: "c", cx: 100, cy: 96, r: 8 },
      { t: "c", cx: 86, cy: 72, r: 7 },
      { t: "c", cx: 114, cy: 72, r: 7 },
    ] },
  { id: "coelho", emoji: "🐰", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "e", cx: 78, cy: 44, rx: 13, ry: 36 },
      { t: "e", cx: 122, cy: 44, rx: 13, ry: 36 },
      { t: "e", cx: 100, cy: 150, rx: 42, ry: 40 },
      { t: "c", cx: 100, cy: 98, r: 34 },
      { t: "c", cx: 88, cy: 92, r: 7 },
      { t: "c", cx: 112, cy: 92, r: 7 },
      { t: "e", cx: 100, cy: 110, rx: 8, ry: 6 },
      { t: "c", cx: 146, cy: 168, r: 14 },
    ] },
  { id: "tartaruga", emoji: "🐢", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "e", cx: 46, cy: 132, rx: 18, ry: 12 },
      { t: "e", cx: 154, cy: 132, rx: 18, ry: 12 },
      { t: "e", cx: 64, cy: 152, rx: 16, ry: 11 },
      { t: "e", cx: 136, cy: 152, rx: 16, ry: 11 },
      { t: "c", cx: 166, cy: 100, r: 18 },
      { t: "e", cx: 100, cy: 110, rx: 58, ry: 44 },
      { t: "c", cx: 100, cy: 100, r: 18 },
      { t: "c", cx: 72, cy: 116, r: 13 },
      { t: "c", cx: 128, cy: 116, r: 13 },
      { t: "c", cx: 100, cy: 138, r: 13 },
    ] },
  { id: "caracol", emoji: "🐌", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "d", d: "M18 160 q10 -22 40 -22 h70 q10 0 10 10 q0 12 -12 12 h-108 z" },
      { t: "c", cx: 120, cy: 110, r: 44 },
      { t: "c", cx: 120, cy: 110, r: 28 },
      { t: "c", cx: 120, cy: 110, r: 13 },
      { t: "e", cx: 30, cy: 132, rx: 12, ry: 9 },
      { t: "r", x: 24, y: 112, w: 5, h: 20 },
      { t: "r", x: 40, y: 112, w: 5, h: 20 },
      { t: "c", cx: 26, cy: 108, r: 6 },
      { t: "c", cx: 42, cy: 108, r: 6 },
    ] },
  { id: "coruja", emoji: "🦉", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "e", cx: 48, cy: 110, rx: 22, ry: 32 },
      { t: "e", cx: 152, cy: 110, rx: 22, ry: 32 },
      { t: "e", cx: 100, cy: 110, rx: 50, ry: 58 },
      { t: "c", cx: 78, cy: 92, r: 20 },
      { t: "c", cx: 122, cy: 92, r: 20 },
      { t: "c", cx: 78, cy: 92, r: 9 },
      { t: "c", cx: 122, cy: 92, r: 9 },
      { t: "p", pts: "100,104 90,120 110,120" },
      { t: "p", pts: "74,168 62,186 88,182" },
      { t: "p", pts: "126,168 138,186 112,182" },
    ] },
  { id: "elefante", emoji: "🐘", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "c", cx: 56, cy: 92, r: 30 },
      { t: "e", cx: 112, cy: 110, rx: 52, ry: 46 },
      { t: "d", d: "M62 118 q-10 40 8 56 q10 8 16 -4 q4 -10 -6 -14 q-8 -4 -4 -20 z" },
      { t: "r", x: 84, y: 148, w: 16, h: 34 },
      { t: "r", x: 124, y: 148, w: 16, h: 34 },
      { t: "c", cx: 64, cy: 84, r: 7 },
    ] },
  { id: "abelha", emoji: "🐝", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "e", cx: 70, cy: 58, rx: 26, ry: 18 },
      { t: "e", cx: 130, cy: 58, rx: 26, ry: 18 },
      { t: "e", cx: 100, cy: 110, rx: 40, ry: 48 },
      { t: "e", cx: 100, cy: 90, rx: 40, ry: 14 },
      { t: "e", cx: 100, cy: 120, rx: 38, ry: 14 },
      { t: "c", cx: 100, cy: 54, r: 20 },
      { t: "r", x: 94, y: 20, w: 4, h: 18 },
      { t: "r", x: 104, y: 20, w: 4, h: 18 },
      { t: "c", cx: 94, cy: 18, r: 6 },
      { t: "c", cx: 108, cy: 18, r: 6 },
    ] },
  { id: "joaninha", emoji: "🐞", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "c", cx: 100, cy: 62, r: 26 },
      { t: "e", cx: 100, cy: 116, rx: 46, ry: 42 },
      { t: "r", x: 97, y: 74, w: 6, h: 84 },
      { t: "c", cx: 80, cy: 104, r: 9 },
      { t: "c", cx: 122, cy: 104, r: 9 },
      { t: "c", cx: 88, cy: 132, r: 8 },
      { t: "c", cx: 116, cy: 132, r: 8 },
      { t: "c", cx: 90, cy: 84, r: 5 },
      { t: "c", cx: 88, cy: 54, r: 6 },
      { t: "c", cx: 112, cy: 54, r: 6 },
    ] },
  { id: "sapo", emoji: "🐸", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "c", cx: 70, cy: 66, r: 20 },
      { t: "c", cx: 130, cy: 66, r: 20 },
      { t: "c", cx: 70, cy: 66, r: 8 },
      { t: "c", cx: 130, cy: 66, r: 8 },
      { t: "e", cx: 100, cy: 120, rx: 50, ry: 42 },
      { t: "e", cx: 46, cy: 148, rx: 18, ry: 13 },
      { t: "e", cx: 154, cy: 148, rx: 18, ry: 13 },
      { t: "d", d: "M72 126 q28 22 56 0" },
    ] },
  { id: "pinguim", emoji: "🐧", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "e", cx: 52, cy: 116, rx: 16, ry: 28 },
      { t: "e", cx: 148, cy: 116, rx: 16, ry: 28 },
      { t: "e", cx: 100, cy: 116, rx: 44, ry: 52 },
      { t: "e", cx: 100, cy: 124, rx: 28, ry: 38 },
      { t: "c", cx: 100, cy: 62, r: 30 },
      { t: "p", pts: "100,66 122,76 100,86" },
      { t: "c", cx: 90, cy: 56, r: 6 },
      { t: "c", cx: 110, cy: 56, r: 6 },
      { t: "p", pts: "74,166 62,180 90,178" },
      { t: "p", pts: "126,166 138,180 110,178" },
    ] },
  { id: "caranguejo", emoji: "🦀", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "c", cx: 44, cy: 96, r: 20 },
      { t: "c", cx: 156, cy: 96, r: 20 },
      { t: "e", cx: 100, cy: 120, rx: 52, ry: 34 },
      { t: "c", cx: 78, cy: 106, r: 8 },
      { t: "c", cx: 122, cy: 106, r: 8 },
      { t: "r", x: 64, y: 140, w: 7, h: 26 },
      { t: "r", x: 90, y: 146, w: 7, h: 26 },
      { t: "r", x: 110, y: 146, w: 7, h: 26 },
      { t: "r", x: 136, y: 140, w: 7, h: 26 },
    ] },
  { id: "ovelha", emoji: "🐑", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "c", cx: 72, cy: 108, r: 26 },
      { t: "c", cx: 104, cy: 98, r: 28 },
      { t: "c", cx: 136, cy: 110, r: 26 },
      { t: "c", cx: 104, cy: 132, r: 26 },
      { t: "e", cx: 150, cy: 88, rx: 22, ry: 20 },
      { t: "e", cx: 128, cy: 80, rx: 12, ry: 9 },
      { t: "c", cx: 146, cy: 84, r: 6 },
      { t: "c", cx: 158, cy: 84, r: 6 },
      { t: "r", x: 80, y: 150, w: 10, h: 26 },
      { t: "r", x: 122, y: 150, w: 10, h: 26 },
    ] },
  { id: "pato", emoji: "🦆", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "e", cx: 96, cy: 126, rx: 48, ry: 34 },
      { t: "c", cx: 126, cy: 80, r: 26 },
      { t: "p", pts: "144,74 180,84 144,94" },
      { t: "e", cx: 88, cy: 124, rx: 26, ry: 18 },
      { t: "c", cx: 132, cy: 74, r: 6 },
    ] },
  { id: "cobra", emoji: "🐍", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "c", cx: 100, cy: 120, r: 52 },
      { t: "c", cx: 100, cy: 120, r: 32 },
      { t: "c", cx: 100, cy: 120, r: 14 },
      { t: "e", cx: 150, cy: 60, rx: 26, ry: 20 },
      { t: "c", cx: 142, cy: 54, r: 6 },
      { t: "c", cx: 158, cy: 54, r: 6 },
      { t: "p", pts: "164,66 186,72 164,78" },
    ] },
  { id: "leao", emoji: "🦁", cat: "animal", vb: "0 0 200 200", areas: [
      { t: "c", cx: 100, cy: 100, r: 54 },
      { t: "c", cx: 100, cy: 100, r: 36 },
      { t: "c", cx: 66, cy: 60, r: 15 },
      { t: "c", cx: 134, cy: 60, r: 15 },
      { t: "c", cx: 86, cy: 94, r: 7 },
      { t: "c", cx: 114, cy: 94, r: 7 },
      { t: "p", pts: "100,106 90,118 110,118" },
      { t: "e", cx: 86, cy: 124, rx: 14, ry: 10 },
      { t: "e", cx: 114, cy: 124, rx: 14, ry: 10 },
    ] },
  { id: "casa", emoji: "🏠", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "r", x: 0, y: 150, w: 200, h: 50 },
      { t: "p", pts: "100,30 180,90 20,90" },
      { t: "r", x: 40, y: 90, w: 120, h: 60 },
      { t: "r", x: 88, y: 110, w: 26, h: 40 },
      { t: "r", x: 52, y: 102, w: 26, h: 24 },
      { t: "r", x: 124, y: 102, w: 26, h: 24 },
      { t: "c", cx: 168, cy: 32, r: 18 },
    ] },
  { id: "carro", emoji: "🚗", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "r", x: 0, y: 154, w: 200, h: 46 },
      { t: "d", d: "M20 130 q0 -30 26 -30 l10 -26 q4 -10 16 -10 h58 q12 0 16 10 l10 26 q26 0 26 30 v14 h-162 z" },
      { t: "p", pts: "70,100 130,100 122,74 78,74" },
      { t: "c", cx: 58, cy: 148, r: 20 },
      { t: "c", cx: 142, cy: 148, r: 20 },
    ] },
  { id: "foguete", emoji: "🚀", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "d", d: "M100 16 q34 34 34 88 v34 h-68 v-34 q0 -54 34 -88 z" },
      { t: "p", pts: "66,110 34,150 66,142" },
      { t: "p", pts: "134,110 166,150 134,142" },
      { t: "c", cx: 100, cy: 76, r: 18 },
      { t: "d", d: "M80 138 h40 q-6 40 -20 52 q-14 -12 -20 -52 z" },
    ] },
  { id: "balao", emoji: "🎈", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "e", cx: 100, cy: 80, rx: 52, ry: 60 },
      { t: "r", x: 78, y: 146, w: 44, h: 30 },
      { t: "r", x: 80, y: 140, w: 6, h: 10 },
      { t: "r", x: 114, y: 140, w: 6, h: 10 },
      { t: "e", cx: 100, cy: 140, rx: 26, ry: 8 },
    ] },
  { id: "bola", emoji: "⚽", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "c", cx: 100, cy: 100, r: 56 },
      { t: "p", pts: "100.0,78.0 106.5,91.1 120.9,93.2 110.5,103.4 112.9,117.8 100.0,111.0 87.1,117.8 89.5,103.4 79.1,93.2 93.5,91.1" },
      { t: "c", cx: 64, cy: 72, r: 12 },
      { t: "c", cx: 136, cy: 72, r: 12 },
      { t: "c", cx: 64, cy: 132, r: 12 },
      { t: "c", cx: 136, cy: 132, r: 12 },
    ] },
  { id: "sorvete", emoji: "🍦", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "p", pts: "100,190 68,110 132,110" },
      { t: "c", cx: 78, cy: 96, r: 24 },
      { t: "c", cx: 122, cy: 96, r: 24 },
      { t: "c", cx: 100, cy: 72, r: 26 },
      { t: "c", cx: 100, cy: 44, r: 10 },
    ] },
  { id: "bolo", emoji: "🎂", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "r", x: 40, y: 140, w: 120, h: 44 },
      { t: "r", x: 52, y: 110, w: 96, h: 30 },
      { t: "r", x: 66, y: 84, w: 68, h: 26 },
      { t: "r", x: 96, y: 52, w: 8, h: 32 },
      { t: "e", cx: 100, cy: 46, rx: 8, ry: 11 },
    ] },
  { id: "presente", emoji: "🎁", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "r", x: 38, y: 86, w: 124, h: 96 },
      { t: "r", x: 30, y: 60, w: 140, h: 30 },
      { t: "r", x: 90, y: 60, w: 20, h: 122 },
      { t: "c", cx: 84, cy: 48, r: 16 },
      { t: "c", cx: 116, cy: 48, r: 16 },
    ] },
  { id: "xicara", emoji: "☕", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "d", d: "M52 78 h96 l-12 76 q-2 14 -16 14 h-40 q-14 0 -16 -14 z" },
      { t: "c", cx: 158, cy: 104, r: 20 },
      { t: "e", cx: 100, cy: 178, rx: 58, ry: 12 },
      { t: "d", d: "M84 34 q10 12 0 24" },
      { t: "d", d: "M116 34 q10 12 0 24" },
    ] },
  { id: "guardachuva", emoji: "☂️", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "d", d: "M22 106 q0 -74 78 -74 q78 0 78 74 z" },
      { t: "d", d: "M22 106 q16 -16 30 0 q14 -16 26 0 q12 -16 26 0 q14 -16 26 0 q14 -16 28 0 z" },
      { t: "r", x: 96, y: 106, w: 8, h: 58 },
      { t: "d", d: "M104 164 q0 22 -20 22 q-14 0 -14 -12" },
    ] },
  { id: "barco", emoji: "⛵", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "r", x: 0, y: 158, w: 200, h: 42 },
      { t: "d", d: "M28 130 h144 l-22 30 h-100 z" },
      { t: "r", x: 96, y: 40, w: 8, h: 90 },
      { t: "p", pts: "92,50 92,124 30,124" },
      { t: "p", pts: "112,56 112,124 168,124" },
    ] },
  { id: "trem", emoji: "🚂", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "r", x: 0, y: 160, w: 200, h: 40 },
      { t: "r", x: 26, y: 96, w: 110, h: 64 },
      { t: "r", x: 136, y: 60, w: 46, h: 100 },
      { t: "r", x: 146, y: 26, w: 26, h: 34 },
      { t: "c", cx: 56, cy: 166, r: 18 },
      { t: "c", cx: 110, cy: 166, r: 18 },
      { t: "c", cx: 158, cy: 166, r: 18 },
      { t: "c", cx: 150, cy: 14, r: 14 },
      { t: "c", cx: 176, cy: 10, r: 10 },
    ] },
  { id: "aviao", emoji: "✈️", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "e", cx: 100, cy: 100, rx: 26, ry: 74 },
      { t: "p", pts: "100,90 190,124 100,124" },
      { t: "p", pts: "100,90 10,124 100,124" },
      { t: "p", pts: "100,160 140,182 100,182" },
      { t: "p", pts: "100,160 60,182 100,182" },
      { t: "c", cx: 100, cy: 50, r: 10 },
    ] },
  { id: "relogio", emoji: "⏰", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "c", cx: 100, cy: 106, r: 62 },
      { t: "c", cx: 100, cy: 106, r: 50 },
      { t: "r", x: 96, y: 66, w: 8, h: 44 },
      { t: "r", x: 100, y: 102, w: 44, h: 8 },
      { t: "c", cx: 100, cy: 106, r: 8 },
      { t: "p", pts: "48,44 32,20 56,26" },
      { t: "p", pts: "152,44 168,20 144,26" },
    ] },
  { id: "lapis", emoji: "✏️", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "r", x: 76, y: 52, w: 48, h: 110 },
      { t: "p", pts: "100,190 76,162 124,162" },
      { t: "r", x: 76, y: 34, w: 48, h: 18 },
      { t: "r", x: 76, y: 20, w: 48, h: 14 },
      { t: "r", x: 76, y: 150, w: 48, h: 12 },
    ] },
  { id: "robo", emoji: "🤖", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "r", x: 56, y: 56, w: 88, h: 66 },
      { t: "c", cx: 84, cy: 84, r: 12 },
      { t: "c", cx: 116, cy: 84, r: 12 },
      { t: "r", x: 80, y: 104, w: 40, h: 8 },
      { t: "r", x: 46, y: 130, w: 108, h: 52 },
      { t: "r", x: 16, y: 138, w: 30, h: 14 },
      { t: "r", x: 154, y: 138, w: 30, h: 14 },
      { t: "r", x: 64, y: 182, w: 24, h: 18 },
      { t: "r", x: 112, y: 182, w: 24, h: 18 },
      { t: "r", x: 96, y: 26, w: 8, h: 30 },
      { t: "c", cx: 100, cy: 20, r: 10 },
    ] },
  { id: "pipa", emoji: "🪁", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "p", pts: "100,14 158,84 100,84" },
      { t: "p", pts: "100,14 42,84 100,84" },
      { t: "p", pts: "42,84 100,84 100,154" },
      { t: "p", pts: "158,84 100,84 100,154" },
      { t: "c", cx: 100, cy: 170, r: 9 },
      { t: "c", cx: 112, cy: 186, r: 8 },
    ] },
  { id: "arvore", emoji: "🌳", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "r", x: 88, y: 132, w: 24, h: 60 },
      { t: "c", cx: 100, cy: 80, r: 44 },
      { t: "c", cx: 62, cy: 104, r: 30 },
      { t: "c", cx: 138, cy: 104, r: 30 },
      { t: "r", x: 0, y: 186, w: 200, h: 14 },
    ] },
  { id: "castelo", emoji: "🏰", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "r", x: 30, y: 96, w: 140, h: 90 },
      { t: "r", x: 14, y: 64, w: 40, h: 122 },
      { t: "r", x: 146, y: 64, w: 40, h: 122 },
      { t: "p", pts: "34,64 14,26 54,26" },
      { t: "p", pts: "166,64 146,26 186,26" },
      { t: "p", pts: "100,96 70,54 130,54" },
      { t: "r", x: 84, y: 136, w: 32, h: 50 },
      { t: "c", cx: 100, cy: 84, r: 10 },
    ] },
  { id: "flor", emoji: "🌸", cat: "obj", vb: "0 0 200 200", areas: [
      { t: "r", x: 94, y: 100, w: 12, h: 84 },
      { t: "c", cx: 100, cy: 44, r: 26 },
      { t: "c", cx: 56, cy: 76, r: 26 },
      { t: "c", cx: 144, cy: 76, r: 26 },
      { t: "c", cx: 73, cy: 126, r: 26 },
      { t: "c", cx: 127, cy: 126, r: 26 },
      { t: "c", cx: 100, cy: 88, r: 24 },
      { t: "e", cx: 72, cy: 146, rx: 24, ry: 12 },
      { t: "e", cx: 128, cy: 162, rx: 24, ry: 12 },
    ] },
  { id: "solnuvem", emoji: "⛅", cat: "space", vb: "0 0 200 200", areas: [
      { t: "c", cx: 74, cy: 62, r: 34 },
      { t: "c", cx: 96, cy: 130, r: 30 },
      { t: "c", cx: 134, cy: 128, r: 24 },
      { t: "c", cx: 62, cy: 138, r: 22 },
      { t: "r", x: 56, y: 138, w: 96, h: 26 },
    ] },
  { id: "saturno", emoji: "🪐", cat: "space", vb: "0 0 200 200", areas: [
      { t: "e", cx: 100, cy: 104, rx: 74, ry: 20 },
      { t: "c", cx: 100, cy: 100, r: 44 },
      { t: "c", cx: 100, cy: 100, r: 26 },
      { t: "p", pts: "30.0,24.0 33.0,31.9 41.4,32.3 34.8,37.6 37.1,45.7 30.0,41.0 22.9,45.7 25.2,37.6 18.6,32.3 27.0,31.9" },
      { t: "p", pts: "172.0,34.0 174.5,40.6 181.5,40.9 176.0,45.3 177.9,52.1 172.0,48.2 166.1,52.1 168.0,45.3 162.5,40.9 169.5,40.6" },
      { t: "p", pts: "160.0,159.0 162.2,164.9 168.6,165.2 163.6,169.2 165.3,175.3 160.0,171.8 154.7,175.3 156.4,169.2 151.4,165.2 157.8,164.9" },
    ] },
  { id: "lua", emoji: "🌙", cat: "space", vb: "0 0 200 200", areas: [
      { t: "c", cx: 88, cy: 96, r: 52 },
      { t: "c", cx: 114, cy: 84, r: 44 },
      { t: "p", pts: "160.0,134.0 163.5,143.2 173.3,143.7 165.6,149.8 168.2,159.3 160.0,153.9 151.8,159.3 154.4,149.8 146.7,143.7 156.5,143.2" },
      { t: "p", pts: "40.0,153.0 42.7,160.3 50.5,160.6 44.4,165.4 46.5,172.9 40.0,168.6 33.5,172.9 35.6,165.4 29.5,160.6 37.3,160.3" },
      { t: "p", pts: "170.0,34.0 172.5,40.6 179.5,40.9 174.0,45.3 175.9,52.1 170.0,48.2 164.1,52.1 166.0,45.3 160.5,40.9 167.5,40.6" },
      { t: "p", pts: "36.0,33.0 38.2,38.9 44.6,39.2 39.6,43.2 41.3,49.3 36.0,45.8 30.7,49.3 32.4,43.2 27.4,39.2 33.8,38.9" },
    ] },
  { id: "terra", emoji: "🌍", cat: "space", vb: "0 0 200 200", areas: [
      { t: "c", cx: 100, cy: 100, r: 60 },
      { t: "d", d: "M48 78 q28 -14 46 4 q14 16 -2 30 q-24 10 -40 -6 z" },
      { t: "d", d: "M118 64 q30 6 34 30 q-14 16 -32 8 q-12 -18 -2 -38 z" },
      { t: "d", d: "M112 126 q34 -6 44 10 q-16 22 -38 16 q-14 -12 -6 -26 z" },
    ] },
  { id: "astronauta", emoji: "👨‍🚀", cat: "space", vb: "0 0 200 200", areas: [
      { t: "c", cx: 100, cy: 68, r: 42 },
      { t: "e", cx: 100, cy: 70, rx: 30, ry: 24 },
      { t: "r", x: 64, y: 110, w: 72, h: 56 },
      { t: "e", cx: 38, cy: 124, rx: 16, ry: 26 },
      { t: "e", cx: 162, cy: 124, rx: 16, ry: 26 },
      { t: "r", x: 72, y: 166, w: 24, h: 30 },
      { t: "r", x: 104, y: 166, w: 24, h: 30 },
      { t: "c", cx: 100, cy: 132, r: 10 },
    ] },
  { id: "estrela", emoji: "⭐", cat: "space", vb: "0 0 200 200", areas: [
      { t: "p", pts: "100.0,32.0 115.8,74.3 160.9,76.2 125.6,104.3 137.6,147.8 100.0,122.9 62.4,147.8 74.4,104.3 39.1,76.2 84.2,74.3" },
      { t: "p", pts: "100.0,66.0 107.4,85.8 128.5,86.7 112.0,99.9 117.6,120.3 100.0,108.6 82.4,120.3 88.0,99.9 71.5,86.7 92.6,85.8" },
      { t: "p", pts: "34.0,152.0 37.9,162.6 49.2,163.1 40.4,170.1 43.4,180.9 34.0,174.7 24.6,180.9 27.6,170.1 18.8,163.1 30.1,162.6" },
      { t: "p", pts: "168.0,152.0 171.5,161.2 181.3,161.7 173.6,167.8 176.2,177.3 168.0,171.9 159.8,177.3 162.4,167.8 154.7,161.7 164.5,161.2" },
    ] },
  { id: "sistema", emoji: "🌌", cat: "space", vb: "0 0 200 200", areas: [
      { t: "c", cx: 20, cy: 100, r: 40 },
      { t: "c", cx: 80, cy: 100, r: 14 },
      { t: "c", cx: 116, cy: 100, r: 20 },
      { t: "c", cx: 160, cy: 100, r: 16 },
      { t: "c", cx: 186, cy: 64, r: 9 },
      { t: "p", pts: "150.0,18.0 153.0,25.9 161.4,26.3 154.8,31.6 157.1,39.7 150.0,35.0 142.9,39.7 145.2,31.6 138.6,26.3 147.0,25.9" },
      { t: "p", pts: "40.0,22.0 42.5,28.6 49.5,28.9 44.0,33.3 45.9,40.1 40.0,36.2 34.1,40.1 36.0,33.3 30.5,28.9 37.5,28.6" },
    ] },
  { id: "cometa", emoji: "☄️", cat: "space", vb: "0 0 200 200", areas: [
      { t: "c", cx: 148, cy: 64, r: 28 },
      { t: "p", pts: "120,64 30,146 40,90" },
      { t: "p", pts: "128,84 46,166 96,150" },
      { t: "p", pts: "46.0,21.0 49.2,29.6 58.4,30.0 51.2,35.7 53.6,44.5 46.0,39.5 38.4,44.5 40.8,35.7 33.6,30.0 42.8,29.6" },
      { t: "p", pts: "176.0,139.0 178.7,146.3 186.5,146.6 180.4,151.4 182.5,158.9 176.0,154.6 169.5,158.9 171.6,151.4 165.5,146.6 173.3,146.3" },
    ] },
];



/* ---------- Desenhos gerados ----------
   Cada semente produz sempre o mesmo desenho, então basta guardar o número
   para o desenho existir de novo — nenhuma imagem ocupa espaço. */
function semente(n) {
  let a = n >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function desenhoGerado(seed) {
  const r = semente(seed);
  const ent = (a, b) => a + Math.floor(r() * (b - a + 1));
  const um = arr => arr[Math.floor(r() * arr.length)];
  const areas = [];
  const estrelaPts = (cx, cy, R1, R2, n, rot) => {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const rr = i % 2 === 0 ? R1 : R2;
      const ang = ((rot + i * 180 / n) * Math.PI) / 180;
      pts.push(`${(cx + Math.cos(ang) * rr).toFixed(1)},${(cy + Math.sin(ang) * rr).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  const tipo = um(["mandala", "bandeira", "robo", "flor", "bicho", "vitral"]);
  let vb = "0 0 200 200", emoji = "✨";

  if (tipo === "mandala") {
    emoji = "🌀";
    const camadas = ent(3, 4);
    for (let k = camadas; k >= 1; k--) {
      const raio = 26 + k * ent(16, 22);
      const n = ent(6, 10);
      const petala = um(["c", "e", "p"]);
      for (let i = 0; i < n; i++) {
        const ang = (i * 360 / n) * Math.PI / 180;
        const cx = 100 + Math.cos(ang) * raio, cy = 100 + Math.sin(ang) * raio;
        const t = 12 + k * 3;
        if (petala === "c") areas.push({ t: "c", cx: +cx.toFixed(1), cy: +cy.toFixed(1), r: t });
        else if (petala === "e") areas.push({ t: "e", cx: +cx.toFixed(1), cy: +cy.toFixed(1), rx: t + 5, ry: t - 4 });
        else areas.push({ t: "p", pts: estrelaPts(cx, cy, t + 4, (t + 4) * 0.45, 5, -90) });
      }
    }
    areas.push({ t: "c", cx: 100, cy: 100, r: ent(18, 26) });
    areas.push({ t: "c", cx: 100, cy: 100, r: ent(8, 14) });

  } else if (tipo === "bandeira") {
    emoji = "🏳️"; vb = "0 0 200 134";
    const layout = um(["h3", "v3", "h5", "cruz", "tri", "cantao"]);
    if (layout === "h3") [0, 45, 89].forEach((y, i) => areas.push({ t: "r", x: 0, y, w: 200, h: i === 1 ? 44 : 45 }));
    else if (layout === "v3") [0, 67, 133].forEach((x, i) => areas.push({ t: "r", x, y: 0, w: i === 1 ? 66 : 67, h: 134 }));
    else if (layout === "h5") for (let i = 0; i < 5; i++) areas.push({ t: "r", x: 0, y: i * 27, w: 200, h: 27 });
    else if (layout === "cruz") {
      areas.push({ t: "r", x: 0, y: 0, w: 200, h: 134 });
      areas.push({ t: "r", x: ent(46, 72), y: 0, w: 30, h: 134 });
      areas.push({ t: "r", x: 0, y: 52, w: 200, h: 30 });
    } else if (layout === "tri") {
      areas.push({ t: "r", x: 0, y: 0, w: 200, h: 67 });
      areas.push({ t: "r", x: 0, y: 67, w: 200, h: 67 });
      areas.push({ t: "p", pts: `0,0 ${ent(60, 96)},67 0,134` });
    } else {
      areas.push({ t: "r", x: 0, y: 0, w: 200, h: 134 });
      areas.push({ t: "r", x: 0, y: 0, w: 86, h: 60 });
    }
    const enfeite = um(["circulo", "estrela", "nada", "estrela"]);
    if (enfeite === "circulo") areas.push({ t: "c", cx: 100, cy: 67, r: ent(24, 34) });
    if (enfeite === "estrela") areas.push({ t: "p", pts: estrelaPts(layout === "cantao" ? 43 : 100, layout === "cantao" ? 30 : 67, ent(18, 28), ent(8, 12), 5, -90) });

  } else if (tipo === "robo") {
    emoji = "🤖";
    const lc = ent(70, 100), ac = ent(50, 70);
    areas.push({ t: "r", x: 100 - lc / 2, y: 42, w: lc, h: ac });
    const olho = um(["c", "r"]);
    [-1, 1].forEach(sx => olho === "c"
      ? areas.push({ t: "c", cx: 100 + sx * ent(14, 20), cy: 42 + ac / 2, r: ent(8, 13) })
      : areas.push({ t: "r", x: 100 + sx * 18 - 10, y: 42 + ac / 2 - 8, w: 20, h: 16 }));
    areas.push({ t: "r", x: 82, y: 42 + ac - 16, w: 36, h: 8 });
    const lcorpo = ent(90, 120), acorpo = ent(46, 62);
    areas.push({ t: "r", x: 100 - lcorpo / 2, y: 42 + ac + 10, w: lcorpo, h: acorpo });
    areas.push({ t: "r", x: 100 - lcorpo / 2 - 30, y: 42 + ac + 22, w: 30, h: 14 });
    areas.push({ t: "r", x: 100 + lcorpo / 2, y: 42 + ac + 22, w: 30, h: 14 });
    areas.push({ t: "r", x: 76, y: 42 + ac + 10 + acorpo, w: 22, h: 20 });
    areas.push({ t: "r", x: 106, y: 42 + ac + 10 + acorpo, w: 22, h: 20 });
    areas.push({ t: "r", x: 96, y: 42 - 22, w: 8, h: 22 });
    areas.push({ t: "c", cx: 100, cy: 42 - 26, r: ent(7, 11) });

  } else if (tipo === "flor") {
    emoji = "🌼";
    const n = ent(5, 9), raio = ent(38, 50), tam = ent(20, 28);
    areas.push({ t: "r", x: 94, y: 100, w: 12, h: 88 });
    areas.push({ t: "e", cx: 66, cy: ent(140, 156), rx: 24, ry: 12 });
    areas.push({ t: "e", cx: 134, cy: ent(150, 168), rx: 24, ry: 12 });
    for (let i = 0; i < n; i++) {
      const ang = (i * 360 / n - 90) * Math.PI / 180;
      areas.push({ t: "c", cx: +(100 + Math.cos(ang) * raio).toFixed(1), cy: +(88 + Math.sin(ang) * raio).toFixed(1), r: tam });
    }
    areas.push({ t: "c", cx: 100, cy: 88, r: ent(20, 26) });

  } else if (tipo === "bicho") {
    emoji = "🐾";
    const rb = ent(38, 50);
    areas.push({ t: "e", cx: 100, cy: 128, rx: rb, ry: rb - 6 });
    areas.push({ t: "c", cx: 100, cy: 70, r: ent(28, 38) });
    const orelha = um(["c", "p"]);
    [-1, 1].forEach(sx => orelha === "c"
      ? areas.push({ t: "c", cx: 100 + sx * 26, cy: 46, r: 13 })
      : areas.push({ t: "p", pts: `${100 + sx * 12},52 ${100 + sx * 34},${ent(14, 26)} ${100 + sx * 36},56` }));
    const no = ent(2, 3);
    for (let i = 0; i < no; i++) areas.push({ t: "c", cx: 100 + (i - (no - 1) / 2) * 22, cy: 66, r: ent(7, 10) });
    areas.push({ t: "e", cx: 100, cy: 84, rx: 8, ry: 6 });
    [-1, 1].forEach(sx => areas.push({ t: "e", cx: 100 + sx * 24, cy: 170, rx: 15, ry: 11 }));

  } else {
    emoji = "🪟";
    const cols = ent(3, 4), rows = ent(3, 4);
    const w = 200 / cols, h = 200 / rows;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const forma = um(["r", "c", "p", "p"]);
      if (forma === "r") areas.push({ t: "r", x: +(i * w).toFixed(1), y: +(j * h).toFixed(1), w: +w.toFixed(1), h: +h.toFixed(1) });
      else if (forma === "c") areas.push({ t: "c", cx: +(i * w + w / 2).toFixed(1), cy: +(j * h + h / 2).toFixed(1), r: +(Math.min(w, h) / 2).toFixed(1) });
      else areas.push({ t: "p", pts: `${(i * w).toFixed(1)},${(j * h + h).toFixed(1)} ${(i * w + w / 2).toFixed(1)},${(j * h).toFixed(1)} ${(i * w + w).toFixed(1)},${(j * h + h).toFixed(1)}` });
    }
  }
  return { id: `g${seed}`, emoji, cat: "gen", vb, areas };
}

/* Acha o desenho pelo id, seja da lista fixa ou gerado */
const acharArte = id => id.startsWith("g")
  ? desenhoGerado(Number(id.slice(1)))
  : DESENHOS.find(d => d.id === id);

function Peca({ a, fill, onClick }) {
  const p = { fill: fill || "#fff", stroke: "#2b2b2b", strokeWidth: 3, strokeLinejoin: "round", onClick, style: { cursor: "pointer" } };
  if (a.t === "c") return <circle cx={a.cx} cy={a.cy} r={a.r} {...p} />;
  if (a.t === "e") return <ellipse cx={a.cx} cy={a.cy} rx={a.rx} ry={a.ry} {...p} />;
  if (a.t === "r") return <rect x={a.x} y={a.y} width={a.w} height={a.h} {...p} />;
  if (a.t === "p") return <polygon points={a.pts} {...p} />;
  return <path d={a.d} {...p} />;
}

/* Miniatura sem interação, para a galeria */
function Mini({ art, fills, size = 72 }) {
  return (
    <svg viewBox={art.vb} width={size} height={size}>
      {art.areas.map((a, i) => <Peca key={i} a={a} fill={fills?.[i]} />)}
    </svg>
  );
}

function Coloring({ t, art, fillsIniciais, onSalvar, onSair, ganhouHoje }) {
  const [cor, setCor] = useState(PALETA[0]);
  const [fills, setFills] = useState(fillsIniciais || {});
  const total = art.areas.length;
  const pintadas = Object.values(fills).filter(Boolean).length;
  const completo = pintadas >= total;

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={onSair}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 18, flex: 1 }}>{art.emoji} {pintadas}/{total}</div>
        <Btn small color="#8B93AD" onClick={() => setFills({})}>🧽</Btn>
      </div>

      <div className="card" style={{ padding: 10, marginBottom: 10 }}>
        <svg viewBox={art.vb} style={{ width: "100%", display: "block", touchAction: "manipulation" }}>
          {art.areas.map((a, i) => (
            <Peca key={i} a={a} fill={fills[i]} onClick={() => setFills(f => ({ ...f, [i]: cor }))} />
          ))}
        </svg>
      </div>

      <div className="card" style={{ padding: 10, marginBottom: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 6 }}>
          {PALETA.map(c => (
            <button key={c} onClick={() => setCor(c)} aria-label={c}
              style={{
                aspectRatio: "1", borderRadius: 12, background: c, cursor: "pointer",
                border: cor === c ? "4px solid #1B2A6B" : "2px solid #E4E8F5",
              }} />
          ))}
        </div>
      </div>

      <Btn full color={pintadas ? "#00B894" : "#8B93AD"} disabled={!pintadas}
        onClick={() => onSalvar(fills, completo)}>
        {completo ? `✅ ${t.finish}` : `💾 ${t.saveAnyway}`}
      </Btn>
      {ganhouHoje >= ECON.colorDailyCap && (
        <div style={{ textAlign: "center", color: "#C9D2FF", fontSize: 11, fontWeight: 800, marginTop: 10 }}>
          {t.dailyCap}
        </div>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}

/* ---------- Galeria em fichário ----------
   Páginas de 9, como um álbum de figurinhas. */
const CATS_DESENHO = ["flag", "animal", "obj", "space", "gen"];
const CAT_ICON = { flag: "🏳️", animal: "🐾", obj: "🧸", space: "🪐", gen: "✨" };
const POR_PAGINA = 9;

function Gallery({ t, gallery, setScreen, abrirDesenho, gerados, gerarMais, coins }) {
  const [aba, setAba] = useState("saved");
  const [pag, setPag] = useState(0);

  const salvos = gallery.slice().reverse();
  const lista = aba === "saved"
    ? salvos
    : aba === "gen"
      ? gerados.map(desenhoGerado)
      : DESENHOS.filter(d => d.cat === aba);
  const paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const p = Math.min(pag, paginas - 1);
  const fatia = lista.slice(p * POR_PAGINA, p * POR_PAGINA + POR_PAGINA);

  const trocarAba = a => { setAba(a); setPag(0); };

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>🎨 {t.games.color}</div>
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
        <button onClick={() => trocarAba("saved")} className="chunky"
          style={{ flex: 1.3, padding: "9px 2px", fontSize: 12, background: aba === "saved" ? "#E84393" : "rgba(255,255,255,.18)" }}>
          🖼️ {gallery.length}
        </button>
        {CATS_DESENHO.map(c => (
          <button key={c} onClick={() => trocarAba(c)} className="chunky"
            style={{ flex: 1, padding: "9px 2px", fontSize: 16, background: aba === c ? "#6A5AE0" : "rgba(255,255,255,.18)" }}>
            {CAT_ICON[c]}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 10, minHeight: 300 }}>
        {fatia.length === 0 ? (
          <div style={{ display: "grid", placeItems: "center", height: 280, color: "#8B93AD", fontWeight: 800, fontSize: 14, textAlign: "center", padding: 20 }}>
            {t.emptyGallery}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {fatia.map((item, k) => {
              const art = aba === "saved" ? acharArte(item.id) : item;
              if (!art) return null;
              const fills = aba === "saved" ? item.fills : null;
              return (
                <button key={k} onClick={() => abrirDesenho(art, fills)}
                  style={{
                    border: "3px solid #E4E8F5", borderRadius: 16, background: "#fff",
                    padding: 4, cursor: "pointer", aspectRatio: "1",
                    display: "grid", placeItems: "center", overflow: "hidden",
                  }}>
                  <Mini art={art} fills={fills} size={82} />
                </button>
              );
            })}
            {Array.from({ length: POR_PAGINA - fatia.length }).map((_, k) => (
              <div key={`v${k}`} style={{ border: "3px dashed #EEF1FF", borderRadius: 16, aspectRatio: "1" }} />
            ))}
          </div>
        )}
      </div>

      {aba === "gen" && (
        <Btn full color="#9B59B6" disabled={coins < PRECO_GERAR}
          onClick={() => { gerarMais(); setPag(Math.floor(gerados.length / POR_PAGINA)); }}>
          ✨ {t.generateMore} · 🪙{PRECO_GERAR}
        </Btn>
      )}

      {paginas > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 }}>
          <Btn small color={p === 0 ? "#8B93AD" : "#4C6FFF"} disabled={p === 0} onClick={() => setPag(p - 1)}>◀</Btn>
          <div style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: paginas }).map((_, k) => (
              <button key={k} onClick={() => setPag(k)} aria-label={`${k + 1}`}
                style={{
                  width: 11, height: 11, borderRadius: 6, border: "none", cursor: "pointer",
                  background: k === p ? "#F9A826" : "rgba(255,255,255,.35)",
                }} />
            ))}
          </div>
          <Btn small color={p >= paginas - 1 ? "#8B93AD" : "#4C6FFF"} disabled={p >= paginas - 1} onClick={() => setPag(p + 1)}>▶</Btn>
        </div>
      )}
      <div style={{ textAlign: "center", color: "#A7B3EA", fontSize: 11, fontWeight: 800, marginTop: 8 }}>
        {p + 1} / {paginas}
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

/* ---------- Quem vai jogar ---------- */
function Profiles({ t, profiles, openProfile, newProfile, deleteProfile, resetProfile, setScreen }) {
  const [editing, setEditing] = useState(false);
  const [ask, setAsk] = useState(null);
  const [zerar, setZerar] = useState(null);
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div className="display" style={{ color: "#fff", fontSize: 40, lineHeight: 1 }}>LUMUS</div>
        <div className="display" style={{ color: "#C9D2FF", fontSize: 18, marginTop: 6 }}>{t.players}</div>
      </div>

      <div className="grid2">
        {profiles.map(pr => (
          <div key={pr.id} style={{ position: "relative" }}>
            <button onClick={() => !editing && openProfile(pr)} className="card"
              style={{ border: "none", width: "100%", padding: 14, display: "grid", placeItems: "center", cursor: "pointer" }}>
              <Avatar a={pr.avatar} size={84} />
              <div className="display" style={{ color: "#1B2A6B", fontSize: 17, marginTop: 6 }}>{pr.name}</div>
            </button>
            {editing && (
              <>
                <button onClick={() => setAsk(pr)} className="chunky" aria-label={t.del}
                  style={{ position: "absolute", top: -6, right: -6, width: 34, height: 34, borderRadius: 17, background: "#E74C3C", fontSize: 15 }}>✕</button>
                <button onClick={() => setZerar(pr)} className="chunky" aria-label={t.reset}
                  style={{ position: "absolute", top: -6, left: -6, width: 34, height: 34, borderRadius: 17, background: "#F9A826", fontSize: 15 }}>↺</button>
              </>
            )}
          </div>
        ))}
        <button onClick={newProfile} className="card"
          style={{ border: "none", padding: 14, display: "grid", placeItems: "center", cursor: "pointer", background: "rgba(255,255,255,.9)" }}>
          <div style={{ width: 84, height: 84, borderRadius: 42, background: "#EEF1FF", display: "grid", placeItems: "center", fontSize: 40, color: "#4C6FFF" }}>+</div>
          <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginTop: 6 }}>{t.newPlayer}</div>
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <Btn full small color="rgba(255,255,255,.2)" onClick={() => setEditing(e => !e)}>{editing ? "✓" : "✏️"}</Btn>
        <Btn full small color="rgba(255,255,255,.2)" onClick={() => setScreen("lang")}>🌐 {t.language}</Btn>
      </div>

      <div style={{ textAlign: "center", marginTop: 22, color: "#8E9CE0", fontSize: 11, fontWeight: 700, lineHeight: 1.6 }}>
        {t.parentsInfo}<br />
        <span style={{ color: "#6E7FCC" }}>{MADE_BY}</span>
      </div>

      {zerar && (
        <Modal onClose={() => setZerar(null)}>
          <div style={{ textAlign: "center" }}>
            <Avatar a={zerar.avatar} size={70} />
            <div style={{ color: "#1B2A6B", fontWeight: 800, margin: "12px 0", fontSize: 15 }}>{t.resetAsk}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn full small color="#8B93AD" onClick={() => setZerar(null)}>{t.cancel}</Btn>
              <Btn full small color="#F9A826" onClick={() => { resetProfile(zerar.id); setZerar(null); }}>{t.reset}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {ask && (
        <Modal onClose={() => setAsk(null)}>
          <div style={{ textAlign: "center" }}>
            <Avatar a={ask.avatar} size={70} />
            <div style={{ color: "#1B2A6B", fontWeight: 800, margin: "12px 0", fontSize: 15 }}>{t.deleteAsk}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn full small color="#8B93AD" onClick={() => setAsk(null)}>{t.cancel}</Btn>
              <Btn full small color="#E74C3C" onClick={() => { deleteProfile(ask.id); setAsk(null); }}>{t.del}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- Idiomas ---------- */
function LangScreen({ t, lang, pickLang, setScreen, back }) {
  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(back)}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 24 }}>🌐 {t.language}</div>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {Object.entries(LANG_CATALOG).map(([code, label]) => {
          const on = lang === code;
          return (
            <div key={code} className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <div className="display" style={{ flex: 1, color: "#1B2A6B", fontSize: 17 }}>{label}</div>
              <Btn small color={on ? "#00B894" : "#4C6FFF"} onClick={() => pickLang(code)}>
                {on ? "✓" : t.use}
              </Btn>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Perfil do jogador ---------- */
function PlayerCard({ t, lang, player, coins, stats, progress, unlocked, seenAch, setScreen, abrir, podeResgatar, resgatar }) {
  const Num = ({ icon, n, label }) => (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div className="display" style={{ fontSize: 20, color: "#1B2A6B", lineHeight: 1.2 }}>{n}</div>
      <div style={{ fontSize: 10, fontWeight: 800, color: "#8B93AD" }}>{label}</div>
    </div>
  );
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 22, flex: 1 }}>{t.profileTitle}</div>
      </div>

      <div className="card" style={{ padding: 18, textAlign: "center", marginBottom: 12 }}>
        <Avatar a={player.avatar} size={120} />
        <div className="display" style={{ color: "#1B2A6B", fontSize: 24, marginTop: 6 }}>{player.name}</div>
        <div style={{ display: "inline-block", background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 16px", fontWeight: 900, marginTop: 8 }}>
          <Coin n={coins} />
        </div>
        {podeResgatar && (
          <div style={{ marginTop: 10 }}>
            <Btn small color="#00B894" onClick={resgatar}>🎁 {t.claim} +{ECON.refillAmount}</Btn>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12, display: "flex" }}>
        <Num icon="🎮" n={stats.rounds} label={t.statRounds} />
        <Num icon="💯" n={stats.perfect} label={t.statPerfect} />
        <Num icon="🎯" n={stats.correct} label={t.statFlags} />
        <Num icon="🔥" n={stats.bestStreak} label={t.streak} />
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12, display: "flex" }}>
        <Num icon="🪙" n={stats.earned} label={t.coins} />
        <Num icon="📅" n={stats.dayStreak} label={t.statDays} />
        <Num icon="⭐" n={stats.stars || 0} label={t.awards} />
        <Num icon="🏅" n={`${seenAch.length}/${ACHIEVEMENTS.length}`} label={t.achievementsGot} />
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div className="display" style={{ color: "#1B2A6B", fontSize: 16, marginBottom: 10 }}>🎖️ {t.badges}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {BADGES.map(b => {
            const tem = b.test(stats);
            return (
              <div key={b.id} title={b.dPt} style={{ textAlign: "center", opacity: tem ? 1 : .35 }}>
                <div style={{
                  width: 46, height: 46, margin: "0 auto", borderRadius: 23,
                  background: tem ? b.cor : "#E4E8F5", display: "grid", placeItems: "center", fontSize: 22,
                  filter: tem ? "none" : "grayscale(1)",
                  boxShadow: tem ? `0 3px 0 rgba(0,0,0,.18)` : "none",
                }}>{tem ? b.icon : "🔒"}</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#6C7695", marginTop: 3, lineHeight: 1.2 }}>{b[lang] || b.en}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div className="display" style={{ color: "#1B2A6B", fontSize: 16, marginBottom: 10 }}>🌍 {t.worldProgress}</div>
        {ROUTE.map(r => {
          const aberto = unlocked.includes(r.id);
          const feitas = progress[r.id] || 0;
          return (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, opacity: aberto ? 1 : .4 }}>
              <div style={{ width: 96, fontSize: 11, fontWeight: 800, color: "#3B4468" }}>{t.continents[r.id]}</div>
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#E9ECF7", overflow: "hidden" }}>
                <div style={{ width: `${(feitas / totalDe(r.id)) * 100}%`, height: "100%", background: r.color, borderRadius: 6 }} />
              </div>
              <div style={{ width: 34, textAlign: "right", fontSize: 11, fontWeight: 800, color: "#6C7695" }}>
                {aberto ? `${feitas}/${totalDe(r.id)}` : "🔒"}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <Btn full color="#E84393" onClick={() => abrir("shop", "player")}>🛍️ {t.shop}</Btn>
        <Btn full color="#00C2CB" onClick={() => abrir("awards", "player")}>🏅 {t.awards}</Btn>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn full color="#4C6FFF" onClick={() => setScreen("profiles")}>👥 {t.switchPlayer}</Btn>
        <Btn full color="#6A5AE0" onClick={() => setScreen("lang")}>🌐 {t.language}</Btn>
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

/* ---------- Mapa das capitais ---------- */
function CapMap({ t, lang, progress, coins, setSel, setScreen, temSecao, comprarSecao }) {
  const nomeRegiao = r =>
    r.id === "cap_br" ? t.capBrasil
    : r.id === "cap_us" ? t.capEUA
    : t.continents[r.id.slice(4)];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>🏛️ {t.games.capitals}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>

      <div className="lista">
        {CAP_REGIOES.map((r, i) => {
          const feitas = progress[r.id] || 0;
          const preco = CAP_PRECO[r.id];
          const chave = `r:${r.id}`;
          const aberto = !preco || temSecao(chave);
          const anteriorOk = i === 0 || !CAP_PRECO[CAP_REGIOES[i - 1].id] || temSecao(`r:${CAP_REGIOES[i - 1].id}`);
          return (
            <div key={r.id} className="card" style={{ padding: 13, display: "flex", alignItems: "center", gap: 12, opacity: aberto || anteriorOk ? 1 : .45 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: aberto ? r.cor : "#B9C0CC", display: "grid", placeItems: "center", fontSize: 24 }}>
                {aberto ? r.icone : "🔒"}
              </div>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ color: "#1B2A6B", fontSize: 17 }}>{nomeRegiao(r)}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#6C7695" }}>
                  {aberto ? `⭐ ${feitas}/${totalDe(r.id)}` : anteriorOk ? `${t.unlockFor} 🪙${preco}` : t.needPrev}
                </div>
              </div>
              {aberto ? (
                <Btn small color={r.cor}
                  onClick={() => { setSel({ cont: r.id, stage: Math.min(totalDe(r.id), feitas + 1) }); setScreen("stages"); }}>
                  {t.play}
                </Btn>
              ) : anteriorOk ? (
                <Btn small color={coins >= preco ? "#E84393" : "#8B93AD"} disabled={coins < preco}
                  onClick={() => comprarSecao(chave, preco)}>🔓 🪙{preco}</Btn>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

/* ---------- Qual idioma aprender ---------- */
function LangGame({ t, lang, escolher, setScreen }) {
  const opcoes = Object.keys(LANG_CATALOG).filter(c => c !== lang && T[c]);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>🔤 {t.whichLang}</div>
      </div>
      <div className="lista">
        {opcoes.map(c => (
          <button key={c} onClick={() => escolher(c)} className="card"
            style={{ border: "none", padding: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: "#4C6FFF", display: "grid", placeItems: "center", color: "#fff", fontWeight: 900, fontSize: 14 }}>
              {c.toUpperCase()}
            </div>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 19 }}>{LANG_CATALOG[c]}</div>
          </button>
        ))}
      </div>
      <div style={{ color: "#A7B3EA", fontSize: 11, fontWeight: 700, marginTop: 14, textAlign: "center", lineHeight: 1.7 }}>
        {t.langHint}
      </div>
    </div>
  );
}

/* ---------- Home do hub ---------- */
function Home({ t, player, coins, nextRefill, setScreen, profiles, onPickGame, abrir, podeResgatar, resgatar, jogosAbertos, abrirJogo }) {
  return (
    <div>
      <TopBar t={t} player={player} coins={coins} nextRefill={nextRefill}
        onAvatar={() => setScreen("player")} onSwitch={() => setScreen("profiles")} quantos={profiles?.length || 1}
        podeResgatar={podeResgatar} resgatar={resgatar} />

      {podeResgatar && (
        <div className="card pop" style={{ padding: 14, marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 34 }}>🎁</div>
          <div style={{ flex: 1 }}>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 17 }}>{t.claimTitle}</div>
            <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 12 }}>+{ECON.refillAmount} 🪙</div>
          </div>
          <Btn small color="#00B894" onClick={resgatar}>{t.claim}</Btn>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16 }}>
        <Mundi size={64} />
        <div className="card" style={{ padding: "12px 14px", flex: 1, borderBottomLeftRadius: 6 }}>
          <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 14 }}>{t.mascotHome}</div>
        </div>
      </div>

      <div className="display" style={{ color: "#fff", fontSize: 22, marginBottom: 10 }}>{t.home}</div>

      {CATALOG.map(c => (
        <div key={c.id} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{c.icon}</span>
            <span className="display" style={{ color: "#C9D2FF", fontSize: 16 }}>{t.cat[c.id]}</span>
          </div>
          <div className="grid2">
            {c.games.map((g, gi) => {
              const aberto = !g.preco || jogosAbertos.includes(g.id);
              const anteriorOk = gi === 0 || jogosAbertos.includes(c.games[gi - 1].id);
              const compravel = !aberto && anteriorOk && g.ready;
              return (
                <button key={g.id} disabled={!g.ready || (!aberto && !compravel)}
                  onClick={() => aberto ? onPickGame(g.id) : compravel && abrirJogo(g.id)}
                  className="card" style={{
                    border: "none", padding: 14, textAlign: "left",
                    cursor: aberto || compravel ? "pointer" : "default",
                    opacity: !g.ready ? .35 : aberto ? 1 : compravel ? .92 : .4,
                    borderTop: `7px solid ${aberto ? g.color : "#B9C0CC"}`,
                  }}>
                  <div style={{ fontSize: 32 }}>{!g.ready ? "🔒" : aberto ? g.icon : compravel ? "🔓" : "🔒"}</div>
                  <div className="display" style={{ color: "#1B2A6B", fontSize: 15, lineHeight: 1.15, marginTop: 4 }}>{t.games[g.id]}</div>
                  {!g.ready && <div style={{ color: "#8B93AD", fontSize: 11, fontWeight: 800, marginTop: 2 }}>{t.soon}</div>}
                  {g.ready && compravel && (
                    <div style={{ color: coins >= g.preco ? "#E84393" : "#8B93AD", fontSize: 12, fontWeight: 900, marginTop: 3 }}>
                      🪙 {g.preco}
                    </div>
                  )}
                  {g.ready && !aberto && !compravel && (
                    <div style={{ color: "#8B93AD", fontSize: 11, fontWeight: 800, marginTop: 2 }}>{t.needPrev}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <Btn full color="#E84393" onClick={() => abrir("shop", "home")}>🛍️ {t.shop}</Btn>
        <Btn full color="#00C2CB" onClick={() => abrir("awards", "home")}>🏅 {t.awards}</Btn>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <Btn full small color="rgba(255,255,255,.2)" onClick={() => setScreen("lang")}>🌐 {t.language}</Btn>
      </div>
      <div style={{ textAlign: "center", color: "#A7B3EA", fontSize: 11, fontWeight: 700, marginTop: 14, lineHeight: 1.6 }}>
        🔒 {t.parentsInfo}<br />
        <span style={{ color: "#7E8CD0" }}>{MADE_BY}</span>
      </div>
    </div>
  );
}

/* ---------- Mapa ---------- */
function MapScreen({ t, lang, player, coins, nextRefill, unlocked, progress, unlockContinent, setSel, setScreen, stats, tutorial, setTutorial }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>🚩 {t.games.flags}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 14 }}>
        <Mundi size={64} />
        <div className="card" style={{ padding: "12px 14px", flex: 1, borderBottomLeftRadius: 6 }}>
          <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 14 }}>{t.mascotHub}</div>
        </div>
      </div>

      <div className="lista">
        {ROUTE.map((r, i) => {
          const open = unlocked.includes(r.id);
          const prev = i === 0 || unlocked.includes(ROUTE[i - 1].id);
          const stars = progress[r.id] || 0;
          return (
            <div key={r.id} className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, opacity: open || prev ? 1 : .45 }}>
              <div style={{ width: 52, height: 52, borderRadius: 18, background: r.color, display: "grid", placeItems: "center", fontSize: 26 }}>
                {open ? "🌍" : r.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ color: "#1B2A6B", fontSize: 19 }}>{t.continents[r.id]}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#6C7695" }}>
                  {open ? `⭐ ${stars}/${totalDe(r.id)}` : `${t.unlockFor} 🪙${r.cost}`}
                </div>
              </div>
              {open
                ? <Btn small color={r.color} onClick={() => { setSel({ cont: r.id, stage: Math.min(totalDe(r.id), (progress[r.id] || 0) + 1) }); setScreen("stages"); }}>{t.play}</Btn>
                : <Btn small color="#8B93AD" disabled={!prev || coins < r.cost} onClick={() => unlockContinent(r.id, r.cost)}>{r.emoji}</Btn>}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", color: "#A7B3EA", fontSize: 12, fontWeight: 700, marginTop: 16 }}>
        {nextRefill > 0 ? `${t.nextCoins} ${fmt(nextRefill)}` : `🎁 ${t.claimReady}`}
      </div>

      {tutorial && (
        <Modal onClose={() => setTutorial(false)}>
          <div style={{ textAlign: "center" }}>
            <Mundi size={80} />
            <div className="display" style={{ fontSize: 24, color: "#1B2A6B", marginTop: 6 }}>{t.tutorial}</div>
            <div style={{ textAlign: "left", margin: "12px 0", color: "#3B4468", fontWeight: 700, lineHeight: 1.7, fontSize: 15 }}>
              🚩 {t.tut1}<br />👆 {t.tut2}<br />⏱️ {t.tut3}<br />🪙 {t.tut4}
            </div>
            <Btn full color="#00B894" onClick={() => setTutorial(false)}>{t.gotIt}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,20,55,.66)", zIndex: 50, display: "grid", placeItems: "center", padding: 20 }}>
      <div className="card pop" onClick={e => e.stopPropagation()} style={{ padding: 20, maxWidth: 380, width: "100%" }}>{children}</div>
    </div>
  );
}

/* ---------- Seleção de fases ---------- */
function Stages({ t, lang, sel, setSel, progress, coins, startRound, setScreen, player, stars, records, temSecao, comprarSecao }) {
  const quiz = quizDe(sel.cont);             // jogos fora do mapa-múndi
  const cont = quiz ? { color: quiz.cor } : ROUTE.find(r => r.id === sel.cont);
  const done = progress[sel.cont] || 0;
  const band = bandFor(sel.cont, sel.stage);
  const totalFases = totalDe(sel.cont);
  const colunasFases = totalFases <= 20 ? 5 : totalFases <= 40 ? 6 : 8;
  const chaveBanda = b => `b:${sel.cont}:${b}`;
  const bandaAberta = b => !BAND_PRECO[b] || temSecao(chaveBanda(b));
  const bandaAnterior = b => DIFFS[DIFFS.indexOf(b) - 1];
  const podeComprar = b => {
    const ant = bandaAnterior(b);
    return !ant || bandaAberta(ant);
  };
  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(sel.cont.startsWith("cap_") ? "capMap" : quiz ? "home" : "map")}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>{quiz
            ? `${quiz.icone} ${quiz.nome(t)}${alvoDe(sel.cont) ? ` · ${LANG_CATALOG[alvoDe(sel.cont)]}` : ""}${
                sel.cont.startsWith("cap_")
                  ? ` · ${sel.cont === "cap_br" ? t.capBrasil : sel.cont === "cap_us" ? t.capEUA : t.continents[sel.cont.slice(4)]}`
                  : ""}`
            : t.continents[sel.cont]}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>

      {/* legenda das faixas de dificuldade */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {DIFFS.map(d => {
          const aberta = bandaAberta(d);
          return (
            <div key={d} style={{
              flex: 1, textAlign: "center", borderRadius: 12, padding: "6px 2px",
              background: aberta ? BAND_COLOR[d] : "#8B93AD", color: "#fff", fontWeight: 900, fontSize: 11,
              opacity: !aberta ? .6 : band === d ? 1 : .45,
            }}>{aberta ? t.levels[d] : `🔒 ${t.levels[d]}`}</div>
          );
        })}
      </div>

      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${colunasFases},1fr)`, gap: colunasFases > 6 ? 5 : 8 }}>
          {Array.from({ length: totalFases }, (_, i) => i + 1).map(n => {
            const b0 = bandFor(sel.cont, n);
            const open = n <= done + 1 && bandaAberta(b0);
            const cleared = n <= done;
            const b = b0;
            const st = stars?.[sel.cont]?.[n] || 0;
            return (
              <button key={n} disabled={!open} onClick={() => setSel(s => ({ ...s, stage: n }))}
                className="chunky" style={{
                  aspectRatio: "1", fontSize: 15, borderRadius: 16, padding: 2,
                  background: !open ? "#DDE2F0" : cleared ? "#00B894" : BAND_COLOR[b],
                  outline: sel.stage === n && open ? "4px solid #1B2A6B" : "none",
                  color: open ? "#fff" : "#A6AFC6",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
                }}>
                <span>{n}</span>
                <span style={{ fontSize: 9, letterSpacing: -1 }}>
                  {[1, 2, 3].map(i => (
                    <span key={i} style={{ opacity: st >= i ? 1 : .28 }}>★</span>
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {(() => {
        const prox = DIFFS.find(d => !bandaAberta(d) && podeComprar(d));
        if (!prox) return null;
        const preco = BAND_PRECO[prox];
        return (
          <div className="card" style={{ padding: 13, marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: BAND_COLOR[prox], display: "grid", placeItems: "center", fontSize: 20 }}>🔓</div>
            <div style={{ flex: 1 }}>
              <div className="display" style={{ color: "#1B2A6B", fontSize: 16 }}>{t.levels[prox]}</div>
              <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 12 }}>{t.unlockFor} 🪙{preco}</div>
            </div>
            <Btn small color={coins >= preco ? BAND_COLOR[prox] : "#8B93AD"} disabled={coins < preco}
              onClick={() => comprarSecao(chaveBanda(prox), preco)}>🪙{preco}</Btn>
          </div>
        );
      })()}

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", margin: "14px 0" }}>
        <Mundi size={56} />
        <div className="card" style={{ padding: "10px 12px", flex: 1, borderBottomLeftRadius: 6, color: "#1B2A6B", fontWeight: 800, fontSize: 13 }}>
          {t.mascotStage}
        </div>
      </div>

      {records?.[sel.cont]?.[sel.stage] != null && (
        <div style={{ textAlign: "center", color: "#C9D2FF", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
          ⏱️ {t.record}: {tempoFmt(records[sel.cont][sel.stage])}
        </div>
      )}
      <Btn full color={BAND_COLOR[band]} disabled={coins < ECON.roundCost || !bandaAberta(band)} onClick={startRound}>
        ▶ {t.stage} {sel.stage} · {t.levels[band]} · {t.cost} 🪙{ECON.roundCost}
      </Btn>
    </div>
  );
}

/* ---------- Jogo ---------- */
function Game({ t, lang, round, setRound, coins, setCoins, finishRound, player, setScreen, onQuit }) {
  const q = round.qs[round.i];
  const [left, setLeft] = useState(round.time);
  const [removed, setRemoved] = useState([]);
  const [picked, setPicked] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [imgOk, setImgOk] = useState(true);
  const [sair, setSair] = useState(false);
  const lockRef = useRef(false);

  useEffect(() => {
    setLeft(round.time); setRemoved([]); setPicked(null); setHintLevel(0); setImgOk(true);
    lockRef.current = false;
  }, [round.i]);

  useEffect(() => {
    if (round.time == null || picked !== null) return; // Fácil não tem cronômetro
    if (left <= 0) { answer(null); return; }
    const x = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(x);
  }, [left, picked, round.time]);

  function answer(opt) {
    if (lockRef.current) return;
    lockRef.current = true;
    setPicked(opt ?? "__timeout__");
    const ok = opt === q.answer;
    setTimeout(() => {
      const streak = ok ? round.streak + 1 : 0;
      const fast = ok && round.time != null && left >= round.time - 3; // respondeu em ~3s
      const next = {
        ...round,
        i: round.i + 1,
        right: round.right + (ok ? 1 : 0),
        flash: round.flash + (fast ? 1 : 0),
        islandRight: round.islandRight + (ok && q.flag && !q.sub && ISLANDS.has(q.flag.toUpperCase()) ? 1 : 0),
        subRight: round.subRight + (ok && q.sub ? 1 : 0),
        score: round.score + (ok ? 100 + (round.time == null ? 30 : left * 10) : 0),
        streak,
        bestStreak: Math.max(round.bestStreak || 0, streak),
      };
      if (next.i >= round.qs.length) finishRound(next); else setRound(next);
    }, 900);
  }

  function useHint(n) {
    const cost = n === 1 ? ECON.hint1 : n === 2 ? ECON.hint2 : ECON.hint3;
    if (coins < cost || hintLevel >= n || picked) return;
    setCoins(c => c - cost);
    const wrongs = shuffle(q.options.filter(o => o !== q.answer && !removed.includes(o)));
    setRemoved(r => [...r, ...wrongs.slice(0, n - hintLevel)]);
    setHintLevel(n);
    setRound(r => ({ ...r, hintsUsed: r.hintsUsed + 1 }));
  }

  const pct = round.time == null ? 100 : (left / round.time) * 100;
  const barColor = pct > 55 ? "#00B894" : pct > 25 ? "#F9A826" : "#E74C3C";

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <button onClick={() => setSair(true)} aria-label={t.quit} className="chunky"
          style={{ background: "rgba(255,255,255,.18)", padding: "6px 11px", fontSize: 15 }}>✕</button>
        <div className="display" style={{ color: "#fff", fontSize: 14 }}>{round.i + 1}/{round.qs.length}</div>
        <div style={{ flex: 1, display: "flex", gap: 3 }}>
          {Array.from({ length: round.qs.length }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 7, borderRadius: 4, background: i < round.i ? "#00E5A0" : "rgba(255,255,255,.25)" }} />
          ))}
        </div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "5px 10px", fontWeight: 900, fontSize: 14 }}><Coin n={coins} /></div>
      </div>

      {/* timer (o modo Fácil joga sem cronômetro) */}
      {round.time == null ? (
        <div style={{ height: 14, borderRadius: 10, background: "rgba(0,229,160,.22)", marginBottom: 12, display: "grid", placeItems: "center", color: "#9BF3D6", fontWeight: 900, fontSize: 10, letterSpacing: 1 }}>
          🐢 {t.noRush}
        </div>
      ) : (
        <div style={{ height: 14, borderRadius: 10, background: "rgba(0,0,0,.22)", overflow: "hidden", marginBottom: 12, position: "relative" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: barColor, transition: "width 1s linear", borderRadius: 10 }} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#fff", fontWeight: 900, fontSize: 11 }}>{left}s</div>
        </div>
      )}

      {/* bandeira */}
      <div className="card" style={{ padding: 14, marginBottom: 12, textAlign: "center" }}>
        <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 13, marginBottom: 8 }}>
          {q.kind === "math" ? t.howMuch : q.kind === "emojiAsk" ? q.ask : q.ask ? q.ask : ["emojiPick", "texto"].includes(q.kind) ? q.prompt : q.sub ? t.whichRegion : t.whichCountry}
        </div>
        {q.kind === "emojiPick" ? (
          <div style={{ fontSize: 46, padding: "6px 0 2px" }}>🔎</div>
        ) : q.kind === "texto" ? (
          <div className={`display ${picked && picked !== q.answer ? "shake" : ""}`}
            style={{ fontSize: q.ask ? 30 : 44, color: "#1B2A6B", padding: "10px 6px", lineHeight: 1.2 }}>
            {q.ask ? q.prompt : "📖"}
          </div>
        ) : q.kind === "emojiAsk" ? (
          <div className={picked && picked !== q.answer ? "shake" : ""} style={{ fontSize: 76, padding: "4px 0" }}>{q.prompt}</div>
        ) : q.kind === "math" ? (
          <div className={`display ${picked && picked !== q.answer ? "shake" : ""}`}
            style={{ fontSize: 44, color: "#1B2A6B", padding: "14px 8px", lineHeight: 1.2 }}>
            {q.prompt}
          </div>
        ) : (
        <div className={picked && picked !== q.answer ? "shake" : ""} style={{ display: "inline-block", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 14px rgba(20,25,60,.25)", background: "#EEF1FF" }}>
          {imgOk
            ? <img src={flagUrl(q.flag)} alt="" onError={() => setImgOk(false)} style={{ width: 210, height: 140, objectFit: "contain", display: "block", background: "#fff" }} />
            : <div style={{ width: 210, height: 140, display: "grid", placeItems: "center", fontSize: 64 }}>
              {q.sub
                ? "🏴"
                : String.fromCodePoint(...q.flag.slice(0, 2).toUpperCase().split("").map(c => 127397 + c.charCodeAt(0)))}
            </div>}
        </div>
        )}
      </div>

      {/* opções */}
      <div style={{ display: "grid", gap: 9 }}>
        {q.options.map(o => {
          const gone = removed.includes(o);
          const isAns = picked && o === q.answer;
          const isBad = picked === o && o !== q.answer;
          return (
            <button key={o} disabled={gone || !!picked} onClick={() => answer(o)} className="chunky"
              style={{
                padding: q.kind === "emojiPick" ? "14px" : "16px 14px",
                fontSize: q.kind === "emojiPick" ? 40 : 18,
                textAlign: q.kind === "emojiPick" ? "center" : "left",
                background: gone ? "#7C86A8" : isAns ? "#00B894" : isBad ? "#E74C3C" : "#fff",
                color: gone ? "rgba(255,255,255,.35)" : (isAns || isBad) ? "#fff" : "#1B2A6B",
                textDecoration: gone ? "line-through" : "none",
                opacity: gone ? .5 : 1,
              }}>
              {isAns ? "✅ " : isBad ? "❌ " : ""}{o}
            </button>
          );
        })}
      </div>

      {/* dicas */}
      <div style={{ marginTop: 14 }}>
        <div style={{ color: "#C9D2FF", fontWeight: 800, fontSize: 12, marginBottom: 6 }}>💡 {t.hints}</div>
        <div style={{ display: "flex", gap: 7 }}>
          {[[1, ECON.hint1, t.remove1], [2, ECON.hint2, t.remove2], [3, ECON.hint3, t.remove3]].map(([n, c, label]) => (
            <button key={n} onClick={() => useHint(n)} disabled={coins < c || hintLevel >= n || !!picked} className="chunky"
              style={{ flex: 1, padding: "10px 4px", fontSize: 11, lineHeight: 1.3, background: hintLevel >= n ? "#7C86A8" : coins < c ? "#8B93AD" : "#6A5AE0" }}>
              {label}<br />🪙{c}
            </button>
          ))}
        </div>
      </div>

      {sair && (
        <Modal onClose={() => setSair(false)}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40 }}>🚪</div>
            <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 15, margin: "10px 0 14px" }}>{t.quitAsk}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn full small color="#8B93AD" onClick={() => setSair(false)}>{t.cancel}</Btn>
              <Btn full small color="#E74C3C" onClick={onQuit}>{t.quit}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {picked && (
        <div className="pop" style={{ textAlign: "center", marginTop: 12, color: "#fff" }}>
          <span className="display" style={{ fontSize: 22 }}>
            {picked === q.answer ? `🎉 ${t.correct}` : picked === "__timeout__" ? `⏰ ${t.timeUp}` : `💪 ${t.wrong}`}
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------- Resultado ---------- */
function Result({ t, round, player, setScreen, setSel, sel, startRound, coins }) {
  const perfect = round.pct === 100;
  return (
    <div className="narrow" style={{ paddingTop: 20 }}>
      <div className="card pop" style={{ padding: 22, textAlign: "center" }}>
        <div style={{ fontSize: 54 }}>{perfect ? "🏆" : round.st > 0 ? "🎉" : "💪"}</div>
        <div className="display" style={{ fontSize: 28, color: "#1B2A6B" }}>{perfect ? t.perfect : t.roundOver}</div>

        <div style={{ display: "flex", justifyContent: "center", gap: 18, margin: "16px 0" }}>
          <div><div style={{ fontSize: 12, color: "#6C7695", fontWeight: 800 }}>{t.accuracy}</div>
            <div className="display" style={{ fontSize: 26, color: "#00B894" }}>{round.right}/{round.qs.length}</div></div>
          <div><div style={{ fontSize: 12, color: "#6C7695", fontWeight: 800 }}>{t.score}</div>
            <div className="display" style={{ fontSize: 26, color: "#4C6FFF" }}>{round.score}</div></div>
          <div><div style={{ fontSize: 12, color: "#6C7695", fontWeight: 800 }}>{t.reward}</div>
            <div className="display" style={{ fontSize: 26, color: "#F9A826" }}>🪙{round.reward}</div></div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 6 }}>
          {[1, 2, 3].map(i => <span key={i} style={{ fontSize: 34, opacity: (round.st || 0) >= i ? 1 : .2 }}>⭐</span>)}
        </div>
        <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 13, marginBottom: 14 }}>
          ⏱️ {tempoFmt(round.seg || 0)}{round.novoRecorde ? ` · 🏆 ${t.newRecord}` : ""}
        </div>

        <div style={{ display: "grid", gap: 9 }}>
          {round.st > 0 && round.stage < totalDe(round.cont) && (
            <Btn full color="#00B894" disabled={coins < ECON.roundCost}
              onClick={() => { setSel(s => ({ ...s, stage: round.stage + 1 })); setScreen("stages"); }}>
              {t.nextStage} →
            </Btn>
          )}
          <Btn full color="#4C6FFF" onClick={() => setScreen("stages")}>{t.again}</Btn>
          <Btn full color="#8B93AD" onClick={() => setScreen(round.cont.startsWith("cap_") ? "capMap" : quizDe(round.cont) ? "home" : "map")}>{t.backMap}</Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------- Loja ----------
   Cada vitrine é o avatar do jogador com a peça já vestida:
   o que aparece no cartão é literalmente o que ele leva. */
function Shop({ t, lang, coins, setCoins, owned, setOwned, player, setPlayer, setScreen, voltaPara = "home" }) {
  const [cat, setCat] = useState("hairStyle");
  const a = player.avatar;
  const optional = ["cap", "glasses", "shirtPattern"]; // dá para não usar nada

  const wear = (type, val) => setPlayer(p => ({ ...p, avatar: { ...p.avatar, [type]: val } }));
  const act = it => {
    if (owned.includes(it.id)) { wear(it.type, it.val); return; }
    if (coins < it.price) return;
    setCoins(c => c - it.price);
    setOwned(o => [...o, it.id]);
    wear(it.type, it.val);
  };

  const items = SHOP_ITEMS.filter(i => i.type === cat);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(voltaPara)}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 24, flex: 1 }}>🛍️ {t.shop}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12, display: "grid", placeItems: "center" }}>
        <Avatar a={a} size={130} />
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
        {SHOP_CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} className="chunky"
            style={{ flex: 1, padding: "9px 2px", fontSize: 11, background: cat === c ? "#6A5AE0" : "rgba(255,255,255,.18)" }}>
            {t.slots[c]}
          </button>
        ))}
      </div>

      <div className="grid3">
        {optional.includes(cat) && (
          <div className="card" style={{ padding: 8, textAlign: "center" }}>
            <div style={{ height: 74, display: "grid", placeItems: "center", fontSize: 30, color: "#B9C0CC" }}>🚫</div>
            <Btn small full color={a[cat] == null ? "#00B894" : "#8B93AD"} onClick={() => wear(cat, null)}>
              {a[cat] == null ? t.equipped : t.remove}
            </Btn>
          </div>
        )}
        {items.map(it => {
          const has = owned.includes(it.id);
          const on = a[it.type] === it.val;
          const preview = { ...a, [it.type]: it.val };
          return (
            <div key={it.id} className="card" style={{ padding: 8, textAlign: "center", borderTop: `6px solid ${RARITY[it.r].cor}` }}>
              <div style={{ height: 74, display: "grid", placeItems: "center", overflow: "hidden", position: "relative" }}>
                <Avatar a={preview} size={74} />
                <span style={{ position: "absolute", top: 0, right: 0, fontSize: 11 }}>{RARITY[it.r].label}</span>
              </div>
              <Btn small full color={on ? "#00B894" : has ? "#4C6FFF" : coins >= it.price ? "#E84393" : "#8B93AD"}
                disabled={!has && coins < it.price} onClick={() => act(it)}>
                {on ? t.equipped : has ? t.equip : it.price ? `🪙${it.price}` : t.free}
              </Btn>
            </div>
          );
        })}
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

/* ---------- Conquistas ---------- */
function Awards({ t, lang, stats, seenAch, setScreen, player, voltaPara = "home" }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(voltaPara)}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 24 }}>🏅 {t.awards}</div>
      </div>
      <div className="card" style={{ padding: 14, marginBottom: 12, maxWidth: 520, marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "space-around", textAlign: "center" }}>
        {[["🏅", `${ACHIEVEMENTS.filter(a => a.test(stats)).length}/${ACHIEVEMENTS.length}`],
          ["🔥", stats.bestStreak], ["💯", stats.perfect],
          ["🪙", ACHIEVEMENTS.filter(a => a.test(stats)).reduce((x, a) => x + premioDe(a), 0)]].map(([i, v]) => (
          <div key={i}><div style={{ fontSize: 22 }}>{i}</div><div className="display" style={{ fontSize: 19, color: "#1B2A6B" }}>{v}</div></div>
        ))}
      </div>
      {CONQ_CATS.map(c => {
        const doGrupo = ACHIEVEMENTS.filter(a => a.cat === c.id);
        if (!doGrupo.length) return null;
        const abertas = doGrupo.filter(a => a.test(stats)).length;
        return (
          <div key={c.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{c.icon}</span>
              <span className="display" style={{ color: "#C9D2FF", fontSize: 16, flex: 1 }}>{c[lang] || c.en}</span>
              <span style={{ color: "#A7B3EA", fontSize: 12, fontWeight: 800 }}>{abertas}/{doGrupo.length}</span>
            </div>
            <div className="lista">
              {doGrupo.map(a => {
                const got = a.test(stats);
                return (
                  <div key={a.id} className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 10, opacity: got ? 1 : .5 }}>
                    <div style={{ fontSize: 26, filter: got ? "none" : "grayscale(1)" }}>{a.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: "#1B2A6B", fontSize: 14 }}>{a[lang] || a.en}</div>
                      <div style={{ fontWeight: 900, fontSize: 11, color: got ? "#00B894" : "#8B93AD" }}>
                        {NIVEL_LABEL[a.n]} · 🪙 {premioDe(a)}
                      </div>
                    </div>
                    <div style={{ fontSize: 19 }}>{got ? "✅" : "🔒"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
