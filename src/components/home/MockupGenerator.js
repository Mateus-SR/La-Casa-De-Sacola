"use client";

import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// DADOS DAS SACOLAS
// Mantidos em sincronia com BagCategories.js (mesmos IDs e nomes)
// "area" define a região onde a arte do cliente será aplicada:
//   x, y → ponto inicial (em proporção: 0.0 a 1.0 do canvas)
//   w, h  → largura e altura da área (em proporção do canvas)
// ─────────────────────────────────────────────────────────────
const SACOLAS = [
  {
    id: "kraft",
    nome: "Sacola Kraft",
    emoji: "🟤",
    corFundo: "#d4a96a",
    corBorda: "#8b5e28",
    area: { x: 0.22, y: 0.18, w: 0.56, h: 0.58 },
  },
  {
    id: "papel",
    nome: "Sacola de Papel",
    emoji: "⬜",
    corFundo: "#e8dcc8",
    corBorda: "#b09070",
    area: { x: 0.22, y: 0.18, w: 0.56, h: 0.58 },
  },
  {
    id: "plastica",
    nome: "Sacola Plástica",
    emoji: "🔵",
    corFundo: "#c8dff0",
    corBorda: "#7098b8",
    area: { x: 0.25, y: 0.20, w: 0.50, h: 0.54 },
  },
  {
    id: "cordao",
    nome: "Sacola com Cordão",
    emoji: "⬛",
    corFundo: "#1a1008",
    corBorda: "#c8a84b",
    area: { x: 0.25, y: 0.22, w: 0.50, h: 0.52 },
  },
];

const CANVAS_TAMANHO = 500;

