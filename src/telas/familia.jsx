/**
 * KidsGameHub — a área do responsável e o caderno
 * ElCamargo Soluções em TI LTDA
 *
 * Saiu do App.jsx sem uma linha de lógica mudada — só recortada e colada
 * (ver docs/decisoes/0005-as-telas-em-arquivos.md).
 */

import React, { useState } from "react";
import { CARIMBOS, carimboPorId } from "../data/caderno.js";
import { devocionalDoDia } from "../data/devocional.js";
import { NOVIDADES } from "../data/novidades.js";
import { LANG_CATALOG } from "../data/textos.js";
import { versoDoDia } from "../data/versos.js";
import { ACHIEVEMENTS, BADGES, BAND_COLOR, CORES_PRINCIPIO, DIFFS, ECON, MEM_LEVELS, ROUTE, SEMANA_VAZIA, diaCurto, ehLeitor, intervaloDaSemana, semanaAtual, tempoFmt, totalDe } from "../lib/catalogo.js";
import { partirChaveMemoria } from "../lib/memoria.js";
import { ondeEstaDevendo } from "../lib/revisao.js";
import { alvoDe, nomeDaTrilha } from "../lib/rodadas.js";
import { juntar } from "../lib/voz.js";
import { Avatar, Btn, Coin, Mundi, useFala } from "./base.jsx";
import { Mini, acharArte } from "./desenho.jsx";
import { nomeDoAno } from "../lib/escola.js";


/* ---------- Meu Caderno ----------
   Registrar, o 4º R. A criança escreve o que ficou — e quem ainda não escreve
   toca carimbos. Os dois valem: o caderno não pode ser só de quem já lê.

   Nada aqui é corrigido nem pontuado. É o único lugar do app assim. */
