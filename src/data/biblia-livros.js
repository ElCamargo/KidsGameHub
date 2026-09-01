/**
 * KidsGameHub — os 66 livros da Bíblia
 * ElCamargo Soluções em TI LTDA
 *
 * Uma tabela de fatos objetivos: nome nos três idiomas, testamento, grupo,
 * número de capítulos e autor tradicional. Seis moldes de pergunta saem daqui
 * — quantos capítulos, qual livro tem tantos capítulos, de que grupo é, o que
 * vem antes, o que vem depois e quem escreveu.
 *
 * `autor: null` onde a autoria não é consenso (Juízes, Rute, Ester, Jó,
 * Samuel, Reis, Crônicas, Hebreus). Preferi não perguntar a não perguntar
 * errado — este banco vai ser lido por criança e revisado por pastor.
 *
 * Contagem de capítulos: cânon protestante, 66 livros.
 */

export const GRUPOS_BIBLIA = {
  lei:        { pt: "Lei (Pentateuco)",     en: "Law (Pentateuch)",     es: "Ley (Pentateuco)" },
  historicos: { pt: "Históricos",           en: "History",              es: "Históricos" },
  poeticos:   { pt: "Poéticos",             en: "Poetry",               es: "Poéticos" },
  maiores:    { pt: "Profetas Maiores",     en: "Major Prophets",       es: "Profetas Mayores" },
  menores:    { pt: "Profetas Menores",     en: "Minor Prophets",       es: "Profetas Menores" },
  evangelhos: { pt: "Evangelhos",           en: "Gospels",              es: "Evangelios" },
  historiaNT: { pt: "História da Igreja",   en: "Church History",       es: "Historia de la Iglesia" },
  paulo:      { pt: "Cartas de Paulo",      en: "Letters of Paul",      es: "Cartas de Pablo" },
  gerais:     { pt: "Cartas Gerais",        en: "General Letters",      es: "Cartas Generales" },
  profecia:   { pt: "Profecia",             en: "Prophecy",             es: "Profecía" },
};

const L = (pt, en, es, t, g, cap, autor) => ({ pt, en, es, t, g, cap, autor });

