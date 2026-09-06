/**
 * KidsGameHub — quem vai jogar, e o cadastro
 * ElCamargo Soluções em TI LTDA
 *
 * Saiu do App.jsx sem uma linha de lógica mudada — só recortada e colada
 * (ver docs/decisoes/0005-as-telas-em-arquivos.md).
 */

import React, { useState, useEffect, useRef } from "react";
import { LANG_CATALOG } from "../data/textos.js";
import { MADE_BY } from "../lib/catalogo.js";
import { ESTADOS } from "../data/brasil.js";
import { Avatar, Btn, HAIRS, Modal, Mundi, SHIRTS, SKINS } from "./base.jsx";


/* ---------- Criação do avatar ----------
   Aqui só o básico e de graça. Chapéu, óculos e estampa vêm da loja,
   para a criança ter o que conquistar com as moedas. */
export function Create({ t, lang, onLang, player, setPlayer, onDone, editando = false, perfilId }) {
  const a = player.avatar;
  const set = (k, v) => setPlayer(p => ({ ...p, avatar: { ...p.avatar, [k]: v } }));
  const campo = (k, v) => setPlayer(p => ({ ...p, [k]: v }));
  const [pinNovo, setPinNovo] = useState("");
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

        {/* Três perguntas antes da aparência. Elas decidem o que a criança
            encontra aberto no hub: quem ainda não lê começa pelos jogos que
            se joga olhando, e não por uma tela de texto que ela não entende. */}
        <div style={{ marginBottom: 14 }}>
          <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginBottom: 6 }}>{t.whoIsIt}</div>
          {editando && (
            <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
              🔒 {t.keepsProgress}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            {[["filho", "🧒", t.roleChild], ["pai", "🧑‍🏫", t.roleParent]].map(([v, ic, rot]) => (
              <button key={v} onClick={() => campo("papel", v)} className="chunky"
                style={{ flex: 1, padding: "10px 6px", fontSize: 13,
                  background: player.papel === v ? "#4C6FFF" : "#E4E8F5",
                  color: player.papel === v ? "#fff" : "#6C7695" }}>
                {ic} {rot}
              </button>
            ))}
          </div>
        </div>

        {player.papel === "pai" && (
          <div style={{ marginBottom: 14 }}>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginBottom: 4 }}>🔒 {t.pinTitle}</div>
            <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 11, marginBottom: 8, lineHeight: 1.5 }}>
              {t.pinWhy}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={pinNovo} onChange={e => setPinNovo(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric" placeholder="0000" aria-label={t.pinTitle}
                style={{ width: 100, padding: "10px 12px", borderRadius: 14, border: "3px solid #E4E8F5",
                  fontWeight: 900, fontSize: 20, letterSpacing: 6, textAlign: "center", outline: "none" }} />
              <div style={{ flex: 1, color: player.pin ? "#00B894" : "#8B93AD", fontWeight: 800, fontSize: 12 }}>
                {player.pin ? `✅ ${t.pinSet}` : t.pinNone}
              </div>
              {player.pin && (
                <Btn small color="#8B93AD" onClick={() => { setPinNovo(""); setPlayer(p => ({ ...p, pin: null })); }}>
                  {t.pinRemove}
                </Btn>
              )}
            </div>
          </div>
        )}

        {player.papel !== "pai" && (
          <>
            <div style={{ marginBottom: 14 }}>
              <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginBottom: 6 }}>{t.howOld}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                {[3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                  <button key={i} onClick={() => campo("idade", i)} className="chunky"
                    style={{ width: 40, padding: "9px 0", fontSize: 14,
                      background: player.idade === i ? "#00B894" : "#E4E8F5",
                      color: player.idade === i ? "#fff" : "#6C7695" }}>{i}</button>
                ))}
                <input
                  value={player.idade > 10 ? String(player.idade) : ""}
                  onChange={e => {
                    const n = parseInt(e.target.value.replace(/D/g, "").slice(0, 3), 10);
                    campo("idade", Number.isFinite(n) && n > 10 ? Math.min(n, 120) : null);
                  }}
                  inputMode="numeric" placeholder={t.ageMore} aria-label={t.ageAny}
                  style={{
                    width: 62, padding: "9px 6px", borderRadius: 20, textAlign: "center",
                    fontWeight: 900, fontSize: 14, outline: "none",
                    border: player.idade > 10 ? "3px solid #00B894" : "3px solid #E4E8F5",
                    background: player.idade > 10 ? "#00B894" : "#E4E8F5",
                    color: player.idade > 10 ? "#fff" : "#6C7695",
                  }} />
              </div>
              <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 11, marginTop: 5 }}>{t.ageAny}</div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginBottom: 6 }}>{t.canRead}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[[false, "🙂", t.readNo], [true, "📖", t.readYes]].map(([v, ic, rot]) => (
                  <button key={String(v)} onClick={() => campo("leitor", v)} className="chunky"
                    style={{ flex: 1, padding: "10px 6px", fontSize: 13,
                      background: player.leitor === v ? "#6A5AE0" : "#E4E8F5",
                      color: player.leitor === v ? "#fff" : "#6C7695" }}>
                    {ic} {rot}
                  </button>
                ))}
              </div>
            </div>

            {lang === "pt" && (
              <div style={{ marginBottom: 14 }}>
                <div className="display" style={{ color: "#1B2A6B", fontSize: 15, marginBottom: 6 }}>{t.myState}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  <button onClick={() => campo("estado", null)} className="chunky"
                    style={{ width: 42, padding: "8px 0", fontSize: 13,
                      background: !player.estado ? "#8B93AD" : "#E4E8F5",
                      color: !player.estado ? "#fff" : "#6C7695" }}>—</button>
                  {[...ESTADOS].sort((a, b) => a.uf.localeCompare(b.uf)).map(e => (
                    <button key={e.uf} onClick={() => campo("estado", e.uf)} className="chunky"
                      aria-label={e.w}
                      style={{ width: 42, padding: "8px 0", fontSize: 13,
                        background: player.estado === e.uf ? "#00B894" : "#E4E8F5",
                        color: player.estado === e.uf ? "#fff" : "#6C7695" }}>{e.uf}</button>
                  ))}
                </div>
                <div style={{ color: "#8B93AD", fontWeight: 700, fontSize: 11, marginTop: 5 }}>{t.stateWhy}</div>
              </div>
            )}          </>
        )}

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
        <Btn full color="#00B894" disabled={!player.name.trim()}
          onClick={async () => {
            if (player.papel === "pai" && pinNovo.length === 4) {
              setPlayer(p => ({ ...p, pin: null }));            // limpa antes de gravar o novo
              const resumo = await resumoSenha(pinNovo, perfilId);
              setPlayer(p => ({ ...p, pin: resumo }));
            }
            onDone();
          }}>{t.ready} 🎉</Btn>
      </div>
    </div>
  );
}


