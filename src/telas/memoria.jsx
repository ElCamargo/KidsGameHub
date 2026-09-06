/**
 * KidsGameHub — o jogo da memória
 * ElCamargo Soluções em TI LTDA
 *
 * Saiu do App.jsx sem uma linha de lógica mudada — só recortada e colada
 * (ver docs/decisoes/0005-as-telas-em-arquivos.md).
 */

import React, { useState, useEffect, useRef } from "react";
import { BAND_COLOR, DIFFS, MEM_LEVELS, MEM_PRECO, custoDaMemoria, flagUrl, tempoFmt } from "../lib/catalogo.js";
import { MAX_JOGADORES } from "../lib/turma.js";
import { Btn, CARAS, Caras, Coin, Modal, Rosto } from "./base.jsx";


export function MemoryGame({ t, lang, nivel, cartas, onFinish, onQuit, duo, eu }) {
  const [viradas, setViradas] = useState([]);   // índices virados agora
  const [achadas, setAchadas] = useState([]);   // índices já casados
  const [jogadas, setJogadas] = useState(0);
  const [seg, setSeg] = useState(0);
  /* Jogando junto: de quem é a vez e quantos pares cada um levou. Quem acerta
     continua — é a regra do jogo de mesa, e é ela que faz a criança querer
     prestar atenção na jogada do outro. */
  const [vez, setVez] = useState(0);
  const [pontos, setPontos] = useState(() => Array(duo ? duo.length + 1 : 2).fill(0));
  const travado = useRef(false);
  const cfg = MEM_LEVELS[nivel];
  const jogadores = duo ? [eu, ...duo] : null;

  useEffect(() => {
    const i = setInterval(() => setSeg(x => x + 1), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (achadas.length && achadas.length === cartas.length) {
      const id = setTimeout(() => onFinish({ seg, jogadas, pontos }), 600);
      return () => clearTimeout(id);
    }
  }, [achadas]);

  function tocar(i) {
    /* viradas.length >= 2 é a guarda contra o toque que chega no instante em
       que as duas cartas se fecham: ali o travado já caiu, mas a tela ainda
       não redesenhou com o tabuleiro limpo. Sem ela esse toque montaria um
       terceiro item em viradas, e o par nunca mais se resolveria — tabuleiro
       morto, e a criança sem entender por que o jogo parou. */
    if (travado.current || viradas.length >= 2 || viradas.includes(i) || achadas.includes(i)) return;
    const novas = [...viradas, i];
    setViradas(novas);
    if (novas.length === 2) {
      setJogadas(j => j + 1);
      travado.current = true;
      const [a, b] = novas;
      const igual = cartas[a].key === cartas[b].key && a !== b;
      setTimeout(() => {
        if (igual) {
          setAchadas(x => [...x, a, b]);
          if (duo) setPontos(p => { const q = [...p]; q[vez]++; return q; });
        } else if (duo) setVez(v => (v + 1) % jogadores.length);
        setViradas([]);
        travado.current = false;
      }, igual ? 420 : 850);
    }
  }

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={onQuit} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 18, flex: 1 }}>{t.levels[nivel]}</div>
        <div style={{ background: "rgba(255,255,255,.18)", color: "#fff", borderRadius: 999, padding: "6px 14px", fontWeight: 900 }}>
          ⏱️ {tempoFmt(seg)}
        </div>
      </div>

      {/* De quem é a vez, do tamanho que uma criança de cinco anos enxerga do
          outro lado da mesa. Sem isto o jogo junto vira discussão. */}
      {duo && (
        <div style={{ display: "grid", gap: 6, marginBottom: 8,
          gridTemplateColumns: `repeat(${jogadores.length > 3 ? 2 : jogadores.length},1fr)` }}>
          {jogadores.map((j, i) => (
            <div key={i} className="card" style={{
              minWidth: 0, padding: "5px 8px", display: "flex", alignItems: "center", gap: 7,
              opacity: vez === i ? 1 : .5,
              outline: vez === i ? "3px solid #F9A826" : "none",
            }}>
              <Rosto p={j} size={26} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#1B2A6B", fontWeight: 900, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {j?.name || "—"}
                </div>
                {vez === i && <div style={{ color: "#F9A826", fontWeight: 900, fontSize: 9 }}>{t.yourTurn}</div>}
              </div>
              <div className="display" style={{ color: "#1B2A6B", fontSize: 18 }}>{pontos[i]}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cfg.cols},1fr)`, gap: 8 }}>
        {cartas.map((c, i) => {
          const aberta = viradas.includes(i) || achadas.includes(i);
          const casada = achadas.includes(i);
          return (
            <button key={i} onClick={() => tocar(i)} className="chunky"
              aria-label={aberta ? undefined : t.a11yCard}
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
        {t.pairs}: {achadas.length / 2}/{cartas.length / 2}{duo ? "" : ` · ${t.moves}: ${jogadas}`}
      </div>
    </div>
  );
}


/* ---------- Escolha de nível da memória ---------- */
export function MemLevels({ t, coins, memBest, setScreen, comecar, tema = "flags", titulo, icone, temSecao, comprarSecao, turma, pedirTurma, sairDaTurma }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>{icone} {titulo}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>
      {/* Jogar junto é do tamanho de um botão porque é para ser achado.
          Era o pedido mais simples da casa e o mais difícil de descobrir. */}
      {turma ? (
        <div className="card" style={{ padding: 12, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <Caras turma={turma} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {t.duoWith} {turma.map(j => j.name).join(", ")}
            </div>
            <div style={{ color: "#00B894", fontWeight: 900, fontSize: 11 }}>⭐ {t.duoFree}</div>
          </div>
          <Btn small color="#8B93AD" onClick={sairDaTurma} rotulo={t.a11yClose}>✕</Btn>
        </div>
      ) : (
        <Btn full color="#00C2CB" onClick={pedirTurma}>👥 {t.duoPlay}</Btn>
      )}
      <div style={{ height: 12 }} />

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
                <Btn small color={BAND_COLOR[d]}
                  disabled={!turma && coins < custoDaMemoria(memBest, tema, d)}
                  onClick={() => comecar(d, tema, turma)}>
                  {turma ? "👥" : custoDaMemoria(memBest, tema, d) ? `🪙${custoDaMemoria(memBest, tema, d)}` : `⭐ ${t.free}`}
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


/* Quem vai jogar junto: os outros perfis do aparelho e quantos convidados
   precisarem, até quatro no total contando quem convidou.

   Escolher é ligar e desligar, não confirmar um de cada vez: a mãe entra, o
   irmão entra, o amigo que dorme aqui hoje entra como convidado. */
export function EscolherTurma({ t, perfis, escolher, fechar }) {
  const [escolhidos, setEscolhidos] = useState([]);
  const cheio = escolhidos.length >= MAX_JOGADORES - 1;
  const dentro = id => escolhidos.some(j => j.id === id);

  const alternar = pr => setEscolhidos(x => dentro(pr.id) ? x.filter(j => j.id !== pr.id)
    : x.length >= MAX_JOGADORES - 1 ? x : [...x, { id: pr.id, name: pr.name, avatar: pr.avatar }]);

  const convidar = () => setEscolhidos(x => {
    if (x.length >= MAX_JOGADORES - 1) return x;
    const quantos = x.filter(j => !j.id).length;
    // O primeiro convidado é só "Convidado"; do segundo em diante ganha número.
    return [...x, { id: null, name: quantos ? `${t.guest} ${quantos + 1}` : t.guest, face: CARAS[quantos % CARAS.length] }];
  });

  const tirar = alvo => setEscolhidos(x => x.filter(j => j !== alvo));

  return (
    <Modal onClose={fechar}>
      <div className="display" style={{ fontSize: 21, color: "#1B2A6B", textAlign: "center" }}>👥 {t.duoWho}</div>
      <div style={{ color: "#6C7695", fontWeight: 700, fontSize: 12, textAlign: "center", lineHeight: 1.6, margin: "6px 0 14px" }}>
        {t.duoHint}
      </div>
      <div style={{ display: "grid", gap: 8, maxHeight: 260, overflowY: "auto" }}>
        {perfis.map(pr => (
          <button key={pr.id} onClick={() => alternar(pr)} className="card"
            aria-pressed={dentro(pr.id)}
            style={{ border: "none", padding: 10, cursor: "pointer", display: "flex",
              alignItems: "center", gap: 10, textAlign: "left",
              outline: dentro(pr.id) ? "3px solid #00B894" : "none",
              opacity: !dentro(pr.id) && cheio ? .45 : 1 }}>
            <Rosto p={pr} size={40} />
            <div className="display" style={{ color: "#1B2A6B", fontSize: 16, flex: 1 }}>{pr.name}</div>
            <div style={{ fontSize: 20 }}>{dentro(pr.id) ? "✅" : "＋"}</div>
          </button>
        ))}
        {escolhidos.filter(j => !j.id).map((j, i) => (
          <button key={"c" + i} onClick={() => tirar(j)} className="card"
            style={{ border: "none", padding: 10, cursor: "pointer", display: "flex",
              alignItems: "center", gap: 10, textAlign: "left", outline: "3px solid #00B894" }}>
            <Rosto p={j} size={40} />
            <div className="display" style={{ color: "#1B2A6B", fontSize: 16, flex: 1 }}>{j.name}</div>
            <div style={{ fontSize: 18 }}>✕</div>
          </button>
        ))}
        {!cheio && (
          <Btn full color="rgba(0,194,203,.18)" onClick={convidar}>
            <span style={{ color: "#1B2A6B" }}>{t.duoAdd}</span>
          </Btn>
        )}
      </div>
      <div style={{ height: 10 }} />
      <Btn full color="#00C2CB" disabled={!escolhidos.length} onClick={() => escolher(escolhidos)}>
        👥 {t.play}
      </Btn>
      <div style={{ height: 8 }} />
      <Btn full color="#8B93AD" onClick={fechar} rotulo={t.a11yClose}>✕</Btn>
    </Modal>
  );
}
