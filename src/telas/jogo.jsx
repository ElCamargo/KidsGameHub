/**
 * KidsGameHub — a rodada de perguntas e o placar
 * ElCamargo Soluções em TI LTDA
 *
 * Saiu do App.jsx sem uma linha de lógica mudada — só recortada e colada
 * (ver docs/decisoes/0005-as-telas-em-arquivos.md).
 */

import React, { useState, useEffect, useRef } from "react";
import { ECON, ISLANDS, flagUrl, shuffle, tempoFmt, totalDe } from "../lib/catalogo.js";
import { explicacaoDe, quizDe } from "../lib/rodadas.js";
import { falar, juntar, textoDaPergunta } from "../lib/voz.js";
import { Btn, Coin, Modal, Rosto, elogio, useFala } from "./base.jsx";


/* ---------- Jogo ---------- */
/* ---------- Folga de leitura ----------
   O cronômetro existe para medir o que a criança SABE, não a velocidade com
   que ela lê. Uma bandeira tem quatro nomes curtos; uma pergunta da Bíblia
   pode ter quatro frases inteiras. Sem esta folga, a fase 100 dava 4 segundos
   para ler quase 200 caracteres — nem adulto faz isso.

   O tempo base já cobre uma pergunta curta (50 caracteres com as quatro
   opções). Cada 10 caracteres além disso valem mais um segundo, até 25.
   Perguntas de bandeira quase não mudam: quatro nomes de país cabem na base. */
const LEITURA_BASE = 50;

const LEITURA_POR_SEG = 10;

const FOLGA_MAX = 25;


function folgaLeitura(q) {
  const texto = ((q.texto || "") + (q.ask || q.prompt || "") + q.options.join("")).length;
  return Math.min(FOLGA_MAX, Math.max(0, Math.round((texto - LEITURA_BASE) / LEITURA_POR_SEG)));
}

const tempoDaPergunta = (round, q) => round.time == null ? null : round.time + folgaLeitura(q);


