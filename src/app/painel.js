"use client";

import Link from "next/link";
import useLoginHook from "../hooks/loginHook.js" // precisa trocar pra um que valide se o usuário já está logado (ou então adicionar essa logica dentro do loginHook)
import { useState, useEffect } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { supabase } from "../lib/supabaseClient";
import { CheckIcon, EyeNoneIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons" // adicionar esses e outros icones depois


export default function Painel() {

  useEffect(() => {
    // Criamos a função que vai até a nuvem
    const carregarSacolas = async () => {
      // Pedimos tudo (*) de uma tabela específica
      const { data, error } = await supabase
        .from('sacola') 
        .select('*');

      if (error) {
        console.error("Erro ao buscar as sacolas:", error);
        return; // Se der erro, paramos por aqui
      }

      if (data) {
        // Se a resposta chegou, colocamos os dados na nossa lista principal!
        setSacolas(data); 
      }
    };

    // Executamos a função
    carregarSacolas();
    
  }, []); // 👈 Esse colchete vazio é vital! Ele diz ao React: "Rode isso apenas UMA VEZ ao abrir a página."

  const [sacolas, setSacolas] = useState([
    { id_sac: 1, nome_sac: 'Carregando', tipo_sac: 'Carregando', quantidademin_sac: 0, precounitario_sac: 0, tamanho_sac: 'Carregando', peso_sac: 'Carregando', status_sac: 'Carregando' },
  ]);

  const [novaSacola, setNovaSacola] = useState({
    nome_sac: '',
    tipo_sac: '',
    quantidademin_sac: '',
    precounitario_sac: '',
    tamanho_sac: '',
    peso_sac: '',
    status_sac: ''
  });

  const handleSalvarSacola = async (e) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário
  
    // 1. Preparamos a sacola final com um ID único provisório
    const sacolaPronta = {
      ...novaSacola,
      id_sac: sacolaEditandoId ? sacolaEditandoId : Date.now(), // O Date.now() gera um número único baseado na hora atual
      precounitario_sac: parseFloat(novaSacola.precounitario_sac),
      quantidademin_sac: parseFloat(novaSacola.quantidademin_sac) // Garante que o preço seja tratado como número
    };
  
    // 2. A Mágica do React: atualizamos a lista principal
    // Os "..." copiam as sacolas antigas, e colocamos a "sacolaPronta" no final
    if (sacolaEditandoId) {
      // ---------------- MODO EDIÇÃO ----------------
      const { data, error } = await supabase
        .from('sacola')
        .update({
          tipo_sac: novaSacola.tipo_sac, 
          quantidademin_sac: parseInt(novaSacola.quantidademin_sac), 
          precounitario_sac: parseFloat(novaSacola.precounitario_sac),
          tamanho_sac: novaSacola.tamanho_sac,
          peso_sac: novaSacola.peso_sac,
          nome_sac: novaSacola.nome_sac,
          status_sac: novaSacola.status_sac
        })
        .eq('id_sac', sacolaEditandoId)
        .select();
  
      if (error) {
        console.error("Erro ao editar:", error);
      } else if (data) {
        // Se deu certo, atualizamos a lista na tela com o item atualizado (data[0])
        const sacolasAtualizadas = sacolas.map((sacola) => 
          sacola.id_sac === sacolaEditandoId ? data[0] : sacola
        );
        setSacolas(sacolasAtualizadas);
      }

    } else {
      // ---------------- MODO CRIAÇÃO ----------------
      const { data, error } = await supabase
        .from('sacola')
        .insert([{ 
          tipo_sac: novaSacola.tipo_sac, 
          quantidademin_sac: parseInt(novaSacola.quantidademin_sac), 
          precounitario_sac: parseFloat(novaSacola.precounitario_sac),
          tamanho_sac: novaSacola.tamanho_sac,
          peso_sac: novaSacola.peso_sac,
          nome_sac: novaSacola.nome_sac,
          status_sac: novaSacola.status_sac
        }])
        .select();
    
      if (error) {
        console.error("Erro ao criar:", error);
      } else if (data) {
        // Se deu certo, colocamos a sacola nova no final da lista
        setSacolas([...sacolas, data[0]]);
      }
    };
  
    // Passo 3: Limpa o formulário de volta ao estado inicial
    setNovaSacola({ nome_sac:'', tipo_sac: '', quantidademin_sac: '', precounitario_sac: '', tamanho_sac: '', peso_sac: '', status_sac: ''});
    
    // Passo 4: Fecha a janela do Radix
    setModalAberto(false);
    setSacolaEditandoId(null);
  };

  const [modalAberto, setModalAberto] = useState(false);
  const [sacolaEditandoId, setSacolaEditandoId] = useState(null);

  const handleAbrirEdicao = (sacolaEscolhida) => {
    setNovaSacola({ 
      id_sac: sacolaEscolhida.id_sac,
      tipo_sac: sacolaEscolhida.tipo_sac,
      quantidademin_sac: sacolaEscolhida.quantidademin_sac,
      precounitario_sac: sacolaEscolhida.precounitario_sac,
      tamanho_sac: sacolaEscolhida.tamanho_sac,
      peso_sac: sacolaEscolhida.peso_sac,
      nome_sac: sacolaEscolhida.nome_sac,
      status_sac: sacolaEscolhida.status_sac
    });
    setSacolaEditandoId(sacolaEscolhida.id_sac); // Avisa qual ID estamos editando
    setNovaSacola(sacolaEscolhida);          // Preenche o formulário
    setModalAberto(true);                    // Abre o modal
  };

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
              
            <input 
                type="text"
                placeholder="Nome de Exibição"
                className="border border-gray-300 p-3 rounded outline-none focus:border-zinc-900 transition"
                value={novaSacola.nome_sac}
                onChange={(e) => setNovaSacola({ ...novaSacola, nome_sac: e.target.value })}
              />

              {/* CAMPO 1: TIPO DA SACOLA 
              Depois quero mudar esse para um campo dropdown selecionavel */}
              <Select.Root 
                value={novaSacola.tipo_sac} 
                onValueChange={(value) => setNovaSacola({ ...novaSacola, tipo_sac: value })}
              >
                {/* O botão que aparece na tela (com as mesmas classes do seu input) */}
                <Select.Trigger className="flex w-full items-center justify-between border border-gray-300 p-3 rounded bg-white outline-none focus:border-zinc-900 transition">
                  <Select.Value placeholder="Selecione o material da sacola"/>
                </Select.Trigger>

                <Select.Portal>
                  {/* A caixa flutuante do menu (z-50 garante que fique por cima do seu Modal) */}
                  <Select.Content className="overflow-hidden bg-white rounded-md shadow-2xl border border-gray-200 z-[100] w-[var(--radix-select-trigger-width)]">
                    <Select.Viewport>

                      <Select.Item value="Plástico" className="p-3 outline-none cursor-pointer focus:bg-gray-100 hover:bg-gray-100 transition">
                        <Select.ItemText>Plástico</Select.ItemText>
                      </Select.Item>

                      <Select.Item value="Papel" className="p-3 outline-none cursor-pointer focus:bg-gray-100 hover:bg-gray-100 transition">
                        <Select.ItemText>Papel</Select.ItemText>
                      </Select.Item>

                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>

              {/* quantidade */}
              <input 
                type="number"
                min="1"
                step="1"
                placeholder="Quantidade minima"
                className="border border-gray-300 p-3 rounded outline-none focus:border-zinc-900 transition"
                value={novaSacola.quantidademin_sac}
                onChange={(e) => setNovaSacola({ ...novaSacola, quantidademin_sac: e.target.value })}
              />

              {/*  precounitario_sac */}
              <div>
                <span className="rounded border aspect-square p-3 border-gray-300 mr-2">
                R$
                </span>
              <input 
                type="number"
                min="0"
                step="0.01"
                placeholder="Preço unitário"
                className="border border-gray-300 p-3 rounded outline-none focus:border-zinc-900 transition"
                value={novaSacola.precounitario_sac} 
                onChange={(e) => setNovaSacola({ ...novaSacola, precounitario_sac: e.target.value })}
              />
              </div>

              {/* tamanho_sac */}
              <input 
                type="text"
                placeholder="Tamanho"
                className="border border-gray-300 p-3 rounded outline-none focus:border-zinc-900 transition"
                value={novaSacola.tamanho_sac}
                onChange={(e) => setNovaSacola({ ...novaSacola, tamanho_sac: e.target.value })}
              />

              {/* peso_sac */}
              <input 
                type="text"
                placeholder="Peso"
                className="border border-gray-300 p-3 rounded outline-none focus:border-zinc-900 transition"
                value={novaSacola.peso_sac}
                onChange={(e) => setNovaSacola({ ...novaSacola, peso_sac: e.target.value })}
              />

              {/* status_sac */}
              <Select.Root 
                value={novaSacola.status_sac} 
                onValueChange={(value) => setNovaSacola({ ...novaSacola, status_sac: value })}
              >
                {/* O botão que aparece na tela (com as mesmas classes do seu input) */}
                <Select.Trigger className="flex w-full items-center justify-between border border-gray-300 p-3 rounded bg-white outline-none focus:border-zinc-900 transition">
                  <Select.Value placeholder="Selecione o status..."/>
                </Select.Trigger>

                <Select.Portal>
                  {/* A caixa flutuante do menu (z-50 garante que fique por cima do seu Modal) */}
                  <Select.Content className="overflow-hidden bg-white rounded-md shadow-2xl border border-gray-200 z-[100] w-[var(--radix-select-trigger-width)]">
                    <Select.Viewport>

                      <Select.Item value="Disponível" className="p-3 outline-none cursor-pointer focus:bg-gray-100 hover:bg-gray-100 transition">
                        <Select.ItemText>Disponível</Select.ItemText>
                      </Select.Item>

                      <Select.Item value="Fora de Estoque" className="p-3 outline-none cursor-pointer focus:bg-gray-100 hover:bg-gray-100 transition">
                        <Select.ItemText>Fora de Estoque</Select.ItemText>
                      </Select.Item>

                      <Select.Item value="Oculto" className="p-3 outline-none cursor-pointer focus:bg-gray-100 hover:bg-gray-100 transition">
                        <Select.ItemText>Oculto</Select.ItemText>
                      </Select.Item>

                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>

              <button type="submit" className="mt-4 bg-[#3f705d] hover:bg-[#2f5546] text-white p-3 rounded font-bold transition">
                Salvar Sacola
              </button>
              <div className="flex-row flex items-center">
              <ExclamationTriangleIcon className="size-7"></ExclamationTriangleIcon>
                <div className="px-3 flex-col flex font-semibold">
                  <span>Cuidado ao salvar!</span>
                <span>Suas alterações podem ter grandes pesos.</span>
              </div>
              </div>
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
    <tr className="bg-zinc-800 text-white">
      <th className="p-3">Nome de Exibição</th>
      <th className="p-3">Material da Sacola</th>
      <th className="p-3 text-center">Qtd. Mínima</th>
      <th className="p-3 text-center">Preço Unit. (R$)</th>
      <th className="p-3 text-center">Tamanho</th>
      <th className="p-3 text-center">Peso</th>
      <th className="p-3 text-center">Status</th>
      <th className="p-3 text-center">Ações</th> {/* Reservado para Editar/Excluir */}
    </tr>
  </thead>
  <tbody className="bg-white border-gray-300">
    {sacolas.map((sacola) => (
<tr key={sacola.id_sac} className="border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-500 hover:border-2 transition">
<td className="p-3 font-semibold text-gray-800">{sacola.nome_sac}</td>
<td className="p-3 font-semibold text-gray-800">{sacola.tipo_sac}</td>
<td className="p-3 text-center">{sacola.quantidademin_sac}</td>
<td className="p-3 text-center">{sacola.precounitario_sac}</td>
<td className="p-3 text-center">{sacola.tamanho_sac}</td>
<td className="p-3 text-center">{sacola.peso_sac}</td>
<td className="p-3 text-center">{sacola.status_sac}</td>
<td className="p-3 flex justify-center space-x-3">
  <button className="text-blue-600 hover:text-blue-800" onClick={() => {
    handleAbrirEdicao({...sacola})
  }}>Editar</button>
</td>
</tr>
))}
</tbody>
</table>
</div>



      
    </main>
  );
}