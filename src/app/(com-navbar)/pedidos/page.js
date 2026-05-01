"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Footer from "@/components/layout/Footer";
import { ShoppingBagIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pedidoAberto, setPedidoAberto] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        window.location.href = "/login";
        return;
      }

      // Busca os pedidos vinculados ao UUID do usuário logado
      const { data, error } = await supabase
        .from("pedido")
        .select("*, itens_pedido(*)")
        .eq("usu_uuid", user.id)
        .order("data_criacao", { ascending: false });

      if (error) throw error;

        setPedidos(data || []);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setCarregando(false);
      }
    };

    fetchPedidos();
  }, []);

  // Função auxiliar para formatar o status com cores
  const getStatusBadge = (status) => {
    const styles = {
      "Em Produção": "bg-yellow-100 text-yellow-700",
      "Entregue": "bg-green-100 text-green-700",
      "Cancelado": "bg-red-100 text-red-700",
      "default": "bg-gray-100 text-gray-700"
    };
    return styles[status] || styles["default"];
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col">

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-10">
        <header className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#264f41]">Meus Pedidos</h1>
          <p className="text-gray-600 text-sm">Acompanhe o histórico de suas encomendas</p>
        </header>

        {carregando ? (
          <div className="text-center py-20 italic text-gray-500">Buscando seu histórico...</div>
        ) : pedidos.length === 0 ? (
          <div className="bg-white border border-[#e4f4ed] rounded-2xl p-16 text-center shadow-sm">
            <ShoppingBagIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-bold text-gray-700 uppercase tracking-wide">Você ainda não fez nenhum pedido.</p>
            <p className="text-gray-500 mt-2">Que tal escolher sua primeira sacola agora?</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id_ped} className="bg-white border border-[#e4f4ed] rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
    
            {/* Ajustei o cartão principal para ser um 'flex-col' para que a lista caiba embaixo */}
            {/* Cabeçalho do cartão */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-4 items-center">
                <div className="bg-[#f0faf5] p-4 rounded-2xl">
                  <ShoppingBagIcon className="w-8 h-8 text-[#3ca779]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Identificador Único do Pedido: #{pedido.id_ped}</p>
                  <p className="font-bold text-[#264f41] text-lg">Pedido feito em: {" "}
                    {new Date(pedido.data_criacao).toLocaleDateString('pt-BR')}
                  </p>
                  <div className="flex flex-col font-semibold ml-2">
                    {pedido.ultima_alteracao && (
                      <p className="text-[#264f41] text-sm">Última alteração: {" "}
                      {new Date(pedido.ultima_alteracao).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                    {pedido.status_ped === "Entregue" && pedido.data_entregue && (
                      <p className="text-[#264f41] text-sm">Confirmado como entregue em: {" "}
                        {new Date(pedido.data_entregue).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Valor Total: <span className="font-bold text-[#3ca779]">R$ {Number(pedido.valor_total || 0).toFixed(2)}</span></p>
                </div>
              </div>

              {/* AQUI ESTÁ O FECHAMENTO CORRETO DA DIV DOS BOTÕES */}
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusBadge(pedido.status_ped)}`}>
                  {pedido.status_ped}
                </span>
                <button 
                  className="text-sm font-bold text-[#264f41] hover:underline px-2"
                  onClick={() => setPedidoAberto(pedidoAberto === pedido.id_ped ? null : pedido.id_ped)}
                >
                  {pedidoAberto === pedido.id_ped ? "Ocultar detalhes" : "Ver detalhes"}
                </button>
              </div>
            </div>


            {pedidoAberto === pedido.id_ped && (
              <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Itens desse pedido:</p>
                <div className="space-y-2">
                  {pedido.itens_pedido?.map((item) => (
                    <div key={item.id_ten} className="text-sm text-gray-600 flex justify-between bg-[#f4f7f5] p-2 rounded-lg">
                      <span>{item.quantidade}x Sacolas {item.cor_sacola}</span>
                      <span className="font-semibold text-md text-[#264f41]">R$ {Number(pedido.valor_total).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}