export function EscreverScreen({ t, lang, rascunho, salvar, cancelar }) {
  const [texto, setTexto] = useState("");
  const [marcados, setMarcados] = useState([]);
  const txt = o => o[lang] || o.en;
  const vazio = !texto.trim() && !marcados.length;

  const alternar = id => setMarcados(m => m.includes(id) ? m.filter(x => x !== id) : [...m, id]);

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={cancelar} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 20, flex: 1 }}>📔 {t.notebook}</div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Mundi size={44} bounce={false} />
          <div style={{ flex: 1, minWidth: 0 }}>
            {rascunho.sobre && (
              <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1, marginBottom: 3 }}>
                {rascunho.sobre}
              </div>
            )}
            <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 16, lineHeight: 1.45 }}>
              {txt(rascunho.pergunta)}
            </div>
          </div>
        </div>
      </div>

      {/* Os carimbos vêm antes do texto: quem não escreve precisa encontrar o
          seu jeito primeiro, e não depois de um campo que não sabe usar. */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>{t.howWasIt}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {CARIMBOS.map(c => {
            const on = marcados.includes(c.id);
            return (
              <button key={c.id} onClick={() => alternar(c.id)}
                style={{ border: "none", cursor: "pointer", borderRadius: 999, padding: "8px 12px",
                  background: on ? "#4C6FFF" : "#E9ECF7", color: on ? "#fff" : "#3B4468",
                  fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 16 }}>{c.e}</span>{txt(c)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>{t.writeHere}</div>
        <textarea value={texto} onChange={e => setTexto(e.target.value.slice(0, 500))}
          rows={5} placeholder={t.writePlaceholder}
          style={{ width: "100%", boxSizing: "border-box", border: "2px solid #E4E8F5", borderRadius: 14,
            padding: 12, fontSize: 15, fontWeight: 700, color: "#1B2A6B", fontFamily: "inherit",
            resize: "none", outline: "none", lineHeight: 1.5 }} />
        <div style={{ textAlign: "right", color: "#B3BBD4", fontWeight: 800, fontSize: 11 }}>{texto.length}/500</div>
      </div>

      <Btn full color="#00B894" disabled={vazio}
        onClick={() => salvar({ texto: texto.trim(), carimbos: marcados, principio: rascunho.principio, sobre: rascunho.sobre })}>
        📔 {t.saveNote}
      </Btn>
      <div style={{ height: 20 }} />
    </div>
  );
}


/* Uma página do caderno, do jeito que ela é lida — pela criança e pelo pai. */
function PaginaCaderno({ r, lang, compacta }) {
  const cor = CORES_PRINCIPIO[r.p] || "#8B93AD";
  return (
    <div className="card" style={{ padding: compacta ? 10 : 14, borderLeft: `6px solid ${cor}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
        <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, flex: 1 }}>{diaCurto(r.d, lang)}</div>
        {r.s && <div style={{ color: "#B3BBD4", fontWeight: 800, fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "55%" }}>{r.s}</div>}
      </div>
      {!!r.c?.length && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: r.t ? 6 : 0 }}>
          {r.c.map(id => {
            const c = carimboPorId(id);
            return c ? (
              <span key={id} style={{ background: "#EEF1FF", borderRadius: 999, padding: "3px 8px",
                fontWeight: 800, fontSize: 11, color: "#3B4468" }}>
                {c.e} {c[lang] || c.en}
              </span>
            ) : null;
          })}
        </div>
      )}
      {r.t && (
        <div style={{ color: "#1B2A6B", fontWeight: 700, fontSize: compacta ? 12 : 14, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
          {r.t}
        </div>
      )}
    </div>
  );
}


export function CadernoScreen({ t, lang, caderno, setScreen, novo, voltar }) {
  const POR_PAGINA = 8;
  const paginas = Math.max(1, Math.ceil(caderno.length / POR_PAGINA));
  const [pag, setPag] = useState(0);           // 0 = as mais recentes
  const p = Math.min(pag, paginas - 1);
  const doNovoAoVelho = [...caderno].reverse();
  const fatia = doNovoAoVelho.slice(p * POR_PAGINA, (p + 1) * POR_PAGINA);

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(voltar)} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 20, flex: 1 }}>📔 {t.notebook}</div>
        {caderno.length > 0 && (
          <div style={{ background: "rgba(255,255,255,.2)", color: "#fff", borderRadius: 999,
            padding: "6px 12px", fontWeight: 900, fontSize: 13 }}>
            {caderno.length}
          </div>
        )}
      </div>

      <Btn full color="#00B894" onClick={novo}>✏️ {t.newNote}</Btn>
      <div style={{ height: 12 }} />

      {!caderno.length ? (
        <div className="card" style={{ padding: 22, textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>📔</div>
          <div style={{ color: "#3B4468", fontWeight: 800, fontSize: 14, lineHeight: 1.7, marginTop: 8 }}>
            {t.notebookEmpty}
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 9 }}>
          {fatia.map((r, i) => <PaginaCaderno key={p * POR_PAGINA + i} r={r} lang={lang} />)}
        </div>
      )}

      {paginas > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <Btn small color={p === 0 ? "rgba(255,255,255,.12)" : "#4C6FFF"} disabled={p === 0} onClick={() => setPag(p - 1)} rotulo={t.a11yPrev}>◀</Btn>
          <div style={{ flex: 1, textAlign: "center", color: "#C9D2FF", fontWeight: 900, fontSize: 12 }}>{p + 1} / {paginas}</div>
          <Btn small color={p >= paginas - 1 ? "rgba(255,255,255,.12)" : "#4C6FFF"} disabled={p >= paginas - 1} onClick={() => setPag(p + 1)} rotulo={t.a11yNext}>▶</Btn>
        </div>
      )}
      <div style={{ height: 20 }} />
    </div>
  );
}


/* ---------- Momento em Família ----------
   O devocional do dia, para ser lido junto: um versículo, uma pergunta para
   conversar e uma pequena atitude para hoje.

   Não existe resposta certa aqui, e é de propósito. O resto do app mede
   acerto; este pedaço mede presença. */
export function DevocionalScreen({ t, lang, momento, marcarMomento, feitoHoje, setScreen, voltar, voz }) {
  const fala = useFala(lang);
  const { principio, dia } = devocionalDoDia();
  const txt = o => o[lang] || o.en;
  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(voltar)} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 20, flex: 1 }}>🕊️ {t.momentTitle}</div>
        {momento.sequencia > 0 && (
          <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900, fontSize: 13 }}>
            🔥 {momento.sequencia}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 16, background: principio.cor, display: "grid", placeItems: "center", fontSize: 24 }}>
            {principio.icone}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1 }}>{t.principle}</div>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 20, lineHeight: 1.1 }}>{txt(principio)}</div>
          </div>
        </div>
        <div className="display" style={{ color: "#1B2A6B", fontSize: 19, lineHeight: 1.45 }}>“{txt(dia.v)}”</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 12, flex: 1 }}>{txt(dia.ref)}</div>
          {/* Outro tom: grave e pausado. Aqui não é o mascote falando. */}
          {voz && (
            <button onClick={() => fala.alternar(juntar([txt(dia.v), txt(dia.ref)]), { tom: "palavra" })}
              aria-label={fala.lendo ? t.voiceStop : t.voiceRead} aria-pressed={fala.lendo} className="chunky"
              style={{ background: "#EEF1FF", color: "#1B2A6B", padding: "6px 12px", fontSize: 15 }}>
              {fala.lendo ? "⏹️" : "🔊"}
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <Mundi size={44} bounce={false} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1, marginBottom: 3 }}>{t.talkAbout}</div>
            <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 15, lineHeight: 1.5 }}>{txt(dia.q)}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12, borderLeft: `8px solid ${principio.cor}` }}>
        <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 10, letterSpacing: 1, marginBottom: 3 }}>{t.todayDo}</div>
        <div style={{ color: "#1B2A6B", fontWeight: 800, fontSize: 15, lineHeight: 1.5 }}>{txt(dia.a)}</div>
      </div>

      {feitoHoje ? (
        <div className="card" style={{ padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 32 }}>💚</div>
          <div className="display" style={{ color: "#00B894", fontSize: 18, marginTop: 4 }}>{t.momentDone}</div>
          <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 12, marginTop: 4 }}>
            {t.momentCount.replace("{n}", momento.feitos || 0)}
          </div>
        </div>
      ) : (
        <Btn full color="#00B894" onClick={marcarMomento}>✓ {t.momentMark}</Btn>
      )}
      <div style={{ height: 20 }} />
    </div>
  );
}


/* O atalho quando a família já disse que quer, e o convite quando ninguém
   escolheu ainda. Um dos dois, nunca os dois. */
export function CartaoMomento({ t, lang, momento, feitoHoje, setMomento, abrir, responsavel }) {
  const { principio } = devocionalDoDia();

  if (momento.fe == null) return (
    <div className="card" style={{ padding: 16, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 26 }}>🕊️</div>
        <div className="display" style={{ color: "#1B2A6B", fontSize: 17, flex: 1 }}>{t.momentTitle}</div>
      </div>
      <div style={{ color: "#3B4468", fontWeight: 700, fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{t.momentInvite}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn full small color="#00B894" onClick={() => { setMomento(m => ({ ...m, fe: true })); abrir(); }}>{t.momentYes}</Btn>
        <Btn full small color="#8B93AD" onClick={() => setMomento(m => ({ ...m, fe: false }))}>{t.momentNo}</Btn>
      </div>
    </div>
  );

  /* Disse "agora não". Some do hub, mas o responsável precisa de um caminho
     de volta — senão a escolha de um dia vira definitiva. */
  if (!momento.fe) return responsavel ? (
    <button onClick={() => { setMomento(m => ({ ...m, fe: true })); abrir(); }} className="card"
      style={{ border: "none", width: "100%", padding: 12, marginBottom: 14, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
      <div style={{ fontSize: 20 }}>🕊️</div>
      <div style={{ flex: 1, color: "#6C7695", fontWeight: 800, fontSize: 13 }}>{t.momentTitle}</div>
      <div style={{ color: "#00B894", fontWeight: 900, fontSize: 13 }}>{t.momentTurnOn}</div>
    </button>
  ) : null;

  return (
    <button onClick={abrir} className="card"
      style={{ border: "none", width: "100%", padding: 14, marginBottom: 14, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 12, textAlign: "left",
        borderLeft: `8px solid ${principio.cor}` }}>
      <div style={{ fontSize: 28 }}>{feitoHoje ? "💚" : "🕊️"}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="display" style={{ color: "#1B2A6B", fontSize: 16 }}>{t.momentTitle}</div>
        <div style={{ color: "#8B93AD", fontWeight: 800, fontSize: 11 }}>
          {feitoHoje ? t.momentDone : `${principio.icone} ${principio[lang] || principio.en}`}
        </div>
      </div>
      {momento.sequencia > 0 && (
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "4px 10px", fontWeight: 900, fontSize: 12 }}>
          🔥 {momento.sequencia}
        </div>
      )}
    </button>
  );
}


/* Melhor nível vencido em cada tema da memória. memBest é "tema:nivel", e o
   que interessa ao adulto é até onde a criança chegou em cada um. */
function memoriaResumo(save) {
  const por = new Map();
  for (const [chave, v] of Object.entries(save?.memBest || {})) {
    const [tema, nivel] = partirChaveMemoria(chave);
    const ordem = DIFFS.indexOf(nivel);
    if (ordem < 0) continue;
    const atual = por.get(tema);
    if (!atual || ordem > atual.ordem) por.set(tema, { tema, nivel, ordem, ...v });
  }
  return [...por.values()].sort((a, b) => b.ordem - a.ordem);
}


function nomeDoTemaMemoria(tema, t) {
  const alvo = alvoDe(tema);
  if (alvo) return `${t.games.wordMem} · ${LANG_CATALOG[alvo] || alvo}`;
  return { flags: t.games.memory, animals: t.games.animals, arts: t.games.artMem, bible: t.games.bibleMem }[tema] || tema;
}


/* Um cartão de criança: os números da semana escolhida, os desenhos daquela
   semana, os recordes de memória e o progresso por trilha. */
function CartaoFilho({ t, lang, perfil, save, presente, presentear }) {
  const st = save?.stats || {};
  /* O que dá para dar agora. Se nem o menor degrau couber, o degrau é o
     próprio resto: 5 lumicoins guardadas não valem nada para ninguém. */
  const valoresDoPresente = (() => {
    const cabem = [10, 25, 50].filter(v => v <= presente.restante);
    return cabem.length ? cabem : presente.restante > 0 ? [presente.restante] : [];
  })();
  const semanas = save?.semanas || {};
  const chaves = Object.keys(semanas).sort();
  const atual = semanaAtual();
  if (!chaves.includes(atual)) chaves.push(atual);      // a semana corrente sempre aparece
  const [qual, setQual] = useState(chaves.length - 1);
  const chave = chaves[Math.min(qual, chaves.length - 1)];
  const semana = { ...SEMANA_VAZIA, ...(semanas[chave] || {}) };
  const vazia = !Object.values(semana).some(v => v > 0);

  const conquistas = ACHIEVEMENTS.filter(a => a.test(st)).length;
  const trilhas = Object.entries(save?.progress || {}).filter(([, v]) => v > 0);
  // A galeria guarda a data de cada desenho: dá para mostrar os da semana.
  const [ini] = [chave];
  const fimSemana = (() => { const [a, m, d] = chave.split("-").map(Number); const x = new Date(a, m - 1, d + 6);
    return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; })();
  const desenhosDaSemana = (save?.gallery || []).filter(g => g.data >= ini && g.data <= fimSemana);
  const cadernoDaSemana = (save?.caderno || []).filter(r => r.d >= ini && r.d <= fimSemana);

  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <Avatar a={perfil.avatar} size={64} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="display" style={{ color: "#1B2A6B", fontSize: 19 }}>{perfil.name || "—"}</div>
          <div style={{ color: "#8B93AD", fontWeight: 800, fontSize: 12 }}>
            {perfil.idade ? `${perfil.idade} ${t.years} · ` : ""}
            {ehLeitor(perfil) ? t.reads : t.readsNot}
          </div>
          {(save?.ano || perfil.estado) && (
            <div style={{ color: "#00875A", fontWeight: 900, fontSize: 11 }}>
              {save?.ano ? `🎒 ${nomeDoAno(save.ano, t)}` : ""}
              {save?.ano && perfil.estado ? " · " : ""}
              {perfil.estado ? `📍 ${perfil.estado}` : ""}
            </div>
          )}
        </div>
      </div>

      {/* A semana, que recomeça todo domingo. É a primeira coisa do cartão
          porque é a pergunta que o adulto faz: o que ele fez esta semana? */}
      <div style={{ background: "#EEF1FF", borderRadius: 16, padding: 10, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Btn small color={qual === 0 ? "#C7CEE0" : "#4C6FFF"} disabled={qual === 0}
            onClick={() => setQual(q => q - 1)} rotulo={t.a11yPrev}>◀</Btn>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 14 }}>
              {chave === atual ? t.thisWeek : t.week} {intervaloDaSemana(chave, lang)}
            </div>
          </div>
          <Btn small color={qual >= chaves.length - 1 ? "#C7CEE0" : "#4C6FFF"} disabled={qual >= chaves.length - 1}
            onClick={() => setQual(q => q + 1)} rotulo={t.a11yNext}>▶</Btn>
        </div>

        {vazia ? (
          <div style={{ textAlign: "center", color: "#8B93AD", fontWeight: 700, fontSize: 11, padding: "2px 0 4px" }}>
            {t.weekNothing}
          </div>
        ) : (
          <div style={{ display: "flex" }}>
            {[["🎮", semana.rodadas], ["🎯", semana.certas], ["⭐", semana.estrelas],
              ["🎨", semana.desenhos], ["🧠", semana.memorias], ["🧩", semana.quebras],
              ["📔", semana.registros], ["👥", semana.duplas], ["🕊️", semana.momentos],
              ["🪙", semana.lumicoins]].map(([ic, v]) => (
              <div key={ic} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 14 }}>{ic}</div>
                <div className="display" style={{ fontSize: String(v).length > 3 ? 13 : 15, color: "#1B2A6B" }}>{v}</div>
              </div>
            ))}
          </div>
        )}

        {desenhosDaSemana.length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
            {desenhosDaSemana.slice(-5).reverse().map((g, i) => {
              const art = acharArte(g.id);
              return art ? (
                <div key={i} style={{ border: "2px solid #fff", borderRadius: 12, padding: 2, background: "#fff", lineHeight: 0 }}>
                  <Mini art={art} fills={g.fills} size={40} />
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, flex: 1 }}>🎁 {t.giveGift}</div>
        {/* Com 5 lumicoins no cofre, os três botões de 10, 25 e 50 ficavam
            apagados e o resto da semana morria ali sem ninguém receber.
            Agora aparece o que cabe — e, quando nada cabe, o que sobrou. */}
        {valoresDoPresente.length
          ? valoresDoPresente.map(v => (
            <Btn key={v} small color="#E84393" onClick={() => presentear(perfil, v)}>+{v}</Btn>
          ))
          : <div style={{ color: "#B3BBD4", fontWeight: 800, fontSize: 11 }}>{t.giftGone}</div>}
      </div>

      <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, marginBottom: 5 }}>∑ {t.allTime}</div>
      <div style={{ display: "flex", marginBottom: 10 }}>
        {[["🎮", st.rounds || 0], ["⭐", st.stars || 0], ["🏅", `${conquistas}/${ACHIEVEMENTS.length}`],
          ["📅", st.dayStreak || 0], ["🪙", st.earned || 0]].map(([ic, v]) => (
          <div key={ic} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 16 }}>{ic}</div>
            <div className="display" style={{ fontSize: 16, color: "#1B2A6B" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* O caderno da criança, com as palavras dela. É a parte do cartão que
          o adulto lê inteira — o resto ele confere. */}
      {cadernoDaSemana.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, flex: 1 }}>📔 {t.notebook}</div>
            <div style={{ color: "#6C7695", fontWeight: 900, fontSize: 11 }}>{st.registros || 0} {t.notesTotal}</div>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            {cadernoDaSemana.slice(-3).reverse().map((r, i) => (
              <PaginaCaderno key={i} r={r} lang={lang} compacta />
            ))}
          </div>
        </div>
      )}

      {/* Onde o filho está devendo. Sai de graça da fila de revisão, e é a
          resposta à pergunta que o responsável realmente tem — não "quanto ele
          jogou", mas "no que ele precisa de mim". Não é lista de vergonha: é
          onde ajudar, e some sozinha quando a criança aprende. */}
      {(() => {
        const devendo = ondeEstaDevendo(save?.revisao);
        if (!devendo.length) return null;
        return (
          <div style={{ marginBottom: 10 }}>
            <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, letterSpacing: .5, marginBottom: 6 }}>
              {t.owing.toUpperCase()}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {devendo.map(x => (
                <div key={x.cont} style={{ display: "flex", alignItems: "center", gap: 8,
                  background: "#FFF4E0", borderRadius: 10, padding: "7px 10px" }}>
                  <div style={{ flex: 1, color: "#6B4E00", fontWeight: 800, fontSize: 12,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {nomeDaTrilha(x.cont, t)}
                  </div>
                  <div className="display" style={{ color: "#B07000", fontSize: 15 }}>{x.vezes}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {!!(save?.gallery?.length) && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, flex: 1 }}>🎨 {t.games.color}</div>
            <div style={{ color: "#6C7695", fontWeight: 900, fontSize: 11 }}>{st.colorDone || 0} {t.painted}</div>
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {save.gallery.slice(-5).reverse().map((g, i) => {
              const art = acharArte(g.id);
              return art ? (
                <div key={i} style={{ border: "2px solid #E4E8F5", borderRadius: 12, padding: 2, background: "#fff", lineHeight: 0 }}>
                  <Mini art={art} fills={g.fills} size={44} />
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {memoriaResumo(save).length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, marginBottom: 5 }}>🧠 {t.memories}</div>
          <div style={{ display: "grid", gap: 4 }}>
            {memoriaResumo(save).map(m => (
              <div key={m.tema} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ background: BAND_COLOR[m.nivel], color: "#fff", borderRadius: 8,
                  padding: "2px 6px", fontWeight: 900, fontSize: 10, whiteSpace: "nowrap" }}>
                  {MEM_LEVELS[m.nivel].cols}×{MEM_LEVELS[m.nivel].rows}
                </div>
                <div style={{ flex: 1, fontSize: 11, fontWeight: 800, color: "#3B4468", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {nomeDoTemaMemoria(m.tema, t)}
                </div>
                <div style={{ fontSize: 10, letterSpacing: -1 }}>
                  {[1, 2, 3].map(i => <span key={i} style={{ opacity: (m.stars || 0) >= i ? 1 : .25 }}>★</span>)}
                </div>
                {m.time != null && (
                  <div style={{ fontSize: 10, fontWeight: 900, color: "#8B93AD", width: 40, textAlign: "right" }}>
                    ⏱️ {tempoFmt(m.time)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {trilhas.length > 0 && (
        <>
          <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, marginBottom: 5 }}>{t.byGame}</div>
          <div style={{ display: "grid", gap: 5 }}>
            {trilhas.map(([cont, feitas]) => {
              const total = totalDe(cont);
              return (
                <div key={cont} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, fontSize: 11, fontWeight: 800, color: "#3B4468", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {nomeDaTrilha(cont, t)}
                  </div>
                  <div style={{ width: 70, height: 8, borderRadius: 5, background: "#E9ECF7", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (feitas / total) * 100)}%`, height: "100%", background: "#00B894" }} />
                  </div>
                  <div style={{ width: 46, textAlign: "right", fontSize: 11, fontWeight: 900, color: "#6C7695" }}>
                    {feitas}/{total}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}


/* ---------- O que mudou no app ----------
   Fechado por padrão para não empurrar changelog na cara de ninguém; com um
   pontinho quando há coisa que este aparelho ainda não viu. Abriu, some o
   pontinho — e some para sempre, não volta a cada abertura. */
function Novidades({ t, lang, novo, aoAbrir }) {
  const [aberto, setAberto] = useState(false);
  const txt = n => n.t[lang] || n.t.en;
  return (
    <div className="card" style={{ padding: 0, marginBottom: 12, overflow: "hidden" }}>
      <button onClick={() => { setAberto(a => !a); if (!aberto) aoAbrir(); }}
        style={{ width: "100%", border: "none", background: "transparent", cursor: "pointer",
          padding: 14, display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
        <div style={{ fontSize: 26 }}>📣</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="display" style={{ color: "#1B2A6B", fontSize: 16 }}>{t.news}</div>
          <div style={{ color: "#8B93AD", fontWeight: 800, fontSize: 11 }}>
            v{NOVIDADES[0].v} · {NOVIDADES[0].d}
          </div>
        </div>
        {novo && (
          <span style={{ background: "#E84393", color: "#fff", borderRadius: 999,
            padding: "3px 9px", fontWeight: 900, fontSize: 10, letterSpacing: .5 }}>
            {t.newsNew.toUpperCase()}
          </span>
        )}
        <div style={{ color: "#8B93AD", fontWeight: 900 }}>{aberto ? "▲" : "▼"}</div>
      </button>

      {aberto && (
        <div style={{ padding: "0 14px 14px" }}>
          {NOVIDADES.map(nova => (
            <div key={nova.v} style={{ borderTop: "1px solid #E4E8F5", paddingTop: 10, marginTop: 10 }}>
              <div className="display" style={{ color: "#1B2A6B", fontSize: 14 }}>{txt(nova).titulo}</div>
              <div style={{ color: "#8B93AD", fontWeight: 800, fontSize: 10, marginBottom: 6 }}>
                v{nova.v} · {nova.d}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {txt(nova).itens.map((item, k) => (
                  <div key={k} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                    <span style={{ color: "#00B894", fontWeight: 900, fontSize: 12, lineHeight: 1.5 }}>✦</span>
                    <span style={{ color: "#3B4468", fontWeight: 700, fontSize: 12, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export function FamilyScreen({ t, lang, familia, setScreen, presente, presentear, momento, setMomento, momentoFeitoHoje, temNovidade, marcarNovidadeLida }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("profiles")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 22, flex: 1 }}>👨‍👩‍👧 {t.family}</div>
      </div>
      <div style={{ color: "#C9D2FF", fontWeight: 700, fontSize: 12, marginBottom: 12 }}>{t.familyHint}</div>

      {/* O que mudou. Fica na área do responsável porque é ele quem instala
          e quem nunca teria como saber que apareceu jogo novo: não há loja,
          não há notificação, não há e-mail. */}
      <Novidades {...{ t, lang, novo: temNovidade, aoAbrir: marcarNovidadeLida }} />

      <CartaoMomento {...{ t, lang, momento, setMomento, feitoHoje: momentoFeitoHoje, responsavel: true, abrir: () => setScreen("devocional") }} />

      {/* A mesada da semana. Fica no topo porque é o que traz o adulto de volta. */}
      <div className="card" style={{ padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 30 }}>🎁</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="display" style={{ color: "#1B2A6B", fontSize: 17 }}>{t.giftWeek}</div>
          <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 11, lineHeight: 1.5 }}>{t.giftHint}</div>
        </div>
        <div className="display" style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 14px", fontSize: 17 }}>
          🪙 {presente.restante}
        </div>
      </div>

      {!familia.length && (
        <div className="card" style={{ padding: 20, textAlign: "center", color: "#6C7695", fontWeight: 800, fontSize: 14 }}>
          {t.familyEmpty}
        </div>
      )}

      <div className="lista">
        {familia.map(({ perfil, save }) => (
          <CartaoFilho key={perfil.id} {...{ t, lang, perfil, save, presente, presentear }} />
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        {/* O responsável também joga: é o mesmo perfil, com progresso próprio. */}
        <Btn full color="#00B894" onClick={() => setScreen("home")}>🎮 {t.play}</Btn>
        <Btn full color="#4C6FFF" onClick={() => setScreen("profiles")}>👥 {t.switchPlayer}</Btn>
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}


/* ---------- Perfil do jogador ---------- */
export function PlayerCard({ t, lang, player, coins, stats, progress, unlocked, seenAch, setScreen, abrir, podeResgatar, resgatar, voz, setVoz, vozOk, som, trocarSom, somOk }) {
  const verso = versoDoDia(lang);
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
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 22, flex: 1 }}>{t.profileTitle}</div>
      </div>

      <div className="card" style={{ padding: 18, textAlign: "center", marginBottom: 12 }}>
        {/* O avatar sozinho deixava metade do cartão em branco. Ali agora fica
            o versículo do dia — o mesmo o dia inteiro, para dar tempo de
            decorar, e só de Salmos e Provérbios. */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
          <Avatar a={player.avatar} size={104} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
              <Mundi size={24} />
              <span className="display" style={{ color: "#8B93AD", fontSize: 12, letterSpacing: 1 }}>LUMUS</span>
            </div>
            <div style={{ color: "#3B4468", fontWeight: 800, fontSize: 13, lineHeight: 1.45 }}>
              “{verso.texto}”
            </div>
            <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11, marginTop: 5 }}>{verso.ref}</div>
          </div>
        </div>
        <div className="display" style={{ color: "#1B2A6B", fontSize: 24, marginTop: 10 }}>{player.name}</div>
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

      {/* Só aparece se o aparelho tiver voz instalada que funcione offline.
          Sem isso o interruptor prometeria algo que não acontece. */}
      {vozOk && (
        <div className="card" style={{ padding: 12, marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 26 }}>{voz ? "🔊" : "🔇"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 16 }}>{t.voice}</div>
            <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 11, lineHeight: 1.4 }}>{t.voiceHint}</div>
          </div>
          <Btn small color={voz ? "#00B894" : "#8B93AD"} onClick={() => setVoz(v => !v)}>
            {voz ? t.voiceOn : t.voiceOff}
          </Btn>
        </div>
      )}

      {/* O som de fundo fica do lado do da voz porque é a mesma pergunta para
          quem cuida: quanto barulho este app faz na minha casa. */}
      {somOk && (
        <div className="card" style={{ padding: 12, marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 26 }}>{som ? "🎵" : "🔕"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 16 }}>{t.sound}</div>
            <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 11, lineHeight: 1.4 }}>{t.soundHint}</div>
          </div>
          <Btn small color={som ? "#00B894" : "#8B93AD"} onClick={trocarSom}>
            {som ? t.soundOn : t.soundOff}
          </Btn>
        </div>
      )}

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
