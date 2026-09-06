import React, { useState, useEffect, useRef } from "react";
import { perguntaDoRegistro, semente as sementeDoTexto } from "./data/caderno.js";
import { DESENHOS } from "./data/desenhos.js";
import { DATA } from "./data/geografia.js";
import { ULTIMA_NOVIDADE } from "./data/novidades.js";
import { PALAVRAS } from "./data/palavras.js";
import { LANG_CATALOG, T } from "./data/textos.js";
import { estrelasDaPalavra, montarRodadaPalavras } from "./lib/alfabetizacao.js";
import { ACHIEVEMENTS, CATALOG, DIFFS, ECON, JOGOS_GRATIS, JOGOS_POR_VOZ, MEM_LEVELS, PRECO_GERAR, PZL_ICONE, PZL_JOGO, PZL_TEMAS, ROUTE, SEMANAS_GUARDADAS, SEMANA_VAZIA, TELAS_SEM_SOM, bandFor, custoDaFase, custoDaMemoria, custoDaPalavra, custoDoQuebra, deviceLang, diaISO, ehIOS, ehLeitor, escadaDe, jaInstalado, jogosGratisPara, loadLang, memEstrelas, precoDe, premioDe, semanaAtual, shuffle, tempoFmt, totalDe } from "./lib/catalogo.js";
import { anoPorIdade, faseDeEntrada } from "./lib/escola.js";
import { migrarMemBest } from "./lib/memoria.js";
import { estrelasDo, pecasDe, sortearBordas, totalDePecas } from "./lib/quebracabeca.js";
import { aRevisar, acertouNaRevisao, errouNaRevisao, guardarErro } from "./lib/revisao.js";
import { ANIMAIS, BIBLIA_EMOJI, VOCAB, alvoDe, buildRound, nomeDaTrilha, quizDe, todosEmojis } from "./lib/rodadas.js";
import { temSom } from "./lib/som.js";
import { TAMANHO_MAX, baixar, lerCopia, montarCopia, nomeDoArquivo } from "./lib/transferir.js";
import { perguntasParaTodos, vencedorDe } from "./lib/turma.js";
import { iniciarVozes, parar as pararVoz, temVoz } from "./lib/voz.js";
import { Btn, HAIRS, Marca, Modal, SHIRTS, SKINS, useSomDeFundo } from "./telas/base.jsx";
import { Coloring, Gallery, acharArte } from "./telas/desenho.jsx";
import { CadernoScreen, DevocionalScreen, EscreverScreen, FamilyScreen, PlayerCard } from "./telas/familia.jsx";
import { CapMap, EscolaScreen, Home, LangGame, MapScreen, Stages } from "./telas/hub.jsx";
import { Create, LangScreen, PinModal, Profiles, resumoSenha } from "./telas/inicio.jsx";
import { Game, Placar, PlacarDaRevisao, PlacarDeTempo, Result } from "./telas/jogo.jsx";
import { Awards, Shop } from "./telas/loja.jsx";
import { EscolherTurma, MemLevels, MemoryGame } from "./telas/memoria.jsx";
import { PalavraGame, PalavraLevels } from "./telas/palavra.jsx";
import { PuzzleGame, PuzzleLevels, cartazDe, coresDeFabrica } from "./telas/quebracabeca.jsx";


