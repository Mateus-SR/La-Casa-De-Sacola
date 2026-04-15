"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ChevronLeftIcon, ChevronRightIcon, MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";

export default function ProdutosModelos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Sistema de Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const itensPorPagina = 9;

  // Filtros
  const [filtroTamanho, setFiltroTamanho] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCor, setFiltroCor] = useState("");
  const [opcoesTipo, setOpcoesTipo] = useState([]);
  const [opcoesTamanho, setOpcoesTamanho] = useState([]);
  const [opcoesCor, setOpcoesCor] = useState([]);

  useEffect(() => {
    carregarOpcoesFiltros();
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [paginaAtual, filtroTipo, filtroTamanho, filtroCor]);

  const carregarOpcoesFiltros = async () => {
    const { data: tipos } = await supabase.from('tipo').select('tipo_tip');
    if (tipos) setOpcoesTipo(tipos.map(t => t.tipo_tip));

    const { data: tamanhos } = await supabase.from('tamanho').select('tamanho_tam');
    if (tamanhos) setOpcoesTamanho(tamanhos.map(t => t.tamanho_tam));

    const { data: cores } = await supabase.from('cor').select('cor_cor');
    if (cores) setOpcoesCor(cores.map(c => c.cor_cor));
  };

  const carregarProdutos = async () => {
    setLoading(true);
    
    const de = (paginaAtual - 1) * itensPorPagina;
    const ate = de + itensPorPagina - 1;

    let query = supabase
      .from('sacola')
      .select('*', { count: 'exact' })
      .neq('status_sac', 'Oculto');

    if (filtroTipo) {
      query = query.eq('tipo_sac', filtroTipo);
    }

    if (filtroTamanho) {
      query = query.eq('tamanho_sac', filtroTamanho);
    }

    if (filtroCor) {
      query = query.eq('cor_sac', filtroCor);
    }

    const { data, error, count } = await query.range(de, ate);

    if (error) {
      console.error("Erro ao carregar produtos:", error);
    } else {
      setProdutos(data || []);
      setTotalPaginas(Math.ceil((count || 0) / itensPorPagina));
    }
    setLoading(false);
  };

  const limparFiltros = () => {
    setFiltroTipo("");
    setFiltroTamanho("");
    setFiltroCor("");
    setPaginaAtual(1);
  };

  const temFiltrosAtivos = filtroTipo || filtroTamanho || filtroCor;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        {/* HEADER */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#f0faf5] text-[#3ca779] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Nossos Produtos
          </span>
          <h1 
            className="text-5xl lg:text-6xl font-extrabold text-[#264f41] mb-4" 
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Escolha o modelo ideal
          </h1>
          <p className="text-[#6b9e8a] text-lg max-w-2xl mx-auto">
            Encontre a embalagem perfeita para o seu negócio. Todos os nossos modelos com personalização completa da sua arte.
          </p>
        </div>

        {/* ÁREA DE FILTROS */}
        <div className="bg-gradient-to-br from-[#f0faf5] to-[#e0f5ea] p-8 rounded-3xl border border-[#c8e3d5] mb-12 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-[#264f41]">
            <MixerHorizontalIcon className="w-5 h-5" />
            <span className="font-bold uppercase text-xs tracking-wider">Filtros de Busca</span>
          </div>
          
          <div className="flex flex-wrap gap-6 items-end">
            <div className="flex flex-col min-w-[220px]">
              <label className="text-xs font-bold uppercase text-[#6b9e8a] mb-2">Material / Tipo</label>
              <select 
                value={filtroTipo}
                onChange={(e) => { setFiltroTipo(e.target.value); setPaginaAtual(1); }}
                className="border-2 border-[#c8e3d5] rounded-2xl p-3 bg-white text-sm text-[#264f41] outline-none focus:ring-2 focus:ring-[#3ca779] focus:border-transparent transition-all font-medium"
              >
                <option value="">Todos os materiais</option>
                {opcoesTipo.map(opcao => (
                  <option key={opcao} value={opcao}>{opcao}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col min-w-[220px]">
              <label className="text-xs font-bold uppercase text-[#6b9e8a] mb-2">Tamanho</label>
              <select 
                value={filtroTamanho}
                onChange={(e) => { setFiltroTamanho(e.target.value); setPaginaAtual(1); }}
                className="border-2 border-[#c8e3d5] rounded-2xl p-3 bg-white text-sm text-[#264f41] outline-none focus:ring-2 focus:ring-[#3ca779] focus:border-transparent transition-all font-medium"
              >
                <option value="">Todos os tamanhos</option>
                {opcoesTamanho.map(opcao => (
                  <option key={opcao} value={opcao}>{opcao}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col min-w-[220px]">
              <label className="text-xs font-bold uppercase text-[#6b9e8a] mb-2">Cor</label>
              <select 
                value={filtroCor}
                onChange={(e) => { setFiltroCor(e.target.value); setPaginaAtual(1); }}
                className="border-2 border-[#c8e3d5] rounded-2xl p-3 bg-white text-sm text-[#264f41] outline-none focus:ring-2 focus:ring-[#3ca779] focus:border-transparent transition-all font-medium"
              >
                <option value="">Todas as cores</option>
                {opcoesCor.map(opcao => (
                  <option key={opcao} value={opcao}>{opcao}</option>
                ))}
              </select>
            </div>

            {temFiltrosAtivos && (
              <button 
                onClick={limparFiltros}
                className="flex items-center gap-2 text-[#8f0000] hover:text-[#cd1515] text-sm font-bold pb-3 transition-colors"
              >
                <Cross2Icon className="w-4 h-4" />
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* GRID DE PRODUTOS */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3ca779]"></div>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-[#f0faf5] to-[#e0f5ea] rounded-3xl border-2 border-dashed border-[#c8e3d5]">
            <p className="text-[#6b9e8a] font-medium text-lg">Nenhum produto encontrado com os filtros selecionados.</p>
            <button onClick={limparFiltros} className="mt-4 text-[#3ca779] font-bold underline hover:text-[#2e8f65] transition-colors">Ver todos os produtos</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {produtos.map((produto) => (
              <div key={produto.id_sac} className="group bg-white border-2 border-[#e4f4ed] rounded-3xl overflow-hidden hover:shadow-2xl hover:border-[#3ca779] transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#f0faf5] to-[#e0f5ea] flex items-center justify-center text-[#6b9e8a] group-hover:from-[#e0f5ea] group-hover:to-[#c8e3d5] transition-all relative">
                  <span className="text-sm font-medium uppercase tracking-widest">Imagem em breve</span>
                  <div className="absolute top-4 right-4 bg-[#3ca779] text-white px-4 py-2 rounded-full shadow-lg">
                    <span className="text-[11px] font-black uppercase">{produto.tipo_sac}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#264f41] group-hover:text-[#3ca779] transition-colors" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                    {produto.nome_sac}
                  </h3>
                  
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-[#f0faf5] p-3 rounded-xl border border-[#e4f4ed]">
                      <p className="text-[10px] uppercase text-[#6b9e8a] font-bold">Tamanho</p>
                      <p className="text-[#264f41] font-semibold mt-1">{produto.tamanho_sac}</p>
                    </div>
                    <div className="bg-[#f0faf5] p-3 rounded-xl border border-[#e4f4ed]">
                      <p className="text-[10px] uppercase text-[#6b9e8a] font-bold">Qtd. Mínima</p>
                      <p className="text-[#264f41] font-semibold mt-1">{produto.quantidademin_sac} un.</p>
                    </div>
                  </div>

                  {produto.cor_sac && (
                    <div className="mt-3 bg-[#f0faf5] p-3 rounded-xl border border-[#e4f4ed]">
                      <p className="text-[10px] uppercase text-[#6b9e8a] font-bold">Cor</p>
                      <p className="text-[#264f41] font-semibold mt-1">{produto.cor_sac}</p>
                    </div>
                  )}

                  <div className="mt-8 flex items-center justify-between border-t border-[#e4f4ed] pt-6">
                    <div>
                      <p className="text-[10px] uppercase text-[#6b9e8a] font-bold">A partir de</p>
                      <span className="text-2xl font-black text-[#264f41] mt-1 block">
                        R$ {Number(produto.precounitario_sac).toFixed(2)}
                      </span>
                    </div>
                    <button className="bg-[#3ca779] hover:bg-[#2e8f65] text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-[#3ca779]/30 hover:shadow-[#3ca779]/50 active:scale-95">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINAÇÃO */}
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16">
            <button 
              onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
              className="p-3 rounded-2xl border-2 border-[#c8e3d5] bg-white hover:bg-[#f0faf5] hover:border-[#3ca779] disabled:opacity-30 transition-all"
            >
              <ChevronLeftIcon className="w-5 h-5 text-[#3ca779]" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPaginaAtual(num)}
                  className={`w-12 h-12 rounded-2xl border-2 font-bold transition-all ${
                    paginaAtual === num 
                      ? 'bg-[#3ca779] text-white border-[#3ca779] scale-110 shadow-lg shadow-[#3ca779]/30' 
                      : 'bg-white text-[#264f41] border-[#c8e3d5] hover:border-[#3ca779] hover:bg-[#f0faf5]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas}
              className="p-3 rounded-2xl border-2 border-[#c8e3d5] bg-white hover:bg-[#f0faf5] hover:border-[#3ca779] disabled:opacity-30 transition-all"
            >
              <ChevronRightIcon className="w-5 h-5 text-[#3ca779]" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
