/**
 * KidsGameHub — monta a palavra
 * ElCamargo Soluções em TI LTDA
 *
 * Saiu do App.jsx sem uma linha de lógica mudada — só recortada e colada
 * (ver docs/decisoes/0005-as-telas-em-arquivos.md).
 */

import React, { useState, useEffect } from "react";
import { QUANTAS_PALAVRAS } from "../lib/alfabetizacao.js";
import { BAND_COLOR, DIFFS, PAL_PRECO, custoDaPalavra } from "../lib/catalogo.js";
import { Btn, Coin, useFala } from "./base.jsx";


/* ---------- Monta a palavra ----------
   A figura aparece, a voz diz a palavra INTEIRA, e a criança monta com as
   sílabas. O app nunca fala a sílaba: quem separa "bola" em BO e LA é ela, e
   é essa separação que se está ensinando (ver docs/decisoes/0004).

   A conferência é peça a peça, e não no fim: encaixou a sílaba errada, ela
   treme e volta na hora. Deixar montar a palavra toda para só então dizer
   "errado" ensina menos e frustra mais. */
export function PalavraGame({ t, lang, palavras, voz, onFinish, onQuit }) {
  const [i, setI] = useState(0);
  const [postas, setPostas] = useState([]);   // índices das peças, na ordem em que entraram
  const [erros, setErros] = useState(0);
  const [errou, setErrou] = useState(null);
  const [pronta, setPronta] = useState(false);
  /* O elogio da palavra montada. Sorteado a cada palavra, e não uma vez por
     rodada: é o momento em que a criança acabou de conseguir. */
  const [bravo, setBravo] = useState("");
  const fala = useFala(lang);
  const p = palavras[i];

  /* Palavra nova: bandeja limpa, e o Lumus diz qual é. */
  useEffect(() => {
    setPostas([]); setPronta(false); setErrou(null); setBravo("");
    if (!voz) return;
    const x = setTimeout(() => fala.dizer(palavras[i].w), 320);
    return () => { clearTimeout(x); fala.calar(); };
  }, [i, voz]);

  /* Montou: um respiro para ver a palavra inteira antes de virar a página. */
  useEffect(() => {
    if (!pronta) return;
    const x = setTimeout(() => {
      if (i + 1 >= palavras.length) onFinish(erros);
      else setI(k => k + 1);
    }, 1200);
    return () => clearTimeout(x);
  }, [pronta]);

  function tocarPeca(k) {
    if (pronta || postas.includes(k)) return;
    if (p.pecas[k] === p.s[postas.length]) {
      const novas = [...postas, k];
      setPostas(novas);
      if (novas.length === p.s.length) {
        setPronta(true);
        setBravo(Object.values(t.elogios.certo)[Math.floor(Math.random() * 3)]);
      }
      return;
    }
    setErros(e => e + 1);
    setErrou(k);
    setTimeout(() => setErrou(null), 450);
  }

  const largura = Math.max(58, Math.min(84, Math.round(300 / p.s.length)));

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={onQuit} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 18, flex: 1 }}>{t.buildWord}</div>
        <div style={{ background: "rgba(255,255,255,.18)", color: "#fff", borderRadius: 999, padding: "6px 14px", fontWeight: 900 }}>
          {i + 1}/{palavras.length}
        </div>
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 14, textAlign: "center" }}>
        <div style={{ fontSize: 76, lineHeight: 1 }}>{p.e}</div>
        {voz && (
          <div style={{ marginTop: 6 }}>
            <button onClick={() => fala.alternar(p.w)} className="chunky"
              aria-label={fala.lendo ? t.voiceStop : t.listenWord} aria-pressed={fala.lendo}
              style={{ background: "#EEF1FF", color: "#1B2A6B", padding: "6px 14px", fontSize: 15 }}>
              {fala.lendo ? "⏹️" : "🔊"}
            </button>
          </div>
        )}

        {/* O "isso!" da palavra montada, no lugar onde o olho já está. */}
        <div className="display" style={{ height: 22, marginTop: 8, fontSize: 18, color: "#00B894" }}>
          {bravo}
        </div>

        {/* Os lugares da palavra. Vazio mostra o traço, que é como a criança
            vê numa folha de caderno. */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
          {p.s.map((silaba, k) => {
            const cheio = k < postas.length;
            return (
              <div key={k} className={pronta ? "pop" : ""} style={{
                minWidth: largura, height: 58, borderRadius: 14, display: "grid", placeItems: "center",
                background: cheio ? (pronta ? "#00B894" : "#4C6FFF") : "#EEF1FF",
                border: cheio ? "none" : "3px dashed #C3CBEA",
                color: cheio ? "#fff" : "#B9C0CC", padding: "0 8px",
                fontFamily: "inherit", fontWeight: 900, fontSize: 24,
              }}>
                <span className="display">{cheio ? silaba : "—"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* A bandeja. Peça já usada some, para não sobrar dúvida do que falta. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {p.pecas.map((silaba, k) => postas.includes(k) ? null : (
          <button key={k} onClick={() => tocarPeca(k)} className={`chunky ${errou === k ? "shake" : ""}`}
            style={{
              minWidth: largura, height: 58, borderRadius: 14, padding: "0 10px",
              background: errou === k ? "#E74C3C" : "#fff", color: "#1B2A6B",
              fontFamily: "inherit", fontWeight: 900, fontSize: 24,
            }}>
            <span className="display">{silaba}</span>
          </button>
        ))}
      </div>

      {/* Tirar a última: errar de dedo não pode custar uma vida. */}
      {!!postas.length && !pronta && (
        <div style={{ marginTop: 14 }}>
          <Btn full small color="rgba(255,255,255,.2)" onClick={() => setPostas(x => x.slice(0, -1))}>
            ↺
          </Btn>
        </div>
      )}
      <div style={{ height: 20 }} />
    </div>
  );
}


/* ---------- Escolha de nível do Monta a palavra ----------
   ponytail: terceira cópia da tela de níveis (memória, quebra-cabeça e esta).
   Vale unificar numa só quando entrar a quarta — hoje as três diferem no que
   mostram no meio, e unificar cedo custaria mais do que a duplicação. */
export function PalavraLevels({ t, coins, palBest, setScreen, comecar, temSecao, comprarSecao, escola }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(escola ? "escola" : "home")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>🔡 {t.games.montar}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>

      <div className="lista">
        {DIFFS.map((d, di) => {
          const b = palBest[d];
          const chave = `p:${d}`;
          const preco = PAL_PRECO[d];
          const aberto = !preco || temSecao(chave);
          const anteriorOk = di === 0 || !PAL_PRECO[DIFFS[di - 1]] || temSecao(`p:${DIFFS[di - 1]}`);
          const custo = escola ? 0 : custoDaPalavra(palBest, d);
          return (
            <div key={d} className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, opacity: aberto || anteriorOk ? 1 : .45 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: aberto ? BAND_COLOR[d] : "#B9C0CC", display: "grid", placeItems: "center", color: "#fff", fontWeight: 900, fontSize: 15 }}>
                {aberto ? QUANTAS_PALAVRAS[d] : "🔒"}
              </div>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ color: "#1B2A6B", fontSize: 18 }}>{t.levels[d]}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#6C7695" }}>
                  {aberto ? (
                    <>
                      {[1, 2, 3].map(i2 => <span key={i2} style={{ opacity: (b?.stars || 0) >= i2 ? 1 : .25 }}>★</span>)}
                      {` · ${QUANTAS_PALAVRAS[d]} ${t.words2.toLowerCase()}`}
                    </>
                  ) : anteriorOk ? `${t.unlockFor} 🪙${preco}` : t.needPrev}
                </div>
              </div>
              {aberto ? (
                <Btn small color={BAND_COLOR[d]} disabled={coins < custo} onClick={() => comecar(d, escola)}>
                  {custo ? `🪙${custo}` : `⭐ ${t.free}`}
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
        🔡 {t.buildWord}
      </div>
      <div style={{ height: 16 }} />
    </div>
  );
}
