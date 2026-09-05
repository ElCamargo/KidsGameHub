/**
 * KidsGameHub — o que mudou no app
 * ElCamargo Soluções em TI LTDA
 *
 * Só dados: nenhuma lógica, nenhum componente.
 *
 * Quem instala o app é o adulto, e ele não tem como saber que apareceu jogo
 * novo — não há loja, não há notificação, não há e-mail. Esta lista é o único
 * lugar onde ele descobre, e ela aparece na área dele, com um pontinho quando
 * há coisa nova.
 *
 * REGRA AO ACRESCENTAR: a mais nova em cima, com a versão da tag, a data, e
 * itens curtos — o que a CRIANÇA ganhou, não o que o código mudou. Nada de
 * "refatoramos o motor de rodadas": isso é para o histórico do git.
 * Os seis idiomas são obrigatórios, e o teste confere.
 */
export const NOVIDADES = [
  {
    v: "1.1.0", d: "2026-09-05",
    t: {
      pt: {
        titulo: "Ler, contar e lembrar",
        itens: [
          "Trilha do ano escolar: escolha o ano e jogue o que a escola cobra, de graça",
          "Área nova: Ler e Escrever, com Monta a Palavra, Que Letra Começa e Rimas",
          "Matemática ganhou Tabuada, Que Horas São e Dinheiro do Brasil",
          "O app agora lembra o que a criança errou e traz de volta em 1, 3, 7 e 21 dias",
          "A ficha do filho mostra onde ele está devendo",
          "Quebra-cabeça nas seis áreas, com encaixe de verdade",
          "Som de fundo baixinho, que se desliga num toque",
        ],
      },
      en: {
        titulo: "Reading, counting and remembering",
        itens: [
          "School year track: pick the grade and play what school asks for, free",
          "New area: Reading and Writing, with Build the Word, Which Letter Starts It and Rhymes",
          "Math gained Times Tables, Telling Time and Brazilian Money",
          "The app now remembers what your child got wrong and brings it back in 1, 3, 7 and 21 days",
          "Your child's card shows where they are behind",
          "Jigsaw puzzles in all six areas, with real interlocking pieces",
          "Quiet background music, one tap to turn off",
        ],
      },
      es: {
        titulo: "Leer, contar y recordar",
        itens: [
          "Ruta del año escolar: elige el grado y juega lo que la escuela pide, gratis",
          "Área nueva: Leer y Escribir, con Arma la Palabra, Con Qué Letra Empieza y Rimas",
          "Matemáticas ganó Tablas de Multiplicar, Qué Hora Es y Dinero de Brasil",
          "La app ahora recuerda lo que el niño falló y lo trae de vuelta en 1, 3, 7 y 21 días",
          "La ficha del hijo muestra dónde está flojo",
          "Rompecabezas en las seis áreas, con encajes de verdad",
          "Sonido de fondo bajito, que se apaga con un toque",
        ],
      },
      fr: {
        titulo: "Lire, compter et se souvenir",
        itens: [
          "Parcours de l'année scolaire : choisis ton année et joue ce que l'école demande, gratuitement",
          "Nouvelle zone : Lire et Écrire, avec Construis le Mot, Quelle Lettre Commence et Rimes",
          "Les maths gagnent Tables de Multiplication, Quelle Heure Est-il et Argent du Brésil",
          "L'appli retient ce que l'enfant a raté et le ramène après 1, 3, 7 et 21 jours",
          "La fiche de l'enfant montre où il a du mal",
          "Puzzles dans les six zones, avec de vraies pièces qui s'emboîtent",
          "Musique de fond très douce, coupée en une touche",
        ],
      },
      de: {
        titulo: "Lesen, rechnen und behalten",
        itens: [
          "Schuljahr-Pfad: Klasse wählen und spielen, was die Schule verlangt — gratis",
          "Neuer Bereich: Lesen und Schreiben, mit Bau das Wort, Welcher Buchstabe Beginnt und Reime",
          "Mathe bekam Einmaleins, Wie Spät Ist Es und Brasilianisches Geld",
          "Die App merkt sich Fehler und bringt sie nach 1, 3, 7 und 21 Tagen zurück",
          "Die Karte des Kindes zeigt, wo es noch hakt",
          "Puzzles in allen sechs Bereichen, mit echten Steckteilen",
          "Leise Hintergrundmusik, mit einem Tipp aus",
        ],
      },
      it: {
        titulo: "Leggere, contare e ricordare",
        itens: [
          "Percorso dell'anno scolastico: scegli la classe e gioca quello che la scuola chiede, gratis",
          "Area nuova: Leggere e Scrivere, con Costruisci la Parola, Con Che Lettera Inizia e Rime",
          "Matematica ha guadagnato Tabelline, Che Ore Sono e Denaro del Brasile",
          "L'app ora ricorda gli errori e li riporta dopo 1, 3, 7 e 21 giorni",
          "La scheda del figlio mostra dove è indietro",
          "Puzzle in tutte e sei le aree, con incastri veri",
          "Musica di sottofondo bassa, si spegne con un tocco",
        ],
      },
    },
  },
  {
    v: "1.0.0", d: "2026-09-05",
    t: {
      pt: { titulo: "A primeira versão", itens: ["21 jogos em 6 áreas, 6 idiomas, offline, sem anúncio e sem conta"] },
      en: { titulo: "The first release", itens: ["21 games in 6 areas, 6 languages, offline, no ads and no account"] },
      es: { titulo: "La primera versión", itens: ["21 juegos en 6 áreas, 6 idiomas, sin conexión, sin anuncios y sin cuenta"] },
      fr: { titulo: "La première version", itens: ["21 jeux dans 6 zones, 6 langues, hors ligne, sans pub ni compte"] },
      de: { titulo: "Die erste Version", itens: ["21 Spiele in 6 Bereichen, 6 Sprachen, offline, ohne Werbung und ohne Konto"] },
      it: { titulo: "La prima versione", itens: ["21 giochi in 6 aree, 6 lingue, offline, senza pubblicità e senza account"] },
    },
  },
];

export const IDIOMAS_NOVIDADES = ["pt", "en", "es", "fr", "de", "it"];

/* A mais nova. É com ela que se compara o que o responsável já viu. */
export const ULTIMA_NOVIDADE = NOVIDADES[0]?.v || "";
