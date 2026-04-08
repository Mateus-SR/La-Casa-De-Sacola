"use client";

import Link from "next/link";
import useLoginHook from "../hooks/loginHook.js" // precisa trocar pra um que valide se o usuário já está logado (ou então adicionar essa logica dentro do loginHook)
import { useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';

export default function Painel() {

  const [sacolas, setSacolas] = useState([
    { id: 1, tipo: 'Papel Kraft', qtdMinima: 100, preco: 1.50, tamanho: '30x40 cm', peso: '50g' },
    { id: 2, tipo: 'Plástico Alça Vazada', qtdMinima: 500, preco: 0.80, tamanho: '20x30 cm', peso: '15g' }
  ]);

  const [novaSacola, setNovaSacola] = useState({
    tipo: '',
    qtdMinima: '',
    preco: '',
    tamanho: '',
    peso: ''
  });

  const handleSalvarSacola = (e) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário
  
    // 1. Preparamos a sacola final com um ID único provisório
    const sacolaPronta = {
      ...novaSacola,
      id: Date.now(), // O Date.now() gera um número único baseado na hora atual
      preco: parseFloat(novaSacola.preco) // Garante que o preço seja tratado como número
    };
  
    // 2. A Mágica do React: atualizamos a lista principal
    // Os "..." copiam as sacolas antigas, e colocamos a "sacolaPronta" no final
    setSacolas([...sacolas, sacolaPronta]);
  
    // Passo 3: Limpa o formulário de volta ao estado inicial
    setNovaSacola({ tipo: '', qtdMinima: '', preco: '', tamanho: '', peso: '' });
    
    // Passo 4: Fecha a janela do Radix
    setModalAberto(false);
  };

  const [modalAberto, setModalAberto] = useState(false);

  return (
    <main className="p-5 m-auto bg-gray-100">
      <meta charSet="UTF-8" />
      <title>Login</title>

      <div className="mb-4">
        <h1 className="text-xl font-extrabold">Painel Administrador</h1>
        <h2>Gerencie seus produtos</h2>
      </div>

      
      <div /*</main>className="mt-2.5 mx-2.5 fixed right-5"*/>
<Dialog.Root open={modalAberto} onOpenChange={setModalAberto}>
        
        {/* O BOTÃO QUE ABRE A JANELA */}
        <Dialog.Trigger asChild>
          <button className="mb-4 bg-zinc-900 hover:bg-zinc-700 text-white px-4 py-2 rounded font-semibold transition shadow-sm">
            + Nova Sacola
          </button>
        </Dialog.Trigger>

        {/* A JANELA FLUTUANTE (MODAL) */}
        <Dialog.Portal>
          {/* O fundo escuro */}
          <Dialog.Overlay className="bg-black/50 fixed inset-0 backdrop-blur-sm" />
          
          {/* A caixa branca no centro */}
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <Dialog.Title className="text-xl font-extrabold mb-6">Adicionar Nova Sacola</Dialog.Title>

            {/* O SEU FORMULÁRIO ENTRA AQUI! */}
            <form onSubmit={handleSalvarSacola} className="flex flex-col gap-4">
              
              {/* CAMPO 1: TIPO DA SACOLA 
              Depois quero mudar esse para um campo dropdown selecionavel */}
              <input 
                type="text"
                placeholder="Tipo da Sacola (ex: Papel Kraft)"
                className="border border-gray-300 p-3 rounded outline-none focus:border-zinc-900 transition"
                value={novaSacola.tipo}
                onChange={(e) => setNovaSacola({ ...novaSacola, tipo: e.target.value })}
              />

              {/* quantidade */}
              <input 
                type="text"
                placeholder="Quantidade minima"
                className="border border-gray-300 p-3 rounded outline-none focus:border-zinc-900 transition"
                value={novaSacola.qtdMinima}
                onChange={(e) => setNovaSacola({ ...novaSacola, qtdMinima: e.target.value })}
              />

              {/*  preco */}
              <input 
                type="text"
                placeholder="Preço"
                className="border border-gray-300 p-3 rounded outline-none focus:border-zinc-900 transition"
                value={novaSacola.preco}
                onChange={(e) => setNovaSacola({ ...novaSacola, preco: e.target.value })}
              />

              {/* tamanho */}
              <input 
                type="text"
                placeholder="Tamanho"
                className="border border-gray-300 p-3 rounded outline-none focus:border-zinc-900 transition"
                value={novaSacola.tamanho}
                onChange={(e) => setNovaSacola({ ...novaSacola, tamanho: e.target.value })}
              />

              {/* peso */}
              <input 
                type="text"
                placeholder="Peso"
                className="border border-gray-300 p-3 rounded outline-none focus:border-zinc-900 transition"
                value={novaSacola.peso}
                onChange={(e) => setNovaSacola({ ...novaSacola, peso: e.target.value })}
              />

              <button type="submit" className="mt-4 bg-[#3f705d] hover:bg-[#2f5546] text-white p-3 rounded font-bold transition">
                Salvar Sacola
              </button>
            </form>

            {/* Botão de fechar (X) nativo do Radix no canto da janela */}
            <Dialog.Close asChild>
              <button className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold">X</button>
            </Dialog.Close>

          </Dialog.Content>
        </Dialog.Portal>

      </Dialog.Root>
</div>

<div className="overflow-x-auto border-2 rounded-t-xl">
<table className="w-full text-left">
  <thead className="border-2 border-zinc-500">
    <tr className="bg-zinc-800 text-white ">
      <th className="p-3">Tipo da Sacola</th>
      <th className="p-3 text-center">Qtd. Mínima</th>
      <th className="p-3 text-center">Preço (R$)</th>
      <th className="p-3 text-center">Tamanho</th>
      <th className="p-3 text-center">Peso</th>
      <th className="p-3 text-center">Ações</th> {/* Reservado para Editar/Excluir */}
    </tr>
  </thead>
  <tbody className="bg-white border-gray-300">
    {sacolas.map((sacola) => (
      <tr key={sacola.id} className="border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-500 hover:border-2 transition">
        <td className="p-3 font-semibold text-gray-800">{sacola.tipo}</td>
        <td className="p-3 text-center">{sacola.qtdMinima}</td>
        <td className="p-3 text-center">{sacola.preco.toFixed(2)}</td>
        <td className="p-3 text-center">{sacola.tamanho}</td>
        <td className="p-3 text-center">{sacola.peso}</td>
        <td className="p-3 flex justify-center space-x-3">
          <button className="text-blue-600 hover:text-blue-800">Editar</button>
          <button className="text-red-600 hover:text-red-800">Excluir</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>



      
    </main>
  );
}