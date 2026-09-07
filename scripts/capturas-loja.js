/**
 * KidsGameHub — capturas para a ficha da Play Store
 * ElCamargo Soluções em TI LTDA
 *
 * NÃO roda no Node. É um módulo para colar no console do navegador com o
 * servidor de desenvolvimento aberto:
 *
 *     const cap = await import("/KidsGameHub/scripts/capturas-loja.js");
 *     await cap.capturar({ largura: 1280, altura: 800, escala: 2, nome: "t10-01" });
 *
 * POR QUE NÃO É FOTO DE TELA DE APARELHO: o app é rasterizado a partir de um
 * SVG `foreignObject`, então o texto sai vetorial e a imagem final não tem
 * barra de status, relógio nem bateria para recortar depois. E a medida em CSS
 * é escolhida, não herdada do aparelho que estava na mão.
 *
 * TRÊS ARMADILHAS, todas já resolvidas aqui, todas descobertas do jeito ruim:
 *
 * 1. BLOB TINGE O CANVAS. Um SVG servido por `URL.createObjectURL` faz o canvas
 *    virar "tainted" e `toDataURL` passa a lançar SecurityError. Tem que ser
 *    `data:` URI.
 *
 * 2. NADA ANIMA DENTRO DO SVG. O que entra na tela com `opacity: 0` e só sobe
 *    pela animação fica congelado no primeiro quadro — os cartões saíam
 *    cinzentos. Por isso a folha injetada zera animação e força opacidade.
 *
 * 3. A MEDIA QUERY MEDE O SVG, NÃO O APARELHO. Dentro do `foreignObject` a
 *    largura que vale é a do desenho. Isso é ARMADILHA NA CAPTURA DE CELULAR
 *    (o `@media (min-width: 860px)` disparava e trazia o layout de desktop
 *    para uma imagem de 1080 de largura) e é EXATAMENTE O QUE SE QUER NA
 *    CAPTURA DE TABLET. Como aqui a largura do SVG é a mesma largura em CSS
 *    que se pediu, o layout sai coerente nos dois casos, sem gambiarra.
 */

/* Só o subconjunto latin interessa: o app está em seis idiomas europeus, e
   arrastar devanagari para dentro do SVG multiplica o tamanho à toa. */
const SERVE = (u) => /-latin-/.test(u) && /\.woff2($|\?)/.test(u);

async function comoDataUri(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`não baixou ${url}: ${r.status}`);
  const b = await r.blob();
  return await new Promise((ok, erro) => {
    const fr = new FileReader();
    fr.onload = () => ok(fr.result);
    fr.onerror = erro;
    fr.readAsDataURL(b);
  });
}

/* Junta todas as folhas em um texto só, embute as fontes e joga fora as que
   não vão ser usadas. Sem embutir, o `data:` URI do SVG resolve o caminho da
   fonte contra ele mesmo, não acha nada, e o texto sai na fonte do sistema. */
async function cssEmbutido() {
  const pedacos = [];
  for (const folha of document.styleSheets) {
    let regras;
    try { regras = folha.cssRules; } catch { continue; }   // folha de outra origem
    for (const r of regras) {
      if (!r.cssText.startsWith("@font-face")) { pedacos.push(r.cssText); continue; }
      const m = /url\(["']?([^"')]+)["']?\)/.exec(r.cssText);
      if (!m || !SERVE(m[1])) continue;                    // fonte que não serve: fora
      const dados = await comoDataUri(new URL(m[1], location.href).href);
      pedacos.push(r.cssText.replace(m[1], dados));
    }
  }
  return pedacos.join("\n");
}

/* Toda imagem tem que virar data: URI pelo mesmo motivo das fontes. */
async function embutirImagens(raiz) {
  await Promise.all([...raiz.querySelectorAll("img")].map(async (img) => {
    const src = img.getAttribute("src");
    if (!src || src.startsWith("data:")) return;
    try { img.setAttribute("src", await comoDataUri(new URL(src, location.href).href)); }
    catch { img.remove(); }                                 // melhor faltar que quebrar
  }));
}

/* Dentro de image/svg+xml o conteúdo de <style> é texto XML: um "&" ou um "<"
   perdido na folha derruba o documento inteiro. Hoje o CSS do app não tem
   nenhum dos dois, e é justamente por isso que vale escapar — para o dia em
   que tiver. */
const xml = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export async function capturar({ largura, altura, escala = 2, nome = "captura" }) {
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll("script").forEach((n) => n.remove());
  await embutirImagens(clone);

  const fundo = getComputedStyle(document.body).backgroundColor;
  const css = await cssEmbutido();
  const congela = `*,*::before,*::after{animation:none!important;
    animation-duration:0s!important;transition:none!important;opacity:1!important}`;

  /* O serializador JÁ escreve xmlns="http://www.w3.org/1999/xhtml" no <body>.
     Acrescentar o mesmo atributo na troca dá "Attribute xmlns redefined", e o
     SVG inteiro deixa de decodificar. Trocar só o nome da tag. */
  const corpo = new XMLSerializer().serializeToString(clone)
    .replace(/^<body/, "<div")
    .replace(/<\/body>$/, "</div>");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}">` +
    `<foreignObject x="0" y="0" width="${largura}" height="${altura}">` +
    `<div xmlns="http://www.w3.org/1999/xhtml" style="width:${largura}px;height:${altura}px;` +
    `overflow:hidden;background:${fundo}">` +
    `<style>${xml(css)}\n${congela}</style>${corpo}</div>` +
    `</foreignObject></svg>`;

  const img = new Image();
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  await img.decode();

  const c = document.createElement("canvas");
  c.width = largura * escala;
  c.height = altura * escala;
  const x = c.getContext("2d");
  x.imageSmoothingEnabled = true;
  x.imageSmoothingQuality = "high";
  x.fillStyle = fundo;
  x.fillRect(0, 0, c.width, c.height);
  x.setTransform(escala, 0, 0, escala, 0, 0);
  x.drawImage(img, 0, 0, largura, altura);

  const a = document.createElement("a");
  a.href = c.toDataURL("image/png");
  a.download = `${nome}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  return { arquivo: `${nome}.png`, pixels: `${c.width}x${c.height}` };
}
