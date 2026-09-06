/**
 * KidsGameHub — as peças de tela usadas em todo lugar
 * ElCamargo Soluções em TI LTDA
 *
 * Saiu do App.jsx sem uma linha de lógica mudada — só recortada e colada
 * (ver docs/decisoes/0005-as-telas-em-arquivos.md).
 */

import React, { useState, useEffect } from "react";
import { fmt } from "../lib/catalogo.js";
import { parar as pararSom, tocar as tocarSom } from "../lib/som.js";
import { falando, falar, parar as pararVoz } from "../lib/voz.js";


/* ---------- Avatar SVG ----------
   Um único desenho serve para o jogo E para a vitrine da loja,
   então o que a criança vê na loja é exatamente o que ela leva. */
export const SKINS = ["#FFDBAC", "#F1C27D", "#E0AC69", "#C68642", "#8D5524", "#5C3317"];

export const HAIRS = ["#2C1B10", "#6B3E26", "#C68642", "#E8B923", "#D64545", "#7B4EBE", "#2E86DE"];

export const SHIRTS = ["#4C6FFF", "#00B894", "#FF7043", "#E84393", "#F9A826", "#00C2CB"];

const HAIR_STYLES = ["short", "buzz", "curly", "long", "bob", "wavy", "ponytail", "afro", null];


/* O cabelo é desenhado em duas camadas: HairBack fica ATRÁS do rosto (é a
   silhueta) e HairFront por cima (é a franja). Como o rosto é desenhado no
   meio das duas, basta a silhueta cobrir tudo — o que sobra por trás da
   cabeça é justamente o que a criança vê. */
function HairBack({ style, color }) {
  if (style === "afro") return <circle cx="50" cy="36" r="31" fill={color} />;
  if (style === "long") return <path d="M20 40 Q20 14 50 14 Q80 14 80 40 L80 76 Q71 70 71 52 L29 52 Q29 70 20 76 Z" fill={color} />;
  // Chanel: passa das orelhas e para na altura do queixo.
  if (style === "bob") return <path d="M17 46 Q17 10 50 10 Q83 10 83 46 L83 66 Q83 72 77 72 Q71 72 71 65 L71 44 L29 44 L29 65 Q29 72 23 72 Q17 72 17 66 Z" fill={color} />;
  // Comprido ondulado: duas mechas caem sobre os ombros, com a ponta em onda.
  if (style === "wavy") return <path d="M16 46 Q16 8 50 8 Q84 8 84 46 L84 80 Q84 87 79 85 Q74 90 71 84 L71 44 L29 44 L29 84 Q26 90 21 85 Q16 87 16 80 Z" fill={color} />;
  if (style === "ponytail") return <ellipse cx="80" cy="48" rx="9" ry="15" fill={color} />;
  return null;
}

function HairFront({ style, color }) {
  if (!style) return null;
  if (style === "buzz") return <path d="M25 40 Q28 22 50 22 Q72 22 75 40 Q62 32 50 32 Q38 32 25 40 Z" fill={color} />;
  // Franja reta, cortada na altura das sobrancelhas.
  if (style === "bob") return <path d="M23 40 Q24 12 50 12 Q76 12 77 40 Q77 31 50 29 Q23 31 23 40 Z" fill={color} />;
  // Franja repartida de lado.
  if (style === "wavy") return <path d="M22 41 Q23 11 50 11 Q78 11 79 41 Q73 24 54 28 Q36 32 22 41 Z" fill={color} />;
  if (style === "curly") return (
    <g fill={color}>
      <circle cx="30" cy="31" r="11" /><circle cx="44" cy="23" r="12" />
      <circle cx="58" cy="23" r="12" /><circle cx="71" cy="32" r="11" />
    </g>
  );
  return <path d="M24 40 Q26 16 50 16 Q74 16 76 40 Q66 28 50 30 Q34 32 24 40 Z" fill={color} />;
}


function Glasses({ kind }) {
  if (kind === "round") return <g stroke="#2b2b2b" strokeWidth="2.5" fill="none"><circle cx="40" cy="45" r="8" /><circle cx="60" cy="45" r="8" /><path d="M48 45 H52" /></g>;
  if (kind === "nerd") return <g stroke="#2b2b2b" strokeWidth="3.5" fill="none"><rect x="30" y="38" width="18" height="14" rx="4" /><rect x="52" y="38" width="18" height="14" rx="4" /><path d="M48 45 H52" /></g>;
  if (kind === "sun") return <g><rect x="29" y="38" width="19" height="13" rx="5" fill="#2b2b2b" /><rect x="52" y="38" width="19" height="13" rx="5" fill="#2b2b2b" /><path d="M48 44 H52" stroke="#2b2b2b" strokeWidth="3" /><path d="M31 41 L36 41" stroke="#fff" strokeWidth="2" opacity=".6" /></g>;
  if (kind === "heart") return (
    <g stroke="#E84393" strokeWidth="2.5" fill="none">
      <path d="M40 40 c -1.6 -3.6 -8 -2.6 -8 1.8 c 0 3.6 5.2 6 8 8.4 c 2.8 -2.4 8 -4.8 8 -8.4 c 0 -4.4 -6.4 -5.4 -8 -1.8 z" transform="translate(-1,0)" />
      <path d="M60 40 c -1.6 -3.6 -8 -2.6 -8 1.8 c 0 3.6 5.2 6 8 8.4 c 2.8 -2.4 8 -4.8 8 -8.4 c 0 -4.4 -6.4 -5.4 -8 -1.8 z" transform="translate(3,0)" />
    </g>
  );
  return null;
}