/* Na ordem canônica: o índice do vetor É a posição do livro na Bíblia. */
export const LIVROS = [
  /* --- Antigo Testamento: Lei --- */
  L("Gênesis", "Genesis", "Génesis", "ao", "lei", 50, "moises"),
  L("Êxodo", "Exodus", "Éxodo", "ao", "lei", 40, "moises"),
  L("Levítico", "Leviticus", "Levítico", "ao", "lei", 27, "moises"),
  L("Números", "Numbers", "Números", "ao", "lei", 36, "moises"),
  L("Deuteronômio", "Deuteronomy", "Deuteronomio", "ao", "lei", 34, "moises"),
  /* --- Históricos --- */
  L("Josué", "Joshua", "Josué", "ao", "historicos", 24, "josue"),
  L("Juízes", "Judges", "Jueces", "ao", "historicos", 21, null),
  L("Rute", "Ruth", "Rut", "ao", "historicos", 4, null),
  L("1 Samuel", "1 Samuel", "1 Samuel", "ao", "historicos", 31, null),
  L("2 Samuel", "2 Samuel", "2 Samuel", "ao", "historicos", 24, null),
  L("1 Reis", "1 Kings", "1 Reyes", "ao", "historicos", 22, null),
  L("2 Reis", "2 Kings", "2 Reyes", "ao", "historicos", 25, null),
  L("1 Crônicas", "1 Chronicles", "1 Crónicas", "ao", "historicos", 29, null),
  L("2 Crônicas", "2 Chronicles", "2 Crónicas", "ao", "historicos", 36, null),
  L("Esdras", "Ezra", "Esdras", "ao", "historicos", 10, "esdras"),
  L("Neemias", "Nehemiah", "Nehemías", "ao", "historicos", 13, "neemias"),
  L("Ester", "Esther", "Ester", "ao", "historicos", 10, null),
  /* --- Poéticos --- */
  L("Jó", "Job", "Job", "ao", "poeticos", 42, null),
  L("Salmos", "Psalms", "Salmos", "ao", "poeticos", 150, "davi"),
  L("Provérbios", "Proverbs", "Proverbios", "ao", "poeticos", 31, "salomao"),
  L("Eclesiastes", "Ecclesiastes", "Eclesiastés", "ao", "poeticos", 12, "salomao"),
  L("Cânticos", "Song of Songs", "Cantares", "ao", "poeticos", 8, "salomao"),
  /* --- Profetas Maiores --- */
  L("Isaías", "Isaiah", "Isaías", "ao", "maiores", 66, "isaias"),
  L("Jeremias", "Jeremiah", "Jeremías", "ao", "maiores", 52, "jeremias"),
  L("Lamentações", "Lamentations", "Lamentaciones", "ao", "maiores", 5, "jeremias"),
  L("Ezequiel", "Ezekiel", "Ezequiel", "ao", "maiores", 48, "ezequiel"),
  L("Daniel", "Daniel", "Daniel", "ao", "maiores", 12, "daniel"),
  /* --- Profetas Menores --- */
  L("Oseias", "Hosea", "Oseas", "ao", "menores", 14, "oseias"),
  L("Joel", "Joel", "Joel", "ao", "menores", 3, "joel"),
  L("Amós", "Amos", "Amós", "ao", "menores", 9, "amos"),
  L("Obadias", "Obadiah", "Abdías", "ao", "menores", 1, "obadias"),
  L("Jonas", "Jonah", "Jonás", "ao", "menores", 4, "jonas"),
  L("Miqueias", "Micah", "Miqueas", "ao", "menores", 7, "miqueias"),
  L("Naum", "Nahum", "Nahúm", "ao", "menores", 3, "naum"),
  L("Habacuque", "Habakkuk", "Habacuc", "ao", "menores", 3, "habacuque"),
  L("Sofonias", "Zephaniah", "Sofonías", "ao", "menores", 3, "sofonias"),
  L("Ageu", "Haggai", "Hageo", "ao", "menores", 2, "ageu"),
  L("Zacarias", "Zechariah", "Zacarías", "ao", "menores", 14, "zacarias"),
  L("Malaquias", "Malachi", "Malaquías", "ao", "menores", 4, "malaquias"),
  /* --- Novo Testamento: Evangelhos --- */
  L("Mateus", "Matthew", "Mateo", "nt", "evangelhos", 28, "mateus"),
  L("Marcos", "Mark", "Marcos", "nt", "evangelhos", 16, "marcos"),
  L("Lucas", "Luke", "Lucas", "nt", "evangelhos", 24, "lucas"),
  L("João", "John", "Juan", "nt", "evangelhos", 21, "joao"),
  /* --- História --- */
  L("Atos", "Acts", "Hechos", "nt", "historiaNT", 28, "lucas"),
  /* --- Cartas de Paulo --- */
  L("Romanos", "Romans", "Romanos", "nt", "paulo", 16, "paulo"),
  L("1 Coríntios", "1 Corinthians", "1 Corintios", "nt", "paulo", 16, "paulo"),
  L("2 Coríntios", "2 Corinthians", "2 Corintios", "nt", "paulo", 13, "paulo"),
  L("Gálatas", "Galatians", "Gálatas", "nt", "paulo", 6, "paulo"),
  L("Efésios", "Ephesians", "Efesios", "nt", "paulo", 6, "paulo"),
  L("Filipenses", "Philippians", "Filipenses", "nt", "paulo", 4, "paulo"),
  L("Colossenses", "Colossians", "Colosenses", "nt", "paulo", 4, "paulo"),
  L("1 Tessalonicenses", "1 Thessalonians", "1 Tesalonicenses", "nt", "paulo", 5, "paulo"),
  L("2 Tessalonicenses", "2 Thessalonians", "2 Tesalonicenses", "nt", "paulo", 3, "paulo"),
  L("1 Timóteo", "1 Timothy", "1 Timoteo", "nt", "paulo", 6, "paulo"),
  L("2 Timóteo", "2 Timothy", "2 Timoteo", "nt", "paulo", 4, "paulo"),
  L("Tito", "Titus", "Tito", "nt", "paulo", 3, "paulo"),
  L("Filemom", "Philemon", "Filemón", "nt", "paulo", 1, "paulo"),
  /* --- Cartas Gerais --- */
  L("Hebreus", "Hebrews", "Hebreos", "nt", "gerais", 13, null),
  L("Tiago", "James", "Santiago", "nt", "gerais", 5, "tiago"),
  L("1 Pedro", "1 Peter", "1 Pedro", "nt", "gerais", 5, "pedro"),
  L("2 Pedro", "2 Peter", "2 Pedro", "nt", "gerais", 3, "pedro"),
  L("1 João", "1 John", "1 Juan", "nt", "gerais", 5, "joao"),
  L("2 João", "2 John", "2 Juan", "nt", "gerais", 1, "joao"),
  L("3 João", "3 John", "3 Juan", "nt", "gerais", 1, "joao"),
  L("Judas", "Jude", "Judas", "nt", "gerais", 1, "judasTadeu"),
  /* --- Profecia --- */
  L("Apocalipse", "Revelation", "Apocalipsis", "nt", "profecia", 22, "joao"),
];

