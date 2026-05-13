"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Footer from "../../../components/layout/Footer";
import Navbar from '../../../components/layout/Navbar';
import ReviewForm from "../../../components/pedidos/ReviewForm";
import { Toaster } from "react-hot-toast";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aberto, setAberto] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return window.location.href = "/login";
      const { data } = await supabase.from("pedido").select("*, itens_pedido(*)").eq("usu_uuid", user.id).order("data_criacao", { ascending: false });
      setPedidos(data || []);
      setCarregando(false);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col">
      <Navbar/><Toaster position="bottom-right" />
      <main className="flex-1 max-w-5xl mx-auto w-full p-10">
        <h1 className="text-2xl font-bold text-[#264f41] mb-6">Meus Pedidos</h1>
        {carregando ? <p>Carregando...</p> : pedidos.map(p => (
          <div key={p.id_ped} className="bg-white p-6 rounded-2xl mb-4 border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">Pedido #{p.id_ped}</p>
                <p className="text-sm text-gray-500">{new Date(p.data_criacao).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setAberto(aberto === p.id_ped ? null : p.id_ped)} className="text-[#3ca779] font-bold">Ver detalhes</button>
            </div>
            {aberto === p.id_ped && (
              <div className="mt-4 border-t pt-4">
                {p.itens_pedido.map(item => (
                  <div key={item.id_ten} className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>{item.quantidade}x Sacola {item.cor_sacola}</span>
                      <span className="font-bold">R$ {Number(item.preco).toFixed(2)}</span>
                    </div>
                    {p.status_ped === "Entregue" && <ReviewForm pedidoId={p.id_ped} produtoId={item.id_sac} onReviewSuccess={() => setAberto(null)}/>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
