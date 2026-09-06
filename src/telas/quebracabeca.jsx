/**
 * KidsGameHub — o quebra-cabeça
 * ElCamargo Soluções em TI LTDA
 *
 * Saiu do App.jsx sem uma linha de lógica mudada — só recortada e colada
 * (ver docs/decisoes/0005-as-telas-em-arquivos.md).
 */

import React, { useState, useEffect, useRef } from "react";
import { PALETA } from "../data/desenhos.js";
import { BAND_COLOR, DIFFS, PZL_PRECO, custoDoQuebra, flagUrl, shuffle, tempoFmt } from "../lib/catalogo.js";
import { GRADES, SALIENCIA, buracoMaisPerto, caminhoDaPeca, pecasDe, totalDePecas } from "../lib/quebracabeca.js";
import { ANIMAIS, BIBLIA_EMOJI, VOCAB } from "../lib/rodadas.js";
import { Btn, Coin } from "./base.jsx";
import { Peca } from "./desenho.jsx";


/* ---------- Quebra-cabeça ----------
   Arrastar com Pointer Events: o mesmo código serve dedo e mouse, e é por
   isso que não entrou nenhuma biblioteca de arrastar-e-soltar no projeto.

   Duas formas de jogar, porque dedo de criança de quatro anos erra o alvo:
   arrastar a peça até o lugar, ou tocar na peça e depois tocar no lugar. A
   segunda salva quem ainda não tem firmeza na mão — e é a única que funciona
   para quem navega por teclado ou toque assistido. */

const CORES_AUTO = PALETA.filter(c => c !== "#FFFFFF");


/* Desenho que ninguém pintou é branco, e peça branca é igual a peça branca.
   Então pintamos por conta — sempre igual para o mesmo desenho, para a
   imagem não mudar no meio da partida. */
export const coresDeFabrica = art =>
  Object.fromEntries(art.areas.map((_, i) => [i, CORES_AUTO[(i * 7 + art.areas.length) % CORES_AUTO.length]]));


/* ---------- o cartaz de figuras ----------
   Uma figura só, esticada no tabuleiro, não dá quebra-cabeça: em 24 peças
   vira mancha, e as peças do fundo ficam todas iguais. Então o tema de
   figuras vira um cartaz quadriculado — uma figura em cada quadrado, cada
   quadrado de uma cor —, e ele cresce junto com o nível.

   O quadriculado do cartaz NUNCA bate com o do corte: são contas diferentes
   de propósito, para a peça não cair certinha em cima de uma figura só. */
const CORES_CARTAZ = ["#FFE0B2", "#C8E6C9", "#B3E5FC", "#F8BBD0", "#D1C4E9", "#FFF9C4", "#B2DFDB", "#FFCCBC"];


/* Coisas de contar, para o cartaz de Matemática. Todas fáceis de reconhecer
   em tamanho pequeno — é para contar, não para adivinhar o que é. */
const DE_CONTAR = ["🍎", "⭐", "⚽", "🐟", "🍌", "🌻", "🚗", "🎈", "🍓", "🐞"];


export function cartazDe(tema, nivel, lang) {
  const { cols, rows } = GRADES[nivel];
  // Uma casa a menos que o corte, em cada sentido: garante o desencontro.
  const ec = Math.max(1, cols - 1), er = Math.max(1, rows - 1);
  const quantas = ec * er;

  /* Sorteia sem repetir enquanto der; passando disso, repete — o que importa
     é o cartaz estar cheio, e figura repetida em quadrado de outra cor
     continua sendo peça diferente. */
  const tirar = lista => {
    const baralho = shuffle([...new Set(lista)]);
    return Array.from({ length: quantas }, (_, i) => baralho[i % baralho.length]);
  };

  let celulas;
  if (tema === "animals") celulas = tirar(ANIMAIS).map(e => ({ emoji: e }));
  else if (tema === "bible") celulas = tirar(BIBLIA_EMOJI).map(e => ({ emoji: e }));
  else if (tema === "words")
    celulas = shuffle(VOCAB).slice(0, quantas).map(v => ({ emoji: v.e, legenda: v.w[lang] || v.w.en }));
  else {
    // Matemática: tantas figuras quanto o número embaixo. Contar é o jogo.
    celulas = Array.from({ length: quantas }, (_, i) => {
      const quantos = 1 + Math.floor(Math.random() * 9);
      return { emoji: DE_CONTAR[i % DE_CONTAR.length], repeticoes: quantos, legenda: String(quantos) };
    });
  }
  // Cor em diagonal: quadrado nenhum fica do lado de outro da mesma cor.
  celulas = celulas.map((c, i) => ({
    ...c, cor: CORES_CARTAZ[(i + Math.floor(i / ec)) % CORES_CARTAZ.length],
  }));
  // Se faltou vocabulário para encher o cartaz, o cartaz encolhe com ele.
  return { tipo: "cartaz", ec, er, celulas, prop: ec / er };
}