/* Nomes dos autores, nos três idiomas. Chave curta para não repetir grafia. */
export const AUTORES = {
  moises:     { pt: "Moisés", en: "Moses", es: "Moisés" },
  josue:      { pt: "Josué", en: "Joshua", es: "Josué" },
  esdras:     { pt: "Esdras", en: "Ezra", es: "Esdras" },
  neemias:    { pt: "Neemias", en: "Nehemiah", es: "Nehemías" },
  davi:       { pt: "Davi", en: "David", es: "David" },
  salomao:    { pt: "Salomão", en: "Solomon", es: "Salomón" },
  isaias:     { pt: "Isaías", en: "Isaiah", es: "Isaías" },
  jeremias:   { pt: "Jeremias", en: "Jeremiah", es: "Jeremías" },
  ezequiel:   { pt: "Ezequiel", en: "Ezekiel", es: "Ezequiel" },
  daniel:     { pt: "Daniel", en: "Daniel", es: "Daniel" },
  oseias:     { pt: "Oseias", en: "Hosea", es: "Oseas" },
  joel:       { pt: "Joel", en: "Joel", es: "Joel" },
  amos:       { pt: "Amós", en: "Amos", es: "Amós" },
  obadias:    { pt: "Obadias", en: "Obadiah", es: "Abdías" },
  jonas:      { pt: "Jonas", en: "Jonah", es: "Jonás" },
  miqueias:   { pt: "Miqueias", en: "Micah", es: "Miqueas" },
  naum:       { pt: "Naum", en: "Nahum", es: "Nahúm" },
  habacuque:  { pt: "Habacuque", en: "Habakkuk", es: "Habacuc" },
  sofonias:   { pt: "Sofonias", en: "Zephaniah", es: "Sofonías" },
  ageu:       { pt: "Ageu", en: "Haggai", es: "Hageo" },
  zacarias:   { pt: "Zacarias", en: "Zechariah", es: "Zacarías" },
  malaquias:  { pt: "Malaquias", en: "Malachi", es: "Malaquías" },
  mateus:     { pt: "Mateus", en: "Matthew", es: "Mateo" },
  marcos:     { pt: "Marcos", en: "Mark", es: "Marcos" },
  lucas:      { pt: "Lucas", en: "Luke", es: "Lucas" },
  joao:       { pt: "João", en: "John", es: "Juan" },
  paulo:      { pt: "Paulo", en: "Paul", es: "Pablo" },
  tiago:      { pt: "Tiago", en: "James", es: "Santiago" },
  pedro:      { pt: "Pedro", en: "Peter", es: "Pedro" },
  judasTadeu: { pt: "Judas, irmão de Tiago", en: "Jude, brother of James", es: "Judas, hermano de Santiago" },
};