function Headwear({ value }) {
  if (!value) return null;
  const [shape, color] = String(value).split("|");
  if (shape === "crown") return (
    <g>
      <path d="M24 32 L24 14 L36 24 L50 10 L64 24 L76 14 L76 32 Z" fill="#F1C40F" stroke="#D4A017" strokeWidth="2" strokeLinejoin="round" />
      <rect x="23" y="31" width="54" height="8" rx="4" fill="#F1C40F" stroke="#D4A017" strokeWidth="2" />
      <circle cx="50" cy="35" r="3" fill="#E74C3C" /><circle cx="34" cy="35" r="2.4" fill="#4C6FFF" /><circle cx="66" cy="35" r="2.4" fill="#00B894" />
    </g>
  );
  if (shape === "explorer") return (
    <g>
      <path d="M6 40 Q50 30 94 40 Q50 50 6 40 Z" fill="#8D6E3A" />
      <path d="M28 38 Q30 14 50 14 Q70 14 72 38 Z" fill="#A98047" />
      <path d="M28 34 H72 V39 H28 Z" fill="#5C4326" />
    </g>
  );
  if (shape === "beanie") return (
    <g>
      <path d="M24 34 Q24 12 50 12 Q76 12 76 34 Z" fill={color} />
      <rect x="21" y="32" width="58" height="9" rx="4.5" fill="#fff" opacity=".85" />
      <circle cx="50" cy="10" r="5" fill="#fff" opacity=".85" />
    </g>
  );
  if (shape === "bow") return (
    <g fill={color}>
      <path d="M50 24 L34 15 L34 33 Z" /><path d="M50 24 L66 15 L66 33 Z" /><circle cx="50" cy="24" r="5" />
    </g>
  );
  // boné
  return (
    <g>
      <path d="M22 34 Q24 12 50 12 Q76 12 78 34 Z" fill={color} />
      <path d="M22 34 Q10 36 8 42 Q30 42 50 36 Z" fill={color} opacity=".85" />
      <circle cx="50" cy="13" r="3.5" fill="#fff" opacity=".8" />
    </g>
  );
}


function ShirtPattern({ kind }) {
  if (kind === "stripe") return <path d="M23 86 H77 M22 94 H78" stroke="#fff" strokeWidth="5" opacity=".75" />;
  if (kind === "dots") return (
    <g fill="#fff" opacity=".8">
      <circle cx="36" cy="85" r="3" /><circle cx="50" cy="92" r="3" /><circle cx="64" cy="85" r="3" />
      <circle cx="43" cy="98" r="3" /><circle cx="57" cy="98" r="3" />
    </g>
  );
  if (kind === "star") return <path d="M50 80 L54 89 L64 90 L56 96 L59 100 L50 95 L41 100 L44 96 L36 90 L46 89 Z" fill="#FFE066" />;
  if (kind === "heart") return <path d="M50 100 C40 93 34 89 34 84 c 0 -5 7 -6 9 -1 c 2 -5 9 -4 9 1 c 0 5 -6 9 -2 16 z" fill="#fff" opacity=".85" transform="translate(-1,-4)" />;
  if (kind === "rainbow") return (
    <g fill="none" strokeWidth="4" strokeLinecap="round">
      <path d="M34 100 A16 16 0 0 1 66 100" stroke="#E74C3C" />
      <path d="M40 100 A10 10 0 0 1 60 100" stroke="#F9A826" />
      <path d="M46 100 A4 4 0 0 1 54 100" stroke="#00B894" />
    </g>
  );
  return null;
}


