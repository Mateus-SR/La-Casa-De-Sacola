"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Tabs from '@radix-ui/react-tabs';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import RotaAdmin from "../components/admin/rotaAdmin";
import TabelaProducao from "../components/producao/TabelaProducao.js";
import useVerificaAcessoAdmin from "../hooks/verificaAcesso.js";
import { useRouter } from 'next/navigation';
import { supabase } from "../lib/supabaseClient";

export default function Producao() {

  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pedidoAberto, setPedidoAberto] = useState(null);

  const router = useRouter();

/*     const [pedidos, setPedidos] = useState([
        { id: "S01", tipo: 'Sacola Kraft', quantidade: 400, tamanho: 'Médio', cor: 'Branco', imagem: 'img/img_login.png', preco: 45.00 },
        { id: "S12", tipo: 'Sacola Plástica', quantidade: 200, tamanho: 'Pequeno', cor: 'Preto', imagem: 'img/img_login.png', preco: 30.00 },
        { id: "S23", tipo: 'Sacola Tecido', quantidade: 150, tamanho: 'Grande', cor: 'Colorido', imagem: 'img/img_login.png', preco: 60.00 },
    ]); */

  useEffect(() => {
    const fetchPedidos = async () => {
      try {    
        // Busca os pedidos vinculados ao UUID do usuário logado
        const { data, error } = await supabase
          .from("pedido")
          .select("*, itens_pedido(*)")
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

    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [imagemAberta, setImagemAberta] = useState(null);

    const handleAbrirPedido = (pedidoCompleto) => {
      setPedidoSelecionado(pedidoCompleto);
    }

    const handleAlterarStatus = (pedidoSelecionado) => {
      alert(`Opa! Ainda não.\n${pedidoSelecionado.status_ped}`);
    }

    const handleFecharModal = () => {
      setPedidoSelecionado(null);
    }

    const handleDetalhesCliente = (pedido) => {
      alert(`Opa! Ainda não!\n${pedido.usu_uuid}`)
    }

    return (
      <RotaAdmin>
      <>
        <main className="p-5 m-auto bg-gray-100 h-screen flex flex-col">
          <meta charSet="UTF-8" />
          <button onClick={() => router.push('/')} className="bg-[#264f41] hover:bg-[#403c37] text-white px-2.5 py-2.5 rounded-xl font-bold transition shadow-md flex items-left gap-2 text-md lg:text-md w-max mb-5">
          ← Voltar
        </button>

          <title>Produção</title>

          <div className="mb-4">
            <h1 className="text-lg lg:text-xl font-extrabold text-[#264f41]">Painel Produção</h1>
            <h2 className="text-md lg:text-lg text-gray-600">Visualize os detalhes dos pedidos</h2>
          </div>

          <Tabs.Root
            defaultValue="producao"
            className="w-full overflow-hidden">
            <Tabs.List
              className="flex items-center mb-5 gap-5 bg-white p-4 rounded-xl shadow-sm border border-[#e4f4ed]">

              <Tabs.Trigger
                value="aguardando"
                className="data-[state=active]:border-[#61c39a] data-[state=active]:text-[#61c39a] text-[#264f41] border-b-4 hover:bg-gray-200 p-2 transition duration-300">
                  Aguardando Cliente
              </Tabs.Trigger>

              <Tabs.Trigger
                value="producao"
                className="data-[state=active]:border-[#61c39a] data-[state=active]:text-[#61c39a] text-[#264f41] border-b-4 hover:bg-gray-200 p-2 transition duration-300">
                  Em produção
              </Tabs.Trigger>

              <Tabs.Trigger
                value="entrega"
                className="data-[state=active]:border-[#61c39a] data-[state=active]:text-[#61c39a] text-[#264f41] border-b-4 hover:bg-gray-200 p-2 transition duration-300">
                  Em entrega
              </Tabs.Trigger>

              <Tabs.Trigger
                value="cancelado"
                className="data-[state=active]:border-[#61c39a] data-[state=active]:text-[#61c39a] text-[#264f41] border-b-4 hover:bg-gray-200 p-2 transition duration-300">
                  Cancelados
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content
              value="aguardando">
                <TabelaProducao
                  dados={pedidos.filter(p => p.status_ped === 'Pago Aguardando Produção' || p.status_ped === "Aguardando Pagamento" || p.status_ped === "No Carrinho")}
                  onAbrirDetalhes={handleAbrirPedido}
                  handleAlterarStatus={handleAlterarStatus}
                  handleDetalhesCliente={handleDetalhesCliente}/>
            </Tabs.Content>

            <Tabs.Content
              value="producao">
                <TabelaProducao
                  dados={pedidos.filter(p => p.status_ped === 'Em Produção')}
                  onAbrirDetalhes={handleAbrirPedido}
                  handleAlterarStatus={handleAlterarStatus}
                  handleDetalhesCliente={handleDetalhesCliente}/>
            </Tabs.Content>

            <Tabs.Content
              value="entrega">
              <TabelaProducao
                dados={pedidos.filter(p => p.status_ped === 'Entregue' || p.status_ped === 'A Caminho' || p.status_ped === 'Aguardando Retirada')}
                onAbrirDetalhes={handleAbrirPedido}
                handleAlterarStatus={handleAlterarStatus}
                handleDetalhesCliente={handleDetalhesCliente}/>
            </Tabs.Content>

            <Tabs.Content
              value="cancelado">
              <TabelaProducao
                dados={pedidos.filter(p => p.status_ped === 'Cancelado')}
                onAbrirDetalhes={handleAbrirPedido}
                handleAlterarStatus={handleAlterarStatus}
                handleDetalhesCliente={handleDetalhesCliente}/>
            </Tabs.Content>
          </Tabs.Root>

{/*           <div className="overflow-x-auto border-2 rounded-t-xl">
            <table className="w-full text-left">
              <thead className="border-2 border-zinc-500">
                <tr className="bg-[#264f41] text-white">
                  <th className="p-3">ID Pedido</th>
                  <th className="p-3 text-center">Quantidade</th>
                  <th className="p-3 text-center">Preço Total (R$)</th>
                  <th className="p-3 text-center">Mais Detalhes</th>
                </tr>
              </thead>
              <tbody className="bg-white border-gray-300">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-[#f0faf5] transition">
                    <td className="p-4 font-bold text-[#264f41] max-w-[250px] truncate">{pedido.id}</td>
                    <td className="p-3 text-center">{pedido.quantidade}</td>
                    <td className="p-3 text-center">R${pedido.preco.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleAbrirPedido(pedido.id)}>
                        Abrir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
        </main>

        <Dialog.Root open={!!pedidoSelecionado} onOpenChange={(open) => { if (!open) handleFecharModal(); }}>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 fixed inset-0 backdrop-blur-sm z-40" />
            <Dialog.Content 
              aria-describedby={undefined} 
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl w-[min(92vw,40rem)] max-h-[90vh] z-[100] overflow-y-auto custom-scrollbar flex flex-col gap-6"
            >
              <Dialog.Title className="flex justify-between items-center border-b border-gray-100 pb-4 m-0">
                <div>
                  <h2 className="text-md lg:text-xl font-extrabold text-[#264f41] uppercase tracking-tight">
                    Pedido #{pedidoSelecionado?.id_ped}
                  </h2>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-1">
                    Realizado em: {pedidoSelecionado && new Date(pedidoSelecionado.data_criacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </Dialog.Title>

              {/* Lista de Itens */}
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                <p className="text-xs font-bold text-gray-400 uppercase">Itens do pedido:</p>
                {pedidoSelecionado?.itens_pedido?.map((item) => (
                  <div key={item.id_ten} className="bg-[#f4f7f5] border border-[#e4f4ed] rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#264f41]">Sacola {item.cor_sacola}</p>
                      <p className="text-sm text-gray-600">{item.quantidade}x unidades</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold uppercase">Preço Un.</p>
                      <p className="font-black text-[#3ca779]">R$ {Number(item.preco).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rodapé: Resumo de Valores */}
{/*               <div className="mt-2 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 font-bold uppercase text-sm">Total do Pedido:</span>
                  <span className="text-2xl font-black text-[#264f41]">
                    R$ {pedidoSelecionado?.itens_pedido?.reduce((acc, item) => acc + (Number(item.preco) * item.quantidade), 0).toFixed(2)}
                  </span>
                </div>
              </div> */}

              {/* Botão X no canto superior direito (Padrão do seu Painel) */}
              <Dialog.Close asChild>
                <button className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold text-lg transition">✕</button>
              </Dialog.Close>

            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {imagemAberta && (
          <div
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setImagemAberta(null)}
          >
            <button
              className="absolute top-4 right-4 text-white bg-black/40 rounded-full px-3 py-1 text-sm"
              onClick={(event) => {
                event.stopPropagation();
                setImagemAberta(null);
              }}
            >
              Fechar
            </button>
            <img
              src={imagemAberta}
              alt="Imagem ampliada"
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        )}
      </>
      </RotaAdmin>
    );
}