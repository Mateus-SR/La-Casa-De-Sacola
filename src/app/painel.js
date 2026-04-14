"use client";

import Link from "next/link";
import useLoginHook from "../hooks/loginHook.js" // precisa trocar pra um que valide se o usuário já está logado (ou então adicionar essa logica dentro do loginHook)
import RotaAdmin from "../components/admin/rotaAdmin"
import { useState, useEffect } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox'
import { supabase } from "../lib/supabaseClient";
import { Pencil2Icon, CheckCircledIcon, CheckIcon, EyeNoneIcon , EyeOpenIcon, ExclamationTriangleIcon, PlusIcon, TrashIcon, EyeClosedIcon } from "@radix-ui/react-icons" // adicionar esses e outros icones depois


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
    carregarFiltros();
    
  }, []); // 👈 Esse colchete vazio é vital! Ele diz ao React: "Rode isso apenas UMA VEZ ao abrir a página."

  const carregarFiltros = async () => {
    const { data: tipo, error: erroMat } = await supabase.from('tipo').select('tipo_tip');
    if (tipo) setOpcoesMaterial(tipo.map(t => t.tipo_tip));

    const { data: tamanho } = await supabase.from('tamanho').select('tamanho_tam');
    if (tamanho) setOpcoesTamanho(tamanho.map(t => t.tamanho_tam));
  };

  const [sacolas, setSacolas] = useState([
    { id_sac: 1, nome_sac: 'Carregando', tipo_sac: 'Carregando', quantidademin_sac: 0, precounitario_sac: 0, tamanho_sac: 'Carregando', peso_sac: 'Carregando', status_sac: 'Carregando' },
  ]);

  const [opcoesMaterial, setOpcoesMaterial] = useState([]);
  const [opcoesTamanho, setOpcoesTamanho] = useState([]);

  const [modalEnumAberto, setModalEnumAberto] = useState(false);
  const [enumAtual, setEnumAtual] = useState("");
  const [novoValorEnum, setNovoValorEnum] = useState("");

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

  const [mostrarSacolasAtivas, setMostrarSacolasAtivas] = useState(true);
  const [mostrarSacolasOcultas, setMostrarSacolasOcultas] = useState(false);
  
  const handleOcultarSacola = async () => {
    const { error } = await supabase
      .from('sacola')
      .update({ status_sac: 'Oculto' })
      .eq('id_sac', sacolaEditandoId)

      if (error) {
        console.error("Erro ao ocultar sacola:", error)
        // pendente modal de erro aqui
      } else {
        setSacolas(sacolas.map((sacola) => 
          sacola.id_sac === sacolaEditandoId
          ? {...sacola, status_sac: 'Oculto' }
          : sacola
        ));
      };

      setModalAberto(false);
      setSacolaEditandoId(null);
  }

  const handleAdicionarValorEnum = async (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    if (!novoValorEnum.trim()) return; 

    // Define em qual tabela vamos inserir (materiais ou tamanhos)
    const tabelaAlvo = enumAtual === 'tipo' ? 'tipo' : 'tamanho';
    const nomeColuna = enumAtual === 'tipo' ? 'tipo_tip' : 'tamanho_tam';

    // Faz um insert padrão na tabela escolhida
    const { error } = await supabase
      .from(tabelaAlvo)
      .insert([{ [nomeColuna]: novoValorEnum.trim() }]);

    if (error) {
      console.error("Erro ao adicionar na tabela:", error);
      // pendente modal avisando sobre o erro, se nome ja existe, etc
    } else {
      await carregarFiltros(); 
      setModalEnumAberto(false);
      setNovoValorEnum("");      
    }
  };

  const sacolasFiltradas = sacolas.filter((sacola) => {
    if (sacola.status_sac === 'Oculto') {
      return mostrarSacolasOcultas;
    }
    return mostrarSacolasAtivas;
  });
  
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

  const handleAbrirNovaSacola = () => {
    setSacolaEditandoId(null); 
    
    setNovaSacola({ 
      nome_sac: '', 
      tipo_sac: '', 
      quantidademin_sac: '', 
      precounitario_sac: '', 
      tamanho_sac: '', 
      peso_sac: '', 
      status_sac: '' 
    });
    
  };

  return (
    <RotaAdmin>
    <main className="p-5 m-auto bg-gray-100 h-screen flex flex-col">
      <meta charSet="UTF-8" />
      <title>Painel Administrador</title>

      <div className="mb-4">
        <h1 className="text-lg lg:text-xl font-extrabold">Painel Administrador</h1>
        <h2 className="text-md lg:text-lg">Gerencie seus produtos</h2>
      </div>

      
      <div /*</main>className="mt-2.5 mx-2.5 fixed right-5"*/>
<Dialog.Root open={modalAberto} onOpenChange={setModalAberto}>
        
<div className="flex items-center mb-2.5 justify-between">
<div className="flex flex-row flex-wrap items-center gap-4 lg:gap-6 lg:mr-10">
  
<div className="flex items-center gap-2 cursor-pointer">
  <Checkbox.Root
    className="flex size-5 lg:size-6 appearance-none items-center justify-center rounded border-2 border-green-400 bg-white outline-none hover:bg-blue-50 data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 transition-colors"
    id="chkAtivas"
    checked={mostrarSacolasAtivas}
    onCheckedChange={setMostrarSacolasAtivas}
  >
    <Checkbox.Indicator className="text-white">
      <CheckIcon className="size-5" /> 
    </Checkbox.Indicator>
  </Checkbox.Root>
  
  <label
    className="text-sm lg:text-base font-medium leading-none text-black cursor-pointer flex items-center gap-1.5 select-none"
    htmlFor="chkAtivas"
  >
    <CheckCircledIcon className="size-5 text-green-600 hidden sm:block" />
    Mostrar sacolas ativas
  </label>
</div>

<div className="flex items-center gap-2 cursor-pointer">
  <Checkbox.Root
    className="flex size-5 lg:size-6 appearance-none items-center justify-center rounded border-2 border-red-400 bg-white outline-none hover:bg-red-50 data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600 transition-colors"
    id="chkOcultas"
    checked={mostrarSacolasOcultas}
    onCheckedChange={setMostrarSacolasOcultas}
  >
    <Checkbox.Indicator className="text-white">
      <CheckIcon className="size-5" /> 
    </Checkbox.Indicator>
  </Checkbox.Root>
  
  <label
    className="text-sm lg:text-base font-medium leading-none text-black cursor-pointer flex items-center gap-1.5 select-none"
    htmlFor="chkOcultas"
  >
    <TrashIcon className="size-5 text-red-600 hidden sm:block" />
    Mostrar sacolas excluídas
  </label>
</div>

</div>

      {/* O BOTÃO QUE ABRE A JANELA */}
      <Dialog.Trigger asChild>
          <button className="bg-zinc-900 hover:bg-zinc-700 text-white px-4 py-2 rounded font-semibold transition shadow-sm text-sm lg:text-md" onClick={handleAbrirNovaSacola}>
            + Nova Sacola
          </button>
        </Dialog.Trigger>
</div>


        {/* A JANELA FLUTUANTE (MODAL) */}
        <Dialog.Portal>
          {/* O fundo escuro */}
          <Dialog.Overlay className="bg-black/50 fixed inset-0 backdrop-blur-sm z-40" />
          
          {/* A caixa branca no centro */}
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl w-full max-w-md z-[100] h-5/6 md:h-auto lg:h-auto overflow-auto custom-scrollbar">
            <Dialog.Title className="text-md lg:text-xl font-extrabold mb-6">{sacolaEditandoId ? 'Editar Sacola' : 'Adicionar Nova Sacola'}</Dialog.Title>

            {/* O SEU FORMULÁRIO ENTRA AQUI! */}
            <form onSubmit={handleSalvarSacola} className="flex flex-col gap-4">
              
          <div className="flex flex-col">
            <span className="font-bold text-xs lg:text-sm  select-none">Nome de Exibição</span>
            <input 
                type="text"
                placeholder="Nome de Exibição"
                className="border border-gray-300 p-2.5 rounded outline-none focus:border-zinc-900 transition text-sm lg:text-md font-extralight"
                value={novaSacola.nome_sac}
                maxLength={60}
                onChange={(e) => setNovaSacola({ ...novaSacola, nome_sac: e.target.value })}
              />
            </div>
            
            <div className="flex flex-col">
            <span className="font-bold text-xs lg:text-sm select-none">Material da Sacola</span>
              <Select.Root 
                value={novaSacola.tipo_sac} 
                onValueChange={(value) => setNovaSacola({ ...novaSacola, tipo_sac: value })}
              >
                <div className="flex flex-row">
                {/* O botão que aparece na tela (com as mesmas classes do seu input) */}
                <Select.Trigger className="flex w-full items-center justify-between border border-gray-300 p-2.5 rounded bg-white outline-none focus:border-zinc-900 transition text-sm lg:text-md font-extralight">
                  <Select.Value placeholder="Selecione o material da sacola..."/>
                  
                </Select.Trigger>
                  <span className="rounded border aspect-square p-2.5 border-gray-300 hover:bg-[#3f705d] hover:text-white transition duration-[200] active:border-zinc-900 active:bg-[#2f5546] cursor-pointer ml-2" onClick={() => { setEnumAtual('tipo'); setModalEnumAberto(true); }}>
                  <PlusIcon className="size-5 lg:size-6"></PlusIcon>
                  </span>
                </div>

                <Select.Portal>
                  {/* A caixa flutuante do menu (z-50 garante que fique por cima do seu Modal) */}
                  <Select.Content className="overflow-hidden bg-white rounded-md shadow-2xl border border-gray-200 z-[100] w-[var(--radix-select-trigger-width)]">
                    <Select.Viewport>

                      {opcoesMaterial.map((material) => (
                        <Select.Item key={material} value={material} className="p-2.5 outline-none cursor-pointer focus:bg-gray-100 hover:bg-gray-100 transition text-sm lg:text-md font-extralight">
                        <Select.ItemText>{material}</Select.ItemText>
                      </Select.Item>
                      ))}

                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              </div>

              <div className="flex flex-col">
            <span className="font-bold text-xs lg:text-sm select-none">Quantidade Mínima</span>
              <input 
                type="number"
                min="1"
                step="1"
                placeholder="Quantidade minima"
                className="border border-gray-300 p-2.5 rounded outline-none focus:border-zinc-900 transition text-sm lg:text-md font-extralight"
                value={novaSacola.quantidademin_sac}
                onChange={(e) => setNovaSacola({ ...novaSacola, quantidademin_sac: e.target.value })}
              />
              </div>

              <div className="flex flex-col">
            <span className="font-bold text-xs lg:text-sm select-none">Preço unitário</span>
              <div className="flex flex-row">
                <span className="rounded border aspect-square p-2.5 border-gray-300 mr-2 text-sm lg:text-md font-extralight">
                R$
                </span>
              <input 
                type="number"
                min="0"
                step="0.01"
                placeholder="Preço unitário"
                className="border w-full border-gray-300 p-2.5 rounded outline-none focus:border-zinc-900 transition text-sm lg:text-md font-extralight"
                value={novaSacola.precounitario_sac} 
                onChange={(e) => setNovaSacola({ ...novaSacola, precounitario_sac: e.target.value })}

                onBlur={(e) => {
                  const valor = parseFloat(e.target.value);
                  // Verifica se é um número válido antes de formatar
                  if (!isNaN(valor)) {
                    setNovaSacola({ 
                      ...novaSacola, 
                      precounitario_sac: valor.toFixed(2) // Força os 2 decimais na memória
                    });
                  }
                }}
              />
              </div>
              </div>

              <div className="flex flex-col">
            <span className="font-bold text-xs lg:text-sm select-none">Tamanho da Sacola</span>
              <Select.Root 
                value={novaSacola.tamanho_sac}
                onValueChange={(value) => setNovaSacola({ ...novaSacola, tamanho_sac: value })}
              >
                <div className="flex flex-row">
                {/* O botão que aparece na tela (com as mesmas classes do seu input) */}
                <Select.Trigger className="flex w-full items-center justify-between border border-gray-300 p-2.5 rounded bg-white outline-none focus:border-zinc-900 transition text-sm lg:text-md font-extralight">
                  <Select.Value placeholder="Selecione o tamanho da sacola..."/>
                  
                </Select.Trigger>
                  <span className="rounded border aspect-square p-2.5 border-gray-300 hover:bg-[#3f705d] hover:text-white transition duration-[200] active:border-zinc-900 active:bg-[#2f5546] cursor-pointer ml-2" onClick={() => { setEnumAtual('tamanhos'); setModalEnumAberto(true); }}>
                  <PlusIcon className="size-5 lg:size-6"></PlusIcon>
                  </span>
                </div>

                <Select.Portal>
                  {/* A caixa flutuante do menu (z-50 garante que fique por cima do seu Modal) */}
                  <Select.Content className="overflow-hidden bg-white rounded-md shadow-2xl border border-gray-200 z-[100] w-[var(--radix-select-trigger-width)]">
                    <Select.Viewport>

                      {opcoesTamanho.map((tamanho) => (
                        <Select.Item key={tamanho} value={tamanho} className="p-2.5 outline-none cursor-pointer focus:bg-gray-100 hover:bg-gray-100 transition text-sm lg:text-md font-extralight">
                        <Select.ItemText>{tamanho}</Select.ItemText>
                      </Select.Item>
                      ))}

                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              </div>

              <div className="flex flex-col">
            <span className="font-bold text-xs lg:text-sm select-none">Peso</span>
              <input 
                type="text"
                placeholder="Peso"
                className="border border-gray-300 p-2.5 rounded outline-none focus:border-zinc-900 transition text-sm lg:text-md font-extralight"
                value={novaSacola.peso_sac}
                onChange={(e) => setNovaSacola({ ...novaSacola, peso_sac: e.target.value })}
              />
              </div>

              <div className="flex flex-col">
            <span className="font-bold text-xs lg:text-sm select-none">Status da Sacola</span>
              <Select.Root 
                value={novaSacola.status_sac} 
                onValueChange={(value) => setNovaSacola({ ...novaSacola, status_sac: value })}
              >
                {/* O botão que aparece na tela (com as mesmas classes do seu input) */}
                <Select.Trigger className="flex w-full items-center justify-between border border-gray-300 p-2.5 rounded bg-white outline-none focus:border-zinc-900 transition text-sm lg:text-md font-extralight">
                  <Select.Value placeholder="Defina o status de visibilidade da sacola..."/>
                </Select.Trigger>

                {novaSacola.status_sac === 'Oculto' && (
                  <span className="text-sm italic text-gray-700">Altere o status para restaurar esse item de volta aos ativos</span>
                )}
                <Select.Portal className="text-sm lg:text-md font-extralight">
                  {/* É possivel que vamos substituir isso futuramente por uma versão dinamica que pega as opções direto do banco, igual o "tamanho" e "material" fazem, mas por enquanto, como não vejo necessidade de adicionar mais status, vamos deixar assim */}
                  <Select.Content className="overflow-hidden bg-white rounded-md shadow-2xl border border-gray-200 z-[100] w-[var(--radix-select-trigger-width)]">
                    <Select.Viewport>

                      <Select.Item value="Disponível" className="p-2.5 outline-none cursor-pointer focus:bg-gray-100 hover:bg-gray-100 transition">
                        <Select.ItemText>Disponível</Select.ItemText>
                      </Select.Item>

                      <Select.Item value="Fora de Estoque" className="p-2.5 outline-none cursor-pointer focus:bg-gray-100 hover:bg-gray-100 transition">
                        <Select.ItemText>Fora de Estoque</Select.ItemText>
                      </Select.Item>

                      {novaSacola.status_sac === 'Oculto' && (
    <Select.Item value="Oculto" className="p-2.5 outline-none cursor-pointer focus:bg-gray-100 hover:bg-gray-100 transition text-red-600 font-semibold">
      <Select.ItemText>Oculto</Select.ItemText>
      
    </Select.Item>
  )}

                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              </div>

              <button type="submit" className="mt-3 bg-[#3f705d] hover:bg-[#2f5546] text-white p-2.5 rounded font-bold text-sm lg:text-md transition">
              {sacolaEditandoId ? 'Salvar Alterações' : 'Cadastrar Sacola'}
              </button>
              <div className="flex-row flex items-center">
              <ExclamationTriangleIcon className="size-6 lg:size-7"></ExclamationTriangleIcon>
                <div className="px-3 flex-col flex font-semibold text-md">
                  <span>Cuidado ao salvar!</span>
                <span>Suas alterações podem ter grandes pesos.</span>
              </div>
              </div>
              {(sacolaEditandoId && novaSacola.status_sac !=='Oculto') && (
              <div
                onClick={handleOcultarSacola}
                className="flex-row flex mx-auto text-md text-red-500 hover:underline hover:text-red-700 font-semibold hover:cursor-pointer transition select-none"
              >
              <TrashIcon className="size-6 lg:size-7"></TrashIcon>
                        <span>Quero excluir e ocultar essa sacola</span>
                      </div>
              )}

            </form>

            {/* Botão de fechar (X) nativo do Radix no canto da janela */}
            <Dialog.Close asChild>
              <button className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold">X</button>
            </Dialog.Close>

          </Dialog.Content>
        </Dialog.Portal>

      </Dialog.Root>

      <Dialog.Root open={modalEnumAberto} onOpenChange={setModalEnumAberto}>
  <Dialog.Portal>
  <Dialog.Overlay className="bg-black/35 fixed inset-0 z-[110]" />
    {/* Z-index bem alto (120) para garantir que abra por cima do modal de criar sacola */}
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl w-full max-w-md z-[120] h-5/6 md:h-auto lg:h-auto overflow-auto custom-scrollbar">
      
      <Dialog.Title className="text-md lg:text-xl font-extrabold mb-6">
        Adicionar Novo {enumAtual === 'tipo' ? 'Material' : 'Tamanho'}
      </Dialog.Title>
      
      <form onSubmit={handleAdicionarValorEnum} className="flex flex-col gap-4 mt-2">
        <input 
          type="text"
          placeholder="Digite o novo valor..."
          className="border border-gray-300 p-3 rounded outline-none focus:border-zinc-900 transition"
          value={novoValorEnum}
          onChange={(e) => setNovoValorEnum(e.target.value)}
          autoFocus // Já foca o cursor no input automaticamente!
        />

        <div className="flex justify-end gap-3 mt-2">
          <Dialog.Close asChild>
            <button 
              type="button"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-zinc-900 font-bold rounded transition"
              onClick={() => setNovoValorEnum("")}
            >
              Cancelar
            </button>
          </Dialog.Close>
          
          <button 
            type="submit"
            className="px-4 py-2 bg-[#3f705d] hover:bg-[#2f5546] text-white font-bold rounded transition shadow-md"
          >
            Salvar
          </button>
        </div>
      </form>

    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
</div>

<div className="flex-1 min-h-0">
<div className="max-h-full overflow-auto border-2 rounded-t-xl custom-scrollbar">
<table className="w-full text-left">
  <thead className="sticky top-0 z-10 bg-zinc-800 text-white border-b-2 border-zinc-500">
    <tr className="bg-zinc-800 text-white">
      <th className="p-3 ">Nome de Exibição</th>
      <th className="p-3">Material da Sacola</th>
      <th className="p-3 text-center">Qtd. Mínima</th>
      <th className="p-3 text-center">Preço Unit. (R$)</th>
      <th className="p-3 text-center">Tamanho</th>
      <th className="p-3 text-center">Peso</th>
      <th className="p-3 text-center">Status</th>
      <th className="p-3 text-center">Ações</th>
    </tr>
  </thead>
  <tbody className="bg-white border-gray-300">
  {sacolasFiltradas.length === 0 && (
    <tr>
      {/* colSpan="8" faz a célula ocupar a largura de todas as colunas da tabela */}
      <td colSpan="8" className="p-10 text-center text-gray-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <EyeClosedIcon className="size-10 text-gray-400" />
          <p className="text-lg font-semibold">Nenhuma sacola encontrada.</p>
          <p className="text-sm">Selecione uma das opções acima para visualizar os itens.</p>
        </div>
      </td>
    </tr>
  )}

    {sacolasFiltradas.map((sacola) => (
<tr key={sacola.id_sac} className="border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-500 hover:border-2 transition">
<td className="p-3 font-semibold text-gray-800 max-w-[250px] truncate">{sacola.nome_sac}</td>
<td className="p-3 font-semibold text-gray-800">{sacola.tipo_sac}</td>
<td className="p-3 text-center">{sacola.quantidademin_sac}</td>
<td className="p-3 text-center">
{Number(sacola.precounitario_sac).toLocaleString('pt-BR', { 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2 
})}
</td>
<td className="p-3 text-center">{sacola.tamanho_sac}</td>
<td className="p-3 text-center">{sacola.peso_sac}</td>
<td className="p-3 text-center">{sacola.status_sac}</td>
<td className="p-3 flex justify-center space-x-3">
  <button className="text-blue-600 hover:text-blue-800 hover:underline flex flex-row items-center" onClick={() => {
    handleAbrirEdicao({...sacola})
  }}>
    <Pencil2Icon className="size-3.5 mr-0.5"></Pencil2Icon>
    Editar
  </button>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>


      
    </main>
    </RotaAdmin>
  );
}