/* ---------- Quem vai jogar ---------- */
/* ---------- Missão, visão e valores, na primeira tela ----------
   Vai embaixo e num carrossel porque quem abre o app é criança querendo
   jogar — mas quem instala é adulto, e ele merece saber, em dois toques e
   sem sair da tela, o que este app é e o que ele nunca vai fazer.

   Cinco cartões, um de cada vez: cinco parágrafos empilhados ninguém lê. */
const SOBRE = [
  { id: "missao", icone: "🎯" },
  { id: "visao", icone: "🔭" },
  { id: "familia", icone: "✝️" },
  { id: "educacao", icone: "📚" },
  { id: "respeito", icone: "🛡️" },
];


function SobreCarrossel({ t }) {
  const trilho = useRef(null);
  const [atual, setAtual] = useState(0);
  const [parado, setParado] = useState(false);

  const irPara = k => {
    setParado(true);
    trilho.current?.scrollTo({ left: k * trilho.current.clientWidth, behavior: "smooth" });
  };

  /* Anda sozinho devagar, e para de vez quando alguém encosta: texto que
     troca embaixo do dedo de quem está lendo é falta de educação. */
  useEffect(() => {
    if (parado) return;
    let quieto = false;
    try { quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { }
    if (quieto) return;
    const id = setInterval(() => {
      const el = trilho.current;
      if (!el || !el.clientWidth) return;
      const prox = (Math.round(el.scrollLeft / el.clientWidth) + 1) % SOBRE.length;
      el.scrollTo({ left: prox * el.clientWidth, behavior: "smooth" });
    }, 7000);
    return () => clearInterval(id);
  }, [parado]);

  return (
    <div style={{ marginTop: 22 }}>
      <div ref={trilho} className="semBarra"
        onPointerDown={() => setParado(true)}
        onScroll={e => {
          const el = e.currentTarget;
          if (el.clientWidth) setAtual(Math.round(el.scrollLeft / el.clientWidth));
        }}
        style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
        {SOBRE.map(c => (
          <div key={c.id} style={{ flex: "0 0 100%", scrollSnapAlign: "center", padding: "0 3px" }}>
            <div style={{ background: "rgba(255,255,255,.12)", borderRadius: 16, padding: "14px 16px", height: "100%" }}>
              <div style={{ fontSize: 21, lineHeight: 1 }}>{c.icone}</div>
              <div className="display" style={{ color: "#fff", fontSize: 16, marginTop: 5 }}>{t.sobre[c.id].t}</div>
              <div style={{ color: "#C9D2FF", fontWeight: 700, fontSize: 12, lineHeight: 1.65, marginTop: 4 }}>
                {t.sobre[c.id].d}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
        {SOBRE.map((c, k) => (
          <button key={c.id} onClick={() => irPara(k)} aria-label={t.sobre[c.id].t}
            aria-current={k === atual ? "true" : undefined}
            style={{
              width: k === atual ? 20 : 8, height: 8, borderRadius: 4, padding: 0, border: "none",
              background: k === atual ? "#fff" : "rgba(255,255,255,.35)",
              cursor: "pointer", transition: "width .2s",
            }} />
        ))}
      </div>
    </div>
  );
}


export function Profiles({ t, profiles, openProfile, newProfile, editProfile, deleteProfile, resetProfile, setScreen, comSenha, salvarCopia, restaurarCopia, som, trocarSom, somOk }) {
  const [editing, setEditing] = useState(false);
  const [ask, setAsk] = useState(null);
  const [zerar, setZerar] = useState(null);
  const [copiar, setCopiar] = useState(null);   // perfil esperando confirmação
  const entrada = useRef(null);
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        {/* O Mundi é o rosto do app: quem abre reconhece antes de ler. */}
        <div style={{ display: "grid", placeItems: "center", marginBottom: 6 }}>
          <Mundi size={72} />
        </div>
        <div className="display" style={{ color: "#fff", fontSize: 40, lineHeight: 1 }}>LUMUS</div>
        <div className="display" style={{ color: "#C9D2FF", fontSize: 18, marginTop: 6 }}>{t.players}</div>
      </div>

      {editing && (
        <div style={{ color: "#C9D2FF", fontWeight: 700, fontSize: 12, textAlign: "center", marginBottom: 10, lineHeight: 1.6 }}>
          ✏️ {t.editHint}
        </div>
      )}

      <div className="grid2">
        {profiles.map(pr => (
          <div key={pr.id} style={{ position: "relative" }}>
            <button onClick={() => !editing && comSenha(pr, openProfile)} className="card"
              style={{ border: "none", width: "100%", padding: 14, display: "grid", placeItems: "center", cursor: "pointer" }}>
              <Avatar a={pr.avatar} size={84} />
              <div className="display" style={{ color: "#1B2A6B", fontSize: 17, marginTop: 6 }}>{pr.name}</div>
              {pr.papel === "pai" && (
                <div style={{ color: "#8B93AD", fontWeight: 900, fontSize: 11 }}>
                  {pr.pin ? "🔒" : "🧑‍🏫"} {t.roleParent}
                </div>
              )}
            </button>
            {editing && (
              <>
                <button onClick={() => comSenha(pr, setAsk)} className="chunky" aria-label={t.del}
                  style={{ position: "absolute", top: -6, right: -6, width: 34, height: 34, borderRadius: 17, background: "#E74C3C", fontSize: 15 }}>✕</button>
                <button onClick={() => comSenha(pr, setZerar)} className="chunky" aria-label={t.reset}
                  style={{ position: "absolute", top: -6, left: -6, width: 34, height: 34, borderRadius: 17, background: "#F9A826", fontSize: 15 }}>↺</button>
                <button onClick={() => comSenha(pr, editProfile)} className="chunky" aria-label={t.editProfile}
                  style={{ position: "absolute", bottom: -6, right: -6, width: 34, height: 34, borderRadius: 17, background: "#4C6FFF", fontSize: 14 }}>✏️</button>
                <button onClick={() => comSenha(pr, setCopiar)} className="chunky" aria-label={t.copyTitle}
                  style={{ position: "absolute", bottom: -6, left: -6, width: 34, height: 34, borderRadius: 17, background: "#00B894", fontSize: 14 }}>💾</button>
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
        {/* O som fica aqui, e não escondido numa configuração: quem quer
            silêncio quer agora, e antes de abrir qualquer perfil. */}
        {somOk && (
          <Btn full small color="rgba(255,255,255,.2)" onClick={trocarSom}
            rotulo={som ? t.soundOff : t.soundOn}>{som ? "🎵" : "🔕"}</Btn>
        )}
      </div>

      {/* Restaurar fica no modo de edição, junto do resto que só o adulto
          mexe — e o arquivo é escolhido pelo seletor do próprio aparelho. */}
      {editing && (
        <div style={{ marginTop: 10 }}>
          <input ref={entrada} type="file" accept="application/json,.json" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; e.target.value = ""; restaurarCopia(f); }} />
          <Btn full small color="rgba(255,255,255,.2)" onClick={() => entrada.current?.click()}>
            📥 {t.restoreTitle}
          </Btn>
          <div style={{ color: "#8E9CE0", fontSize: 11, fontWeight: 700, textAlign: "center", marginTop: 8, lineHeight: 1.6 }}>
            {t.restoreHint}
          </div>
        </div>
      )}

      {copiar && (
        <Modal onClose={() => setCopiar(null)}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40 }}>💾</div>
            <div className="display" style={{ color: "#1B2A6B", fontSize: 20, margin: "8px 0 4px" }}>{t.copyTitle}</div>
            <div style={{ color: "#3B4468", fontWeight: 700, fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
              {t.copyHint.replace("{quem}", copiar.name)}
            </div>
            {/* O caderno da criança vai junto. O adulto tem que saber disso
                antes de mandar o arquivo por aí. */}
            <div style={{ background: "#FFF4E0", borderRadius: 14, padding: 10, color: "#6B4E00",
              fontWeight: 800, fontSize: 12, lineHeight: 1.5, marginBottom: 14 }}>
              ⚠️ {t.copyWarn}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn full small color="#8B93AD" onClick={() => setCopiar(null)}>{t.cancel}</Btn>
              <Btn full small color="#00B894" onClick={() => { salvarCopia(copiar); setCopiar(null); }}>💾 {t.copySave}</Btn>
            </div>
          </div>
        </Modal>
      )}

      <SobreCarrossel t={t} />

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
export function LangScreen({ t, lang, pickLang, setScreen, back }) {
  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(back)} rotulo={t.a11yBack}>←</Btn>
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


/* ---------- Senha do responsável ----------
   ISTO É UMA TRANCA CONTRA CRIANÇA, NÃO SEGURANÇA.

   Tudo mora no aparelho, em localStorage. Quem souber abrir o navegador por
   dentro passa por aqui em um minuto — e não há como ser diferente num app
   sem servidor e sem conta. O que estes quatro números resolvem é o problema
   real: a criança de 6 anos não entra na tela do pai nem apaga o perfil dele.

   Guardo o resumo SHA-256 com o id do perfil como tempero, para a senha não
   ficar legível a olho nu no armazenamento. Quatro dígitos se quebram por
   tentativa e erro; o resumo só evita a leitura casual.

   ponytail: quatro dígitos e resumo local. Se um dia isso virar conta de
   verdade, aí sim entra senha forte e servidor. */
export async function resumoSenha(pin, id) {
  const txt = `lumus:${id}:${pin}`;
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  } catch {
    // Sem WebCrypto (contexto inseguro): guarda um resumo fraco, melhor que texto puro.
    let h = 2166136261;
    for (const c of txt) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
    return "fraco:" + h.toString(16);
  }
}


/* Teclado de quatro dígitos. Sem teclado do sistema: dedo de adulto com o
   celular na mão da criança, e nada de texto para ler. */
export function PinModal({ t, titulo, onOk, onCancelar, erro }) {
  const [pin, setPin] = useState("");
  const digitar = d => setPin(x => (x + d).slice(0, 4));
  return (
    <Modal onClose={onCancelar}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40 }}>🔒</div>
        <div className="display" style={{ fontSize: 21, color: "#1B2A6B", margin: "6px 0 4px" }}>{titulo}</div>
        <div style={{ color: erro ? "#E74C3C" : "#8B93AD", fontWeight: 800, fontSize: 12, marginBottom: 12 }}>
          {erro ? t.pinWrong : t.pinHint}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 14 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: 34, height: 42, borderRadius: 12, display: "grid", placeItems: "center",
              background: "#EEF1FF", color: "#1B2A6B", fontWeight: 900, fontSize: 22,
              border: pin.length === i ? "3px solid #4C6FFF" : "3px solid #E4E8F5",
            }}>{pin[i] ? "•" : ""}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].map(d => (
            <button key={d} className="chunky"
              disabled={d === "✓" && pin.length < 4}
              onClick={() => d === "⌫" ? setPin(x => x.slice(0, -1)) : d === "✓" ? onOk(pin) : digitar(d)}
              style={{
                padding: "14px 0", fontSize: 19,
                background: d === "✓" ? (pin.length === 4 ? "#00B894" : "#B9C0CC") : d === "⌫" ? "#8B93AD" : "#4C6FFF",
              }}>{d}</button>
          ))}
        </div>
        <button onClick={onCancelar}
          style={{ background: "none", border: "none", color: "#8B93AD", fontWeight: 800, fontSize: 13, marginTop: 12, cursor: "pointer" }}>
          {t.cancel}
        </button>
      </div>
    </Modal>
  );
}
