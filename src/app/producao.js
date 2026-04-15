"use client"
import React, { useState } from "react";

export default function Producao() {
    const [pedidos, setPedidos] = useState([
        { id: 1, tipo: 'Sacola Kraft', quantidade: 400, tamanho: 'Médio', cor: 'Branco', imagem: 'img/img_login.png', preco: 45.00 },
        { id: 2, tipo: 'Sacola Plástica', quantidade: 200, tamanho: 'Pequeno', cor: 'Preto', imagem: 'img/img_login.png', preco: 30.00 },
        { id: 3, tipo: 'Sacola Tecido', quantidade: 150, tamanho: 'Grande', cor: 'Colorido', imagem: 'img/img_login.png', preco: 60.00 },
    ]);

    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [imagemAberta, setImagemAberta] = useState(null);

    const handleAbrirPedido = (id) => {
      const pedido = pedidos.find(p => p.id === id);
      setPedidoSelecionado(pedido);
    }

    const handleFecharModal = () => {
      setPedidoSelecionado(null);
    }

    return (
      <>
        <main className="p-5 m-auto bg-gray-100">
          <meta charSet="UTF-8" />
          <title>Produção</title>

          <div className="mb-4">
            <h1 className="text-xl font-extrabold">Painel Produção</h1>
            <h2>Visualize os detalhes dos pedidos</h2>
          </div>

          <div className="overflow-x-auto border-2 rounded-t-xl">
            <table className="w-full text-left">
              <thead className="border-2 border-zinc-500">
                <tr className="bg-zinc-800 text-white">
                  <th className="p-3">ID Pedido</th>
                  <th className="p-3 text-center">Quantidade</th>
                  <th className="p-3 text-center">Preço Total (R$)</th>
                  <th className="p-3 text-center">Mais Detalhes</th>
                </tr>
              </thead>
              <tbody className="bg-white border-gray-300">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-500 transition">
                    <td className="p-3 font-semibold text-gray-800">{pedido.id}</td>
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
          </div>
        </main>

        {pedidoSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Detalhes do Pedido #{pedidoSelecionado.id}</h2>
              
              <div className="space-y-3 mb-6">
                <p><strong>Tipo:</strong> {pedidoSelecionado.tipo}</p>
                <p><strong>Quantidade:</strong> {pedidoSelecionado.quantidade}</p>
                <p><strong>Tamanho:</strong> {pedidoSelecionado.tamanho}</p>
                <p><strong>Cor:</strong> {pedidoSelecionado.cor}</p>
                <div>
                  <strong>Imagem:</strong>
                  <img
                    src={pedidoSelecionado.imagem}
                    alt={`Foto do pedido ${pedidoSelecionado.id}`}
                    className="mt-2 w-full max-w-[250px] aspect-square object-cover rounded-lg border border-gray-200 cursor-pointer"
                    onClick={() => setImagemAberta(pedidoSelecionado.imagem)}
                  />
                </div>
                <p><strong>Preço Total:</strong> R${pedidoSelecionado.preco.toFixed(2)}</p>
              </div>

              <button
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                onClick={handleFecharModal}>
                Fechar
              </button>
            </div>
          </div>
        )}

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
    );
}