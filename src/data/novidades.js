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
    v: "1.4.0", d: "2026-10-10",
    t: {
      pt: {
        titulo: "A tela inicial ficou mais fácil de usar",
        itens: [
          "A tela inicial agora mostra as áreas — Ler e Escrever, Geografia, Matemática, Natureza, Arte, Idiomas e Fé — e os jogos ficam dentro de cada uma. Menos rolagem para achar o que a criança quer jogar",
          "Jogar junto no mesmo aparelho saiu do fundo: o convite para o irmão, o primo ou o amigo está na própria tela inicial, e vale para o jogo que ela abrir em seguida",
          "O ano escolar agora é definido pelo responsável, no cartão do filho. A criança vê o ano dela, mas não troca mais sozinha",
          "Corrigido: abrir um perfil gravado por uma versão antiga do app podia travar a tela. Não trava mais",
        ],
      },
      en: {
        titulo: "The home screen is easier to use",
        itens: [
          "The home screen now shows the areas — Reading and Writing, Geography, Maths, Nature, Art, Languages and Faith — with the games inside each one. Less scrolling to find what the child wants to play",
          "Playing together on one device came out of hiding: the invite for a sibling, cousin or friend is right on the home screen, and it carries into whatever game they open next",
          "The school year is now set by the grown-up, on the child's card. The child still sees their year, but no longer changes it alone",
          "Fixed: opening a profile saved by an older version of the app could freeze the screen. It no longer does",
        ],
      },
      es: {
        titulo: "La pantalla de inicio es más fácil de usar",
        itens: [
          "La pantalla de inicio ahora muestra las áreas — Leer y Escribir, Geografía, Matemáticas, Naturaleza, Arte, Idiomas y Fe — y los juegos están dentro de cada una. Menos desplazamiento para encontrar lo que quiere jugar",
          "Jugar juntos en el mismo aparato salió del fondo: la invitación para el hermano, el primo o el amigo está en la propia pantalla de inicio, y vale para el juego que abra después",
          "El año escolar ahora lo define la persona responsable, en la tarjeta del hijo. El niño ve su año, pero ya no lo cambia solo",
          "Corregido: abrir un perfil guardado por una versión antigua de la aplicación podía bloquear la pantalla. Ya no ocurre",
        ],
      },
      fr: {
        titulo: "L'écran d'accueil est plus simple à utiliser",
        itens: [
          "L'écran d'accueil montre maintenant les domaines — Lire et Écrire, Géographie, Mathématiques, Nature, Art, Langues et Foi — et les jeux se trouvent dans chacun. Moins de défilement pour trouver ce que l'enfant veut jouer",
          "Jouer ensemble sur le même appareil n'est plus caché : l'invitation pour le frère, le cousin ou l'ami est sur l'écran d'accueil, et vaut pour le jeu ouvert ensuite",
          "L'année scolaire est maintenant définie par l'adulte, sur la carte de l'enfant. L'enfant voit son année, mais ne la change plus seul",
          "Corrigé : ouvrir un profil enregistré par une ancienne version de l'application pouvait bloquer l'écran. Ce n'est plus le cas",
        ],
      },
      de: {
        titulo: "Der Startbildschirm ist einfacher geworden",
        itens: [
          "Der Startbildschirm zeigt jetzt die Bereiche — Lesen und Schreiben, Geografie, Mathematik, Natur, Kunst, Sprachen und Glaube — und die Spiele stecken in jedem davon. Weniger Scrollen, bis das Kind findet, was es spielen will",
          "Gemeinsam auf einem Gerät spielen war versteckt: die Einladung für Geschwister, Cousine oder Freund steht jetzt auf dem Startbildschirm und gilt für das Spiel, das danach geöffnet wird",
          "Das Schuljahr legt jetzt die erwachsene Person auf der Karte des Kindes fest. Das Kind sieht sein Jahr weiterhin, ändert es aber nicht mehr allein",
          "Behoben: ein Profil, das eine ältere Version der App gespeichert hatte, konnte den Bildschirm blockieren. Das passiert nicht mehr",
        ],
      },
      it: {
        titulo: "La schermata iniziale è più facile da usare",
        itens: [
          "La schermata iniziale ora mostra le aree — Leggere e Scrivere, Geografia, Matematica, Natura, Arte, Lingue e Fede — e i giochi stanno dentro ciascuna. Meno scorrimento per trovare quello che il bambino vuole giocare",
          "Giocare insieme sullo stesso apparecchio non è più nascosto: l'invito per il fratello, il cugino o l'amico è sulla schermata iniziale, e vale per il gioco che apre dopo",
          "L'anno scolastico ora lo decide l'adulto, sulla scheda del figlio. Il bambino vede il suo anno, ma non lo cambia più da solo",
          "Corretto: aprire un profilo salvato da una vecchia versione dell'app poteva bloccare lo schermo. Adesso non succede più",
        ],
      },
    },
  },
  {
    v: "1.3.0", d: "2026-09-07",
    t: {
      pt: {
        titulo: "O app agora se chama Clarim",
        itens: [
          "Mesmo app, mesmos jogos, mesmo Mundi — só o nome mudou. Lumus já era marca registrada de outra empresa, e trocamos antes de publicar na loja",
          "NADA SE PERDEU: os perfis, os mundis, as estrelas, o caderno e os desenhos continuam exatamente onde estavam",
          "A senha do responsável continua a mesma. Não é preciso recadastrar nada",
          "Clarim é o toque que anuncia — e é o que o app faz: anunciar o que a criança já sabe fazer",
        ],
      },
      en: {
        titulo: "The app is now called Clarim",
        itens: [
          "Same app, same games, same Mundi — only the name changed. Lumus was already another company's registered trademark, and we changed it before the store launch",
          "NOTHING WAS LOST: profiles, mundis, stars, the notebook and the drawings are all exactly where they were",
          "The grown-up's password is unchanged. Nothing needs to be set up again",
          "A clarim is the bugle call that announces — which is what the app does: announce what the child can already do",
        ],
      },
      es: {
        titulo: "La aplicación ahora se llama Clarim",
        itens: [
          "La misma aplicación, los mismos juegos, el mismo Mundi — solo cambió el nombre. Lumus ya era marca registrada de otra empresa, y lo cambiamos antes de publicar en la tienda",
          "NO SE PERDIÓ NADA: los perfiles, los mundis, las estrellas, el cuaderno y los dibujos siguen donde estaban",
          "La contraseña del adulto sigue siendo la misma. No hay que registrar nada de nuevo",
          "Un clarín es el toque que anuncia — y es lo que hace la aplicación: anunciar lo que la criatura ya sabe hacer",
        ],
      },
      fr: {
        titulo: "L'application s'appelle maintenant Clarim",
        itens: [
          "Même application, mêmes jeux, même Mundi — seul le nom change. Lumus était déjà une marque déposée par une autre entreprise, et nous avons changé avant la publication",
          "RIEN N'EST PERDU : les profils, les mundis, les étoiles, le carnet et les dessins sont exactement là où ils étaient",
          "Le mot de passe du parent ne change pas. Rien à refaire",
          "Un clairon est la sonnerie qui annonce — c'est ce que fait l'application : annoncer ce que l'enfant sait déjà faire",
        ],
      },
      de: {
        titulo: "Die App heißt jetzt Clarim",
        itens: [
          "Gleiche App, gleiche Spiele, gleicher Mundi — nur der Name ist neu. Lumus war bereits eine eingetragene Marke einer anderen Firma, und wir haben vor dem Store-Start gewechselt",
          "NICHTS GING VERLOREN: Profile, Mundis, Sterne, das Heft und die Zeichnungen sind genau dort, wo sie waren",
          "Das Passwort der Erwachsenen bleibt gleich. Es muss nichts neu eingerichtet werden",
          "Ein Clarim ist das Signalhorn, das ankündigt — und genau das tut die App: ankündigen, was das Kind schon kann",
        ],
      },
      it: {
        titulo: "L'app ora si chiama Clarim",
        itens: [
          "Stessa app, stessi giochi, stesso Mundi — è cambiato solo il nome. Lumus era già un marchio registrato di un'altra azienda, e abbiamo cambiato prima di pubblicare nel negozio",
          "NON SI È PERSO NIENTE: i profili, i mundis, le stelle, il quaderno e i disegni sono esattamente dov'erano",
          "La password dell'adulto resta la stessa. Non serve registrare nulla di nuovo",
          "Il clarino è lo squillo che annuncia — ed è quello che fa l'app: annunciare ciò che il bambino sa già fare",
        ],
      },
    },
  },
  {
    v: "1.2.3", d: "2026-09-07",
    t: {
      pt: {
        titulo: "Mais mundis, e o esforço também conta",
        itens: [
          "Todos os jogos pagam bem mais mundis — quem faz 1 estrela ganhou quase o dobro, porque abrir jogo novo estava demorado demais para os pequenos",
          "Terminar a fase continua valendo mais: 3 estrelas ainda pagam o dobro de 1",
          "Na tela do responsável: o cartão da semana agora mostra as rodadas que a criança terminou sem estrela — o esforço que não aparecia em número nenhum",
          "O presente da semana subiu para 170 mundis, em parcelas de 20, 50 ou 100",
        ],
      },
      en: {
        titulo: "More mundis, and effort counts too",
        itens: [
          "Every game pays far more mundis — a 1-star round now earns almost double, because unlocking a new game was taking the little ones too long",
          "Finishing well still pays more: 3 stars are still worth double 1 star",
          "On the grown-up screen: the weekly card now shows the rounds the child finished without a star — the effort that showed up in no number at all",
          "The weekly gift went up to 170 mundis, in portions of 20, 50 or 100",
        ],
      },
      es: {
        titulo: "Más mundis, y el esfuerzo también cuenta",
        itens: [
          "Todos los juegos pagan muchos más mundis — quien saca 1 estrella gana casi el doble, porque abrir un juego nuevo tardaba demasiado para los pequeños",
          "Terminar bien sigue valiendo más: 3 estrellas siguen pagando el doble que 1",
          "En la pantalla del adulto: la tarjeta de la semana ahora muestra las rondas que la criatura terminó sin estrella — el esfuerzo que no aparecía en ningún número",
          "El regalo de la semana subió a 170 mundis, en partes de 20, 50 o 100",
        ],
      },
      fr: {
        titulo: "Plus de mundis, et l'effort compte aussi",
        itens: [
          "Tous les jeux paient bien plus de mundis — une manche à 1 étoile rapporte presque le double, car débloquer un nouveau jeu prenait trop longtemps aux petits",
          "Bien finir vaut toujours plus : 3 étoiles paient encore le double d'une seule",
          "Sur l'écran du parent : la carte de la semaine montre maintenant les manches terminées sans étoile — l'effort qui n'apparaissait dans aucun chiffre",
          "Le cadeau de la semaine passe à 170 mundis, par tranches de 20, 50 ou 100",
        ],
      },
      de: {
        titulo: "Mehr Mundis, und der Einsatz zählt auch",
        itens: [
          "Alle Spiele zahlen viel mehr Mundis — eine Runde mit 1 Stern bringt fast das Doppelte, denn ein neues Spiel freizuschalten dauerte den Kleinen zu lange",
          "Gut abschließen zahlt weiter mehr: 3 Sterne sind immer noch doppelt so viel wert wie 1",
          "Im Bereich der Erwachsenen: die Wochenkarte zeigt jetzt die Runden, die das Kind ohne Stern beendet hat — der Einsatz, der in keiner Zahl auftauchte",
          "Das Wochengeschenk steigt auf 170 Mundis, in Portionen von 20, 50 oder 100",
        ],
      },
      it: {
        titulo: "Più mundis, e conta anche l'impegno",
        itens: [
          "Tutti i giochi pagano molti più mundis — chi fa 1 stella guadagna quasi il doppio, perché sbloccare un gioco nuovo era troppo lungo per i piccoli",
          "Finire bene vale ancora di più: 3 stelle pagano sempre il doppio di 1",
          "Nella schermata del genitore: la scheda della settimana ora mostra le partite finite senza stella — l'impegno che non appariva in nessun numero",
          "Il regalo della settimana sale a 170 mundis, in parti da 20, 50 o 100",
        ],
      },
    },
  },
  {
    v: "1.2.2", d: "2026-09-07",
    t: {
      pt: {
        titulo: "Levar o progresso para outro aparelho",
        itens: [
          "Botão novo na tela de quem vai jogar: 💾 Levar para outro aparelho — salve a cópia de cada filho e abra no celular ou no notebook",
          "Salve a cópia agora: o Clarim vai mudar de endereço, e é ela que leva o progresso junto",
          "Salve pelo aparelho onde a criança jogou. No aparelho vazio, a cópia sai vazia",
        ],
      },
      en: {
        titulo: "Take progress to another device",
        itens: [
          "New button on the who-is-playing screen: 💾 Move to another device — save each child's copy and open it on the phone or laptop",
          "Save the copy now: Clarim is changing address, and the copy is what carries progress along",
          "Save from the device where the child played. On an empty device, the copy comes out empty",
        ],
      },
      es: {
        titulo: "Llevar el progreso a otro aparato",
        itens: [
          "Botón nuevo en la pantalla de quién va a jugar: 💾 Llevar a otro aparato — guarda la copia de cada hijo y ábrela en el móvil o el portátil",
          "Guarda la copia ahora: Clarim va a cambiar de dirección, y es ella la que lleva el progreso",
          "Guarda desde el aparato donde jugó la criatura. En un aparato vacío, la copia sale vacía",
        ],
      },
      fr: {
        titulo: "Emporter la progression sur un autre appareil",
        itens: [
          "Nouveau bouton sur l'écran des joueurs : 💾 Emporter sur un autre appareil — enregistre la copie de chaque enfant et ouvre-la sur le téléphone ou l'ordinateur",
          "Enregistre la copie maintenant : Clarim va changer d'adresse, et c'est elle qui emporte la progression",
          "Enregistre depuis l'appareil où l'enfant a joué. Sur un appareil vide, la copie sort vide",
        ],
      },
      de: {
        titulo: "Den Fortschritt auf ein anderes Gerät mitnehmen",
        itens: [
          "Neuer Knopf im Spieler-Bildschirm: 💾 Auf ein anderes Gerät mitnehmen — speichere die Kopie jedes Kindes und öffne sie auf dem Handy oder Laptop",
          "Speichere die Kopie jetzt: Clarim bekommt eine neue Adresse, und die Kopie nimmt den Fortschritt mit",
          "Speichere von dem Gerät, auf dem das Kind gespielt hat. Auf einem leeren Gerät kommt eine leere Kopie heraus",
        ],
      },
      it: {
        titulo: "Portare i progressi su un altro apparecchio",
        itens: [
          "Pulsante nuovo nella schermata di chi gioca: 💾 Porta su un altro apparecchio — salva la copia di ogni figlio e aprila sul telefono o sul portatile",
          "Salva la copia adesso: Clarim cambierà indirizzo, ed è lei che porta i progressi",
          "Salva dall'apparecchio dove il bambino ha giocato. Su un apparecchio vuoto, la copia esce vuota",
        ],
      },
    },
  },
  {
    v: "1.2.0", d: "2026-09-07",
    t: {
      pt: {
        titulo: "O progresso não se perde",
        itens: [
          "Progresso guardado por uma versão antiga volta a abrir sem erro, mesmo depois de meses",
          "Salve a cópia de cada filho na tela de quem vai jogar — o Clarim vai mudar de endereço em breve",
        ],
      },
      en: {
        titulo: "Progress does not get lost",
        itens: [
          "Progress saved by an older version opens again without errors, even after months",
          "Save a copy of each child on the who-is-playing screen — Clarim is moving to a new address soon",
        ],
      },
      es: {
        titulo: "El progreso no se pierde",
        itens: [
          "El progreso guardado por una versión antigua vuelve a abrir sin error, incluso después de meses",
          "Guarda la copia de cada hijo en la pantalla de quién va a jugar — Clarim va a cambiar de dirección pronto",
        ],
      },
      fr: {
        titulo: "La progression ne se perd pas",
        itens: [
          "Une progression enregistrée par une ancienne version se rouvre sans erreur, même après des mois",
          "Enregistre la copie de chaque enfant sur l'écran des joueurs — Clarim va bientôt changer d'adresse",
        ],
      },
      de: {
        titulo: "Der Fortschritt geht nicht verloren",
        itens: [
          "Fortschritt aus einer alten Version öffnet wieder ohne Fehler, auch nach Monaten",
          "Speichere die Kopie jedes Kindes im Spieler-Bildschirm — Clarim bekommt bald eine neue Adresse",
        ],
      },
      it: {
        titulo: "I progressi non si perdono",
        itens: [
          "I progressi salvati da una versione vecchia si riaprono senza errore, anche dopo mesi",
          "Salva la copia di ogni figlio nella schermata di chi gioca — Clarim cambierà indirizzo a breve",
        ],
      },
    },
  },
  {
    v: "1.1.0", d: "2026-09-06",
    t: {
      pt: {
        titulo: "Ler, contar e lembrar",
        itens: [
          "O jogo do Brasil começa pelo estado onde a criança mora — é só dizer na ficha dela",
          "Mais dois: Corpo e Natureza (corpo, plantas, água) e O Brasil (regiões e estados)",
          "Dois jogos novos: Problema do Dia e Arma a Conta, com vai-um e empresta-um",
          "Jogo novo: Como Se Escreve — ç ou ss, s ou z, m antes de p e b",
          "Jogo novo: Leitura do Clarim — o app lê um texto e faz perguntas sobre ele",
          "Jogo novo: Começa Igual — ouça as palavras e ache a que começa com o mesmo som",
          "Jogo novo: Ditado do Clarim — ouça a palavra e escreva letra por letra",
          "Jogo novo: Família Silábica — ouça a palavra e ache a sílaba que a começa",
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
          "The Brazil game starts with the state where your child lives — just set it in their card",
          "Two more: Body and Nature (body, plants, water) and Brazil (regions and states)",
          "Two new games: Word Problem and Stack the Sum, with carrying and borrowing",
          "New game: How Do You Spell It — fill the gap in the word you hear",
          "New game: Clarim Reading — the app reads a text and asks questions about it",
          "New game: Same Start — hear the words and find the one starting with the same sound",
          "New game: Clarim Dictation — hear the word and spell it letter by letter",
          "New game: Syllable Family — hear the word and find the syllable it starts with",
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
          "El juego de Brasil empieza por el estado donde vive el niño — basta decirlo en su ficha",
          "Dos más: Cuerpo y Naturaleza (cuerpo, plantas, agua) y Brasil (regiones y estados)",
          "Dos juegos nuevos: Problema del Día y Arma la Cuenta, con llevadas y préstamos",
          "Juego nuevo: Cómo Se Escribe — completa el hueco de la palabra que escuchas",
          "Juego nuevo: Lectura de Clarim — la app lee un texto y hace preguntas sobre él",
          "Juego nuevo: Empieza Igual — escucha las palabras y encuentra la del mismo sonido inicial",
          "Juego nuevo: Dictado de Clarim — escucha la palabra y escríbela letra por letra",
          "Juego nuevo: Familia Silábica — escucha la palabra y encuentra la sílaba que la empieza",
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
          "Le jeu du Brésil commence par l'état où vit l'enfant — il suffit de le dire sur sa fiche",
          "Deux de plus : Corps et Nature (corps, plantes, eau) et Le Brésil (régions et états)",
          "Deux nouveaux jeux : Problème du Jour et Pose l'Opération, avec retenues",
          "Nouveau jeu : Comment Ça S'écrit — complète le trou du mot que tu entends",
          "Nouveau jeu : Lecture de Clarim — l'appli lit un texte et pose des questions dessus",
          "Nouveau jeu : Même Début — écoute les mots et trouve celui qui commence par le même son",
          "Nouveau jeu : Dictée de Clarim — écoute le mot et écris-le lettre par lettre",
          "Nouveau jeu : Famille de Syllabes — écoute le mot et trouve la syllabe qui le commence",
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
          "Das Brasilien-Spiel beginnt mit dem Bundesstaat, in dem das Kind wohnt",
          "Zwei weitere: Körper und Natur (Körper, Pflanzen, Wasser) und Brasilien (Regionen)",
          "Zwei neue Spiele: Sachaufgabe und Schriftlich Rechnen, mit Übertrag",
          "Neues Spiel: Wie Schreibt Man Das — füll die Lücke im gehörten Wort",
          "Neues Spiel: Clarim-Lesen — die App liest einen Text vor und stellt Fragen dazu",
          "Neues Spiel: Gleicher Anfang — hör die Wörter und finde das mit dem gleichen Anlaut",
          "Neues Spiel: Clarim-Diktat — hör das Wort und schreib es Buchstabe für Buchstabe",
          "Neues Spiel: Silbenfamilie — hör das Wort und finde die Silbe, mit der es beginnt",
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
          "Il gioco del Brasile inizia dallo stato in cui vive il bambino — basta dirlo nella scheda",
          "Altri due: Corpo e Natura (corpo, piante, acqua) e Il Brasile (regioni e stati)",
          "Due giochi nuovi: Problema del Giorno e Incolonna il Conto, con il riporto",
          "Gioco nuovo: Come Si Scrive — completa lo spazio della parola che ascolti",
          "Gioco nuovo: Lettura di Clarim — l'app legge un testo e fa domande su di esso",
          "Gioco nuovo: Stesso Inizio — ascolta le parole e trova quella con lo stesso suono iniziale",
          "Gioco nuovo: Dettato di Clarim — ascolta la parola e scrivila lettera per lettera",
          "Gioco nuovo: Famiglia di Sillabe — ascolta la parola e trova la sillaba che la inizia",
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