/* ============================================================
   LUMUS — Kids Game Hub
   "Iluminar a mente"
   © ElCamargo Soluções em TI LTDA — https://github.com/ElCamargo/KidsGameHub
   Licença MIT (ver LICENSE)
   ------------------------------------------------------------
   Este arquivo é o miolo, e só ele: o estado do jogador, a gravação no
   aparelho e qual tela aparece a cada momento. As telas moram em
   src/telas/, as tabelas do jogo em src/lib/catalogo.js e o sorteio das
   perguntas em src/lib/rodadas.js — ver a ADR 0005.

   Persistência via window.storage (ver src/lib/storage.js).
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
  /* papel: "filho" joga; "pai" só acompanha. idade e leitor decidem o que
     nasce aberto — ver jogosGratisPara. Perfis antigos não têm esses campos:
     tratamos como criança que já lê, que era o comportamento de antes. */
  const [player, setPlayer] = useState({
    name: "", papel: "filho", idade: null, leitor: null, pin: null,
    avatar: { skin: SKINS[1], hair: HAIRS[0], hairStyle: "short", cap: null, glasses: null, shirt: SHIRTS[0], shirtPattern: null },
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
  const [pzlBest, setPzlBest] = useState({}); // {tema:nivel: {stars, time}}
  const [stats, setStats] = useState({
    rounds: 0, perfect: 0, bestStreak: 0, streak: 0, earned: 0, correct: 0,
    noHintRounds: 0, geniusCleared: 0, continents: 1,
    flash: 0, perfectNoHint: 0, lastStagePerfect: 0, islandRight: 0, subRight: 0,
    contDone: 0, dayStreak: 1, lastDay: "", maxCoins: ECON.start,
      stars: 0, momentos: 0, registros: 0, duplas: 0, memRounds: 0, memPerfect: 0, mem3: 0, colorDone: 0, mathRight: 0, mathStage: 0, bichoRight: 0, engRight: 0, bibRight: 0, capRight: 0, pzlRounds: 0, pzl3: 0, palavrasFeitas: 0, pal3: 0,
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
  /* Quebra-cabeça: o tema escolhido no hub ("flags" ou "art") e a partida
     que está de pé. A imagem vai dentro da partida — bandeira sorteada ou
     desenho que a criança pintou —, e não é sorteada de novo a cada quadro. */
  const [pzlTema, setPzlTema] = useState("flags");
  const [pzl, setPzl] = useState(null);
  /* Monta a palavra: o recorde é por nível, e mede ERRO e não relógio —
     aprender a ler não é corrida. */
  const [palBest, setPalBest] = useState({});
  const [pal, setPal] = useState(null);
  /* A memória do erro: as perguntas que a criança errou, para voltarem em 1,
     3, 7 e 21 dias. É o que faz o conteúdo que já existe render o dobro. */
  const [revisao, setRevisao] = useState([]);
  const [gerados, setGerados] = useState([]);
  const [jogosAbertos, setJogosAbertos] = useState(JOGOS_GRATIS);
  const [secoes, setSecoes] = useState([]); // níveis e regiões já comprados
  /* O ano de escola deste perfil. Fica no save do filho, não no aparelho:
     dois irmãos no mesmo celular estão em anos diferentes. */
  const [ano, setAno] = useState(null);
  /* Se o Monta a Palavra foi aberto pela trilha do ano escolar. Ele não é
     trilha de fases, então não dá para marcar isso no sel como as outras. */
  const [porEscola, setPorEscola] = useState(false);
  const [destinoIdioma, setDestinoIdioma] = useState("quiz"); // quiz ou memória
  const [editando, setEditando] = useState(false);            // criando ou editando ficha

  /* ----- Momento em Família -----
     Isto não é do jogador, é do lar: o devocional é feito junto, uma vez por
     dia, por quem estiver ali. Por isso mora em "lumus:familia", fora dos
     saves de cada perfil, e a sequência é da família inteira.

     fe: null = ninguém escolheu ainda · true = a família quer · false = não. */
  const [momento, setMomento] = useState({ fe: null, ultimoDia: "", sequencia: 0, feitos: 0 });
  const momentoFeitoHoje = momento.ultimoDia === diaISO();
  /* {semana, restante} — quanto ainda há para presentear nesta semana. */
  const [presente, setPresente] = useState({ semana: semanaAtual(), restante: ECON.presenteSemanal });
  /* { "2026-08-30": {rodadas, certas, estrelas, desenhos, memorias, lumicoins} } */
  const [semanas, setSemanas] = useState({});
  /* Meu Caderno: o que a criança registrou, do mais antigo para o mais novo.
     Chaves curtas de propósito — isto cresce e mora no localStorage.
     { d: dia, t: texto, c: [carimbos], p: princípio, s: sobre o quê } */
  const [caderno, setCaderno] = useState([]);
  /* O dia em que a turma já foi premiada, para não pagar duas vezes. A chave
     no save continua duplaDia: renomear apagaria o dia de quem já jogou. */
  const [duplaDia, setDuplaDia] = useState("");
  /* Quem está jogando junto, fora o dono do perfil: de um a três, cada um
     {id, name, avatar}. id nulo = convidado, alguém que não tem perfil no
     aparelho e por isso não recebe lumicoins. Null = partida de um só. */
  const [turma, setTurma] = useState(null);
  const [escolhendoTurma, setEscolhendoTurma] = useState(false);

  /* ----- a voz do Lumus -----
     Quem ainda não lê nasce com ela ligada: é o que faz a pergunta existir
     para essa criança. Quem já lê pode ligar quando quiser.

     vozOk é se o APARELHO tem voz local instalada. Não tendo, nada aparece —
     nem o botão, nem o interruptor: prometer voz e não falar é pior. */
  const [voz, setVoz] = useState(false);
  const [vozOk, setVozOk] = useState(false);
  /* O som de fundo nasce ligado: baixo, e a um toque de ser desligado — na
     tela de escolher jogador e na ficha do jogador. Silencioso por padrão
     seria uma função que ninguém descobre.

     Mora no APARELHO, e não no perfil: é a resposta a uma pergunta da casa,
     "quanto barulho este app faz aqui?", e precisa valer já na primeira tela,
     antes de qualquer perfil ser aberto. */
  const [som, setSom] = useState(true);
  /* A última versão de novidades que o responsável já leu. No aparelho, e
     não no perfil: o app é o mesmo para a casa inteira. */
  const [novidadeVista, setNovidadeVista] = useState(ULTIMA_NOVIDADE);
  const temNovidade = novidadeVista !== ULTIMA_NOVIDADE;
  const marcarNovidadeLida = () => {
    setNovidadeVista(ULTIMA_NOVIDADE);
    try { window.storage.set("lumus:novidades", ULTIMA_NOVIDADE); } catch { }
  };
  const trocarSom = () => setSom(v => {
    try { window.storage.set("lumus:som", v ? "0" : "1"); } catch { }
    return !v;
  });
  /* A pergunta que está sendo respondida agora, e para onde voltar depois. */
  const [rascunho, setRascunho] = useState(null);

  /* Bônus dado pelo responsável e ainda não mostrado: {valor, de}. */
  const [presenteRecebido, setPresenteRecebido] = useState(null);

  /* Soma no balde da semana corrente. Os totais de sempre continuam em stats;
     isto aqui é só o "o que aconteceu desde domingo", que é o que o adulto
     pergunta quando pega o celular. */
  function registrarSemana(campos) {
    const chave = semanaAtual();
    setSemanas(atual => {
      const balde = { ...SEMANA_VAZIA, ...(atual[chave] || {}) };
      for (const [k, v] of Object.entries(campos)) balde[k] = (balde[k] || 0) + v;
      const proximo = { ...atual, [chave]: balde };
      // guarda só as últimas semanas: histórico longo não cabe e ninguém lê
      const chaves = Object.keys(proximo).sort();
      for (const velha of chaves.slice(0, Math.max(0, chaves.length - SEMANAS_GUARDADAS))) delete proximo[velha];
      return proximo;
    });
  }

  /* Feito hoje. A sequência quebra se pular um dia — não é castigo, é o que
     faz existir o "não vamos perder hoje", que é o ponto do hábito. */
  function marcarMomento() {
    if (momentoFeitoHoje) return;
    const hoje = diaISO(), ontem = diaISO(new Date(Date.now() - 864e5));
    setMomento(m => ({
      ...m, fe: true, ultimoDia: hoje, feitos: (m.feitos || 0) + 1,
      sequencia: m.ultimoDia === ontem ? (m.sequencia || 0) + 1 : 1,
    }));
    // Quem estava ali leva o crédito no próprio perfil. De propósito não há
    // lumicoin nenhuma aqui: fé neste app não se troca por moeda.
    if (activeId) setStats(x => ({ ...x, momentos: (x.momentos || 0) + 1 }));
    registrarSemana({ momentos: 1 });
  }

  const t = T[lang];

  /* O <html lang> mandava sempre "pt-BR". Leitor de tela lê inglês com sotaque
     português quando isso está errado, e o navegador oferece traduzir por cima. */
  useEffect(() => { try { document.documentElement.lang = lang; } catch { } }, [lang]);

  /* ----- perfis: vários jogadores no mesmo aparelho -----
     Índice leve em "lumus:profiles" (id, nome, avatar) para desenhar a
     tela de escolha sem abrir todos os saves. O progresso de cada um fica
     em "lumus:p:<id>", separado — irmão não mexe no do irmão. */
  const [profiles, setProfiles] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const blankSave = () => ({
    coins: ECON.start, lastRefill: Date.now(), unlocked: ["sa"], progress: {}, owned: [], seenAch: [],
    stars: {}, records: {}, memBest: {}, pzlBest: {}, palBest: {}, revisao: [], gallery: [], colorDay: { dia: "", moedas: 0 }, gerados: [], jogosAbertos: JOGOS_GRATIS, secoes: [], ano: null,
    presente: { semana: semanaAtual(), restante: ECON.presenteSemanal }, semanas: {}, presenteRecebido: null, caderno: [], duplaDia: "", voz: null,
    stats: {
      rounds: 0, perfect: 0, bestStreak: 0, streak: 0, earned: 0, correct: 0,
      noHintRounds: 0, geniusCleared: 0, continents: 1,
      flash: 0, perfectNoHint: 0, lastStagePerfect: 0, islandRight: 0, subRight: 0,
      contDone: 0, dayStreak: 1, lastDay: "", maxCoins: ECON.start,
      stars: 0, momentos: 0, registros: 0, duplas: 0, memRounds: 0, memPerfect: 0, mem3: 0, colorDone: 0, mathRight: 0, mathStage: 0, bichoRight: 0, engRight: 0, bibRight: 0, capRight: 0, pzlRounds: 0, pzl3: 0, palavrasFeitas: 0, pal3: 0,
    },
  });

  function applySave(d, perfil) {
    setPlayer({
      name: perfil.name, avatar: perfil.avatar,
      papel: perfil.papel || "filho",
      idade: perfil.idade ?? null,
      leitor: perfil.leitor ?? null,
      pin: perfil.pin || null,
    });
    // Cada jogador tem o seu idioma: um irmão pode jogar em inglês e o outro
    // em português no mesmo aparelho.
    if (d.lang && T[d.lang]) setLang(d.lang);
    else if (d.lang) loadLang(d.lang).then(ok => ok && setLang(d.lang));
    setCoins(d.coins); setLastRefill(d.lastRefill); setUnlocked(d.unlocked);
    const oldFmt = Object.keys(d.progress || {}).some(k => k.includes(":"));
    setProgress(oldFmt ? {} : (d.progress || {}));
    setOwned(d.owned || []); setStats(d.stats); setSeenAch(d.seenAch || []);
    setStars(d.stars || {}); setRecords(d.records || {}); setMemBest(migrarMemBest(d.memBest, DIFFS));
    setPzlBest(d.pzlBest || {});
    setPalBest(d.palBest || {});
    setRevisao(Array.isArray(d.revisao) ? d.revisao : []);
    setGallery(d.gallery || []); setColorDay(d.colorDay || { dia: "", moedas: 0 });
    setAno(d.ano || null);
    setGerados(d.gerados || []);
    setJogosAbertos([...new Set([...jogosGratisPara(ehLeitor(perfil)), ...(d.jogosAbertos || [])])]);
    setSecoes(d.secoes || []);
    // Semana nova, cofre cheio de novo. Sobra da semana passada não acumula:
    // é uma mesada para usar, não um saldo para juntar.
    const sem = semanaAtual();
    setPresente(d.presente?.semana === sem ? d.presente : { semana: sem, restante: ECON.presenteSemanal });
    setSemanas(d.semanas || {});
    setPresenteRecebido(d.presenteRecebido || null);
    setCaderno(d.caderno || []);
    setDuplaDia(d.duplaDia || "");
    // null = ninguém decidiu ainda; aí quem não lê ganha a voz de presente.
    setVoz(d.voz == null ? !ehLeitor(perfil) : !!d.voz);
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
      try { const sm = await window.storage.get("lumus:som"); setSom(sm?.value !== "0"); } catch { }
      /* Quem nunca viu nada é quem acabou de instalar: para ele não há
         novidade, há o app inteiro. Só marca como não lido quem já usava. */
      try {
        const nv = await window.storage.get("lumus:novidades");
        setNovidadeVista(nv?.value || (list.length ? "" : ULTIMA_NOVIDADE));
      } catch { setNovidadeVista(list.length ? "" : ULTIMA_NOVIDADE); }
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
      try {
        const f = await window.storage.get("lumus:familia");
        if (f?.value) setMomento(m => ({ ...m, ...JSON.parse(f.value) }));
      } catch { }
      setLoaded(true);
    })();
  }, []);

  /* O lar tem um arquivo só, fora dos perfis: irmão não reinicia a sequência. */
  useEffect(() => {
    if (!loaded) return;
    try { window.storage.set("lumus:familia", JSON.stringify(momento)); } catch { }
  }, [loaded, momento]);

  /* ----- memória ----- */
  function comecarMemoria(nivel, tema = memTema, comTurma = null) {
    // Jogando junto não se cobra: o que queremos é que eles joguem juntos.
    const custo = comTurma?.length ? 0 : custoDaMemoria(memBest, tema, nivel);
    if (coins < custo) { setToast(t.notEnough); return; }
    if (custo) setCoins(c => c - custo);
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
    setMem({ nivel, cartas, tema, duo: comTurma?.length ? comTurma : null });
    setScreen("mem");
  }

  /* Os outros jogadores recebem no save deles, direto — eles não estão com o
     app aberto para receber de outro jeito. Convidado não tem save, e tudo
     bem: ele veio jogar, não juntar moeda. */
  async function premiarOutros(outros, premio) {
    for (const o of outros || []) {
      if (!o?.id) continue;
      try {
        const d = await lerSave(o.id);
        if (premio) {
          d.coins = Math.min(ECON.cap, (d.coins || 0) + premio);
          d.stats = { ...d.stats, earned: (d.stats?.earned || 0) + premio,
            maxCoins: Math.max(d.stats?.maxCoins || 0, d.coins) };
        }
        d.stats = { ...d.stats, duplas: (d.stats?.duplas || 0) + 1 };
        window.storage.set(`lumus:p:${o.id}`, JSON.stringify(d));
      } catch { }
    }
  }

  /* Fim de uma partida em grupo. Não mexe em estrelas nem em recordes: é outro
     jogo, com outra graça, e o recorde de um não pode ser feito a oito mãos. */
  async function fimTurma({ seg, jogadas, pontos }) {
    const hoje = diaISO();
    const premio = duplaDia === hoje ? 0 : ECON.duplaReward;
    if (premio) {
      setCoins(c => Math.min(ECON.cap, c + premio));
      setDuplaDia(hoje);
      registrarSemana({ lumicoins: premio });
    }
    setStats(x => ({ ...x, earned: x.earned + premio, duplas: (x.duplas || 0) + 1 }));
    registrarSemana({ duplas: 1 });
    await premiarOutros(mem.duo, premio);

    setMem(m => ({ ...m, done: true, seg, jogadas, pontos, vencedor: vencedorDe(pontos), reward: premio }));
    setScreen("memResult");
  }

  function fimMemoria({ seg, jogadas, pontos }) {
    if (mem?.duo) { fimTurma({ seg, jogadas, pontos }); return; }
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
    const today = diaISO();
    const yest = diaISO(new Date(Date.now() - 864e5));
    setStats(x => ({
      ...x,
      earned: x.earned + reward,
      memRounds: x.memRounds + 1,
      mem3: x.mem3 + (st === 3 ? 1 : 0),
      memPerfect: x.memPerfect + (jogadas === mem.cartas.length / 2 ? 1 : 0),
      maxCoins: Math.max(x.maxCoins, Math.min(ECON.cap, coins + reward)),
      dayStreak: x.lastDay === today ? x.dayStreak : x.lastDay === yest ? x.dayStreak + 1 : 1,
      lastDay: today,
    }));
    registrarSemana({ memorias: 1, estrelas: st, lumicoins: reward });
    setMem(m => ({ ...m, done: true, seg, jogadas, st, reward, recorde }));
    setScreen("memResult");
  }

  /* ----- quebra-cabeça -----
     A imagem sai do que a criança já tem: bandeira dos continentes que ela
     abriu, ou desenho que ela mesma pintou. Nada baixado, nada de fora. */
  function fonteDoQuebra(tema, nivel) {
    if (tema === "flags") {
      const codes = [...new Set(unlocked.flatMap(c => Object.keys(DATA[c])))];
      if (!codes.length) return null;
      return { tipo: "flag", code: shuffle(codes)[0], prop: 4 / 3 };
    }
    if (tema === "art") {
      /* Primeiro o que ela pintou. Se ainda não pintou nada, um desenho
         colorido por nós — quebra-cabeça branco não tem como ser montado. */
      const salvo = gallery.length ? gallery[Math.floor(Math.random() * gallery.length)] : null;
      const art = salvo ? acharArte(salvo.id) : DESENHOS[Math.floor(Math.random() * DESENHOS.length)];
      if (!art) return null;
      const [, , vw, vh] = art.vb.split(" ").map(Number);
      return { tipo: "arte", art, fills: salvo ? salvo.fills : coresDeFabrica(art), prop: vw / vh };
    }
    return cartazDe(tema, nivel, lang);
  }

  function comecarQuebra(nivel, tema = pzlTema) {
    const custo = custoDoQuebra(pzlBest, tema, nivel);
    if (coins < custo) { setToast(t.notEnough); return; }
    const fonte = fonteDoQuebra(tema, nivel);
    if (!fonte) { setToast("🧩"); return; }
    if (custo) setCoins(c => c - custo);
    // A ordem da bandejinha é sorteada uma vez, aqui: se fosse sorteada na
    // tela, as peças dançariam de lugar a cada encaixe.
    // As bordas de encaixe também são sorteadas aqui: se fossem sorteadas na
    // tela, a peça mudaria de formato a cada quadro.
    setPzl({ nivel, tema, fonte, bordas: sortearBordas(nivel), ordem: shuffle(pecasDe(nivel).map(x => x.i)) });
    setScreen("pzl");
  }

  function fimQuebra(seg) {
    const st = estrelasDo(pzl.nivel, seg);
    const reward = st ? ECON.memReward[st] : 0;
    setCoins(c => Math.min(ECON.cap, c + reward));
    const chave = `${pzl.tema}:${pzl.nivel}`;
    const antes = pzlBest[chave];
    const recorde = !antes || seg < antes.time;
    setPzlBest(b => ({
      ...b,
      [chave]: { stars: Math.max(antes?.stars || 0, st), time: recorde ? seg : antes.time },
    }));
    const today = diaISO();
    const yest = diaISO(new Date(Date.now() - 864e5));
    setStats(x => ({
      ...x,
      earned: x.earned + reward,
      pzlRounds: (x.pzlRounds || 0) + 1,
      pzl3: (x.pzl3 || 0) + (st === 3 ? 1 : 0),
      maxCoins: Math.max(x.maxCoins, Math.min(ECON.cap, coins + reward)),
      dayStreak: x.lastDay === today ? x.dayStreak : x.lastDay === yest ? x.dayStreak + 1 : 1,
      lastDay: today,
    }));
    registrarSemana({ quebras: 1, estrelas: st, lumicoins: reward });
    setPzl(q => ({ ...q, done: true, seg, st, reward, recorde }));
    setScreen("pzlResult");
  }

  /* ----- revisar os erros -----
     De graça, sempre: cobrar da criança para ela consertar o que errou seria
     o avesso do que este app quer ser. */
  const paraRevisar = aRevisar(revisao, diaISO(), 10);

  function comecarRevisao() {
    if (!paraRevisar.length) return;
    setRound({
      cont: "revisao", diff: "medium", stage: 0, time: null, t0: Date.now(),
      qs: paraRevisar.map(x => x.q), chaves: paraRevisar.map(x => x.chave),
      i: 0, score: 0, right: 0, hintsUsed: 0, streak: 0, bestStreak: 0,
      flash: 0, islandRight: 0, subRight: 0, errou: [],
    });
    setScreen("game");
  }

  /* Fim da revisão: não mexe em fase, estrela nem recorde — é conserto, não
     conquista. O que ela mexe é no calendário de cada pergunta. */
  function fimRevisao(r) {
    const hoje = diaISO();
    let lista = revisao;
    let aprendidas = 0;
    r.chaves.forEach((chave, k) => {
      const errouEsta = (r.errou || []).some(q => q === r.qs[k]);
      if (errouEsta) { lista = errouNaRevisao(lista, chave, hoje); return; }
      const passo = acertouNaRevisao(lista, chave, hoje);
      lista = passo.lista;
      if (passo.aprendida) aprendidas++;
    });
    setRevisao(lista);
    const premio = r.right * ECON.revisaoReward;
    if (premio) {
      setCoins(c => Math.min(ECON.cap, c + premio));
      setStats(x => ({ ...x, earned: x.earned + premio, revisadas: (x.revisadas || 0) + r.right }));
      registrarSemana({ lumicoins: premio, revisadas: r.right });
    }
    setRound({ ...r, pct: Math.round((r.right / r.qs.length) * 100), st: 0, reward: premio, aprendidas });
    setScreen("revisaoResult");
  }

  /* ----- monta a palavra ----- */
  function comecarPalavras(nivel, gratis = false) {
    const custo = gratis ? 0 : custoDaPalavra(palBest, nivel);
    if (coins < custo) { setToast(t.notEnough); return; }
    const palavras = montarRodadaPalavras(PALAVRAS, nivel);
    if (!palavras.length) { setToast("🔡"); return; }
    if (custo) setCoins(c => c - custo);
    setPal({ nivel, palavras });
    setScreen("pal");
  }

  function fimPalavras(erros) {
    const quantas = pal.palavras.length;
    const st = estrelasDaPalavra(erros, quantas);
    const reward = st ? ECON.reward[st] : 0;
    setCoins(c => Math.min(ECON.cap, c + reward));
    const antes = palBest[pal.nivel];
    const recorde = !antes || erros < antes.erros;
    setPalBest(b => ({
      ...b,
      [pal.nivel]: { stars: Math.max(antes?.stars || 0, st), erros: recorde ? erros : antes.erros },
    }));
    const today = diaISO();
    const yest = diaISO(new Date(Date.now() - 864e5));
    setStats(x => ({
      ...x,
      earned: x.earned + reward,
      palavrasFeitas: (x.palavrasFeitas || 0) + quantas,
      pal3: (x.pal3 || 0) + (st === 3 ? 1 : 0),
      maxCoins: Math.max(x.maxCoins, Math.min(ECON.cap, coins + reward)),
      dayStreak: x.lastDay === today ? x.dayStreak : x.lastDay === yest ? x.dayStreak + 1 : 1,
      lastDay: today,
    }));
    registrarSemana({ palavras: quantas, estrelas: st, lumicoins: reward });
    setPal(x => ({ ...x, done: true, erros, st, reward, recorde }));
    setScreen("palResult");
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
    if (jogosAbertos.includes(id)) return;
    const anteriorOk = i === 0 || jogosAbertos.includes(area.games[i - 1].id);
    if (!anteriorOk) return;
    const preco = precoDe(jogo);
    if (coins < preco) { setToast(t.notEnough); return; }
    setCoins(c => c - preco);
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
    if (completo) registrarSemana({ desenhos: 1, lumicoins: premio });
    setGallery(g => [...g, { id: pintando.art.id, fills, data: hoje }].slice(-81));  // 9 páginas de 9
    if (completo) setStats(x => ({ ...x, colorDone: (x.colorDone || 0) + 1 }));
    setToast(premio ? `🎨 +${premio} 🪙` : "🎨 💾");
    setPintando(null);
    setScreen("gallery");
  }

  /* ----- Meu Caderno -----
     Registrar é o 4º R da AEP, e o único passo do app em que não existe
     resposta certa. Nada aqui é corrigido, pontuado ou comparado. */
  function salvarRegistro({ texto, carimbos, principio, sobre }) {
    const hoje = diaISO();
    const primeiroDoDia = !caderno.some(r => r.d === hoje);
    const premio = primeiroDoDia ? ECON.cadernoReward : 0;
    if (premio) {
      setCoins(c => Math.min(ECON.cap, c + premio));
      setStats(x => ({ ...x, earned: x.earned + premio }));
    }
    // 200 páginas: uma por dia dá mais de meio ano de caderno, e o
    // localStorage do aparelho mais simples continua dando conta.
    setCaderno(g => [...g, { d: hoje, t: texto || "", c: carimbos || [], p: principio, s: sobre || "" }].slice(-200));
    setStats(x => ({ ...x, registros: (x.registros || 0) + 1 }));
    registrarSemana({ registros: 1, lumicoins: premio });
    setToast(premio ? `📔 +${premio} 🪙` : "📔 💾");
    setRascunho(null);
    setScreen("caderno");
  }

  /* Sorteia a pergunta uma vez e guarda: se ficasse no render da tela, ela
     trocaria a cada tecla digitada. */
  function abrirCaderno({ principio, pergunta }, sobre, volta) {
    setRascunho({ principio, pergunta, sobre, volta: volta || screen });
    setScreen("escrever");
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
      applySave(r?.value ? JSON.parse(r.value) : blankSave(), pr);
    } catch { applySave(blankSave(), pr); }
    setActiveId(pr.id);
    // Responsável não joga: entra direto no acompanhamento dos filhos.
    if (pr.papel === "pai") { carregarFamilia(pr.id); setScreen("familia"); }
    else setScreen("home");
  }

  /* Presenteia um filho com parte da mesada da semana.
     Escrevo direto no save da criança porque ela não está logada — é o mesmo
     aparelho e o mesmo armazenamento, só que outro arquivo. Recarrego a lista
     depois para o número na tela ser o que está gravado, não um palpite. */
  /* Lê o save de outro perfil. window.storage.get lança quando a chave não
     existe, e um perfil recém-criado ainda não tem save nenhum — sem isto,
     escrever no save do irmão falha calado justamente na primeira vez. */
  async function lerSave(id) {
    try {
      const r = await window.storage.get(`lumus:p:${id}`);
      if (r?.value) return JSON.parse(r.value);
    } catch { }
    return blankSave();
  }

  async function presentear(pr, quanto) {
    const sem = semanaAtual();
    const cofre = presente.semana === sem ? presente : { semana: sem, restante: ECON.presenteSemanal };
    const valor = Math.min(quanto, cofre.restante);
    if (valor <= 0) return;
    try {
      const d = await lerSave(pr.id);
      d.coins = Math.min(ECON.cap, (d.coins || 0) + valor);
      // O presente entra no cofre, mas não conta como ganho no jogo: quem
      // ganhou lumicoins jogando é outra história, e as conquistas sabem.
      d.stats = { ...d.stats, maxCoins: Math.max(d.stats?.maxCoins || 0, d.coins) };
      // Um recado esperando a criança abrir o perfil dela. Se o responsável
      // der duas vezes antes disso, soma: ela vê um bônus só, com o total.
      d.presenteRecebido = {
        valor: (d.presenteRecebido?.valor || 0) + valor,
        de: player.name || t.roleParent,
      };
      window.storage.set(`lumus:p:${pr.id}`, JSON.stringify(d));
    } catch { return; }
    setPresente({ semana: sem, restante: cofre.restante - valor });
    setToast(`🎁 ${pr.name} +${valor} 🪙`);
    carregarFamilia(activeId);
  }

  /* ----- levar o progresso para outro aparelho -----
     Sem conta e sem servidor: um arquivo que o responsável guarda e abre no
     aparelho novo. Ver src/lib/transferir.js para o que vai e o que não vai
     dentro dele. */
  async function salvarCopia(pr) {
    const save = await lerSave(pr.id);
    const nome = nomeDoArquivo(pr.name);
    const ok = baixar(nome, JSON.stringify(montarCopia(pr, save), null, 1));
    setToast(ok ? `💾 ${nome}` : t.copyFail);
  }

  async function restaurarCopia(arquivo) {
    if (!arquivo) return;
    if (arquivo.size > TAMANHO_MAX) { setToast(t.restoreErr.formato); return; }
    let cru = "";
    try { cru = await arquivo.text(); } catch { setToast(t.restoreErr.formato); return; }

    const { erro, perfil, save } = lerCopia(cru);
    if (erro) { setToast(t.restoreErr[erro] || t.restoreErr.formato); return; }

    // Id novo sempre: restaurar nunca escreve por cima de quem já joga aqui.
    const id = `p${Date.now()}`;
    const completo = { ...blankSave(), ...save };
    try {
      window.storage.set(`lumus:p:${id}`, JSON.stringify(completo));
      const lista = [...profiles, { id, ...perfil }];
      window.storage.set("lumus:profiles", JSON.stringify(lista));
      setProfiles(lista);
    } catch { setToast(t.restoreErr.formato); return; }
    setToast(`✅ ${perfil.name}`);
  }

  /* Perfil com senha só é aberto, editado, zerado ou apagado depois dela.
     Se a tranca valesse só para entrar, a criança apagaria o perfil do pai. */
  const [pedirPin, setPedirPin] = useState(null);   // { pr, acao }
  const [pinErrado, setPinErrado] = useState(false);

  function comSenha(pr, acao) {
    if (pr.pin) { setPinErrado(false); setPedirPin({ pr, acao }); return; }
    acao(pr);
  }

  async function conferirPin(digitado) {
    const { pr, acao } = pedirPin;
    if (await resumoSenha(digitado, pr.id) !== pr.pin) { setPinErrado(true); return; }
    setPedirPin(null); setPinErrado(false);
    acao(pr);
  }

  /* Editar um jogador que já existe.
     A ficha (nome, avatar, papel, idade, leitura) mora em "lumus:profiles";
     o progresso mora em "lumus:p:<id>", outro arquivo. Editar a ficha não
     encosta no progresso — e mesmo assim carrego o save antes de abrir a
     tela, para que o "Pronto" grave de volta exatamente o que estava lá. */
  async function editProfile(pr) {
    try {
      const r = await window.storage.get(`lumus:p:${pr.id}`);
      applySave(r?.value ? JSON.parse(r.value) : blankSave(), pr);
    } catch { applySave(blankSave(), pr); }
    setActiveId(pr.id);
    setEditando(true);
    setScreen("create");
  }

  function newProfile() {
    setEditando(false);
    const d = blankSave();
    setActiveId(`p${Date.now()}`);
    applySave(d, {
      name: "", papel: "filho", idade: null, leitor: null, pin: null,
      avatar: { skin: SKINS[1], hair: HAIRS[0], hairStyle: "short", cap: null, glasses: null, shirt: SHIRTS[0], shirtPattern: null },
    });
    setScreen("create");
  }

  /* ----- acompanhamento dos filhos -----
     O responsável lê o save de cada criança do próprio aparelho. Nada sai
     daqui: é o mesmo localStorage, só que aberto por outra tela. */
  const [familia, setFamilia] = useState([]);
  async function carregarFamilia(eu = activeId) {
    const filhos = [];
    for (const pr of profiles) {
      if (pr.papel === "pai" || pr.id === eu) continue;
      try {
        const r = await window.storage.get(`lumus:p:${pr.id}`);
        filhos.push({ perfil: pr, save: r?.value ? JSON.parse(r.value) : null });
      } catch { filhos.push({ perfil: pr, save: null }); }
    }
    setFamilia(filhos);
  }

  function resetProfile(id) {
    const zerado = blankSave();
    try { window.storage.set(`lumus:p:${id}`, JSON.stringify(zerado)); } catch { }
    if (id === activeId) {
      applySave(zerado, player);
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
    const d = { lang, coins, lastRefill, unlocked, progress, owned, stats, seenAch, stars, records, memBest, pzlBest, palBest, revisao, gallery, colorDay, gerados, jogosAbertos, secoes, presente, semanas, presenteRecebido, caderno, duplaDia, voz, ano };
    try { window.storage.set(`lumus:p:${activeId}`, JSON.stringify(d)); } catch { }
    setProfiles(ps => {
      const has = ps.some(p => p.id === activeId);
      const next = has
        ? ps.map(p => p.id === activeId
            ? { ...p, name: player.name, avatar: player.avatar, papel: player.papel, idade: player.idade, leitor: player.leitor, pin: player.pin }
            : p)
        : [...ps, { id: activeId, name: player.name, avatar: player.avatar, papel: player.papel, idade: player.idade, leitor: player.leitor, pin: player.pin }];
      try { window.storage.set("lumus:profiles", JSON.stringify(next)); } catch { }
      return next;
    });
  }, [loaded, activeId, screen, lang, coins, unlocked, progress, owned, stats, player, seenAch, stars, records, memBest, pzlBest, palBest, revisao, gallery, colorDay, gerados, jogosAbertos, secoes, presente, semanas, presenteRecebido, caderno, duplaDia, voz, ano]);

  /* A lista de vozes chega vazia na primeira pergunta em quase todo
     navegador, e só depois o aparelho avisa que carregou. */
  useEffect(() => {
    const conferir = () => setVozOk(temVoz(lang));
    const parar = iniciarVozes(conferir);
    conferir();
    return parar;
  }, [lang]);

  /* Trocou de tela, a voz cala. Sem isto o versículo continua sendo lido
     enquanto a criança já está no meio de uma partida. */
  /* O relógio da pergunta, escrito lá de dentro do jogo e lido aqui pela
     música. Referência para não redesenhar o app a cada segundo. */
  const fracaoTempo = useRef(null);
  useSomDeFundo(som && !TELAS_SEM_SOM.has(screen), fracaoTempo);

  useEffect(() => { pararVoz(); }, [screen]);
  useEffect(() => pararVoz, []);

  /* A voz abre os jogos de resposta em figura para quem ainda não lê.
     Fica num efeito porque a lista de vozes do aparelho chega depois do
     perfil carregar — e porque só ACRESCENTA: desligar a voz não tira da
     mão da criança um jogo que ela já estava jogando. */
  useEffect(() => {
    if (!loaded || !activeId || !voz || !vozOk || ehLeitor(player)) return;
    setJogosAbertos(js => js.length && JOGOS_POR_VOZ.every(id => js.includes(id))
      ? js : [...new Set([...js, ...JOGOS_POR_VOZ])]);
  }, [loaded, activeId, voz, vozOk, player.leitor, player.idade]);

  /* ----- relógio + refill ----- */
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => { if (toast) { const x = setTimeout(() => setToast(null), 2200); return () => clearTimeout(x); } }, [toast]);

  /* ----- botão voltar do aparelho -----
     Sem isto, o "voltar" do Android fecha o app no meio da partida: como o
     jogo é uma tela só, o navegador não tem para onde voltar e sai.

     Guardo o caminho que a criança percorreu e devolvo um passo por vez. A
     casa é o chão: chegando na home, "voltar" não faz mais nada em vez de
     fechar. E a cada volta reponho uma entrada no histórico, senão o toque
     seguinte cai fora do app de novo. */
  const trilha = useRef(["home"]);
  const voltandoRef = useRef(false);

  useEffect(() => {
    if (screen === "boot") return;
    if (voltandoRef.current) { voltandoRef.current = false; return; }
    const t = trilha.current;
    if (t[t.length - 1] !== screen) t.push(screen);
    if (t.length > 50) t.shift();
  }, [screen]);

  useEffect(() => {
    try { window.history.pushState({ lumus: true }, ""); } catch { }
    const aoVoltar = () => {
      try { window.history.pushState({ lumus: true }, ""); } catch { }
      const t = trilha.current;
      if (t.length > 1) {
        t.pop();
        voltandoRef.current = true;
        setScreen(t[t.length - 1]);
      } else {
        // já está na primeira tela: fica onde está em vez de fechar
        voltandoRef.current = true;
        setScreen(t[0] || "home");
      }
    };
    window.addEventListener("popstate", aoVoltar);
    return () => window.removeEventListener("popstate", aoVoltar);
  }, []);

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

  /* Fase já vencida com 3 estrelas é treino livre: cobrar de novo por algo
     que a criança já dominou só a empurra para longe de repetir. As outras
     continuam custando — é o que dá sentido às lumicoins. */
  function startRound(comTurma = null) {
    /* Em grupo é de graça, como a memória, e pelo mesmo motivo. Pela trilha
       do ano escolar também: dever de escola não se paga com lumicoin. */
    const custo = comTurma?.length || bandFor(sel.cont, sel.stage) === sel.escola
      ? 0 : custoDaFase(stars, sel.cont, sel.stage);
    if (coins < custo) { setToast(t.notEnough); return; }
    if (custo) setCoins(c => c - custo);
    const quiz = quizDe(sel.cont);
    const r = quiz ? quiz.montar(sel.stage, t, lang, sel.cont) : buildRound(sel.cont, sel.stage, lang);
    const quantos = (comTurma?.length || 0) + 1;
    setRound(comTurma?.length
      ? { ...r, qs: perguntasParaTodos(r.qs, quantos), duo: comTurma, pontos: Array(quantos).fill(0) }
      : r);
    setScreen("game");
  }

  /* Uma rodada em grupo não mexe em fase, estrela nem recorde: as perguntas
     foram divididas, e um pedaço de rodada não vence fase nenhuma. */
  async function fimDuelo(r) {
    const hoje = diaISO();
    const premio = duplaDia === hoje ? 0 : ECON.duplaReward;
    if (premio) {
      setCoins(c => Math.min(ECON.cap, c + premio));
      setDuplaDia(hoje);
      registrarSemana({ lumicoins: premio });
    }
    setStats(x => ({ ...x, earned: x.earned + premio, duplas: (x.duplas || 0) + 1 }));
    registrarSemana({ duplas: 1 });
    await premiarOutros(r.duo, premio);
    setRound({ ...r, vencedor: vencedorDe(r.pontos), reward: premio });
    setScreen("result");
  }

  function finishRound(r) {
    if (r.duo) { fimDuelo(r); return; }
    if (r.cont === "revisao") { fimRevisao(r); return; }
    /* O que ela errou entra na fila de revisão. É aqui, e não na tela do
       jogo, porque só o save do perfil pode guardar. */
    if (r.errou?.length) {
      let lista = revisao;
      for (const q of r.errou) lista = guardarErro(lista, r.cont, q, diaISO());
      setRevisao(lista);
    }
    const pct = Math.round((r.right / r.qs.length) * 100);
    // As estrelas contam ERROS, não porcentagem: numa rodada de 5 perguntas
    // a régua de porcentagem pula de 80% para 100% e as 2 estrelas somem.
    const erros = r.qs.length - r.right;
    const limite1 = r.qs.length >= 10 ? 3 : 2;   // erros ainda aceitos para 1 estrela
    const st = erros === 0 ? 3 : erros === 1 ? 2 : erros <= limite1 ? 1 : 0;
    let reward = ECON.reward[st] || 0;
    if (r.hintsUsed === 0 && st > 0) reward += 5;
    setCoins(c => Math.min(ECON.cap, c + reward));
    const today = diaISO();
    const yest = diaISO(new Date(Date.now() - 864e5));
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
    registrarSemana({ rodadas: 1, certas: r.right, estrelas: st, lumicoins: reward });
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
    /* Quem navega por teclado precisa ver onde está. :focus-visible não
       aparece para quem usa o dedo, então não atrapalha a criança. */
    :focus-visible{outline:3px solid #F9A826;outline-offset:3px;border-radius:6px}
    /* Sem isto, dois toques rápidos numa carta dão zoom em vez de virar. */
    button,.chunky{touch-action:manipulation}
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

        {/* O bônus de mérito. Aparece assim que a criança entra no perfil,
            antes de qualquer outra coisa, e some depois de lida. */}
        {presenteRecebido && !["create", "boot", "profiles"].includes(screen) && (
          <Modal onClose={() => setPresenteRecebido(null)}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 56 }}>🎁</div>
              <div className="display" style={{ fontSize: 24, color: "#1B2A6B", marginTop: 4 }}>{t.bonusTitle}</div>
              <div style={{ color: "#3B4468", fontWeight: 800, fontSize: 15, lineHeight: 1.7, margin: "10px 0" }}>
                {t.bonusFrom.replace("{quem}", presenteRecebido.de)}
              </div>
              <div className="display" style={{
                display: "inline-block", background: "#F9A826", color: "#5A3B00",
                borderRadius: 999, padding: "8px 22px", fontSize: 26, margin: "2px 0 10px",
              }}>
                🪙 +{presenteRecebido.valor}
              </div>
              <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
                {t.bonusCheers}
              </div>
              <Btn full color="#00B894" onClick={() => setPresenteRecebido(null)}>🎉 {t.bonusOk}</Btn>
            </div>
          </Modal>
        )}

        {pedirPin && (
          <PinModal t={t} erro={pinErrado} titulo={pedirPin.pr.name || t.roleParent}
            onOk={conferirPin} onCancelar={() => { setPedirPin(null); setPinErrado(false); }} />
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

        {screen === "create" && <Create {...{ t, lang, onLang: () => setScreen("lang"), player, setPlayer,
          editando, perfilId: activeId,
          onDone: () => {
            // Perfil novo: troca a base do que nasce aberto, agora que se sabe
            // se a criança lê. Perfil que já jogou: só ACRESCENTA. Editar a
            // ficha de quem já está no meio do caminho não pode tirar da mão
            // dela um jogo que ela já estava jogando.
            const gratis = jogosGratisPara(ehLeitor(player));
            setJogosAbertos(js => stats.rounds === 0 && !editando
              ? [...new Set([...gratis, ...js.filter(id => !JOGOS_GRATIS.includes(id))])]
              : [...new Set([...gratis, ...js])]);
            setEditando(false);
            if (player.papel === "pai") { carregarFamilia(activeId); setScreen("familia"); }
            else setScreen("home");
          } }} />}
        {screen === "profiles" && <Profiles {...{ t, profiles, openProfile, newProfile, editProfile, deleteProfile, resetProfile, setScreen, comSenha,
          som, trocarSom, somOk: temSom(),
          salvarCopia, restaurarCopia }} />}
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
          icone: alvoDe(memTema) ? "🃏" : { flags: "🧠", animals: "🐾", arts: "🧩", bible: "🕊️" }[memTema],
          turma, pedirTurma: () => setEscolhendoTurma(true), sairDaTurma: () => setTurma(null) }} />}
        {escolhendoTurma && (
          <EscolherTurma {...{ t, perfis: profiles.filter(pr => pr.id !== activeId),
            escolher: js => { setTurma(js.length ? js : null); setEscolhendoTurma(false); },
            fechar: () => setEscolhendoTurma(false) }} />
        )}
        {screen === "mem" && mem && <MemoryGame {...{ t, lang, nivel: mem.nivel, cartas: mem.cartas,
          duo: mem.duo, eu: { name: player.name, avatar: player.avatar },
          onFinish: fimMemoria, onQuit: () => setScreen("memLevels") }} />}
        {screen === "memResult" && mem?.duo && (
          <Placar {...{ t, jogadores: [{ name: player.name, avatar: player.avatar }, ...mem.duo],
            pontos: mem.pontos, vencedor: mem.vencedor, reward: mem.reward,
            rodape: `⏱️ ${tempoFmt(mem.seg)} · ${t.moves}: ${mem.jogadas}`,
            aoRepetir: () => comecarMemoria(mem.nivel, mem.tema, mem.duo),
            aoSair: () => setScreen("memLevels") }} />
        )}
        {screen === "memResult" && mem && !mem.duo && (
          <PlacarDeTempo {...{ t, st: mem.st, reward: mem.reward, recorde: mem.recorde,
            linha: `⏱️ ${tempoFmt(mem.seg)} · ${t.moves}: ${mem.jogadas}`,
            aoRepetir: () => comecarMemoria(mem.nivel, mem.tema),
            repetirBloqueado: coins < custoDaMemoria(memBest, mem.tema, mem.nivel),
            aoSair: () => setScreen("memLevels") }} />
        )}
        {screen === "palLevels" && <PalavraLevels {...{ t, coins, palBest, setScreen, comecar: comecarPalavras, temSecao, comprarSecao, escola: porEscola }} />}
        {screen === "pal" && pal && <PalavraGame {...{ t, lang, palavras: pal.palavras, voz: voz && vozOk,
          onFinish: fimPalavras, onQuit: () => setScreen("palLevels") }} />}
        {screen === "palResult" && pal && (
          <PlacarDeTempo {...{ t, st: pal.st, reward: pal.reward, recorde: pal.recorde,
            /* Erro conta com o ❌ e não com palavra: "Jogadas" aqui seria mentira,
               e sem erro nenhum a linha nem menciona — não se cobra o acerto. */
            linha: `${t.words2}: ${pal.palavras.length}${pal.erros ? ` · ❌ ${pal.erros}` : ""}`,
            aoRepetir: () => comecarPalavras(pal.nivel),
            repetirBloqueado: coins < custoDaPalavra(palBest, pal.nivel),
            aoSair: () => setScreen("palLevels") }} />
        )}
        {screen === "pzlLevels" && <PuzzleLevels {...{ t, coins, pzlBest, setScreen, comecar: comecarQuebra, tema: pzlTema,
          titulo: t.games[PZL_JOGO[pzlTema]], icone: PZL_ICONE[pzlTema], temSecao, comprarSecao }} />}
        {screen === "pzl" && pzl && <PuzzleGame {...{ t, nivel: pzl.nivel, fonte: pzl.fonte, ordem: pzl.ordem, bordas: pzl.bordas,
          onFinish: fimQuebra, onQuit: () => setScreen("pzlLevels") }} />}
        {screen === "pzlResult" && pzl && (
          <PlacarDeTempo {...{ t, st: pzl.st, reward: pzl.reward, recorde: pzl.recorde,
            linha: `⏱️ ${tempoFmt(pzl.seg)} · ${t.pieces}: ${totalDePecas(pzl.nivel)}`,
            aoRepetir: () => comecarQuebra(pzl.nivel, pzl.tema),
            repetirBloqueado: coins < custoDoQuebra(pzlBest, pzl.tema, pzl.nivel),
            aoSair: () => setScreen("pzlLevels") }} />
        )}
        {screen === "familia" && <FamilyScreen {...{ t, lang, familia, setScreen, presente, presentear, momento, setMomento, momentoFeitoHoje, temNovidade, marcarNovidadeLida }} />}
        {screen === "caderno" && <CadernoScreen {...{ t, lang, caderno, setScreen, voltar: voltaPara,
          novo: () => { abrirCaderno(perguntaDoRegistro(sementeDoTexto(diaISO())), ""); } }} />}
        {screen === "escrever" && rascunho && <EscreverScreen {...{ t, lang, rascunho,
          salvar: salvarRegistro, cancelar: () => { setRascunho(null); setScreen(rascunho.volta || "caderno"); } }} />}
        {screen === "devocional" && <DevocionalScreen {...{ t, lang, momento, marcarMomento, feitoHoje: momentoFeitoHoje, setScreen,
          voz: voz && vozOk,
          voltar: player.papel === "pai" ? "familia" : "home" }} />}
        {screen === "player" && <PlayerCard {...{ t, lang, player, coins, stats, progress, unlocked, seenAch, setScreen, abrir, podeResgatar, resgatar,
          voz, setVoz, vozOk, som, trocarSom, somOk: temSom() }} />}
        {screen === "lang" && <LangScreen {...{ t, lang, pickLang, setScreen, back: activeId ? "home" : "profiles" }} />}
        {screen === "home" && <Home {...{ t, lang, player, coins, nextRefill, setScreen, profiles, abrir, podeResgatar, resgatar, jogosAbertos, abrirJogo,
          quantasRevisar: paraRevisar.length, revisar: comecarRevisao, ano,
          momento, setMomento, momentoFeitoHoje, voz: voz && vozOk,
          onPickGame: (g) => {
            const memTemas = { memory: "flags", animals: "animals", artMem: "arts", bibleMem: "bible" };
            const quizzes = { count: "math", animalQuiz: "bichos", colors: "arts", bible: "bible",
              curiosidades: "curiosidades", sciAnimals: "ciencias", inicial: "inicial", rimas: "rimas",
              silabas: "silabas",
              tabuada: "tabuada", horas: "horas", dinheiro: "dinheiro" };
            if (g === "capitals") { setScreen("capMap"); return; }
            if (g === "words" || g === "wordMem") { setDestinoIdioma(g === "wordMem" ? "mem" : "quiz"); setScreen("langGame"); return; }
            if (g === "color") { if (!gerados.length) gerarMais(false); setScreen("gallery"); return; }
            if (g === "montar") { setPorEscola(false); setScreen("palLevels"); return; }
            if (PZL_TEMAS[g]) { setPzlTema(PZL_TEMAS[g]); setScreen("pzlLevels"); return; }
            if (memTemas[g]) { setMemTema(memTemas[g]); setScreen("memLevels"); return; }
            if (quizzes[g]) {
              const k = quizzes[g];
              setSel({ cont: k, stage: Math.min(totalDe(k), (progress[k] || 0) + 1) });
              setScreen("stages"); return;
            }
            setScreen("map"); if (!stats.rounds) setTutorial(true);
          } }} />}
        {screen === "escola" && <EscolaScreen {...{ t, progress, setScreen,
          ano: ano || anoPorIdade(player.idade),
          escolherAno: setAno,
          /* Entra pela faixa que o ano cobra, mas continua de onde a criança
             parou se ela já estiver dentro dela. O sel.escola é o que faz a
             faixa abrir e a fase não custar — e some sozinho quando qualquer
             outra tela monta um sel novo. */
          abrirItem: (item) => {
            if (item.tela) { setPorEscola(true); setScreen(item.tela); return; }
            const stage = faseDeEntrada(escadaDe(item.cont).plan, item.banda, progress[item.cont] || 0);
            setSel({ cont: item.cont, stage, escola: item.banda });
            setScreen("stages");
          } }} />}
        {screen === "map" && <MapScreen {...{ t, lang, player, coins, nextRefill, unlocked, progress, unlockContinent, setSel, setScreen, stats, tutorial, setTutorial }} />}
        {screen === "stages" && <Stages {...{ t, lang, sel, setSel, progress, coins, startRound, setScreen, player, stars, records, temSecao, comprarSecao,
          turma, pedirTurma: () => setEscolhendoTurma(true), sairDaTurma: () => setTurma(null) }} />}
        {screen === "game" && round && <Game {...{ t, lang, round, setRound, coins, setCoins, finishRound, player, setScreen,
          voz: voz && vozOk, fracaoTempo,
          onQuit: () => { setRound(null); setScreen("stages"); } }} />}
        {screen === "revisaoResult" && round && (
          <PlacarDaRevisao {...{ t, round, aoSair: () => setScreen("home") }} />
        )}
        {screen === "result" && round?.duo && (
          <Placar {...{ t, jogadores: [{ name: player.name, avatar: player.avatar }, ...round.duo],
            pontos: round.pontos, vencedor: round.vencedor, reward: round.reward,
            rodape: `${nomeDaTrilha(round.cont, t)} · ${t.stage} ${round.stage}`,
            aoRepetir: () => startRound(round.duo),
            aoSair: () => setScreen("stages") }} />
        )}
        {screen === "result" && round && !round.duo && <Result {...{ t, round, player, setScreen, setSel, sel, startRound, coins,
          escrever: () => abrirCaderno(perguntaDoRegistro(sementeDoTexto(round.cont) + round.stage),
            `${nomeDaTrilha(round.cont, t)} · ${t.stage} ${round.stage}`, "result") }} />}
        {screen === "shop" && <Shop {...{ t, lang, coins, setCoins, owned, setOwned, player, setPlayer, setScreen, voltaPara }} />}
        {screen === "awards" && <Awards {...{ t, lang, stats, seenAch, setScreen, player, voltaPara }} />}
      </div>
    </div>
  );
}


export default function App() {
  return <Guarda><AppInterno /></Guarda>;
}