export default function MockupGenerator() {
  const [imagemUsuario, setImagemUsuario] = useState(null);
  const [sacolaSelecionada, setSacolaSelecionada] = useState(SACOLAS[0]);
  const [arrastando, setArrastando] = useState(false);
  const [escala, setEscala] = useState(70);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const canvasRef = useRef(null);

  // ─── Redesenha sempre que algo mudar ─────────────────────────
  useEffect(() => {
    if (imagemUsuario) {
      renderizarMockup();
    }
  }, [imagemUsuario, sacolaSelecionada, escala, offsetX, offsetY]);

  // ─── Lê o arquivo e cria o objeto Image ──────────────────────
  function carregarImagem(arquivo) {
    if (!arquivo || !arquivo.type.startsWith("image/")) return;

    const leitor = new FileReader();
    leitor.onload = (eventoDeLeitura) => {
      const novaImagem = new Image();
      novaImagem.onload = () => setImagemUsuario(novaImagem);
      novaImagem.src = eventoDeLeitura.target.result;
    };
    leitor.readAsDataURL(arquivo);
  }

  // ─── Eventos de drag and drop ────────────────────────────────
  function handleDragOver(evento) {
    evento.preventDefault();
    setArrastando(true);
  }

  function handleDragLeave() {
    setArrastando(false);
  }

  function handleDrop(evento) {
    evento.preventDefault();
    setArrastando(false);
    carregarImagem(evento.dataTransfer.files[0]);
  }

  function handleInputArquivo(evento) {
    carregarImagem(evento.target.files[0]);
  }

  // ─── Troca de sacola ─────────────────────────────────────────
  function handleSelecionarSacola(sacola) {
    setSacolaSelecionada(sacola);
  }

  // ─── Função principal de renderização no Canvas ──────────────
  function renderizarMockup() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const CW = CANVAS_TAMANHO;
    const CH = CANVAS_TAMANHO;

    // 1) Limpa e pinta o fundo
    ctx.clearRect(0, 0, CW, CH);
    ctx.fillStyle = "#f9f7f4";
    ctx.fillRect(0, 0, CW, CH);

    // 2) Sombra no chão
    desenharSombraNoChao(ctx, CW, CH);

    // 3) Corpo da sacola
    desenharCorpoDaSacola(ctx, CW, CH);

    // 4) Arte do cliente por cima
    desenharArteDoCliente(ctx, CW, CH);

    // 5) Contorno da sacola (fica na frente da arte)
    desenharContorno(ctx, CW, CH);

    // 6) Alças
    desenharAlcas(ctx, CW, CH);

    // 7) Nome da loja discreto no rodapé da sacola
    desenharMarcaDAgua(ctx, CW, CH);
  }

  function desenharSombraNoChao(ctx, CW, CH) {
    const gradiente = ctx.createRadialGradient(CW / 2, CH * 0.9, 5, CW / 2, CH * 0.9, 130);
    gradiente.addColorStop(0, "rgba(44,26,14,0.18)");
    gradiente.addColorStop(1, "rgba(44,26,14,0)");
    ctx.fillStyle = gradiente;
    ctx.beginPath();
    ctx.ellipse(CW / 2, CH * 0.9, 130, 22, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function desenharCorpoDaSacola(ctx, CW, CH) {
    const { corFundo, id } = sacolaSelecionada;
    const [x, y, w, h] = obterDimensoesSacola(CW, CH);

    ctx.save();
    ctx.beginPath();
    aplicarFormatoDaSacola(ctx, id, x, y, w, h);
    ctx.fillStyle = corFundo;
    ctx.fill();
    ctx.restore();

    // Lateral direita mais escura (efeito 3D)
    if (id !== "cordao") {
      ctx.save();
      ctx.beginPath();
      aplicarFormatoDaSacola(ctx, id, x, y, w, h);
      ctx.clip();
      const sombraLateral = ctx.createLinearGradient(x + w * 0.65, y, x + w, y);
      sombraLateral.addColorStop(0, "rgba(0,0,0,0)");
      sombraLateral.addColorStop(1, "rgba(0,0,0,0.15)");
      ctx.fillStyle = sombraLateral;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    }
  }

  function desenharArteDoCliente(ctx, CW, CH) {
    if (!imagemUsuario) return;

    const { area, id } = sacolaSelecionada;
    const [sx, sy, sw, sh] = obterDimensoesSacola(CW, CH);

    // Área alvo onde a arte vai
    const areaX = sx + sw * area.x;
    const areaY = sy + sh * area.y;
    const areaW = sw * area.w;
    const areaH = sh * area.h;

    // Calcula tamanho proporcional da arte dentro da área
    const iw = imagemUsuario.width;
    const ih = imagemUsuario.height;
    const fatorEscala = escala / 100;
    let largura, altura;

    if (iw / ih > areaW / areaH) {
      largura = areaW * fatorEscala;
      altura = (ih / iw) * largura;
    } else {
      altura = areaH * fatorEscala;
      largura = (iw / ih) * altura;
    }

    // Centraliza na área + ajustes dos sliders
    const dx = areaX + (areaW - largura) / 2 + offsetX;
    const dy = areaY + (areaH - altura) / 2 + offsetY;

    // Clip: arte não vaza fora da sacola
    ctx.save();
    ctx.beginPath();
    aplicarFormatoDaSacola(ctx, id, sx, sy, sw, sh);
    ctx.clip();

    // "multiply" faz a arte parecer impressa (funciona bem com sacolas claras)
    // "source-over" é melhor para a sacola escura (cordão)
    ctx.globalCompositeOperation = id === "cordao" ? "source-over":
    ctx.globalAlpha = 0.85;
    ctx.drawImage(imagemUsuario, dx, dy, largura, altura);

    ctx.restore();
  }

  function desenharContorno(ctx, CW, CH) {
    const { corBorda, id } = sacolaSelecionada;
    const [x, y, w, h] = obterDimensoesSacola(CW, CH);

    ctx.save();
    ctx.beginPath();
    aplicarFormatoDaSacola(ctx, id, x, y, w, h);
    ctx.strokeStyle = corBorda;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function desenharAlcas(ctx, CW, CH) {
    const { id } = sacolaSelecionada;
    const [x, y, w] = obterDimensoesSacola(CW, CH);
    const centroX = x + w / 2;
    const topoY = y;

    ctx.save();
    ctx.lineCap = "round";

    if (id === "cordao") {
      // Alça de cordão fino dourado
      ctx.strokeStyle = "#8b6820";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(centroX - 45, topoY);
      ctx.bezierCurveTo(centroX - 55, topoY - 75, centroX + 55, topoY - 75, centroX + 45, topoY);
      ctx.stroke();
      // Reflexo dourado
      ctx.strokeStyle = "#d4a83a";
      ctx.lineWidth = 2;
      ctx.stroke();
      // Argola
      ctx.beginPath();
      ctx.arc(centroX, topoY, 8, 0, Math.PI * 2);
      ctx.strokeStyle = "#c8a84b";
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      // Alças de papel com corda
      const gap = 26;
      const lx1 = centroX - gap / 2 - 55;
      const lx2 = centroX - gap / 2;
      const rx1 = centroX + gap / 2;
      const rx2 = centroX + gap / 2 + 55;
      const alturaCurva = topoY - 70;

      ctx.strokeStyle = "rgba(44,26,14,0.15)";
      ctx.lineWidth = 13;
      ctx.beginPath();
      ctx.moveTo(lx1 + 3, topoY + 3);
      ctx.quadraticCurveTo(centroX - gap / 2 - 25 + 3, alturaCurva + 3, lx2 + 3, topoY + 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rx1 + 3, topoY + 3);
      ctx.quadraticCurveTo(centroX + gap / 2 + 25 + 3, alturaCurva + 3, rx2 + 3, topoY + 3);
      ctx.stroke();

      ctx.strokeStyle = "#5c3d1a";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(lx1, topoY);
      ctx.quadraticCurveTo(centroX - gap / 2 - 25, alturaCurva, lx2, topoY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rx1, topoY);
      ctx.quadraticCurveTo(centroX + gap / 2 + 25, alturaCurva, rx2, topoY);
      ctx.stroke();

      ctx.strokeStyle = "#a0703a";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(lx1, topoY);
      ctx.quadraticCurveTo(centroX - gap / 2 - 25, alturaCurva, lx2, topoY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rx1, topoY);
      ctx.quadraticCurveTo(centroX + gap / 2 + 25, alturaCurva, rx2, topoY);
      ctx.stroke();
    }

    ctx.restore();
  }

  function desenharMarcaDAgua(ctx, CW, CH) {
    const [x, y, w, h] = obterDimensoesSacola(CW, CH);
    const { id } = sacolaSelecionada;

    ctx.save();
    ctx.font = "italic 600 11px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = id === "cordao"
      ? "rgba(200,168,75,0.5)"
      : "rgba(44,26,14,0.25)";
    ctx.fillText("La Casa de Sacola", x + w / 2, y + h - 24);
    ctx.restore();
  }

  // ─── Helpers de geometria ─────────────────────────────────────

  // Retorna [x, y, largura, altura] do corpo da sacola no canvas
  function obterDimensoesSacola(CW, CH) {
    const margem = CW * 0.16;
    const x = margem;
    const w = CW - margem * 2;
    const y = CH * 0.14;
    const h = CH * 0.72;
    return [x, y, w, h];
  }

  // Aplica o path correto dependendo do tipo da sacola
  function aplicarFormatoDaSacola(ctx, id, x, y, w, h) {
    if (id === "plastica") {
      // Sacola plástica: levemente trapezoidal com cantos arredondados
      ctx.roundRect(x + w * 0.04, y, w * 0.92, h, [8, 8, 16, 16]);
    } else if (id === "cordao") {
      // Sacola luxo: trapezoidal discreta
      ctx.moveTo(x + w * 0.02, y);
      ctx.lineTo(x + w - w * 0.02, y);
      ctx.lineTo(x + w - w * 0.04, y + h);
      ctx.lineTo(x + w * 0.04, y + h);
      ctx.closePath();
    } else {
      // Kraft e papel: trapezoidal clássica
      ctx.moveTo(x + w * 0.04, y);
      ctx.lineTo(x + w - w * 0.04, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
    }
  }

  // ─── Download da imagem gerada ────────────────────────────────
  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "mockup-lacasa.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  // ─── JSX ──────────────────────────────────────────────────────
  return (
    <section id="mockup" className="py-20 bg-[#f9f7f4]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#f0faf5] text-[#3ca779] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Visualizador
          </span>
          <h2
            className="text-4xl font-extrabold text-[#264f41] mb-4"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Veja como vai ficar
          </h2>
          <p className="text-[#6b9e8a] text-lg max-w-2xl mx-auto">
            Faça upload da sua arte e visualize como ela ficará estampada na sacola antes de pedir.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Coluna esquerda: upload + controles */}
          <div className="flex flex-col gap-6">

            {/* Área de upload */}
            <label
              className={`flex flex-col items-center justify-center gap-3 p-10 rounded-3xl border-2 border-dashed cursor-pointer transition-all ${
                arrastando
                  ? "border-[#3ca779] bg-[#f0faf5]"
                  : "border-[#c8e3d5] bg-white hover:border-[#3ca779] hover:bg-[#f8fdfb]"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputArquivo}
              />
              <div className="w-14 h-14 rounded-2xl bg-[#f0faf5] border border-[#c8e3d5] flex items-center justify-center text-2xl">
                🖼️
              </div>
              <div className="text-center">
                <p className="font-bold text-[#264f41]">Arraste sua arte aqui</p>
                <p className="text-[#6b9e8a] text-sm mt-1">
                  PNG com fundo transparente tem o melhor resultado
                </p>
              </div>
              <span className="inline-flex items-center gap-2 bg-[#3ca779] hover:bg-[#2e8f65] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
                Escolher imagem
              </span>
            </label>

            {/* Seletor de sacola */}
            <div>
              <p className="text-xs font-semibold text-[#6b9e8a] uppercase tracking-wider mb-3">
                Tipo de sacola
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SACOLAS.map((sacola) => (
                  <button
                    key={sacola.id}
                    onClick={() => handleSelecionarSacola(sacola)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                      sacolaSelecionada.id === sacola.id
                        ? "border-[#3ca779] bg-[#f0faf5]"
                        : "border-[#e4f4ed] bg-white hover:border-[#61c39a]"
                    }`}
                  >
                    <span className="text-xl">{sacola.emoji}</span>
                    <span className="font-semibold text-[#264f41] text-sm">{sacola.nome}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Controles de ajuste (só aparece depois do upload) */}
            {imagemUsuario && (
              <div className="bg-white rounded-3xl border border-[#e4f4ed] p-6">
                <p className="text-xs font-semibold text-[#6b9e8a] uppercase tracking-wider mb-4">
                  Ajustar posição da arte
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-[#264f41] w-20 shrink-0">Tamanho</label>
                    <input
                      type="range" min="20" max="120" value={escala}
                      onChange={(e) => setEscala(Number(e.target.value))}
                      className="flex-1 accent-[#3ca779]"
                    />
                    <span className="text-sm text-[#6b9e8a] w-10 text-right">{escala}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-[#264f41] w-20 shrink-0">Horizontal</label>
                    <input
                      type="range" min="-80" max="80" value={offsetX}
                      onChange={(e) => setOffsetX(Number(e.target.value))}
                      className="flex-1 accent-[#3ca779]"
                    />
                    <span className="text-sm text-[#6b9e8a] w-10 text-right">{offsetX}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-[#264f41] w-20 shrink-0">Vertical</label>
                    <input
                      type="range" min="-80" max="80" value={offsetY}
                      onChange={(e) => setOffsetY(Number(e.target.value))}
                      className="flex-1 accent-[#3ca779]"
                    />
                    <span className="text-sm text-[#6b9e8a] w-10 text-right">{offsetY}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Coluna direita: canvas */}
          <div className="flex flex-col items-center gap-5">
            <div className="w-full bg-white rounded-3xl border border-[#e4f4ed] p-4 shadow-sm flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={CANVAS_TAMANHO}
                height={CANVAS_TAMANHO}
                className="max-w-full rounded-2xl"
              />
            </div>

            {/* Placeholder quando não tem imagem */}
            {!imagemUsuario && (
              <p className="text-[#9ab8ae] text-sm text-center">
                Faça upload da sua arte para ver o mockup
              </p>
            )}

            {/* Botão de download */}
            {imagemUsuario && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 bg-[#3ca779] hover:bg-[#2e8f65] text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 3v12" />
                </svg>
                Baixar Mockup
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}