export function Avatar({ a, size = 96 }) {
  const hs = a.hairStyle === undefined ? "short" : a.hairStyle;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <path d="M20 100 Q20 74 50 74 Q80 74 80 100 Z" fill={a.shirt} />
      <ShirtPattern kind={a.shirtPattern} />
      <rect x="43" y="64" width="14" height="14" rx="6" fill={a.skin} />
      <HairBack style={hs} color={a.hair} />
      <ellipse cx="50" cy="44" rx="26" ry="27" fill={a.skin} />
      <circle cx="23" cy="46" r="5" fill={a.skin} />
      <circle cx="77" cy="46" r="5" fill={a.skin} />
      <HairFront style={hs} color={a.hair} />
      <ellipse cx="40" cy="45" rx="4" ry="5" fill="#2b2b2b" />
      <ellipse cx="60" cy="45" rx="4" ry="5" fill="#2b2b2b" />
      <circle cx="41.5" cy="43" r="1.4" fill="#fff" />
      <circle cx="61.5" cy="43" r="1.4" fill="#fff" />
      <circle cx="32" cy="53" r="4.5" fill="#FF8FA3" opacity=".55" />
      <circle cx="68" cy="53" r="4.5" fill="#FF8FA3" opacity=".55" />
      <path d="M42 57 Q50 64 58 57" stroke="#2b2b2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Glasses kind={a.glasses} />
      <Headwear value={a.cap} />
    </svg>
  );
}


/* ---------- Marca ----------
   Fica no topo de todas as telas, discreta o bastante para não competir com
   o título de cada uma, mas presente o suficiente para fixar o nome. */
export function Marca() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10, opacity: .6 }}>
      <svg width="17" height="17" viewBox="0 0 100 100" aria-hidden="true">
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
          const r = (a * Math.PI) / 180;
          return <line key={a} x1={50 + Math.cos(r) * 40} y1={44 + Math.sin(r) * 40}
            x2={50 + Math.cos(r) * 52} y2={44 + Math.sin(r) * 52}
            stroke="#F9A826" strokeWidth="7" strokeLinecap="round" />;
        })}
        <circle cx="50" cy="44" r="29" fill="#FFD659" />
        <rect x="38" y="72" width="24" height="8" rx="4" fill="#B8C2DA" />
        <rect x="41" y="83" width="18" height="7" rx="3.5" fill="#96A2C3" />
      </svg>
      <span className="display" style={{ color: "#C9D2FF", fontSize: 13, letterSpacing: 3 }}>LUMUS</span>
    </div>
  );
}


/* ---------- Mundi, o mascote ---------- */
export function Mundi({ size = 72, bounce = true }) {
  return (
    <div className={bounce ? "mundi-bob" : ""} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="46" r="34" fill="#4C6FFF" />
        <path d="M22 36 Q34 30 44 38 Q52 46 44 54 Q32 58 24 52 Z" fill="#00B894" />
        <path d="M58 26 Q72 28 76 40 Q70 48 60 44 Q54 34 58 26 Z" fill="#00B894" />
        <path d="M56 56 Q72 54 78 62 Q68 74 58 70 Q52 62 56 56 Z" fill="#00B894" />
        <circle cx="40" cy="44" r="7" fill="#fff" /><circle cx="41" cy="45" r="3.4" fill="#222" />
        <circle cx="62" cy="44" r="7" fill="#fff" /><circle cx="63" cy="45" r="3.4" fill="#222" />
        <path d="M42 60 Q50 68 60 60" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M38 82 L34 94 M62 82 L66 94" stroke="#F9A826" strokeWidth="6" strokeLinecap="round" />
      </svg>
    </div>
  );
}


/* ---------- UI base ---------- */
/* rotulo vira aria-label: um botão cujo conteúdo é só "←" não tem nome nenhum
   para um leitor de tela, e o adulto que usa VoiceOver ouve apenas "botão". */
export const Btn = ({ children, onClick, color = "#4C6FFF", disabled, full, small, rotulo }) => (
  <button aria-label={rotulo} onClick={onClick} disabled={disabled}
    className={`chunky ${full ? "w-full" : ""}`}
    style={{
      background: disabled ? "#B9C0CC" : color,
      padding: small ? "10px 16px" : "16px 22px",
      fontSize: small ? 15 : 19,
      opacity: disabled ? .8 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
    }}>{children}</button>
);


export const Coin = ({ n }) => (
  <span className="inline-flex items-center gap-1 font-extrabold">
    <span style={{ fontSize: "1.05em" }}>🪙</span>{n}
  </span>
);


export function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,20,55,.66)", zIndex: 50, display: "grid", placeItems: "center", padding: 20 }}>
      <div className="card pop" onClick={e => e.stopPropagation()} style={{ padding: 20, maxWidth: 380, width: "100%" }}>{children}</div>
    </div>
  );
}


