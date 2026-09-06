/**
 * KidsGameHub — desenhar, pintar e a galeria
 * ElCamargo Soluções em TI LTDA
 *
 * Saiu do App.jsx sem uma linha de lógica mudada — só recortada e colada
 * (ver docs/decisoes/0005-as-telas-em-arquivos.md).
 */

import React, { useState } from "react";
import { DESENHOS, PALETA } from "../data/desenhos.js";
import { ECON, PRECO_GERAR } from "../lib/catalogo.js";
import { Btn } from "./base.jsx";



/* ---------- Desenhos gerados ----------
   Cada semente produz sempre o mesmo desenho, então basta guardar o número
   para o desenho existir de novo — nenhuma imagem ocupa espaço. */
function semente(n) {
  let a = n >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


function desenhoGerado(seed) {
  const r = semente(seed);
  const ent = (a, b) => a + Math.floor(r() * (b - a + 1));
  const um = arr => arr[Math.floor(r() * arr.length)];
  const areas = [];
  const estrelaPts = (cx, cy, R1, R2, n, rot) => {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const rr = i % 2 === 0 ? R1 : R2;
      const ang = ((rot + i * 180 / n) * Math.PI) / 180;
      pts.push(`${(cx + Math.cos(ang) * rr).toFixed(1)},${(cy + Math.sin(ang) * rr).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  const tipo = um(["mandala", "bandeira", "robo", "flor", "bicho", "vitral"]);
  let vb = "0 0 200 200", emoji = "✨";

  if (tipo === "mandala") {
    emoji = "🌀";
    const camadas = ent(3, 4);
    for (let k = camadas; k >= 1; k--) {
      const raio = 26 + k * ent(16, 22);
      const n = ent(6, 10);
      const petala = um(["c", "e", "p"]);
      for (let i = 0; i < n; i++) {
        const ang = (i * 360 / n) * Math.PI / 180;
        const cx = 100 + Math.cos(ang) * raio, cy = 100 + Math.sin(ang) * raio;
        const t = 12 + k * 3;
        if (petala === "c") areas.push({ t: "c", cx: +cx.toFixed(1), cy: +cy.toFixed(1), r: t });
        else if (petala === "e") areas.push({ t: "e", cx: +cx.toFixed(1), cy: +cy.toFixed(1), rx: t + 5, ry: t - 4 });
        else areas.push({ t: "p", pts: estrelaPts(cx, cy, t + 4, (t + 4) * 0.45, 5, -90) });
      }
    }
    areas.push({ t: "c", cx: 100, cy: 100, r: ent(18, 26) });
    areas.push({ t: "c", cx: 100, cy: 100, r: ent(8, 14) });

  } else if (tipo === "bandeira") {
    emoji = "🏳️"; vb = "0 0 200 134";
    const layout = um(["h3", "v3", "h5", "cruz", "tri", "cantao"]);
    if (layout === "h3") [0, 45, 89].forEach((y, i) => areas.push({ t: "r", x: 0, y, w: 200, h: i === 1 ? 44 : 45 }));
    else if (layout === "v3") [0, 67, 133].forEach((x, i) => areas.push({ t: "r", x, y: 0, w: i === 1 ? 66 : 67, h: 134 }));
    else if (layout === "h5") for (let i = 0; i < 5; i++) areas.push({ t: "r", x: 0, y: i * 27, w: 200, h: 27 });
    else if (layout === "cruz") {
      areas.push({ t: "r", x: 0, y: 0, w: 200, h: 134 });
      areas.push({ t: "r", x: ent(46, 72), y: 0, w: 30, h: 134 });
      areas.push({ t: "r", x: 0, y: 52, w: 200, h: 30 });
    } else if (layout === "tri") {
      areas.push({ t: "r", x: 0, y: 0, w: 200, h: 67 });
      areas.push({ t: "r", x: 0, y: 67, w: 200, h: 67 });
      areas.push({ t: "p", pts: `0,0 ${ent(60, 96)},67 0,134` });
    } else {
      areas.push({ t: "r", x: 0, y: 0, w: 200, h: 134 });
      areas.push({ t: "r", x: 0, y: 0, w: 86, h: 60 });
    }
    const enfeite = um(["circulo", "estrela", "nada", "estrela"]);
    if (enfeite === "circulo") areas.push({ t: "c", cx: 100, cy: 67, r: ent(24, 34) });
    if (enfeite === "estrela") areas.push({ t: "p", pts: estrelaPts(layout === "cantao" ? 43 : 100, layout === "cantao" ? 30 : 67, ent(18, 28), ent(8, 12), 5, -90) });

  } else if (tipo === "robo") {
    emoji = "🤖";
    const lc = ent(70, 100), ac = ent(50, 70);
    areas.push({ t: "r", x: 100 - lc / 2, y: 42, w: lc, h: ac });
    const olho = um(["c", "r"]);
    [-1, 1].forEach(sx => olho === "c"
      ? areas.push({ t: "c", cx: 100 + sx * ent(14, 20), cy: 42 + ac / 2, r: ent(8, 13) })
      : areas.push({ t: "r", x: 100 + sx * 18 - 10, y: 42 + ac / 2 - 8, w: 20, h: 16 }));
    areas.push({ t: "r", x: 82, y: 42 + ac - 16, w: 36, h: 8 });
    const lcorpo = ent(90, 120), acorpo = ent(46, 62);
    areas.push({ t: "r", x: 100 - lcorpo / 2, y: 42 + ac + 10, w: lcorpo, h: acorpo });
    areas.push({ t: "r", x: 100 - lcorpo / 2 - 30, y: 42 + ac + 22, w: 30, h: 14 });
    areas.push({ t: "r", x: 100 + lcorpo / 2, y: 42 + ac + 22, w: 30, h: 14 });
    areas.push({ t: "r", x: 76, y: 42 + ac + 10 + acorpo, w: 22, h: 20 });
    areas.push({ t: "r", x: 106, y: 42 + ac + 10 + acorpo, w: 22, h: 20 });
    areas.push({ t: "r", x: 96, y: 42 - 22, w: 8, h: 22 });
    areas.push({ t: "c", cx: 100, cy: 42 - 26, r: ent(7, 11) });

  } else if (tipo === "flor") {
    emoji = "🌼";
    const n = ent(5, 9), raio = ent(38, 50), tam = ent(20, 28);
    areas.push({ t: "r", x: 94, y: 100, w: 12, h: 88 });
    areas.push({ t: "e", cx: 66, cy: ent(140, 156), rx: 24, ry: 12 });
    areas.push({ t: "e", cx: 134, cy: ent(150, 168), rx: 24, ry: 12 });
    for (let i = 0; i < n; i++) {
      const ang = (i * 360 / n - 90) * Math.PI / 180;
      areas.push({ t: "c", cx: +(100 + Math.cos(ang) * raio).toFixed(1), cy: +(88 + Math.sin(ang) * raio).toFixed(1), r: tam });
    }
    areas.push({ t: "c", cx: 100, cy: 88, r: ent(20, 26) });

  } else if (tipo === "bicho") {
    emoji = "🐾";
    const rb = ent(38, 50);
    areas.push({ t: "e", cx: 100, cy: 128, rx: rb, ry: rb - 6 });
    areas.push({ t: "c", cx: 100, cy: 70, r: ent(28, 38) });
    const orelha = um(["c", "p"]);
    [-1, 1].forEach(sx => orelha === "c"
      ? areas.push({ t: "c", cx: 100 + sx * 26, cy: 46, r: 13 })
      : areas.push({ t: "p", pts: `${100 + sx * 12},52 ${100 + sx * 34},${ent(14, 26)} ${100 + sx * 36},56` }));
    const no = ent(2, 3);
    for (let i = 0; i < no; i++) areas.push({ t: "c", cx: 100 + (i - (no - 1) / 2) * 22, cy: 66, r: ent(7, 10) });
    areas.push({ t: "e", cx: 100, cy: 84, rx: 8, ry: 6 });
    [-1, 1].forEach(sx => areas.push({ t: "e", cx: 100 + sx * 24, cy: 170, rx: 15, ry: 11 }));

  } else {
    emoji = "🪟";
    const cols = ent(3, 4), rows = ent(3, 4);
    const w = 200 / cols, h = 200 / rows;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const forma = um(["r", "c", "p", "p"]);
      if (forma === "r") areas.push({ t: "r", x: +(i * w).toFixed(1), y: +(j * h).toFixed(1), w: +w.toFixed(1), h: +h.toFixed(1) });
      else if (forma === "c") areas.push({ t: "c", cx: +(i * w + w / 2).toFixed(1), cy: +(j * h + h / 2).toFixed(1), r: +(Math.min(w, h) / 2).toFixed(1) });
      else areas.push({ t: "p", pts: `${(i * w).toFixed(1)},${(j * h + h).toFixed(1)} ${(i * w + w / 2).toFixed(1)},${(j * h).toFixed(1)} ${(i * w + w).toFixed(1)},${(j * h + h).toFixed(1)}` });
    }
  }
  return { id: `g${seed}`, emoji, cat: "gen", vb, areas };
}


/* Acha o desenho pelo id, seja da lista fixa ou gerado */
export const acharArte = id => id.startsWith("g")
  ? desenhoGerado(Number(id.slice(1)))
  : DESENHOS.find(d => d.id === id);


export function Peca({ a, fill, onClick }) {
  const p = { fill: fill || "#fff", stroke: "#2b2b2b", strokeWidth: 3, strokeLinejoin: "round", onClick, style: { cursor: "pointer" } };
  if (a.t === "c") return <circle cx={a.cx} cy={a.cy} r={a.r} {...p} />;
  if (a.t === "e") return <ellipse cx={a.cx} cy={a.cy} rx={a.rx} ry={a.ry} {...p} />;
  if (a.t === "r") return <rect x={a.x} y={a.y} width={a.w} height={a.h} {...p} />;
  if (a.t === "p") return <polygon points={a.pts} {...p} />;
  return <path d={a.d} {...p} />;
}


/* Miniatura sem interação, para a galeria */
export function Mini({ art, fills, size = 72 }) {
  return (
    <svg viewBox={art.vb} width={size} height={size}>
      {art.areas.map((a, i) => <Peca key={i} a={a} fill={fills?.[i]} />)}
    </svg>
  );
}


export function Coloring({ t, art, fillsIniciais, onSalvar, onSair, ganhouHoje }) {
  const [cor, setCor] = useState(PALETA[0]);
  const [fills, setFills] = useState(fillsIniciais || {});
  const total = art.areas.length;
  const pintadas = Object.values(fills).filter(Boolean).length;
  const completo = pintadas >= total;

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={onSair} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 18, flex: 1 }}>{art.emoji} {pintadas}/{total}</div>
        <Btn small color="#8B93AD" onClick={() => setFills({})}>🧽</Btn>
      </div>

      <div className="card" style={{ padding: 10, marginBottom: 10 }}>
        <svg viewBox={art.vb} style={{ width: "100%", display: "block", touchAction: "manipulation" }}>
          {art.areas.map((a, i) => (
            <Peca key={i} a={a} fill={fills[i]} onClick={() => setFills(f => ({ ...f, [i]: cor }))} />
          ))}
        </svg>
      </div>

      <div className="card" style={{ padding: 10, marginBottom: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 6 }}>
          {PALETA.map(c => (
            <button key={c} onClick={() => setCor(c)} aria-label={c}
              style={{
                aspectRatio: "1", borderRadius: 12, background: c, cursor: "pointer",
                border: cor === c ? "4px solid #1B2A6B" : "2px solid #E4E8F5",
              }} />
          ))}
        </div>
      </div>

      <Btn full color={pintadas ? "#00B894" : "#8B93AD"} disabled={!pintadas}
        onClick={() => onSalvar(fills, completo)}>
        {completo ? `✅ ${t.finish}` : `💾 ${t.saveAnyway}`}
      </Btn>
      {ganhouHoje >= ECON.colorDailyCap && (
        <div style={{ textAlign: "center", color: "#C9D2FF", fontSize: 11, fontWeight: 800, marginTop: 10 }}>
          {t.dailyCap}
        </div>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}


/* ---------- Galeria em fichário ----------
   Páginas de 9, como um álbum de figurinhas. */
const CATS_DESENHO = ["flag", "animal", "obj", "space", "gen"];

const CAT_ICON = { flag: "🏳️", animal: "🐾", obj: "🧸", space: "🪐", gen: "✨" };

export const POR_PAGINA = 9;


export function Gallery({ t, gallery, setScreen, abrirDesenho, gerados, gerarMais, coins }) {
  const [aba, setAba] = useState("saved");
  const [pag, setPag] = useState(0);

  const salvos = gallery.slice().reverse();
  const lista = aba === "saved"
    ? salvos
    : aba === "gen"
      ? gerados.map(desenhoGerado)
      : DESENHOS.filter(d => d.cat === aba);
  const paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const p = Math.min(pag, paginas - 1);
  const fatia = lista.slice(p * POR_PAGINA, p * POR_PAGINA + POR_PAGINA);

  const trocarAba = a => { setAba(a); setPag(0); };

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>🎨 {t.games.color}</div>
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
        <button onClick={() => trocarAba("saved")} className="chunky"
          style={{ flex: 1.3, padding: "9px 2px", fontSize: 12, background: aba === "saved" ? "#E84393" : "rgba(255,255,255,.18)" }}>
          🖼️ {gallery.length}
        </button>
        {CATS_DESENHO.map(c => (
          <button key={c} onClick={() => trocarAba(c)} className="chunky"
            style={{ flex: 1, padding: "9px 2px", fontSize: 16, background: aba === c ? "#6A5AE0" : "rgba(255,255,255,.18)" }}>
            {CAT_ICON[c]}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 10, minHeight: 300 }}>
        {fatia.length === 0 ? (
          <div style={{ display: "grid", placeItems: "center", height: 280, color: "#8B93AD", fontWeight: 800, fontSize: 14, textAlign: "center", padding: 20 }}>
            {t.emptyGallery}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {fatia.map((item, k) => {
              const art = aba === "saved" ? acharArte(item.id) : item;
              if (!art) return null;
              const fills = aba === "saved" ? item.fills : null;
              return (
                <button key={k} onClick={() => abrirDesenho(art, fills)}
                  style={{
                    border: "3px solid #E4E8F5", borderRadius: 16, background: "#fff",
                    padding: 4, cursor: "pointer", aspectRatio: "1",
                    display: "grid", placeItems: "center", overflow: "hidden",
                  }}>
                  <Mini art={art} fills={fills} size={82} />
                </button>
              );
            })}
            {Array.from({ length: POR_PAGINA - fatia.length }).map((_, k) => (
              <div key={`v${k}`} style={{ border: "3px dashed #EEF1FF", borderRadius: 16, aspectRatio: "1" }} />
            ))}
          </div>
        )}
      </div>

      {aba === "gen" && (
        <Btn full color="#9B59B6" disabled={coins < PRECO_GERAR}
          onClick={() => { gerarMais(); setPag(Math.floor(gerados.length / POR_PAGINA)); }}>
          ✨ {t.generateMore} · 🪙{PRECO_GERAR}
        </Btn>
      )}

      {paginas > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 }}>
          <Btn small color={p === 0 ? "#8B93AD" : "#4C6FFF"} disabled={p === 0} onClick={() => setPag(p - 1)} rotulo={t.a11yPrev}>◀</Btn>
          <div style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: paginas }).map((_, k) => (
              <button key={k} onClick={() => setPag(k)} aria-label={`${k + 1}`}
                style={{
                  width: 11, height: 11, borderRadius: 6, border: "none", cursor: "pointer",
                  background: k === p ? "#F9A826" : "rgba(255,255,255,.35)",
                }} />
            ))}
          </div>
          <Btn small color={p >= paginas - 1 ? "#8B93AD" : "#4C6FFF"} disabled={p >= paginas - 1} onClick={() => setPag(p + 1)} rotulo={t.a11yNext}>▶</Btn>
        </div>
      )}
      <div style={{ textAlign: "center", color: "#A7B3EA", fontSize: 11, fontWeight: 800, marginTop: 8 }}>
        {p + 1} / {paginas}
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}