/* Um quadrado do cartaz: o fundo, a figura (ou várias, quando é de contar) e
   a legenda embaixo, quando tem. */
function QuadroDoCartaz({ c, x, y, L }) {
  const quantos = c.repeticoes || 1;
  const mc = Math.ceil(Math.sqrt(quantos)), mr = Math.ceil(quantos / mc);
  const alturaFig = c.legenda ? L * 0.66 : L;
  const passo = Math.min(alturaFig / mr, L / mc) * 0.94;
  const x0 = x + (L - passo * mc) / 2, y0 = (c.legenda ? y : y) + (alturaFig - passo * mr) / 2;
  return (
    <g>
      <rect x={x} y={y} width={L} height={L} fill={c.cor} />
      {Array.from({ length: quantos }, (_, i) => (
        <text key={i} x={x0 + (i % mc) * passo + passo / 2} y={y0 + Math.floor(i / mc) * passo + passo / 2}
          fontSize={passo * 0.8} textAnchor="middle" dominantBaseline="central">{c.emoji}</text>
      ))}
      {/* A letra encolhe com o tamanho da palavra: "borboleta" no corpo de
          "lua" invadiria os quadrados do lado, e as duas ficariam ilegíveis.
          1.55 é a largura média de uma letra desta fonte. */}
      {c.legenda && (
        <text x={x + L / 2} y={y + L * 0.85} textAnchor="middle" dominantBaseline="central"
          fontSize={Math.min(L * 0.24, L * 1.55 / String(c.legenda).length)}
          fontWeight="900" fill="#1B2A6B">{c.legenda}</text>
      )}
    </g>
  );
}


/* A imagem inteira, do tamanho que mandarem. Bandeira é arquivo, arte e
   cartaz são SVG, e as três esticam para o retângulo do tabuleiro sem tarja
   branca. */
function ImagemDoQuebra({ fonte }) {
  if (fonte.tipo === "flag")
    return <img src={flagUrl(fonte.code)} alt="" draggable={false}
      style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }} />;
  if (fonte.tipo === "cartaz") {
    const L = 100;
    return (
      <svg viewBox={`0 0 ${fonte.ec * L} ${fonte.er * L}`} preserveAspectRatio="none" aria-hidden="true"
        style={{ width: "100%", height: "100%", display: "block" }}>
        {fonte.celulas.map((c, i) => (
          <QuadroDoCartaz key={i} c={c} L={L} x={(i % fonte.ec) * L} y={Math.floor(i / fonte.ec) * L} />
        ))}
      </svg>
    );
  }
  /* O branco por baixo não é enfeite: sem ele o desenho fica transparente, e
     na bandejinha a peça vira um risco solto no fundo roxo, sem forma que a
     criança consiga pegar com o olho. */
  return (
    <div style={{ width: "100%", height: "100%", background: "#fff" }}>
      <svg viewBox={fonte.art.vb} preserveAspectRatio="none" aria-hidden="true"
        style={{ width: "100%", height: "100%", display: "block" }}>
        {fonte.art.areas.map((a, i) => <Peca key={i} a={a} fill={fonte.fills?.[i]} />)}
      </svg>
    </div>
  );
}


/* Uma peça é uma janela recortada: dentro dela mora a imagem inteira, do
   tamanho do tabuleiro, deslocada para aparecer só o pedaço daquela peça — e
   o clipPath corta esse pedaço no formato do encaixe. Ninguém corta imagem
   nenhuma no build: quem corta é o navegador, e serve arquivo e SVG igual.

   A caixa da peça é maior que a célula, porque o dente sai para fora dela. */