/* ---------- Topo com moedas ---------- */
export function TopBar({ t, player, coins, nextRefill, right, onAvatar, onSwitch, quantos, podeResgatar, resgatar }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <button onClick={onAvatar} aria-label={t.profileTitle}
        style={{ background: "rgba(255,255,255,.16)", borderRadius: 20, padding: 4, border: "none", cursor: onAvatar ? "pointer" : "default" }}>
        <Avatar a={player.avatar} size={44} />
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="display" style={{ color: "#fff", fontSize: 17, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.name}</div>
        {nextRefill != null && !podeResgatar && <div style={{ color: "#B9C6FF", fontSize: 11, fontWeight: 700 }}>{t.nextCoins} {fmt(nextRefill)}</div>}
        {podeResgatar && <div style={{ color: "#9BF3D6", fontSize: 11, fontWeight: 800 }}>🎁 {t.claimReady}</div>}
      </div>
      {onSwitch && (
        <button onClick={onSwitch} aria-label={t.switchPlayer} className="chunky"
          style={{ background: "rgba(255,255,255,.18)", padding: "9px 11px", fontSize: 16, position: "relative" }}>
          👥
          {quantos > 1 && (
            <span style={{
              position: "absolute", top: -5, right: -5, background: "#E84393", color: "#fff",
              borderRadius: 999, fontSize: 10, fontWeight: 900, padding: "1px 5px",
            }}>{quantos}</span>
          )}
        </button>
      )}
      <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "8px 12px", fontWeight: 900, fontSize: 16 }}><Coin n={coins} /></div>
      {podeResgatar && <Btn small color="#00B894" onClick={resgatar}>🎁</Btn>}
      {right}
    </div>
  );
}


/* As caras de quem vai jogar, sobrepostas como cartas na mão. Cabe na mesma
   linha com um ou com três. */
export function Caras({ turma, size = 36 }) {
  return (
    <div style={{ display: "flex", flexShrink: 0 }}>
      {turma.map((j, i) => (
        <div key={i} style={{ marginLeft: i ? -size * 0.35 : 0 }}><Rosto p={j} size={size} /></div>
      ))}
    </div>
  );
}


/* Uma cara para cada convidado. Com quatro jogando, o nome escrito não resolve
   para quem tem cinco anos e ainda não lê — a cara resolve. */
export const CARAS = ["🙂", "🐱", "🦊"];


/* Convidado não tem perfil no aparelho, então não tem avatar. Um rosto
   resolve, e ninguém precisa se cadastrar só para jogar uma partida. */
export function Rosto({ p, size = 40 }) {
  if (p?.avatar) return <Avatar a={p.avatar} size={size} />;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#E9ECF7",
      display: "grid", placeItems: "center", fontSize: size * 0.55 }}>{p?.face || "🙂"}</div>
  );
}

/* Dia local em "AAAA-MM-DD". toISOString não serve: em UTC-3 ele já vira o dia
   seguinte às 21h, e o devocional feito à noite contaria como o de amanhã. */
/* ---------- falar e calar com o mesmo botão ----------
   Tocar no alto-falante no meio da leitura tem que CALAR. Quem tocou de novo
   quer silêncio — não a mesma frase por cima da que já estava saindo. */
export function useFala(lang) {
  const [lendo, setLendo] = useState(false);
  const dizer = (texto, opcoes) => {
    setLendo(true);
    if (!falar(texto, { lang, ...opcoes, aoTerminar: () => setLendo(false) })) setLendo(false);
  };
  const calar = () => { pararVoz(); setLendo(false); };
  useEffect(() => calar, []);
  return { lendo, dizer, calar, alternar: (texto, opcoes) => lendo ? calar() : dizer(texto, opcoes) };
}


/* ---------- o som de fundo ----------
   Um só para o app inteiro, ligado desde a tela de escolher jogador. `fracao`
   é uma referência viva para o quanto sobra do tempo da pergunta, lida a cada
   nota — se fosse valor fixo, a música não aceleraria no fim da pergunta.

   Vale lembrar por que o som não começa sozinho na abertura: navegador
   nenhum deixa um site fazer barulho antes do primeiro toque da pessoa. Ele
   entra no primeiro toque, que na prática é a criança escolhendo o perfil. */
export function useSomDeFundo(ligado, fracao) {
  useEffect(() => {
    if (!ligado) return;
    tocarSom({ fracao: () => (fracao ? fracao.current : null), calado: falando });
    return pararSom;
  }, [ligado, fracao]);
}


/* ---------- o elogio ----------
   Criança que termina uma rodada precisa ouvir que foi bem — inclusive, e
   principalmente, quando foi mal. Por isso a faixa de zero estrela também tem
   frase, e ela nunca cobra: convida a jogar de novo.

   Sorteada entre três porque a mesma frase toda vez para de ser ouvida na
   terceira rodada, e aí vira só um texto na tela. */
export function elogio(t, st) {
  const grupo = st >= 3 ? t.elogios.tudo : st > 0 ? t.elogios.bem : t.elogios.vamos;
  const frases = Object.values(grupo);
  return frases[Math.floor(Math.random() * frases.length)];
}
