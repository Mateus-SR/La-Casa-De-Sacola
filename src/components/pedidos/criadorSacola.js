"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "react-hot-toast";
import {
  PlusIcon,
  MinusIcon,
  ArchiveIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ReloadIcon,
  Cross2Icon,
  UploadIcon,
} from "@radix-ui/react-icons";

// ---------------------------------------------------------------------------
// Função utilitária: faz o upload para o Cloudinary usando assinatura segura
// ---------------------------------------------------------------------------
async function uploadParaCloudinary(arquivo) {
  // 1. Pede a assinatura para a nossa API Route
  const resAssinatura = await fetch("/api/upload-signature", {
    method: "POST",
  });

  if (!resAssinatura.ok) {
    throw new Error("Não foi possível gerar a assinatura de upload.");
  }

  const { timestamp, signature, apiKey, cloudName } =
    await resAssinatura.json();

  // 2. Monta o FormData e envia direto para o Cloudinary
  const formData = new FormData();
  formData.append("file", arquivo);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("api_key", apiKey);
  formData.append("folder", "la-casa-sacola/logos");

  const resUpload = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!resUpload.ok) {
    throw new Error("Falha ao enviar o arquivo para o Cloudinary.");
  }

  const dados = await resUpload.json();
  return dados.secure_url; // URL pública e permanente da imagem
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function CriadorDeSacola({
  pedidoId,
  setPedidoId,
  userId,
  temItens,
  onSacolaAdicionada,
}) {
  const [aberto, setAberto] = useState(false);
  const [passo, setPasso] = useState(1);
  const [sacolas, setSacolas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [coresDisponiveis, setCoresDisponiveis] = useState([]);

  // Seleções do wizard
  const [sacolaSelecionada, setSacolaSelecionada] = useState(null);
  const [corSelecionada, setCorSelecionada] = useState(null);
  const [numCoresLogo, setNumCoresLogo] = useState(1);
  const [quantidade, setQuantidade] = useState(1);

  // Estados do logo
  const [arquivoLogo, setArquivoLogo] = useState(null);       // Objeto File
  const [previewLogo, setPreviewLogo] = useState(null);       // URL local para preview
  const [uploadandoLogo, setUploadandoLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);               // URL final no Cloudinary
  const [arrastando, setArrastando] = useState(false);
  const inputArquivoRef = useRef(null);

  const intervaloRefQuant = useRef(null);
  const timeoutRefQuant = useRef(null);

  const qtdStep = () => {
    const min = sacolaSelecionada?.quantidademin_sac || 1;
    return min >= 1000 ? 100 : min >= 100 ? 10 : 1;
  };

  const qtdIniciarRepeticao = (delta) => {
    setQuantidade((q) =>
      Math.max(sacolaSelecionada?.quantidademin_sac || 1, q + delta)
    );
    timeoutRefQuant.current = setTimeout(() => {
      intervaloRefQuant.current = setInterval(() => {
        setQuantidade((q) =>
          Math.max(sacolaSelecionada?.quantidademin_sac || 1, q + delta)
        );
      }, 50);
    }, 300);
  };

  const qtdPararRepeticao = () => {
    clearTimeout(timeoutRefQuant.current);
    clearInterval(intervaloRefQuant.current);
  };

  const qtdHandleInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const min = sacolaSelecionada?.quantidademin_sac || 1;
    if (raw === "") {
      setQuantidade(min);
      return;
    }
    setQuantidade(Number(raw));
  };

  const qtdHandleBlur = () => {
    const min = sacolaSelecionada?.quantidademin_sac || 1;
    if (quantidade < min) setQuantidade(min);
  };

  // -------------------------------------------------------------------------
  // Busca sacolas ao abrir o wizard
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (aberto && sacolas.length === 0) fetchDadosIniciais();
  }, [aberto]);

  useEffect(() => {
    if (sacolaSelecionada) {
      setQuantidade(sacolaSelecionada.quantidademin_sac || 1);
    }
  }, [sacolaSelecionada]);

  const fetchDadosIniciais = async () => {
    setCarregando(true);
    try {
      const { data: dataSac, error: errSac } = await supabase
        .from("sacola")
        .select("*")
        .order("nome_sac", { ascending: true });
      if (errSac) throw errSac;
      setSacolas(dataSac || []);

      const { data: dataCor, error: errCor } = await supabase
        .from("cores")
        .select("id_cor, nome_cor, hex_cor")
        .is("excluido", false)
        .order("nome_cor", { ascending: true });
      if (errCor) throw errCor;
      setCoresDisponiveis(dataCor || []);
    } catch (e) {
      toast.error("Erro ao carregar dados do catálogo.");
    } finally {
      setCarregando(false);
    }
  };

  // -------------------------------------------------------------------------
  // Lógica de seleção e preview do arquivo de logo
  // -------------------------------------------------------------------------
  const tiposPermitidos = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "application/pdf"];
  const tamanhoMaximoMB = 10;

  const processarArquivo = (arquivo) => {
    if (!arquivo) return;

    if (!tiposPermitidos.includes(arquivo.type)) {
      toast.error("Formato inválido. Use PNG, JPG, SVG ou PDF.");
      return;
    }

    if (arquivo.size > tamanhoMaximoMB * 1024 * 1024) {
      toast.error(`Arquivo muito grande. Máximo ${tamanhoMaximoMB}MB.`);
      return;
    }

    setArquivoLogo(arquivo);
    setLogoUrl(null); // Reseta URL anterior se trocar o arquivo

    // Gera preview local (apenas para imagens, não PDF)
    if (arquivo.type !== "application/pdf") {
      const urlLocal = URL.createObjectURL(arquivo);
      setPreviewLogo(urlLocal);
    } else {
      setPreviewLogo(null); // PDF não tem preview de imagem
    }
  };

  const handleInputArquivo = (e) => {
    processarArquivo(e.target.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setArrastando(true);
  };

  const handleDragLeave = () => setArrastando(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setArrastando(false);
    processarArquivo(e.dataTransfer.files?.[0]);
  };

  const removerLogo = () => {
    setArquivoLogo(null);
    setPreviewLogo(null);
    setLogoUrl(null);
    if (inputArquivoRef.current) inputArquivoRef.current.value = "";
  };

  // -------------------------------------------------------------------------
  // Faz o upload ao avançar do passo 4 para o 5
  // -------------------------------------------------------------------------
  const handleUploadEAvancar = async () => {
    // Se não selecionou nenhum arquivo, avança direto (logo é opcional)
    if (!arquivoLogo) {
      setPasso((p) => p + 1);
      return;
    }

    // Se já fez upload deste arquivo antes, avança direto
    if (logoUrl) {
      setPasso((p) => p + 1);
      return;
    }

    setUploadandoLogo(true);
    try {
      const url = await uploadParaCloudinary(arquivoLogo);
      setLogoUrl(url);
      toast.success("Logo enviado com sucesso!");
      setPasso((p) => p + 1);
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error(error.message || "Falha ao enviar o logo. Tente novamente.");
    } finally {
      setUploadandoLogo(false);
    }
  };

  // -------------------------------------------------------------------------
  // Navegação entre passos
  // -------------------------------------------------------------------------
  const podeAvancar = () => {
    if (passo === 1) return !!sacolaSelecionada;
    if (passo === 2) return !!corSelecionada;
    if (passo === 3) return quantidade >= (sacolaSelecionada?.quantidademin_sac || 1);
    if (passo === 4) return true; // Logo é opcional
    return false;
  };

  const avancar = () => {
    if (passo === 4) {
      handleUploadEAvancar();
      return;
    }
    if (podeAvancar()) setPasso((p) => p + 1);
  };

  const voltar = () => {
    if (passo > 1) setPasso((p) => p - 1);
  };

  const resetWizard = () => {
    setPasso(1);
    setSacolaSelecionada(null);
    setCorSelecionada(null);
    setNumCoresLogo(1);
    setQuantidade(1);
    removerLogo();
    setAberto(false);
  };

  // -------------------------------------------------------------------------
  // Confirma e salva no banco (agora inclui logo_url)
  // -------------------------------------------------------------------------
  const confirmarSacola = async () => {
    setSalvando(true);
    try {
      let idPedido = pedidoId;

      if (!idPedido) {
        const { data: novoPedido, error: errPedido } = await supabase
          .from("pedido")
          .insert({ status_ped: "No Carrinho", usu_uuid: userId })
          .select()
          .single();
        if (errPedido) throw errPedido;
        idPedido = novoPedido.id_ped;
        setPedidoId(idPedido);
      }

      const { error: errItem } = await supabase.from("itens_pedido").insert({
        ped_id: idPedido,
        sac_id: sacolaSelecionada.id_sac,
        quantidade: quantidade,
        preco: sacolaSelecionada.precounitario_sac,
        cor_id: corSelecionada.id_cor,
        logo_url: logoUrl || null, // Salva a URL do Cloudinary (ou null se não enviou)
      });
      if (errItem) throw errItem;

      toast.success("Sacola adicionada ao pedido!");
      onSacolaAdicionada({
        ...sacolaSelecionada,
        quantity: quantidade,
        cor_sac: corSelecionada.nome_cor,
        cor_id: corSelecionada.id_cor,
        logo_url: logoUrl || null,
      });
      setPasso(6);
    } catch (e) {
      console.error("Erro ao salvar sacola:", e);
      toast.error("Erro ao adicionar sacola. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  // -------------------------------------------------------------------------
  // Estado fechado — botão de entrada
  // -------------------------------------------------------------------------
  if (!aberto) {
    if (!temItens) {
      return (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#c8e3d5] shadow-sm">
          <div className="w-20 h-20 bg-[#f0faf5] rounded-full flex items-center justify-center mx-auto mb-6">
            <ArchiveIcon className="text-[#3ca779] size-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#264f41] mb-2">
            Esse pedido está vazio
          </h2>
          <p className="text-[#6b9e8a] mb-8">
            Clique no botão abaixo para criar e adicionar sua sacola
            personalizada.
          </p>
          <button
            onClick={() => setAberto(true)}
            className="bg-[#3ca779] hover:bg-[#2e8f65] text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#3ca779]/30 inline-flex items-center gap-2 cursor-pointer"
          >
            <PlusIcon className="size-5" /> Criar sacola personalizada
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => setAberto(true)}
        className="w-full mt-4 border-2 border-dashed border-[#c8e3d5] rounded-2xl py-4 text-[#6b9e8a] hover:border-[#3ca779] hover:text-[#3ca779] hover:bg-[#f0faf5] transition-all font-bold flex items-center justify-center gap-2"
      >
        <PlusIcon className="size-5" /> Adicionar outra sacola
      </button>
    );
  }

  // -------------------------------------------------------------------------
  // Indicador de progresso
  // -------------------------------------------------------------------------
  const PASSOS = ["Sacola", "Cor", "Detalhes", "Logo", "Revisão"];

  const IndicadorPassos = () => (
    <div className="flex items-center justify-between mb-8 px-1">
      {PASSOS.map((label, i) => {
        const num = i + 1;
        const ativo = num === passo;
        const feito = num < passo;
        return (
          <div key={num} className="flex items-center gap-2 flex-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${feito
                    ? "bg-[#3ca779] text-white"
                    : ativo
                      ? "bg-[#264f41] text-white scale-110 shadow-md"
                      : "bg-[#e4f4ed] text-[#6b9e8a]"
                  }`}
              >
                {feito ? <CheckIcon className="size-4" /> : num}
              </div>
              <span
                className={`text-xs font-semibold hidden sm:block ${ativo ? "text-[#264f41]" : "text-[#6b9e8a]"}`}
              >
                {label}
              </span>
            </div>
            {i < PASSOS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 rounded transition-all ${feito ? "bg-[#3ca779]" : "bg-[#e4f4ed]"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // -------------------------------------------------------------------------
  // Botões de navegação
  // -------------------------------------------------------------------------
  const BotoesNavegacao = ({ onConfirmar }) => (
    <div className="flex justify-between mt-8 pt-6 border-t border-[#e4f4ed]">
      <button
        onClick={passo === 1 ? resetWizard : voltar}
        className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[#6b9e8a] hover:bg-[#f0faf5] font-bold transition-all"
      >
        <ChevronLeftIcon /> {passo === 1 ? "Cancelar" : "Voltar"}
      </button>

      {passo < 5 ? (
        <button
          onClick={avancar}
          disabled={!podeAvancar() || uploadandoLogo}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all
            ${podeAvancar() && !uploadandoLogo
              ? "bg-[#3ca779] hover:bg-[#2e8f65] text-white shadow-lg shadow-[#3ca779]/30"
              : "bg-[#e4f4ed] text-[#b0cfc4] cursor-not-allowed"
            }`}
        >
          {uploadandoLogo ? (
            <>
              <ReloadIcon className="animate-spin size-4" /> Enviando...
            </>
          ) : (
            <>
              Próximo <ChevronRightIcon />
            </>
          )}
        </button>
      ) : (
        <button
          onClick={onConfirmar}
          disabled={salvando}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#264f41] hover:bg-[#1a3a2e] text-white font-bold transition-all shadow-lg disabled:opacity-50"
        >
          {salvando ? (
            <>
              <ReloadIcon className="animate-spin size-4" /> Salvando...
            </>
          ) : (
            <>
              <CheckIcon className="size-4" /> Adicionar ao pedido
            </>
          )}
        </button>
      )}
    </div>
  );

  // -------------------------------------------------------------------------
  // Wrapper do wizard
  // -------------------------------------------------------------------------
  return (
    <div className="bg-white rounded-3xl p-8 border border-[#e4f4ed] shadow-sm">
      <IndicadorPassos />

      {/* PASSO 1 — Escolha da sacola */}
      {passo === 1 && (
        <div>
          <h3 className="text-xl font-bold text-[#264f41] mb-1">
            Escolha o tipo de sacola
          </h3>
          <p className="text-[#6b9e8a] text-sm mb-6">
            Selecione o modelo que deseja personalizar.
          </p>

          {carregando ? (
            <div className="flex items-center justify-center py-12 text-[#6b9e8a] gap-3">
              <ReloadIcon className="animate-spin size-5" /> Carregando sacolas...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sacolas.map((sac) => {
                const selecionada = sacolaSelecionada?.id_sac === sac.id_sac;
                return (
                  <button
                    key={sac.id_sac}
                    onClick={() => setSacolaSelecionada(sac)}
                    className={`text-left p-5 rounded-2xl border-2 transition-all
                      ${selecionada
                        ? "border-[#3ca779] bg-[#f0faf5] shadow-md"
                        : "border-[#e4f4ed] hover:border-[#a8d5be] hover:bg-[#f9fdfa]"
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-[#264f41]">{sac.nome_sac}</p>
                        <p className="text-sm text-[#6b9e8a] mt-0.5">{sac.tipo_sac}</p>
                        {sac.tamanho_sac && (
                          <p className="text-xs text-[#a0bcb2] mt-1">{sac.tamanho_sac}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-[#3ca779]">
                          R$ {Number(sac.precounitario_sac).toFixed(2).replace(".", ",")}
                        </p>
                        <p className="text-xs text-[#a0bcb2]">por unidade</p>
                        {sac.quantidademin_sac && (
                          <p className="text-xs text-[#b0cfc4] mt-1">
                            Mín. {sac.quantidademin_sac} un.
                          </p>
                        )}
                      </div>
                    </div>
                    {selecionada && (
                      <div className="mt-3 flex items-center gap-1.5 text-[#3ca779] text-sm font-semibold">
                        <CheckIcon className="size-4" /> Selecionada
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          <BotoesNavegacao />
        </div>
      )}

      {/* PASSO 2 — Cor da sacola */}
      {passo === 2 && (
        <div>
          <h3 className="text-xl font-bold text-[#264f41] mb-1">
            Escolha a cor da sacola
          </h3>
          <p className="text-[#6b9e8a] text-sm mb-6">
            Selecione a cor de fundo da sacola.
          </p>

          <div className="grid grid-cols-4 gap-4">
            {coresDisponiveis.map((cor) => {
              const selecionada = corSelecionada?.id_cor === cor.id_cor;
              return (
                <button
                  key={cor.id_cor}
                  onClick={() => setCorSelecionada(cor)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all
                    ${selecionada
                      ? "border-[#3ca779] bg-[#f0faf5]"
                      : "border-[#e4f4ed] hover:border-[#a8d5be]"
                    }`}
                >
                  <div
                    className="w-10 h-10 rounded-full shadow-inner border border-[#e4f4ed]"
                    style={{ backgroundColor: cor.hex_cor }}
                  />
                  <span className="text-xs font-semibold text-[#264f41]">
                    {cor.nome_cor}
                  </span>
                  {selecionada && <CheckIcon className="text-[#3ca779] size-3" />}
                </button>
              );
            })}
          </div>
          <BotoesNavegacao />
        </div>
      )}

      {/* PASSO 3 — Detalhes: quantidade e cores do logo */}
      {passo === 3 && (
        <div>
          <h3 className="text-xl font-bold text-[#264f41] mb-1">
            Detalhes do pedido
          </h3>
          <p className="text-[#6b9e8a] text-sm mb-6">
            Informe a quantidade e as cores do seu logo.
          </p>

          <div className="space-y-6">
            <div className="bg-[#f9fdfa] rounded-2xl p-5 border border-[#e4f4ed]">
              <p className="font-bold text-[#264f41] mb-1">Quantidade</p>
              {sacolaSelecionada?.quantidademin_sac && (
                <p className="text-xs text-[#6b9e8a] mb-4">
                  Mínimo de {sacolaSelecionada.quantidademin_sac} unidades para este modelo.
                </p>
              )}
              <div className="flex items-center gap-4">
                <button
                  onMouseDown={() => qtdIniciarRepeticao(-qtdStep())}
                  onMouseUp={qtdPararRepeticao}
                  onMouseLeave={qtdPararRepeticao}
                  onTouchStart={() => qtdIniciarRepeticao(-qtdStep())}
                  onTouchEnd={qtdPararRepeticao}
                  className="w-10 h-10 rounded-xl bg-[#e4f4ed] hover:bg-[#c8e3d5] text-[#264f41] flex items-center justify-center transition-all select-none"
                >
                  <MinusIcon />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={quantidade}
                  onChange={qtdHandleInput}
                  onBlur={qtdHandleBlur}
                  className="text-2xl font-extrabold text-[#264f41] w-24 text-center bg-transparent border border-[#e4f4ed] rounded-xl py-1 px-2 focus:outline-none focus:border-[#3ca779] focus:bg-white transition-all"
                />
                <button
                  onMouseDown={() => qtdIniciarRepeticao(qtdStep())}
                  onMouseUp={qtdPararRepeticao}
                  onMouseLeave={qtdPararRepeticao}
                  onTouchStart={() => qtdIniciarRepeticao(qtdStep())}
                  onTouchEnd={qtdPararRepeticao}
                  className="w-10 h-10 rounded-xl bg-[#e4f4ed] hover:bg-[#c8e3d5] text-[#264f41] flex items-center justify-center transition-all select-none"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            <div className="bg-[#f9fdfa] rounded-2xl p-5 border border-[#e4f4ed]">
              <p className="font-bold text-[#264f41] mb-1">Cores do logo</p>
              <p className="text-xs text-[#6b9e8a] mb-4">
                Cada cor adicional representa uma estampagem extra (silk screen).
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setNumCoresLogo((n) => Math.max(1, n - 1))}
                  className="w-10 h-10 rounded-xl bg-[#e4f4ed] hover:bg-[#c8e3d5] text-[#264f41] flex items-center justify-center transition-all"
                >
                  <MinusIcon />
                </button>
                <span className="text-2xl font-extrabold text-[#264f41] w-16 text-center">
                  {numCoresLogo}
                </span>
                <button
                  onClick={() => setNumCoresLogo((n) => Math.min(3, n + 1))}
                  className="w-10 h-10 rounded-xl bg-[#e4f4ed] hover:bg-[#c8e3d5] text-[#264f41] flex items-center justify-center transition-all"
                >
                  <PlusIcon />
                </button>
              </div>
              {numCoresLogo > 1 && (
                <p className="text-xs text-[#3ca779] mt-3 font-semibold">
                  {quantidade} sacolas × {numCoresLogo} cores ={" "}
                  {quantidade * numCoresLogo} estampagens no total
                </p>
              )}
            </div>
          </div>
          <BotoesNavegacao />
        </div>
      )}

      {/* PASSO 4 — Upload do logo (NOVO) */}
      {passo === 4 && (
        <div>
          <h3 className="text-xl font-bold text-[#264f41] mb-1">
            Envie seu logo
          </h3>
          <p className="text-[#6b9e8a] text-sm mb-6">
            Formatos aceitos: PNG, JPG, SVG ou PDF. Tamanho máximo: 10MB.
            <span className="ml-1 text-[#3ca779] font-semibold">Opcional</span> — você pode enviar depois.
          </p>

          {/* Área de upload ou preview */}
          {!arquivoLogo ? (
            // Zona de drop
            <label
              className={`flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all
                ${arrastando
                  ? "border-[#3ca779] bg-[#f0faf5] scale-[1.02]"
                  : "border-[#c8e3d5] bg-[#f9fdfa] hover:border-[#3ca779] hover:bg-[#f0faf5]"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={inputArquivoRef}
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.pdf"
                className="hidden"
                onChange={handleInputArquivo}
              />
              <div className="w-16 h-16 bg-white rounded-2xl border border-[#e4f4ed] flex items-center justify-center shadow-sm">
                <UploadIcon className="size-7 text-[#3ca779]" />
              </div>
              <div className="text-center">
                <p className="font-bold text-[#264f41]">
                  Arraste seu arquivo aqui
                </p>
                <p className="text-sm text-[#6b9e8a] mt-1">
                  ou clique para selecionar
                </p>
              </div>
              <span className="inline-flex items-center gap-2 bg-[#3ca779] hover:bg-[#2e8f65] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
                Escolher arquivo
              </span>
            </label>
          ) : (
            // Preview do arquivo selecionado
            <div className="rounded-2xl border-2 border-[#3ca779] bg-[#f0faf5] p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Ícone ou miniatura */}
                  <div className="w-16 h-16 rounded-xl border border-[#c8e3d5] bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {previewLogo ? (
                      <img
                        src={previewLogo}
                        alt="Preview do logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      // PDF — sem preview de imagem
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-black text-[#8f0000] uppercase">PDF</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#264f41] text-sm truncate">
                      {arquivoLogo.name}
                    </p>
                    <p className="text-xs text-[#6b9e8a] mt-0.5">
                      {(arquivoLogo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {logoUrl && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <CheckIcon className="size-3 text-[#3ca779]" />
                        <span className="text-xs text-[#3ca779] font-semibold">
                          Enviado com sucesso
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botão remover */}
                <button
                  onClick={removerLogo}
                  className="p-2 rounded-xl text-[#6b9e8a] hover:bg-red-50 hover:text-red-500 transition-all shrink-0"
                  title="Remover arquivo"
                >
                  <Cross2Icon className="size-4" />
                </button>
              </div>

              {/* Botão para trocar arquivo */}
              {!logoUrl && (
                <label className="self-start text-xs font-semibold text-[#3ca779] hover:underline cursor-pointer">
                  <input
                    ref={inputArquivoRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg,.pdf"
                    className="hidden"
                    onChange={handleInputArquivo}
                  />
                  Trocar arquivo
                </label>
              )}
            </div>
          )}

          {/* Dica de formatos */}
          <div className="mt-4 p-4 bg-[#f9fdfa] rounded-xl border border-[#e4f4ed]">
            <p className="text-xs font-bold text-[#264f41] mb-1">💡 Dica</p>
            <p className="text-xs text-[#6b9e8a] leading-relaxed">
              Para melhor resultado na impressão, prefira arquivos{" "}
              <strong className="text-[#264f41]">vetorizados (SVG ou PDF)</strong>{" "}
              ou PNG com fundo transparente em alta resolução (mínimo 300 DPI).
            </p>
          </div>

          <BotoesNavegacao />
        </div>
      )}

      {/* PASSO 5 — Revisão */}
      {passo === 5 && (
        <div>
          <h3 className="text-xl font-bold text-[#264f41] mb-1">
            Revisão da sacola
          </h3>
          <p className="text-[#6b9e8a] text-sm mb-6">
            Confirme os detalhes antes de adicionar ao pedido.
          </p>

          <div className="space-y-3">
            <RevisaoLinha label="Sacola" valor={sacolaSelecionada?.nome_sac} />
            <RevisaoLinha label="Tipo" valor={sacolaSelecionada?.tipo_sac} />
            {sacolaSelecionada?.tamanho_sac && (
              <RevisaoLinha label="Tamanho" valor={sacolaSelecionada.tamanho_sac} />
            )}
            <RevisaoLinha
              label="Cor"
              valor={
                <span className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full inline-block border border-[#e4f4ed]"
                    style={{ backgroundColor: corSelecionada?.hex_cor }}
                  />
                  {corSelecionada?.nome_cor}
                </span>
              }
            />
            <RevisaoLinha label="Quantidade" valor={`${quantidade} unidades`} />
            <RevisaoLinha
              label="Cores do logo"
              valor={`${numCoresLogo} ${numCoresLogo === 1 ? "cor" : "cores"}`}
            />

            {/* Logo na revisão */}
            <div className="flex justify-between items-center py-3 px-4 bg-[#f9fdfa] rounded-xl border border-[#e4f4ed]">
              <span className="text-sm text-[#6b9e8a] font-semibold">Logo</span>
              {logoUrl ? (
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-[#3ca779]" />
                  <span className="text-sm text-[#3ca779] font-bold">Enviado</span>
                  {previewLogo && (
                    <img
                      src={previewLogo}
                      alt="Logo"
                      className="w-8 h-8 rounded-lg object-contain border border-[#e4f4ed] bg-white"
                    />
                  )}
                </div>
              ) : (
                <span className="text-sm text-[#a0bcb2] font-semibold italic">
                  Não enviado
                </span>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-[#e4f4ed] flex justify-between items-center">
              <span className="font-bold text-[#264f41]">Subtotal estimado</span>
              <span className="text-xl font-extrabold text-[#3ca779]">
                R${" "}
                {(sacolaSelecionada?.precounitario_sac * quantidade * (numCoresLogo / 20))
                  .toFixed(2)
                  .replace(".", ",")}
              </span>
            </div>
          </div>

          <BotoesNavegacao onConfirmar={confirmarSacola} />
        </div>
      )}

      {/* PASSO 6 — Sucesso */}
      {passo === 6 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#f0faf5] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="size-8 text-[#3ca779]" />
          </div>
          <h3 className="text-2xl font-bold text-[#264f41] mb-2">
            Sacola adicionada ao carrinho!
          </h3>
          <p className="text-[#6b9e8a] mb-8">
            O que você gostaria de fazer agora?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setPasso(1);
                setSacolaSelecionada(null);
                setCorSelecionada(null);
                setNumCoresLogo(1);
                setQuantidade(1);
                removerLogo();
              }}
              className="px-6 py-3 rounded-2xl border-2 border-[#3ca779] text-[#3ca779] hover:bg-[#f0faf5] font-bold transition-all"
            >
              Criar outra sacola
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente auxiliar de linha de revisão
// ---------------------------------------------------------------------------
function RevisaoLinha({ label, valor }) {
  return (
    <div className="flex justify-between items-center py-3 px-4 bg-[#f9fdfa] rounded-xl border border-[#e4f4ed]">
      <span className="text-sm text-[#6b9e8a] font-semibold">{label}</span>
      <span className="text-sm text-[#264f41] font-bold">{valor}</span>
    </div>
  );
}