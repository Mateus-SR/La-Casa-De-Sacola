"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import { ShoppingBagIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = "/login";
        return;
      }

      // Busca os pedidos vinculados ao UUID do usuário logado
      const { data, error } = await supabase
        .from("pedido")
        .select("*")
        .eq("uuid_usu", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setPedidos(data || []);
      }
      setCarregando(false);
    };

    fetchPedidos();
  }, []);

  // Função auxiliar para formatar o status com cores
  const getStatusBadge = (status) => {
    const styles = {
      "Pendente": "bg-yellow-100 text-yellow-700",
      "Concluído": "bg-green-100 text-green-700",
      "Cancelado": "bg-red-100 text-red-700",
      "default": "bg-gray-100 text-gray-700"
    };
    return styles[status] || styles["default"];
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col">
      <Navbar />
      
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
              <div key={pedido.id_ped} className="bg-white border border-[#e4f4ed] rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div className="bg-[#f0faf5] p-4 rounded-2xl">
                    <ShoppingBagIcon className="w-8 h-8 text-[#3ca779]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Pedido #{pedido.id_ped}</p>
                    <p className="font-bold text-[#264f41] text-lg">
                      {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-500">Valor Total: <span className="font-bold text-[#3ca779]">R$ {Number(pedido.total_ped).toFixed(2)}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusBadge(pedido.status_ped)}`}>
                    {pedido.status_ped}
                  </span>
                  <button className="text-sm font-bold text-[#264f41] hover:underline px-2">Ver detalhes</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}