function PecaDoQuebra({ fonte, p, cols, rows, style }) {
  const s = SALIENCIA, k = 1 + 2 * s;
  /* overflow além do clipPath: o recorte é só pintura, e sem ele a imagem
     inteira que mora dentro da peça continua empurrando a rolagem da página
     para o lado. */
  return (
    <div style={{ ...style, overflow: "hidden", clipPath: `url(#pzl${p.i})` }}>
      <div style={{
        position: "absolute",
        width: `${cols / k * 100}%`, height: `${rows / k * 100}%`,
        left: `${-(p.col - s) / k * 100}%`, top: `${-(p.row - s) / k * 100}%`,
      }}>
        <ImagemDoQuebra fonte={fonte} />
      </div>
    </div>
  );
}


export function PuzzleGame({ t, nivel, fonte, ordem, bordas, onFinish, onQuit }) {
  const { cols, rows } = GRADES[nivel];
  const total = totalDePecas(nivel);
  const pecas = pecasDe(nivel);
  const sal = SALIENCIA, k = 1 + 2 * sal;
  /* Onde a peça encaixada se desenha no tabuleiro: a célula dela, alargada
     para os dois lados, porque os dentes avançam sobre as vizinhas. */
  const noTabuleiro = x => ({
    position: "absolute",
    left: `${(x.col - sal) * 100 / cols}%`, top: `${(x.row - sal) * 100 / rows}%`,
    width: `${k * 100 / cols}%`, height: `${k * 100 / rows}%`,
  });
  const [postas, setPostas] = useState([]);
  const [seg, setSeg] = useState(0);
  const [escolhida, setEscolhida] = useState(null);   // peça tocada, esperando o lugar
  const [arrasto, setArrasto] = useState(null);
  const [errou, setErrou] = useState(null);
  const tabuleiro = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setSeg(x => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Um respiro antes do placar: a criança montou, ela quer ver montado.
    if (postas.length === total) {
      const id = setTimeout(() => onFinish(seg), 900);
      return () => clearTimeout(id);
    }
  }, [postas]);

  /* Os lugares não se mexem, então medir na hora de soltar basta — e poupa
     guardar uma referência de tela para cada peça. */
  function lugares() {
    const r = tabuleiro.current?.getBoundingClientRect();
    if (!r) return [];
    const w = r.width / cols, h = r.height / rows;
    return pecas.map(x => ({ i: x.i, x: r.left + x.col * w, y: r.top + x.row * h, w, h }));
  }

  function recusar(i) {
    setErrou(i);
    setTimeout(() => setErrou(null), 450);
  }

  function encaixar(i, x, y) {
    const ls = lugares();
    if (!ls.length) return;
    // Tolerância larga: soltou perto, gruda. Dedo de cinco anos erra alvo.
    const l = buracoMaisPerto(x, y, ls, Math.max(ls[0].w, ls[0].h) * 0.9);
    if (l && l.i === i) { setPostas(ps => [...ps, i]); setEscolhida(null); }
    else recusar(i);
  }

  /* Tocar no lugar: para quem escolheu a peça em vez de arrastar. */
  function tocarLugar(iLugar) {
    if (escolhida == null) return;
    if (escolhida === iLugar) { setPostas(ps => [...ps, escolhida]); setEscolhida(null); }
    else recusar(escolhida);
  }

  const propPeca = fonte.prop * rows / cols;                       // largura/altura de UMA peça
  const altBandeja = total > 16 ? 46 : total > 9 ? 56 : 66;        // peça pequena ainda é dedo
  const faltam = ordem.filter(i => !postas.includes(i));

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={onQuit} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 18, flex: 1 }}>{t.levels[nivel]}</div>
        <div style={{ background: "rgba(255,255,255,.18)", color: "#fff", borderRadius: 999, padding: "6px 14px", fontWeight: 900 }}>
          ⏱️ {tempoFmt(seg)}
        </div>
      </div>

      <div ref={tabuleiro} className="card" style={{
        position: "relative", width: "100%", aspectRatio: String(fonte.prop),
        padding: 0, overflow: "hidden", touchAction: "none", marginBottom: 12,
      }}>
        {/* O fantasma: a imagem inteira, bem apagada, por baixo. É o que faz
            uma criança de quatro anos saber para onde vai a peça. Sem ele o
            quebra-cabeça vira tentativa e erro, que não ensina nada. */}
        <div style={{ position: "absolute", inset: 0, opacity: .16 }} aria-hidden="true">
          <ImagemDoQuebra fonte={fonte} />
        </div>
        {/* As encaixadas primeiro, soltas do alvo de toque: elas passam por
            cima da célula das vizinhas, e o alvo de toque não pode passar. */}
        {postas.map(i => (
          <PecaDoQuebra key={i} fonte={fonte} p={pecas[i]} cols={cols} rows={rows} style={noTabuleiro(pecas[i])} />
        ))}
        {/* Os cortes desenhados por cima do fantasma. Sem eles a criança vê
            uma mancha e não sabe qual peça está procurando; com eles, ela
            compara a forma que está na mão com o buraco que está na tela —
            que é como se monta quebra-cabeça de madeira desde sempre.

            O buraco vazio fica mais forte que a peça já encaixada: o que
            interessa é o que ainda falta. */}
        <svg viewBox={`0 0 ${cols} ${rows}`} preserveAspectRatio="none" aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {pecas.map(x => {
            const vazio = !postas.includes(x.i);
            return (
              <svg key={x.i} x={x.col - sal} y={x.row - sal} width={k} height={k}
                viewBox="0 0 1 1" preserveAspectRatio="none">
                <path d={caminhoDaPeca(nivel, x.i, bordas)} fill="none" vectorEffect="non-scaling-stroke"
                  stroke={vazio ? `rgba(27,42,107,${escolhida != null ? .7 : .5})` : "rgba(255,255,255,.55)"}
                  strokeWidth={vazio ? 2 : 1} strokeLinejoin="round" />
              </svg>
            );
          })}
        </svg>
        {/* Os alvos de toque, invisíveis: quem desenha o buraco é o contorno. */}
        {pecas.filter(x => !postas.includes(x.i)).map(x => (
          <button key={x.i} onClick={() => tocarLugar(x.i)} aria-label={`${t.pieces} ${x.i + 1}`}
            style={{
              position: "absolute", padding: 0, border: "none", background: "transparent",
              left: `${x.col * 100 / cols}%`, top: `${x.row * 100 / rows}%`,
              width: `${100 / cols}%`, height: `${100 / rows}%`,
              cursor: escolhida != null ? "pointer" : "default",
            }} />
        ))}
      </div>

      {/* A bandejinha, embaralhada uma vez só */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", minHeight: altBandeja }}>
        {faltam.map(i => (
          <div key={i} role="button" tabIndex={0} aria-label={`${t.pieces} ${i + 1}`}
            className={errou === i ? "shake" : ""}
            onPointerDown={e => {
              e.currentTarget.setPointerCapture(e.pointerId);
              const r = e.currentTarget.getBoundingClientRect();
              setArrasto({
                i, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY,
                dx: e.clientX - r.left, dy: e.clientY - r.top, w: r.width, h: r.height, moveu: false,
              });
            }}
            onPointerMove={e => setArrasto(a => a && a.i === i
              ? { ...a, x: e.clientX, y: e.clientY, moveu: a.moveu || Math.hypot(e.clientX - a.x0, e.clientY - a.y0) > 8 }
              : a)}
            onPointerUp={e => {
              const a = arrasto;
              setArrasto(null);
              if (!a || a.i !== i) return;
              // Arrastou: encaixa onde soltou. Só tocou: escolhe, e o próximo
              // toque vai no lugar — as duas formas levam ao mesmo lugar.
              if (a.moveu) encaixar(i, e.clientX, e.clientY);
              else setEscolhida(v => v === i ? null : i);
            }}
            onPointerCancel={() => setArrasto(null)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setEscolhida(v => v === i ? null : i); }
            }}
            style={{
              position: "relative", width: altBandeja * propPeca * k, height: altBandeja * k,
              touchAction: "none", cursor: "grab",
              /* A sombra tem que seguir o formato da peça, e não a caixa dela:
                 box-shadow desenharia um retângulo em volta dos dentes. */
              filter: escolhida === i
                ? "drop-shadow(0 0 2px #F9A826) drop-shadow(0 0 5px #F9A826)"
                : "drop-shadow(0 3px 4px rgba(20,25,60,.35))",
              opacity: arrasto?.i === i && arrasto.moveu ? .25 : 1,
            }}>
            <PecaDoQuebra fonte={fonte} p={pecas[i]} cols={cols} rows={rows}
              style={{ position: "absolute", inset: 0 }} />
          </div>
        ))}
      </div>

      {/* Os recortes. Um clipPath por peça, em coordenadas da própria caixa,
          para o mesmo desenho servir a peça grande do tabuleiro e a pequena
          da bandejinha sem ser refeito. */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <defs>
          {pecas.map(x => (
            <clipPath key={x.i} id={`pzl${x.i}`} clipPathUnits="objectBoundingBox">
              <path d={caminhoDaPeca(nivel, x.i, bordas)} />
            </clipPath>
          ))}
        </defs>
      </svg>

      {/* A peça que está no dedo, seguindo o dedo */}
      {arrasto?.moveu && (
        <div style={{
          position: "fixed", left: arrasto.x - arrasto.dx, top: arrasto.y - arrasto.dy,
          width: arrasto.w, height: arrasto.h, pointerEvents: "none", zIndex: 90,
          transform: "scale(1.15)", filter: "drop-shadow(0 8px 10px rgba(20,25,60,.45))",
        }}>
          <PecaDoQuebra fonte={fonte} p={pecas[arrasto.i]} cols={cols} rows={rows}
            style={{ position: "absolute", inset: 0 }} />
        </div>
      )}

      <div style={{ textAlign: "center", color: "#C9D2FF", fontWeight: 800, fontSize: 12, marginTop: 12 }}>
        {t.pieces}: {postas.length}/{total}
      </div>
      <div style={{ textAlign: "center", color: "#A7B3EA", fontWeight: 700, fontSize: 11, marginTop: 6, lineHeight: 1.6 }}>
        {t.puzzleHow}
      </div>
      <div style={{ height: 16 }} />
    </div>
  );
}


