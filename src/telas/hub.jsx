/**
 * KidsGameHub — o hub: escolher jogo, ano, mapa e fase
 * ElCamargo Soluções em TI LTDA
 *
 * Saiu do App.jsx sem uma linha de lógica mudada — só recortada e colada
 * (ver docs/decisoes/0005-as-telas-em-arquivos.md).
 */

import React, { useState } from "react";
import { LANG_CATALOG, T } from "../data/textos.js";
import { BAND_COLOR, BAND_PRECO, CAP_PRECO, CATALOG, DIFFS, ECON, MADE_BY, ROUTE, bandFor, custoDaFase, ehLeitor, fmt, jogoDe, precoDe, tempoFmt, totalDe } from "../lib/catalogo.js";
import { ANOS, IDADE_DO_ANO, conteudoDoAno, nomeDoAno } from "../lib/escola.js";
import { CAP_REGIOES, alvoDe, quizDe } from "../lib/rodadas.js";
import { Btn, Caras, Coin, Modal, Mundi, TopBar } from "./base.jsx";
import { CartaoMomento } from "./familia.jsx";

export function Home({ t, lang, player, coins, nextRefill, setScreen, profiles, onPickGame, abrir, podeResgatar, resgatar, jogosAbertos, abrirJogo, momento, setMomento, momentoFeitoHoje, voz, quantasRevisar, revisar, ano }) {
  return (
    <div>
      <TopBar t={t} player={player} coins={coins} nextRefill={nextRefill}
        onAvatar={() => setScreen("player")} onSwitch={() => setScreen("profiles")} quantos={profiles?.length || 1}
        podeResgatar={podeResgatar} resgatar={resgatar} />

      {/* O que ela errou, de volta. Fica antes dos jogos porque é a coisa que
          mais ensina no app — e é de graça: cobrar da criança para consertar
          o próprio erro seria o avesso do que este app quer ser. */}
      {!!quantasRevisar && (
        <button onClick={revisar} className="card pop"
          style={{ border: "none", width: "100%", textAlign: "left", cursor: "pointer",
            padding: 14, marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 34 }}>🔁</div>
          <div style={{ flex: 1 }}>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 17 }}>{t.reviewTitle}</div>
            <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 12 }}>
              {t.reviewHint.replace("{n}", quantasRevisar)}
            </div>
          </div>
          <div style={{ background: "#00B894", color: "#fff", borderRadius: 999, padding: "6px 13px", fontWeight: 900 }}>
            {quantasRevisar}
          </div>
        </button>
      )}

      {/* A porta da escola. Vem antes dos jogos porque é o que o pai abre
          quando a professora mandou bilhete — e o que a criança abre quando
          tem prova. */}
      <button onClick={() => setScreen("escola")} className="card pop"
        style={{ border: "none", width: "100%", textAlign: "left", cursor: "pointer",
          padding: 14, marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 34 }}>🎒</div>
        <div style={{ flex: 1 }}>
          <div className="display" style={{ color: "#1B2A6B", fontSize: 17 }}>{t.school}</div>
          <div style={{ color: "#6C7695", fontWeight: 800, fontSize: 12 }}>
            {ano ? nomeDoAno(ano, t) : t.schoolPick}
          </div>
        </div>
        <div style={{ fontSize: 20, color: "#8B93AD" }}>▶</div>
      </button>

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

      {/* Antes dos jogos: a família vem primeiro, e o convite só o adulto
          responde — a decisão é do lar, não da criança. */}
      {(momento.fe != null || player.papel === "pai") && (
        <CartaoMomento {...{ t, lang, momento, setMomento, feitoHoje: momentoFeitoHoje, abrir: () => setScreen("devocional") }} />
      )}

      <div className="display" style={{ color: "#fff", fontSize: 22, marginBottom: 10 }}>{t.home}</div>
      {/* Para quem ainda não lê, os jogos de texto aparecem trancados. Dizer
          por quê evita a criança achar que quebrou — e o adulto, que faltou. */}
      {!ehLeitor(player) && (
        <div style={{ color: "#A7B3EA", fontWeight: 700, fontSize: 11, marginTop: -6, marginBottom: 10 }}>
          {voz ? `🔊 ${t.voiceOpens}` : `🔒 ${t.needsReading}`}
        </div>
      )}

      {CATALOG.map(c => (
        <div key={c.id} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{c.icon}</span>
            <span className="display" style={{ color: "#C9D2FF", fontSize: 16 }}>{t.cat[c.id]}</span>
          </div>
          <div className="grid2">
            {c.games.map((g, gi) => {
              const aberto = jogosAbertos.includes(g.id);
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
                    <div style={{ color: coins >= precoDe(g) ? "#E84393" : "#8B93AD", fontSize: 12, fontWeight: 900, marginTop: 3 }}>
                      🪙 {precoDe(g)}
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
        <Btn full color="#8D6E3A" onClick={() => abrir("caderno", "home")}>📔 {t.notebook}</Btn>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <Btn full color="#E84393" onClick={() => abrir("shop", "home")}>🛍️ {t.shop}</Btn>
        <Btn full color="#00C2CB" onClick={() => abrir("awards", "home")}>🏅 {t.awards}</Btn>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        {player.papel === "pai" && (
          <Btn full small color="rgba(255,255,255,.2)" onClick={() => setScreen("familia")}>👨‍👩‍👧 {t.family}</Btn>
        )}
        <Btn full small color="rgba(255,255,255,.2)" onClick={() => setScreen("lang")}>🌐 {t.language}</Btn>
      </div>
      <div style={{ textAlign: "center", color: "#A7B3EA", fontSize: 11, fontWeight: 700, marginTop: 14, lineHeight: 1.6 }}>
        🔒 {t.parentsInfo}<br />
        <span style={{ color: "#7E8CD0" }}>{MADE_BY}</span>
      </div>
    </div>
  );
}


/* ---------- Home do hub ---------- */
/* ---------- A trilha do ano escolar ----------
   O app se organiza por dificuldade; a escola, por ano. Esta tela é a ponte:
   escolhido o ano, ela mostra as poucas coisas que a escola cobra NELE, já na
   faixa certa e sem cobrar lumicoin. É a única porta do app que abre faixa de
   graça, e é de propósito: a criança que mais precisa de reforço é justamente
   a que não tem tempo de jogo para juntar moeda. */

export function EscolaScreen({ t, ano, escolherAno, abrirItem, progress, setScreen }) {
  const atual = ano || "a1";
  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>🎒 {t.school}</div>
      </div>

      {/* Seis anos não cabem numa fileira de celular: três por linha em 375px. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {ANOS.map(a => (
          <button key={a} onClick={() => escolherAno(a)} className="chunky"
            style={{ flex: "1 1 30%", padding: "8px 4px", fontSize: 12, lineHeight: 1.2,
              background: a === atual ? "#00B894" : "rgba(255,255,255,.22)" }}>
            <div>{nomeDoAno(a, t)}</div>
            <div style={{ fontSize: 10, opacity: .85 }}>{t.schoolAge.replace("{n}", IDADE_DO_ANO[a])}</div>
          </button>
        ))}
      </div>

      <div className="display" style={{ color: "#C9D2FF", fontSize: 15, marginBottom: 8 }}>{t.schoolHint}</div>

      <div className="lista">
        {conteudoDoAno(atual).map(item => {
          const g = jogoDe(item.jogo) || {};
          const feitas = progress[item.cont] || 0;
          return (
            <button key={item.jogo} onClick={() => abrirItem(item)} className="card"
              style={{ border: "none", width: "100%", textAlign: "left", cursor: "pointer",
                padding: 13, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: g.color || "#4C6FFF",
                display: "grid", placeItems: "center", fontSize: 24 }}>{g.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="display" style={{ color: "#1B2A6B", fontSize: 17 }}>{t.games[item.jogo]}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#6C7695" }}>
                  {item.banda ? t.levels[item.banda] + " · ⭐ " + feitas + "/" + totalDe(item.cont) : t.play}
                </div>
              </div>
              <div style={{ fontSize: 20, color: "#8B93AD" }}>▶</div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginTop: 14 }}>
        <Mundi size={56} />
        <div className="card" style={{ padding: "10px 12px", flex: 1, borderBottomLeftRadius: 6,
          color: "#00875A", fontWeight: 900, fontSize: 13 }}>{t.schoolFree}</div>
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}


/* ---------- Mapa ---------- */
export function MapScreen({ t, lang, player, coins, nextRefill, unlocked, progress, unlockContinent, setSel, setScreen, stats, tutorial, setTutorial }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
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


/* ---------- Mapa das capitais ---------- */
export function CapMap({ t, lang, progress, coins, setSel, setScreen, temSecao, comprarSecao }) {
  const nomeRegiao = r =>
    r.id === "cap_br" ? t.capBrasil
    : r.id === "cap_us" ? t.capEUA
    : t.continents[r.id.slice(4)];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
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
export function LangGame({ t, lang, escolher, setScreen }) {
  const opcoes = Object.keys(LANG_CATALOG).filter(c => c !== lang && T[c]);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
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


/* ---------- Seleção de fases ---------- */
export function Stages({ t, lang, sel, setSel, progress, coins, startRound, setScreen, player, stars, records, temSecao, comprarSecao, turma, pedirTurma, sairDaTurma }) {
  const quiz = quizDe(sel.cont);             // jogos fora do mapa-múndi
  const cont = quiz ? { color: quiz.cor } : ROUTE.find(r => r.id === sel.cont);
  const done = progress[sel.cont] || 0;
  const band = bandFor(sel.cont, sel.stage);
  /* A faixa que o ano escolar da criança cobra entra aberta, e as fases dela
     também — quem está no 4º ano não vai vencer trinta fases de tabuada fácil
     antes de chegar no 6, 7 e 8 que a professora cobrou esta semana. O resto
     da escada continua como sempre: se comprando, se vencendo. */
  const bandaDaEscola = sel.escola || null;
  const totalFases = totalDe(sel.cont);
  /* Trilha de 100 fases não cabe num tabuleiro só: 20 linhas de botões
     empurram o "Jogar" para fora da tela. Página de 20, sempre 5 colunas,
     e a página abre junto com a fase — a de número 21 só existe quando a 20
     estiver vencida. */
  const custoFase = bandFor(sel.cont, sel.stage) === bandaDaEscola ? 0 : custoDaFase(stars, sel.cont, sel.stage);
  const POR_PAGINA = 20;
  const paginas = Math.ceil(totalFases / POR_PAGINA);
  const [pag, setPag] = useState(Math.min(paginas - 1, Math.floor((sel.stage - 1) / POR_PAGINA)));
  const p0 = pag * POR_PAGINA;
  const fasesDaPagina = Array.from({ length: Math.min(POR_PAGINA, totalFases - p0) }, (_, i) => p0 + i + 1);
  const paginaAberta = i => done >= i * POR_PAGINA;
  const chaveBanda = b => `b:${sel.cont}:${b}`;
  const bandaAberta = b => b === bandaDaEscola || !BAND_PRECO[b] || temSecao(chaveBanda(b));
  const bandaAnterior = b => DIFFS[DIFFS.indexOf(b) - 1];
  const podeComprar = b => {
    const ant = bandaAnterior(b);
    return !ant || bandaAberta(ant);
  };
  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(bandaDaEscola ? "escola" : sel.cont.startsWith("cap_") ? "capMap" : quiz ? "home" : "map")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>{quiz
            ? `${quiz.icone} ${quiz.nome(t)}${alvoDe(sel.cont) ? ` · ${LANG_CATALOG[alvoDe(sel.cont)]}` : ""}${
                sel.cont.startsWith("cap_")
                  ? ` · ${sel.cont === "cap_br" ? t.capBrasil : sel.cont === "cap_us" ? t.capEUA : t.continents[sel.cont.slice(4)]}`
                  : ""}`
            : t.continents[sel.cont]}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>

      {bandaDaEscola && (
        <div className="card" style={{ padding: "9px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 20 }}>🎒</span>
          <span style={{ color: "#00875A", fontWeight: 900, fontSize: 12, lineHeight: 1.3 }}>{t.schoolFree}</span>
        </div>
      )}

      {/* legenda das faixas de dificuldade */}
      {/* Seis faixas não cabem numa fileira de celular: deixo quebrar, dá três
          por linha em 375px e as seis numa só quando a tela é larga. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {DIFFS.map(d => {
          const aberta = bandaAberta(d);
          return (
            <div key={d} style={{
              flex: "1 1 28%", textAlign: "center", borderRadius: 12, padding: "6px 2px",
              background: aberta ? BAND_COLOR[d] : "#8B93AD", color: "#fff", fontWeight: 900, fontSize: 11,
              opacity: !aberta ? .6 : band === d ? 1 : .45,
            }}>{aberta ? t.levels[d] : `🔒 ${t.levels[d]}`}</div>
          );
        })}
      </div>

      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          {fasesDaPagina.map(n => {
            const b0 = bandFor(sel.cont, n);
            const open = (n <= done + 1 || b0 === bandaDaEscola) && bandaAberta(b0);
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

        {paginas > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
            <Btn small color={pag === 0 ? "#C7CEE0" : "#4C6FFF"} disabled={pag === 0}
              onClick={() => setPag(pag - 1)} rotulo={t.a11yPrev}>◀</Btn>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div className="display" style={{ color: "#1B2A6B", fontSize: 15 }}>
                {t.stage} {p0 + 1}–{p0 + fasesDaPagina.length}
              </div>
              <div style={{ color: "#8B93AD", fontWeight: 800, fontSize: 11 }}>{pag + 1}/{paginas}</div>
            </div>
            <Btn small color={pag >= paginas - 1 || !paginaAberta(pag + 1) ? "#C7CEE0" : "#4C6FFF"}
              disabled={pag >= paginas - 1 || !paginaAberta(pag + 1)}
              onClick={() => setPag(pag + 1)}>{pag < paginas - 1 && !paginaAberta(pag + 1) ? "🔒" : "▶"}</Btn>
          </div>
        )}
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
      {turma ? (
        <>
          <div className="card" style={{ padding: 10, marginBottom: 9, display: "flex", alignItems: "center", gap: 10 }}>
            <Caras turma={turma} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="display" style={{ color: "#1B2A6B", fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.duoWith} {turma.map(j => j.name).join(", ")}
              </div>
              <div style={{ color: "#00B894", fontWeight: 900, fontSize: 11 }}>{t.duoTakeTurns}</div>
            </div>
            <Btn small color="#8B93AD" onClick={sairDaTurma} rotulo={t.a11yClose}>✕</Btn>
          </div>
          <Btn full color="#00C2CB" disabled={!bandaAberta(band)} onClick={() => startRound(turma)}>
            👥 {t.stage} {sel.stage} · {t.levels[band]}
          </Btn>
        </>
      ) : (
        <>
          <Btn full color={BAND_COLOR[band]} disabled={coins < custoFase || !bandaAberta(band)} onClick={() => startRound()}>
            ▶ {t.stage} {sel.stage} · {t.levels[band]} · {custoFase ? `${t.cost} 🪙${custoFase}` : `⭐ ${t.free}`}
          </Btn>
          <div style={{ height: 9 }} />
          <Btn full color="rgba(255,255,255,.2)" onClick={pedirTurma}>👥 {t.duoPlay}</Btn>
        </>
      )}
    </div>
  );
}
