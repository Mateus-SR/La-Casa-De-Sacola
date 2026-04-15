"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

export default function ProdutosModelos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Sistema de Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const itensPorPagina = 9; // 3 fileiras de 3

  // Filtros "Pré-Prontos" (Estados criados, mas lógica simplificada por enquanto)
  const [filtroCor, setFiltroCor] = useState("");
  const [filtroTamanho, setFiltroTamanho] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  useEffect(() => {
    carregarProdutos();
  }, [paginaAtual]);

  const carregarProdutos = async () => {
    setLoading(true);
    
    // Cálculo para o Supabase range
    const de = (paginaAtual - 1) * itensPorPagina;
    const ate = de + itensPorPagina - 1;

    // Buscando da tabela 'sacola' que identificamos no seu painel admin
    const { data, error, count } = await supabase
    .from('sacola')
    .select('*', { count: 'exact' })
    .neq('status_sac', 'Oculto') // Exibe tudo que NÃO for 'Oculto'
    .range(de, ate);

    if (error) {
      console.error("Erro ao carregar produtos:", error);
    } else {
      setProdutos(data || []);
      setTotalPaginas(Math.ceil((count || 0) / itensPorPagina));
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER / NAVBAR */}
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-zinc-900">Produtos Modelos</h1>
          <p className="text-gray-600 mt-2">Encontre a embalagem perfeita para o seu negócio</p>
        </div>

        {/* ÁREA DE FILTROS (PRÉ-PRONTA) */}
        {/* Aqui os filtros estão visíveis mas aguardando as informações para a lógica completa */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-8 flex flex-wrap gap-4 items-end">
           <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-gray-500 mb-1">Cor</span>
              <select className="border rounded p-2 bg-gray-50 text-sm outline-none" disabled>
                <option>Aguardando dados...</option>
              </select>
           </div>
           <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-gray-500 mb-1">Tamanho</span>
              <select className="border rounded p-2 bg-gray-50 text-sm outline-none" disabled>
                <option>Aguardando dados...</option>
              </select>
           </div>
           <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-gray-500 mb-1">Material</span>
              <select className="border rounded p-2 bg-gray-50 text-sm outline-none" disabled>
                <option>Aguardando dados...</option>
              </select>
           </div>
           <p className="text-xs italic text-gray-400 self-center">Filtros serão ativados em breve.</p>
        </div>

        {/* GRID DE PRODUTOS (3 COLUNAS) */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {produtos.map((produto) => (
              <div key={produto.id_sac} className="group bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Espaço para Imagem (Vazio por enquanto) */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors">
                  [ Imagem em breve ]
                </div>
                
                <div className="p-6">
                  {/* Tipo da Sacola - Pegando da coluna tipo_sac do seu banco */}
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {produto.tipo_sac}
                  </span>
                  
                  {/* Nome da Sacola - Pegando da coluna nome_sac do seu banco */}
                  <h3 className="text-xl font-bold mt-1 text-zinc-900">
                    {produto.nome_sac}
                  </h3>
                  
                  {/* Informações detalhadas */}
                  <div className="mt-4 space-y-1 text-sm text-gray-600">
                    <p><strong>Tamanho:</strong> {produto.tamanho_sac}</p>
                    <p><strong>Qtd. Mínima:</strong> {produto.quantidademin_sac} unidades</p>
                  </div>

                  {/* Preço Unitário e Botão de Ação */}
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-2xl font-black text-zinc-900">
                      R$ {Number(produto.precounitario_sac).toFixed(2)}
                    </span>
                    <button className="bg-zinc-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-zinc-700 transition">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINAÇÃO (1 2 3 4...) */}
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            <button 
              onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
              className="p-2 rounded border hover:bg-gray-100 disabled:opacity-30 transition"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPaginaAtual(num)}
                className={`w-10 h-10 rounded border font-bold transition ${
                  paginaAtual === num 
                    ? 'bg-zinc-900 text-white border-zinc-900' 
                    : 'bg-white text-zinc-900 hover:bg-gray-100'
                }`}
              >
                {num}
              </button>
            ))}

            <button 
              onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas}
              className="p-2 rounded border hover:bg-gray-100 disabled:opacity-30 transition"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}