/* ---------- Escolha de nível do quebra-cabeça ---------- */
export function PuzzleLevels({ t, coins, pzlBest, setScreen, comecar, tema, titulo, icone, temSecao, comprarSecao }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={() => setScreen("home")} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 21, flex: 1 }}>{icone} {titulo}</div>
        <div style={{ background: "#F9A826", color: "#5A3B00", borderRadius: 999, padding: "6px 12px", fontWeight: 900 }}><Coin n={coins} /></div>
      </div>

      <div className="lista">
        {DIFFS.map((d, di) => {
          const g = GRADES[d];
          const b = pzlBest[`${tema}:${d}`];
          const chave = `q:${tema}:${d}`;
          const preco = PZL_PRECO[d];
          const aberto = !preco || temSecao(chave);
          const anteriorOk = di === 0 || !PZL_PRECO[DIFFS[di - 1]] || temSecao(`q:${tema}:${DIFFS[di - 1]}`);
          return (
            <div key={d} className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, opacity: aberto || anteriorOk ? 1 : .45 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: aberto ? BAND_COLOR[d] : "#B9C0CC", display: "grid", placeItems: "center", color: "#fff", fontWeight: 900, fontSize: 13 }}>
                {aberto ? `${g.cols * g.rows}` : "🔒"}
              </div>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ color: "#1B2A6B", fontSize: 18 }}>{t.levels[d]}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#6C7695" }}>
                  {aberto ? (
                    <>
                      {[1, 2, 3].map(i2 => <span key={i2} style={{ opacity: (b?.stars || 0) >= i2 ? 1 : .25 }}>★</span>)}
                      {b?.time != null && ` · ⏱️ ${tempoFmt(b.time)}`}
                      {` · ${g.cols}×${g.rows} ${t.pieces.toLowerCase()}`}
                    </>
                  ) : anteriorOk ? `${t.unlockFor} 🪙${preco}` : t.needPrev}
                </div>
              </div>
              {aberto ? (
                <Btn small color={BAND_COLOR[d]}
                  disabled={coins < custoDoQuebra(pzlBest, tema, d)}
                  onClick={() => comecar(d, tema)}>
                  {custoDoQuebra(pzlBest, tema, d) ? `🪙${custoDoQuebra(pzlBest, tema, d)}` : `⭐ ${t.free}`}
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
      <div style={{ height: 16 }} />
    </div>
  );
}