/* Listas fechadas que dão perguntas boas sozinhas. */
export const LISTAS_BIBLIA = {
  mandamentos: {
    pergunta: { pt: "Qual é o {n}º mandamento?", en: "What is commandment number {n}?", es: "¿Cuál es el mandamiento nº {n}?" },
    itens: [
      { pt: "Não terás outros deuses além de mim", en: "You shall have no other gods before me", es: "No tendrás otros dioses delante de mí" },
      { pt: "Não farás para ti imagem de escultura", en: "You shall not make for yourself an idol", es: "No te harás imagen ni semejanza" },
      { pt: "Não tomarás o nome do Senhor em vão", en: "You shall not take the Lord's name in vain", es: "No tomarás el nombre del Señor en vano" },
      { pt: "Lembra-te do dia de sábado, para o santificar", en: "Remember the Sabbath day, to keep it holy", es: "Acuérdate del día de reposo para santificarlo" },
      { pt: "Honra teu pai e tua mãe", en: "Honour your father and your mother", es: "Honra a tu padre y a tu madre" },
      { pt: "Não matarás", en: "You shall not murder", es: "No matarás" },
      { pt: "Não adulterarás", en: "You shall not commit adultery", es: "No cometerás adulterio" },
      { pt: "Não furtarás", en: "You shall not steal", es: "No hurtarás" },
      { pt: "Não dirás falso testemunho", en: "You shall not give false testimony", es: "No darás falso testimonio" },
      { pt: "Não cobiçarás o que é do próximo", en: "You shall not covet your neighbour's things", es: "No codiciarás lo de tu prójimo" },
    ],
  },
  pragas: {
    pergunta: { pt: "Qual foi a {n}ª praga do Egito?", en: "What was plague number {n} of Egypt?", es: "¿Cuál fue la plaga nº {n} de Egipto?" },
    itens: [
      { pt: "As águas viraram sangue", en: "Water turned to blood", es: "Las aguas se volvieron sangre" },
      { pt: "As rãs", en: "The frogs", es: "Las ranas" },
      { pt: "Os piolhos", en: "The gnats", es: "Los piojos" },
      { pt: "As moscas", en: "The flies", es: "Las moscas" },
      { pt: "A peste nos animais", en: "Disease on the livestock", es: "La peste en el ganado" },
      { pt: "As úlceras", en: "The boils", es: "Las úlceras" },
      { pt: "A chuva de pedras", en: "The hail", es: "El granizo" },
      { pt: "Os gafanhotos", en: "The locusts", es: "Las langostas" },
      { pt: "As trevas", en: "The darkness", es: "Las tinieblas" },
      { pt: "A morte dos primogênitos", en: "The death of the firstborn", es: "La muerte de los primogénitos" },
    ],
  },
  criacao: {
    pergunta: { pt: "O que Deus criou no {n}º dia?", en: "What did God create on day {n}?", es: "¿Qué creó Dios en el día {n}?" },
    itens: [
      { pt: "A luz", en: "Light", es: "La luz" },
      { pt: "O céu, separando as águas", en: "The sky, separating the waters", es: "El cielo, separando las aguas" },
      { pt: "A terra seca e as plantas", en: "Dry land and plants", es: "La tierra seca y las plantas" },
      { pt: "O sol, a lua e as estrelas", en: "The sun, moon and stars", es: "El sol, la luna y las estrellas" },
      { pt: "Os peixes e as aves", en: "Fish and birds", es: "Los peces y las aves" },
      { pt: "Os animais da terra e o homem", en: "Land animals and man", es: "Los animales de la tierra y el hombre" },
      { pt: "Nada: Ele descansou", en: "Nothing: He rested", es: "Nada: Él descansó" },
    ],
  },
};
