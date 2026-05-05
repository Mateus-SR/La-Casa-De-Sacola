"use client";

import { useState, useRef, useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const SACOLAS = [
  {
    id: "kraft",
    nome: "Sacola Kraft",
    emoji: "🟤",
    fotoUrl: "/img/sacolaKraft.webp",
    area: { x: 0.25, y: 0.2, w: 0.5, h: 0.55 },
    refImg: "/img/refAgenda.jfif",
    refDesc: "Cabe uma agenda A5!",
  },
  {
    id: "papel",
    nome: "Sacola de Papel",
    emoji: "⬜",
    fotoUrl: "/img/sacolaPapel.webp",
    area: { x: 0.25, y: 0.2, w: 0.5, h: 0.55 },
    refImg: "/img/refTablet.png",
    refDesc: "Cabe um tablet de até 10 polegadas!",
  },
  {
    id: "plastica",
    nome: "Sacola Plástica",
    emoji: "🔵",
    fotoUrl: "/img/sacolaPlastico.jpg",
    area: { x: 0.25, y: 0.2, w: 0.5, h: 0.55 },
    refImg: "/img/refCelular.webp",
    refDesc: "Cabe um celular de até 6.5 polegadas!",
  },
  {
    id: "cordao",
    nome: "Sacola com Cordão",
    emoji: "⬛",
    fotoUrl: "/img/sacolaCordao.jpg",
    area: { x: 0.25, y: 0.2, w: 0.5, h: 0.55, rotate: -0.13 },
    refImg: "/img/refNot.webp",
    refDesc: "Cabe um notebook de até 13 polegadas!",
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
  const [imagensSacolas, setImagensSacolas] = useState({});

  const canvasRef = useRef(null);

  const [cardVirado, setCardVirado] = useState(false);

  //pré-carrega todas as fotos uma vez ao montar
  useEffect(() => {
    SACOLAS.forEach((sacola) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // necessário para usar no canvas
      img.onload = () => {
        setImagensSacolas((prev) => ({ ...prev, [sacola.id]: img }));
      };
      img.src = sacola.fotoUrl;
    });
  }, []);

  useEffect(() => {
    renderizarMockup();
  }, [
    imagemUsuario,
    sacolaSelecionada,
    escala,
    offsetX,
    offsetY,
    imagensSacolas,
  ]);

  useEffect(() => {
    if (localStorage.getItem("tutorialMockupVisto")) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0].isIntersecting) {
          const tutorial = driver();
          document?.activeElement?.blur();
          tutorial.highlight({
            element: "#canvas-mockup",
            popover: {
              title: "Veja o que cabe!",
              description:
                "Clique na sacola para ver uma comparação de tamanho com objetos do dia a dia.",
              side: "left",
            },
          });

          localStorage.setItem("tutorialMockupVisto", "true");

          observador.disconnect();
        }
      },
      { threshold: 0.6 },
    );

    const secao = document.getElementById("mockup");
    if (secao) observador.observe(secao);

    return () => observador.disconnect();
  }, []);

  //para resetar o tutorial, localStorage.removeItem("tutorialMockupVisto") no console do navegador

  function handleSelecionarSacola(sacola) {
    setSacolaSelecionada(sacola);
    setCardVirado(false);
  }

  //só vira se não tiver imagem carregada
  function handleCliqueCanvas() {
    if (!imagemUsuario) {
      setCardVirado((prev) => !prev);
    }
  }

  function handleRemoverImagem() {
    setImagemUsuario(null);
    setCardVirado(false);
    setEscala(70);
    setOffsetX(0);
    setOffsetY(0);
  }

  //lê o arquivo enviado e cria o objeto Image
  function carregarImagem(arquivo) {
    if (!arquivo || !arquivo.type.startsWith("image/")) return;

    setCardVirado(false);

    const leitor = new FileReader();
    leitor.onload = (eventoDeLeitura) => {
      const novaImagem = new Image();
      novaImagem.onload = () => setImagemUsuario(novaImagem);
      novaImagem.src = eventoDeLeitura.target.result;
    };
    leitor.readAsDataURL(arquivo);
  }

  //upload
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

  // função principal de renderização
  function renderizarMockup() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const CW = CANVAS_TAMANHO;
    const CH = CANVAS_TAMANHO;

    const fotoSacola = imagensSacolas[sacolaSelecionada.id];
    if (!fotoSacola) {
      ctx.fillStyle = "#9ab8ae";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Carregando sacola...", CW / 2, CH / 2);
      return;
    }

    const escalaFoto =
      Math.min(CW / fotoSacola.width, CH / fotoSacola.height) * 0.92;
    const fw = fotoSacola.width * escalaFoto;
    const fh = fotoSacola.height * escalaFoto;
    const fx = (CW - fw) / 2;
    const fy = (CH - fh) / 2;
    ctx.drawImage(fotoSacola, fx, fy, fw, fh);

    if (!imagemUsuario) return;

    const { area } = sacolaSelecionada;
    const areaX = fx + fw * area.x;
    const areaY = fy + fh * area.y;
    const areaW = fw * area.w;
    const areaH = fh * area.h;

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

    const dx = areaX + (areaW - largura) / 2 + offsetX;
    const dy = areaY + (areaH - altura) / 2 + offsetY;

    // APLICAÇÃO DA ARTE COM TRANSFORMAÇÃO
    ctx.save();

    // Move o ponto de origem pro centro
    ctx.translate(dx + largura / 2, dy + altura / 2);

    // Aplica a rotação definida no objeto da sacola (padrão é 0)
    if (area.rotate) {
      ctx.rotate(area.rotate);
    }
    // Desenha a imagem
    ctx.drawImage(imagemUsuario, -largura / 2, -altura / 2, largura, altura);

    ctx.restore();
  }

  //download
  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "mockup-lacasa.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  //JSX
  return (
    <section id="mockup" className="py-20">
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
            Faça upload da sua arte e visualize como ela ficará estampada na
            sacola antes de pedir.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* coluna esquerda: controles */}
          <div className="flex flex-col gap-6">
            {/* upload */}
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
                <p className="font-bold text-[#264f41]">
                  Arraste sua arte aqui
                </p>
                <p className="text-[#6b9e8a] text-sm mt-1">
                  PNG com fundo transparente tem o melhor resultado
                </p>
              </div>
              <span className="inline-flex items-center gap-2 bg-[#3ca779] text-white font-semibold text-sm px-5 py-2.5 rounded-xl">
                Escolher imagem
              </span>
            </label>

            {/* seletor de sacola */}
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
                    <span className="font-semibold text-[#264f41] text-sm">
                      {sacola.nome}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* posição imagem */}
            {imagemUsuario && (
              <div className="bg-white rounded-3xl border border-[#e4f4ed] p-6">
                <p className="text-xs font-semibold text-[#6b9e8a] uppercase tracking-wider mb-4">
                  Ajustar posição da arte
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-[#264f41] w-20 shrink-0">
                      Tamanho
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      value={escala}
                      onChange={(e) => setEscala(Number(e.target.value))}
                      className="flex-1 accent-[#3ca779]"
                    />
                    <span className="text-sm text-[#6b9e8a] w-10 text-right">
                      {escala}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-[#264f41] w-20 shrink-0">
                      Horizontal
                    </label>
                    <input
                      type="range"
                      min="-80"
                      max="80"
                      value={offsetX}
                      onChange={(e) => setOffsetX(Number(e.target.value))}
                      className="flex-1 accent-[#3ca779]"
                    />
                    <span className="text-sm text-[#6b9e8a] w-10 text-right">
                      {offsetX}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-[#264f41] w-20 shrink-0">
                      Vertical
                    </label>
                    <input
                      type="range"
                      min="-80"
                      max="80"
                      value={offsetY}
                      onChange={(e) => setOffsetY(Number(e.target.value))}
                      className="flex-1 accent-[#3ca779]"
                    />
                    <span className="text-sm text-[#6b9e8a] w-10 text-right">
                      {offsetY}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* coluna direita: canvas */}
          <div className="flex flex-col items-center gap-5">
            <div
              className="w-full"
              style={{
                perspective: "1000px",
                cursor: !imagemUsuario ? "pointer" : "default",
              }}
            >
              <div
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s ease",
                  transform: cardVirado ? "rotateY(180deg)" : "rotateY(0deg)",
                  position: "relative",
                  aspectRatio: "1 / 1",
                }}
              >
                {/* frente: canvas */}
                <div
                  className="w-full h-full bg-white rounded-3xl border border-[#e4f4ed] p-4 flex items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    position: "absolute",
                    inset: 0,
                  }}
                  onClick={handleCliqueCanvas}
                >
                  <canvas
                    id="canvas-mockup"
                    ref={canvasRef}
                    width={CANVAS_TAMANHO}
                    height={CANVAS_TAMANHO}
                    className={`max-w-full rounded-2xl ${!imagemUsuario ? "cursor-pointer" : ""}`}
                  />
                </div>

                {/* trás: comparação de tamanho */}
                <div
                  className="w-full h-full bg-white rounded-3xl border border-[#e4f4ed] p-6 flex flex-col items-center justify-center gap-4"
                  style={{
                    backfaceVisibility: "hidden",
                    position: "absolute",
                    inset: 0,
                    transform: "rotateY(180deg)",
                  }}
                  onClick={() => setCardVirado(false)}
                >
                  <p className="text-xs font-semibold text-[#6b9e8a] uppercase tracking-wider">
                    O que cabe nessa sacola?
                  </p>

                  <img
                    src={sacolaSelecionada.refImg}
                    alt="Referência de tamanho"
                    className="w-40 h-40 object-contain drop-shadow-sm"
                  />

                  <p className="text-sm font-semibold text-[#264f41] text-center">
                    {sacolaSelecionada.refDesc}
                  </p>

                  <span className="text-xs text-[#9ab8ae] mt-2">
                    Clique para voltar
                  </span>
                </div>
              </div>
            </div>

            {!imagemUsuario && (
              <p className="text-[#9ab8ae] text-sm text-center">
                Faça upload da sua arte para ver o mockup
              </p>
            )}

            {/* remover imagem */}
            {imagemUsuario && (
              <button
                onClick={handleRemoverImagem}
                className="flex items-center gap-2 border-2 border-red-200 text-red-400 hover:border-red-400 hover:text-red-600 font-semibold px-4 py-3.5 rounded-2xl transition-all"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Remover arte
              </button>
            )}

            {imagemUsuario && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 bg-[#3ca779] hover:bg-[#2e8f65] text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 3v12"
                  />
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
