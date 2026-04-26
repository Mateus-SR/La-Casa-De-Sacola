"use client";
import { 
    Pencil2Icon
  } from "@radix-ui/react-icons";

export default function TabelaProducao({ dados, onAbrirDetalhes, handleAlterarStatus, handleDetalhesCliente }) {
    // Componente de Tabela Reutilizável
  if (!dados || dados.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-[#e4f4ed]">
        <p className="text-lg font-semibold">Nenhum pedido encontrado nesta categoria.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-[#e4f4ed] overflow-hidden">
      <div className="max-h-full overflow-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="sticky top-0 z-10 bg-[#264f41] text-white">
            <tr>
              <th className="p-4 font-semibold text-sm">ID Pedido</th>
              <th className="p-4 font-semibold text-sm text-center">Quantidade</th>
              <th className="p-4 font-semibold text-sm text-center">Preço Total (R$)</th>
              <th className="p-4 font-semibold text-sm text-center">Cliente</th>
              <th className="p-4 font-semibold text-sm text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dados.map((pedido) => (
              <tr key={pedido.id_ped} className="hover:bg-[#f0faf5] transition">
                <td className="p-4 font-bold text-[#264f41] max-w-[250px] truncate">#{pedido.id_ped}</td>
                <td className="p-4 text-center">{pedido.itens_pedido.quantidade}</td>
                <td className="p-4 text-center">R$ {Number(pedido.itens_pedido.preco).toFixed(2)}</td>
                <td className="p-4 text-center hover:underline hover:cursor-pointer"
                    onClick={() => handleDetalhesCliente(pedido)}>
                        {pedido.usu_uuid}</td>
                <td className="p-4 text-center flex gap-5 justify-center">
                    <button 
                        onClick={() => onAbrirDetalhes(pedido)}
                        className="text-blue-600 hover:bg-white p-2 rounded-lg transition inline-flex items-center gap-1 font-bold">
                        Abrir Detalhes
                    </button>
                        <button onClick={() => handleAlterarStatus(pedido)} className="text-blue-600 hover:bg-white p-2 rounded-lg transition inline-flex items-center gap-1 font-bold">
                          <Pencil2Icon/> Editar
                        </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    
  );
};