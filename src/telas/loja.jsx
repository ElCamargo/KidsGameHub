/**
 * KidsGameHub — a loja e as conquistas
 * ElCamargo Soluções em TI LTDA
 *
 * Saiu do App.jsx sem uma linha de lógica mudada — só recortada e colada
 * (ver docs/decisoes/0005-as-telas-em-arquivos.md).
 */

import React, { useState } from "react";
import { ACHIEVEMENTS, CONQ_CATS, NIVEL_LABEL, RARITY, SHOP_CATS, SHOP_ITEMS, premioDe } from "../lib/catalogo.js";
import { Avatar, Btn, Coin } from "./base.jsx";


/* ---------- Loja ----------
   Cada vitrine é o avatar do jogador com a peça já vestida:
   o que aparece no cartão é literalmente o que ele leva. */
export function Shop({ t, lang, coins, setCoins, owned, setOwned, player, setPlayer, setScreen, voltaPara = "home" }) {
  const [cat, setCat] = useState("hairStyle");
  const a = player.avatar;
  const optional = ["cap", "glasses", "shirtPattern"]; // dá para não usar nada

  const wear = (type, val) => setPlayer(p => ({ ...p, avatar: { ...p.avatar, [type]: val } }));
  const act = it => {
    if (owned.includes(it.id)) { wear(it.type, it.val); return; }
    if (coins < it.price) return;
    setCoins(c => c - it.price);
    setOwned(o => [...o, it.id]);
    wear(it.type, it.val);
  };

  const items = SHOP_ITEMS.filter(i => i.type === cat);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(voltaPara)} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 24, flex: 1 }}>🛍️ {t.shop}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12, display: "grid", placeItems: "center" }}>
        <Avatar a={a} size={130} />
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
        {SHOP_CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} className="chunky"
            style={{ flex: 1, padding: "9px 2px", fontSize: 11, background: cat === c ? "#6A5AE0" : "rgba(255,255,255,.18)" }}>
            {t.slots[c]}
          </button>
        ))}
      </div>

      <div className="grid3">
        {optional.includes(cat) && (
          <div className="card" style={{ padding: 8, textAlign: "center" }}>
            <div style={{ height: 74, display: "grid", placeItems: "center", fontSize: 30, color: "#B9C0CC" }}>🚫</div>
            <Btn small full color={a[cat] == null ? "#00B894" : "#8B93AD"} onClick={() => wear(cat, null)}>
              {a[cat] == null ? t.equipped : t.remove}
            </Btn>
          </div>
        )}
        {items.map(it => {
          const has = owned.includes(it.id);
          const on = a[it.type] === it.val;
          const preview = { ...a, [it.type]: it.val };
          return (
            <div key={it.id} className="card" style={{ padding: 8, textAlign: "center", borderTop: `6px solid ${RARITY[it.r].cor}` }}>
              <div style={{ height: 74, display: "grid", placeItems: "center", overflow: "hidden", position: "relative" }}>
                <Avatar a={preview} size={74} />
                <span style={{ position: "absolute", top: 0, right: 0, fontSize: 11 }}>{RARITY[it.r].label}</span>
              </div>
              <Btn small full color={on ? "#00B894" : has ? "#4C6FFF" : coins >= it.price ? "#E84393" : "#8B93AD"}
                disabled={!has && coins < it.price} onClick={() => act(it)}>
                {on ? t.equipped : has ? t.equip : it.price ? `🪙${it.price}` : t.free}
              </Btn>
            </div>
          );
        })}
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}


/* ---------- Conquistas ---------- */
export function Awards({ t, lang, stats, seenAch, setScreen, player, voltaPara = "home" }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen(voltaPara)} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 24 }}>🏅 {t.awards}</div>
      </div>
      <div className="card" style={{ padding: 14, marginBottom: 12, maxWidth: 520, marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "space-around", textAlign: "center" }}>
        {[["🏅", `${ACHIEVEMENTS.filter(a => a.test(stats)).length}/${ACHIEVEMENTS.length}`],
          ["🔥", stats.bestStreak], ["💯", stats.perfect],
          ["🪙", ACHIEVEMENTS.filter(a => a.test(stats)).reduce((x, a) => x + premioDe(a), 0)]].map(([i, v]) => (
          <div key={i}><div style={{ fontSize: 22 }}>{i}</div><div className="display" style={{ fontSize: 19, color: "#1B2A6B" }}>{v}</div></div>
        ))}
      </div>
      {CONQ_CATS.map(c => {
        const doGrupo = ACHIEVEMENTS.filter(a => a.cat === c.id);
        if (!doGrupo.length) return null;
        const abertas = doGrupo.filter(a => a.test(stats)).length;
        return (
          <div key={c.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{c.icon}</span>
              <span className="display" style={{ color: "#C9D2FF", fontSize: 16, flex: 1 }}>{c[lang] || c.en}</span>
              <span style={{ color: "#A7B3EA", fontSize: 12, fontWeight: 800 }}>{abertas}/{doGrupo.length}</span>
            </div>
            <div className="lista">
              {doGrupo.map(a => {
                const got = a.test(stats);
                return (
                  <div key={a.id} className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 10, opacity: got ? 1 : .5 }}>
                    <div style={{ fontSize: 26, filter: got ? "none" : "grayscale(1)" }}>{a.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: "#1B2A6B", fontSize: 14 }}>{a[lang] || a.en}</div>
                      <div style={{ fontWeight: 900, fontSize: 11, color: got ? "#00B894" : "#8B93AD" }}>
                        {NIVEL_LABEL[a.n]} · 🪙 {premioDe(a)}
                      </div>
                    </div>
                    <div style={{ fontSize: 19 }}>{got ? "✅" : "🔒"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

