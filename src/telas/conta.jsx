/**
 * KidsGameHub — a conta armada
 * ElCamargo Soluções em TI LTDA
 *
 * A conta uma casa embaixo da outra, como a professora escreve no quadro. A
 * criança responde da UNIDADE para a esquerda, e a conferência é casa a casa:
 * pôs o algarismo errado, ele treme e volta na hora. Deixar preencher tudo
 * para só então dizer "errado" esconde qual casa ela não sabe — e é qual casa
 * que interessa.
 *
 * O "vai um" aparece SOZINHO, depois que a casa fica certa. Pedir para a
 * criança digitar a reserva dobraria os toques e ensinaria a mesma coisa; do
 * jeito que está, ela vê a reserva surgir exatamente no momento em que ela
 * acontece, que é quando a explicação entra.
 */

import React, { useState, useEffect } from "react";
import { Btn } from "./base.jsx";

export function ContaGame({ t, contas, onFinish, onQuit, titulo }) {
  const [i, setI] = useState(0);
  const [postas, setPostas] = useState([]);      // algarismos já postos, da unidade para a esquerda
  const [erros, setErros] = useState(0);
  const [errou, setErrou] = useState(null);
  const [pronta, setPronta] = useState(false);
  const [bravo, setBravo] = useState("");
  const c = contas[i];

  useEffect(() => {
    setPostas([]); setPronta(false); setErrou(null); setBravo("");
  }, [i]);

  /* Fechou a conta: um respiro para ver o resultado inteiro antes de virar. */
  useEffect(() => {
    if (!pronta) return;
    const x = setTimeout(() => {
      if (i + 1 >= contas.length) onFinish(erros);
      else setI(k => k + 1);
    }, 1300);
    return () => clearTimeout(x);
  }, [pronta]);

  function tocar(d) {
    if (pronta) return;
    if (d === c.digitos[postas.length]) {
      const novas = [...postas, d];
      setPostas(novas);
      if (novas.length === c.digitos.length) {
        setPronta(true);
        setBravo(Object.values(t.elogios.certo)[Math.floor(Math.random() * 3)]);
      }
      return;
    }
    setErros(e => e + 1);
    setErrou(d);
    setTimeout(() => setErrou(null), 450);
  }

  /* A conta é desenhada da direita para a esquerda: a coluna 0 é a unidade.
     `cols` é a maior das três linhas — a soma pode estourar uma casa. */
  const cols = Math.max(String(c.a).length, String(c.b).length, c.digitos.length);
  const L = cols >= 4 ? 42 : 48;
  const casas = Array.from({ length: cols }, (_, k) => cols - 1 - k);   // da esquerda para a direita

  const algarismo = (n, casa) => {
    const s = String(n);
    const k = s.length - 1 - casa;
    return k >= 0 ? s[k] : "";
  };

  const Celula = ({ children, cor, forte }) => (
    <div style={{
      width: L, height: 52, display: "grid", placeItems: "center",
      fontFamily: "'Baloo 2', system-ui, sans-serif", fontWeight: 800,
      fontSize: forte ? 30 : 28, color: cor || "#1B2A6B",
    }}>{children}</div>
  );

  return (
    <div className="narrow">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Btn small color="rgba(255,255,255,.2)" onClick={onQuit} rotulo={t.a11yBack}>←</Btn>
        <div className="display" style={{ color: "#fff", fontSize: 18, flex: 1 }}>{titulo}</div>
        <div style={{ background: "rgba(255,255,255,.18)", color: "#fff", borderRadius: 999, padding: "6px 14px", fontWeight: 900 }}>
          {i + 1}/{contas.length}
        </div>
      </div>

      <div className="card" style={{ padding: "16px 14px", marginBottom: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* O "vai um" e o "empresta um", que aparecem conforme a criança
              fecha cada casa — nunca antes. */}
          <div style={{ display: "flex" }}>
            {casas.map(casa => {
              const veio = casa > 0 && c.reservas[casa - 1] && postas.length >= casa;
              return (
                <div key={casa} style={{ width: L, height: 22, display: "grid", placeItems: "center" }}>
                  {veio && (
                    <span className="pop" style={{
                      fontSize: 13, fontWeight: 900,
                      color: c.op === "+" ? "#F9A826" : "#E84393",
                    }}>{c.op === "+" ? "+1" : "−1"}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex" }}>
            {casas.map(casa => <Celula key={casa}>{algarismo(c.a, casa)}</Celula>)}
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: 26, marginTop: -2 }}>
              <span className="display" style={{ fontSize: 30, color: "#6C7695" }}>{c.op === "+" ? "+" : "−"}</span>
            </div>
            {casas.map(casa => <Celula key={casa}>{algarismo(c.b, casa)}</Celula>)}
          </div>

          <div style={{ height: 4, background: "#1B2A6B", borderRadius: 3, width: cols * L, margin: "4px 0 8px" }} />

          {/* Os lugares da resposta. Vazio mostra o traço, como no caderno. */}
          <div style={{ display: "flex" }}>
            {casas.map(casa => {
              if (casa >= c.digitos.length) return <div key={casa} style={{ width: L }} />;
              const cheio = postas.length > casa;
              const daVez = postas.length === casa;
              return (
                <div key={casa} className={pronta ? "pop" : ""} style={{
                  width: L - 6, height: 52, margin: "0 3px", borderRadius: 12,
                  display: "grid", placeItems: "center",
                  background: cheio ? (pronta ? "#00B894" : "#4C6FFF") : "#EEF1FF",
                  border: cheio ? "none" : daVez ? "3px solid #4C6FFF" : "3px dashed #C3CBEA",
                  color: cheio ? "#fff" : "#B9C0CC",
                  fontFamily: "'Baloo 2', system-ui, sans-serif", fontWeight: 900, fontSize: 28,
                }}>{cheio ? c.digitos[casa] : "—"}</div>
              );
            })}
          </div>
        </div>

        <div className="display" style={{ height: 22, marginTop: 10, fontSize: 18, color: "#00B894", textAlign: "center" }}>
          {bravo}
        </div>
      </div>

      {/* O teclado. Dez teclas, do 0 ao 9, como qualquer calculadora. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map(d => (
          <button key={d} onClick={() => tocar(d)} className={`chunky ${errou === d ? "shake" : ""}`}
            style={{
              height: 54, borderRadius: 14,
              background: errou === d ? "#E74C3C" : "#fff", color: "#1B2A6B",
              fontFamily: "inherit", fontWeight: 900, fontSize: 24,
            }}>
            <span className="display">{d}</span>
          </button>
        ))}
      </div>

      {/* Tirar a última: errar de dedo não pode custar uma vida. */}
      {!!postas.length && !pronta && (
        <div style={{ marginTop: 14 }}>
          <Btn full small color="rgba(255,255,255,.2)" onClick={() => setPostas(x => x.slice(0, -1))}>↺</Btn>
        </div>
      )}
      <div style={{ height: 20 }} />
    </div>
  );
}