export function Game({ t, lang, round, setRound, coins, setCoins, finishRound, player, setScreen, onQuit, voz, fracaoTempo }) {
  const q = round.qs[round.i];
  /* Em grupo as perguntas giram: a primeira é de quem convidou, e daí em
     diante passa para o lado. Entre uma e outra entra a tela de passar o
     celular — sem ela o jogador seguinte vê a resposta do anterior e a
     rodada acaba antes de começar. */
  const duo = round.duo;
  const jogadores = duo ? [{ name: player.name, avatar: player.avatar }, ...duo] : null;
  const vez = duo ? round.i % jogadores.length : 0;
  const daVez = jogadores?.[vez] || null;
  const [passando, setPassando] = useState(false);
  const tempoQ = tempoDaPergunta(round, q);
  const [left, setLeft] = useState(tempoQ);
  const [removed, setRemoved] = useState([]);
  const [picked, setPicked] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [imgOk, setImgOk] = useState(true);
  const [sair, setSair] = useState(false);
  /* Guarda a rodada seguinte enquanto a criança lê o porquê do erro. */
  const [explicando, setExplicando] = useState(null);
  const lockRef = useRef(false);

  useEffect(() => {
    setLeft(tempoDaPergunta(round, round.qs[round.i])); setRemoved([]); setPicked(null); setHintLevel(0); setImgOk(true);
    setExplicando(null);
    lockRef.current = false;
  }, [round.i]);

  /* Lê a pergunta em voz alta. Quem não lê depende disto para jogar; por isso
     é automático, e não um botão que a criança de quatro anos teria que
     descobrir sozinha. Em duelo fica quieto: o outro jogador ouviria. */
  const fala = useFala(lang);
  const lerPergunta = () => fala.dizer(textoDaPergunta(round.qs[round.i], t));
  useEffect(() => {
    if (!voz || duo || passando) return;
    const x = setTimeout(lerPergunta, 260);   // deixa a tela desenhar primeiro
    return () => { clearTimeout(x); fala.calar(); };
  }, [voz, duo, passando, round.i]);

  /* A música do app acompanha o relógio desta pergunta: quanto menos tempo
     sobra, mais miúdo o passo. Escrevemos numa referência que veio de cima,
     porque a nota seguinte é agendada fora do React e precisa do valor de
     agora — e porque quem toca é o app, não esta tela. */
  if (fracaoTempo) fracaoTempo.current = tempoQ == null || left == null ? null : left / tempoQ;
  useEffect(() => () => { if (fracaoTempo) fracaoTempo.current = null; }, [fracaoTempo]);

  /* O porquê do erro também é lido: é a parte que mais vale ouvir. */
  useEffect(() => {
    if (voz && explicando) falar(juntar([explicando.certa, explicando.porque]), { lang });
  }, [voz, explicando, lang]);

  useEffect(() => {
    if (passando) return;                              // relógio parado na troca de mãos
    if (round.time == null || picked !== null) return; // Fácil não tem cronômetro
    if (left <= 0) { answer(null); return; }
    const x = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(x);
  }, [left, picked, round.time, passando]);

  function answer(opt) {
    if (lockRef.current) return;
    lockRef.current = true;
    setPicked(opt ?? "__timeout__");
    const ok = opt === q.answer;
    setTimeout(() => {
      const streak = ok ? round.streak + 1 : 0;
      const fast = ok && tempoQ != null && left >= tempoQ - 3;   // respondeu em ~3s
      const next = {
        ...round,
        ...(duo ? { pontos: round.pontos.map((v, k) => v + (ok && k === vez ? 1 : 0)) } : null),
        i: round.i + 1,
        right: round.right + (ok ? 1 : 0),
        // A pergunta errada viaja junto com a rodada até o fim, onde o save
        // a guarda para voltar daqui a um dia.
        errou: ok ? (round.errou || []) : [...(round.errou || []), q],
        flash: round.flash + (fast ? 1 : 0),
        islandRight: round.islandRight + (ok && q.flag && !q.sub && ISLANDS.has(q.flag.toUpperCase()) ? 1 : 0),
        subRight: round.subRight + (ok && q.sub ? 1 : 0),
        score: round.score + (ok ? 100 + (tempoQ == null ? 30 : left * 10) : 0),
        streak,
        bestStreak: Math.max(round.bestStreak || 0, streak),
      };
      // Errou: a rodada para e explica. Acertar não interrompe — quem já
      // sabe não precisa de aula, e o ritmo é metade da graça do jogo.
      if (!ok) { setExplicando({ next, certa: q.answer, porque: explicacaoDe(q) }); return; }
      if (next.i >= round.qs.length) finishRound(next);
      else { setRound(next); if (duo) setPassando(true); }
    }, 900);
  }

  function useHint(n) {
    const cost = n === 1 ? ECON.hint1 : n === 2 ? ECON.hint2 : ECON.hint3;
    if (duo || coins < cost || hintLevel >= n || picked) return;
    setCoins(c => c - cost);
    const wrongs = shuffle(q.options.filter(o => o !== q.answer && !removed.includes(o)));
    setRemoved(r => [...r, ...wrongs.slice(0, n - hintLevel)]);
    setHintLevel(n);
    setRound(r => ({ ...r, hintsUsed: r.hintsUsed + 1 }));
  }

  const pct = tempoQ == null ? 100 : (left / tempoQ) * 100;
  const barColor = pct > 55 ? "#00B894" : pct > 25 ? "#F9A826" : "#E74C3C";

  function seguir() {
    const { next } = explicando;
    setExplicando(null);
    if (next.i >= round.qs.length) finishRound(next);
    else { setRound(next); if (duo) setPassando(true); }
  }

  if (passando) return (
    <div className="narrow" style={{ paddingTop: 40 }}>
      <div className="card pop" style={{ padding: 26, textAlign: "center" }}>
        <div style={{ fontSize: 46 }}>🤝</div>
        <div style={{ display: "grid", placeItems: "center", margin: "10px 0 6px" }}>
          <Rosto p={daVez} size={72} />
        </div>
        <div className="display" style={{ fontSize: 22, color: "#1B2A6B", lineHeight: 1.2 }}>
          {t.duoPass.replace("{quem}", daVez?.name || "—")}
        </div>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14, margin: "14px 0" }}>
          {jogadores.map((j, i) => (
            <div key={i} style={{ textAlign: "center", opacity: vez === i ? 1 : .5 }}>
              <div className="display" style={{ fontSize: 24, color: "#1B2A6B" }}>{round.pontos[i]}</div>
              <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10 }}>{j?.name}</div>
            </div>
          ))}
        </div>
        <Btn full color="#00B894" onClick={() => setPassando(false)}>{t.duoReady}</Btn>
      </div>
    </div>
  );

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
        {voz && !duo && (
          <button onClick={() => fala.alternar(textoDaPergunta(round.qs[round.i], t))}
            aria-label={fala.lendo ? t.voiceStop : t.voiceRepeat} aria-pressed={fala.lendo} className="chunky"
            style={{ background: "rgba(255,255,255,.18)", padding: "6px 10px", fontSize: 15 }}>
            {fala.lendo ? "⏹️" : "🔊"}
          </button>
        )}
        {duo ? (
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {round.pontos.map((v, i) => (
              <div key={i} style={{ background: vez === i ? "#F9A826" : "rgba(255,255,255,.18)",
                color: vez === i ? "#5A3B00" : "#fff", borderRadius: 999, padding: "5px 9px", fontWeight: 900, fontSize: 14 }}>
                {v}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "5px 10px", fontWeight: 900, fontSize: 14 }}><Coin n={coins} /></div>
        )}
      </div>

      {/* De quem é a vez, ao lado da pergunta: a criança confere sem perguntar. */}
      {duo && (
        <div className="card" style={{ padding: "6px 10px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <Rosto p={daVez} size={24} />
          <div style={{ color: "#1B2A6B", fontWeight: 900, fontSize: 13, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {daVez?.name}
          </div>
          <div style={{ color: "#F9A826", fontWeight: 900, fontSize: 10 }}>{t.yourTurn}</div>
        </div>
      )}

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
          {q.kind === "leitura" ? "" : q.kind === "math" ? t.howMuch : q.kind === "emojiAsk" ? q.ask : q.ask ? q.ask : ["emojiPick", "texto"].includes(q.kind) ? q.prompt : q.sub ? t.whichRegion : t.whichCountry}
        </div>
        {q.kind === "ortografia" ? (
          /* A figura diz QUAL palavra é — "ca__a" pode virar casa e pode
             virar caça, e sem ela a pergunta teria duas respostas. */
          <div className={picked && picked !== q.answer ? "shake" : ""}>
            <div style={{ fontSize: 44, lineHeight: 1 }}>{q.figura}</div>
            <div className="display" style={{ fontSize: 34, color: "#1B2A6B", marginTop: 10, letterSpacing: 1 }}>
              {q.antes}<span style={{ color: "#E84393" }}>__</span>{q.depois}
            </div>
          </div>
        ) : q.kind === "leitura" ? (
          /* Texto alinhado à esquerda e com entrelinha larga: é assim que se
             lê. Centralizado, como o resto do app, a criança perde a linha. */
          <div className={picked && picked !== q.answer ? "shake" : ""}>
            <div style={{ fontSize: 38, lineHeight: 1 }}>{q.figura}</div>
            <div style={{ color: "#1B2A6B", fontWeight: 700, fontSize: 15, lineHeight: 1.6,
              textAlign: "left", margin: "10px 2px 12px" }}>{q.texto}</div>
            <div style={{ height: 2, background: "#D7DEF5", borderRadius: 2, margin: "0 auto 10px", width: "45%" }} />
            <div className="display" style={{ color: "#1B2A6B", fontSize: 18, lineHeight: 1.25 }}>{q.ask}</div>
          </div>
        ) : q.kind === "emojiPick" ? (
          <div style={{ fontSize: 46, padding: "6px 0 2px" }}>🔎</div>
        ) : q.kind === "texto" ? (
          <div className={picked && picked !== q.answer ? "shake" : ""}>
            {/* Nas capitais, a bandeira do estado vem antes do nome: a criança
                reconhece o desenho muito antes de ler "Rio Grande do Norte".
                Estado sem bandeira no pacote continua só com o nome. */}
            {q.flag && imgOk && (
              <div style={{ display: "inline-block", borderRadius: 14, overflow: "hidden",
                boxShadow: "0 4px 14px rgba(20,25,60,.22)", background: "#EEF1FF", marginBottom: 6 }}>
                <img src={flagUrl(q.flag)} alt="" onError={() => setImgOk(false)}
                  style={{ width: 168, height: 112, objectFit: "contain", display: "block", background: "#fff" }} />
              </div>
            )}
            <div className="display"
              style={{ fontSize: q.ask ? 30 : 44, color: "#1B2A6B", padding: q.flag ? "0 6px 4px" : "10px 6px", lineHeight: 1.2 }}>
              {q.ask ? q.prompt : "📖"}
            </div>
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

      {/* dicas — em duelo não existem: comprar a vitória sobre o irmão
          não é jogo, e o outro estaria pagando com as lumicoins dele */}
      <div style={{ marginTop: 14, display: duo ? "none" : "block" }}>
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

      {/* Raciocinar: a frase verdadeira que a criança não sabia, com a
          resposta certa do lado. Sem "você errou" — o erro ela já viu. */}
      {explicando && (
        <Modal onClose={seguir}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40 }}>💡</div>
            <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1, marginTop: 6 }}>
              {t.whyTitle}
            </div>
            <div className="display" style={{ color: "#00B894", fontSize: 26, lineHeight: 1.15, margin: "2px 0 10px" }}>
              {explicando.certa}
            </div>
            <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
              {explicando.porque}
            </div>
            <Btn full color="#00B894" onClick={seguir}>{t.gotIt}</Btn>
          </div>
        </Modal>
      )}

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
export function Result({ t, round, player, setScreen, setSel, sel, startRound, coins, escrever }) {
  const perfect = round.pct === 100;
  const [frase] = useState(() => elogio(t, round.st));
  return (
    <div className="narrow" style={{ paddingTop: 20 }}>
      <div className="card pop" style={{ padding: 22, textAlign: "center" }}>
        <div style={{ fontSize: 54 }}>{perfect ? "🏆" : round.st > 0 ? "🎉" : "💪"}</div>
        <div className="display" style={{ fontSize: 28, color: "#1B2A6B" }}>{perfect ? t.perfect : frase}</div>
        <div style={{ color: "#8B93AD", fontWeight: 800, fontSize: 12, marginTop: 2 }}>{t.roundOver}</div>

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

        {/* Relacionar e Registrar, os dois passos que faltavam. Vem antes dos
            botões de jogar de novo de propósito: pensar no que passou é mais
            valioso que a próxima rodada, e quem quiser pular, pula. */}
        <Btn full color="#8D6E3A" onClick={escrever}>📔 {t.writeIt}</Btn>
        <div style={{ height: 9 }} />

        <div style={{ display: "grid", gap: 9 }}>
          {round.st > 0 && round.stage < totalDe(round.cont) && (
            <Btn full color="#00B894"
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


/* O placar de uma partida em grupo — o mesmo na memória e no quiz, porque é a
   mesma pergunta: quem fez quantos, e quanto todo mundo levou. */
export function Placar({ t, jogadores, pontos, vencedor, reward, rodape, aoRepetir, aoSair }) {
  return (
    <div className="narrow" style={{ paddingTop: 20 }}>
      <div className="card pop" style={{ padding: 22, textAlign: "center" }}>
        <div style={{ fontSize: 54 }}>{vencedor == null ? "🤝" : "🏆"}</div>
        <div className="display" style={{ fontSize: 24, color: "#1B2A6B" }}>
          {vencedor == null ? t.duoTie : t.duoWon.replace("{quem}", jogadores[vencedor]?.name || "—")}
        </div>

        <div style={{ display: "grid", gap: 10, margin: "16px 0",
          gridTemplateColumns: `repeat(${jogadores.length > 3 ? 2 : jogadores.length},1fr)` }}>
          {jogadores.map((j, i) => (
            <div key={i} style={{ minWidth: 0, background: "#EEF1FF", borderRadius: 16, padding: 12 }}>
              <div style={{ display: "grid", placeItems: "center" }}><Rosto p={j} size={44} /></div>
              <div style={{ color: "#1B2A6B", fontWeight: 900, fontSize: 12, marginTop: 5,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{j?.name || "—"}</div>
              <div className="display" style={{ fontSize: 26, color: vencedor === i ? "#00B894" : "#1B2A6B" }}>
                {pontos?.[i] ?? 0}
              </div>
            </div>
          ))}
        </div>

        {rodape && <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 13, marginBottom: 12 }}>{rodape}</div>}

        {/* Todos levam o mesmo, tenham ganhado ou perdido. */}
        <div className="display" style={{ fontSize: 18, color: reward ? "#F9A826" : "#8B93AD", marginBottom: 16 }}>
          {reward ? `🪙 ${reward} ${t.duoBoth}` : t.duoPaidToday}
        </div>

        <div style={{ display: "grid", gap: 9 }}>
          <Btn full color="#4C6FFF" onClick={aoRepetir}>{t.again}</Btn>
          <Btn full color="#8B93AD" onClick={aoSair} rotulo={t.a11yBack}>←</Btn>
        </div>
      </div>
    </div>
  );
}


/* O fim de uma revisão. Sem estrela e sem fase: consertar o que se errou não
   é conquista nova, é a mesma conquista ficando de pé. O que se conta é
   quantas voltaram certas — e quantas saíram da fila para sempre. */
export function PlacarDaRevisao({ t, round, aoSair }) {
  const [frase] = useState(() => elogio(t, round.right === round.qs.length ? 3 : round.right ? 1 : 0));
  return (
    <div className="narrow" style={{ paddingTop: 20 }}>
      <div className="card pop" style={{ padding: 22, textAlign: "center" }}>
        <div style={{ fontSize: 54 }}>🔁</div>
        <div className="display" style={{ fontSize: 26, color: "#1B2A6B" }}>{frase}</div>
        <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 13, margin: "10px 0 4px" }}>
          {t.reviewDone.replace("{n}", `${round.right}/${round.qs.length}`)}
        </div>
        {!!round.aprendidas && (
          <div style={{ color: "#00B894", fontWeight: 900, fontSize: 13, marginBottom: 4 }}>
            🎓 {t.reviewLearned.replace("{n}", round.aprendidas)}
          </div>
        )}
        <div className="display" style={{ fontSize: 22, color: "#F9A826", margin: "10px 0 16px" }}>🪙 {round.reward}</div>
        <Btn full color="#8B93AD" onClick={aoSair} rotulo={t.a11yBack}>←</Btn>
      </div>
    </div>
  );
}


/* O fim de uma partida contra o relógio. Memória e quebra-cabeça acabam com a
   mesma pergunta — quantas estrelas, em quanto tempo, quanto rendeu —, então
   acabam na mesma tela. */
export function PlacarDeTempo({ t, st, reward, recorde, linha, aoRepetir, repetirBloqueado, aoSair }) {
  // Sorteado uma vez: se fosse no corpo, trocaria a cada redesenho da tela.
  const [frase] = useState(() => elogio(t, st));
  return (
    <div style={{ paddingTop: 20 }}>
      <div className="card pop" style={{ padding: 22, textAlign: "center" }}>
        <div style={{ fontSize: 54 }}>{st === 3 ? "🏆" : st ? "🎉" : "💪"}</div>
        <div className="display" style={{ fontSize: 26, color: "#1B2A6B" }}>{frase}</div>
        <div style={{ color: "#8B93AD", fontWeight: 800, fontSize: 12, marginTop: 2 }}>{t.roundOver}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, margin: "10px 0 6px" }}>
          {[1, 2, 3].map(i => <span key={i} style={{ fontSize: 34, opacity: st >= i ? 1 : .2 }}>⭐</span>)}
        </div>
        <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 13, marginBottom: 14 }}>
          {linha}{recorde ? ` · 🏆 ${t.newRecord}` : ""}
        </div>
        <div className="display" style={{ fontSize: 22, color: "#F9A826", marginBottom: 16 }}>🪙 {reward}</div>
        <div style={{ display: "grid", gap: 9 }}>
          <Btn full color="#4C6FFF" onClick={aoRepetir} disabled={repetirBloqueado}>{t.again}</Btn>
          <Btn full color="#8B93AD" onClick={aoSair} rotulo={t.a11yBack}>←</Btn>
        </div>
      </div>
    </div>
  );
}
