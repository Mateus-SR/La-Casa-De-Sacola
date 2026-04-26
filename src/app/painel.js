"use client";

import { useRouter } from 'next/navigation';
import Link from "next/link";
import useLoginHook from "../hooks/loginHook.js" // precisa trocar pra um que valide se o usuário já está logado (ou então adicionar essa logica dentro do loginHook)
import RotaAdmin from "../components/admin/rotaAdmin";
import { useState, useEffect } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Tabs from '@radix-ui/react-tabs';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { supabase } from "../lib/supabaseClient";
import { 
  Pencil2Icon, 
  CheckCircledIcon, 
  CheckIcon, 
  ExclamationTriangleIcon, 
  PlusIcon, 
  TrashIcon, 
  EyeClosedIcon,
  GearIcon,
  UpdateIcon
} from "@radix-ui/react-icons";

export default function Painel() {

  const router = useRouter();

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
        const { data: tipo, error: erroMat } = await supabase
          .from('tipo')
          .select('id_tip, tipo_tip')
          .neq('excluido', true);
        //if (tipo) setOpcoesMaterial(tipo.map(t => t.tipo_tip));
        if (tipo) setOpcoesMaterial(tipo);
    
        const { data: tamanho } = await supabase
          .from('tamanho')
          .select('id_tam, tamanho_tam')
          .neq('excluido', true);
          //if (tamanho) setOpcoesTamanho(tamanho.map(t => t.tamanho_tam));
          if (tamanho) setOpcoesTamanho(tamanho);
        };
    
      const [sacolas, setSacolas] = useState([
        { id_sac: 1, nome_sac: 'Carregando', tipo_sac: 'Carregando', quantidademin_sac: 0, precounitario_sac: 0, tamanho_sac: 'Carregando', peso_sac: 'Carregando', status_sac: 'Carregando' },
      ]);
    
      // pendente: comentar todos esses carinhas aqui
      const [opcoesMaterial, setOpcoesMaterial] = useState([]);
      const [opcoesTamanho, setOpcoesTamanho] = useState([]);

      const [modalEnumAberto, setModalEnumAberto] = useState(false);
      const [enumAtual, setEnumAtual] = useState("");
      const [novoValorEnum, setNovoValorEnum] = useState("");
      const [enumEditandoId, setEnumEditandoId] = useState(null)

      const [modalAberto, setModalAberto] = useState(false);

      const [sacolaEditandoId, setSacolaEditandoId] = useState(null);

      const [mostrarSacolasAtivas, setMostrarSacolasAtivas] = useState(true);
      const [mostrarSacolasOcultas, setMostrarSacolasOcultas] = useState(false);

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
            // 👈 AQUI ESTÁ A MÁGICA: se data[0] for undefined, usamos o { ...sacola, ...novaSacola }
            const sacolasAtualizadas = sacolas.map((sacola) => 
              sacola.id_sac === sacolaEditandoId 
                ? (data[0] || { ...sacola, ...novaSacola }) 
                : sacola
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
          } else if (data && data[0]) { 
            // 👈 Protegemos aqui também para evitar inserir undefined
            setSacolas([...sacolas, data[0]]);
          }
        };
    
        // Passo 3: Limpa o formulário de volta ao estado inicial
        setNovaSacola({ nome_sac:'', tipo_sac: '', quantidademin_sac: '', precounitario_sac: '', tamanho_sac: '', peso_sac: '', status_sac: ''});
    
        // Passo 4: Fecha a janela do Radix
        setModalAberto(false);
        setSacolaEditandoId(null);
      };
    
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
        const listaCerta = enumAtual === 'tipo' ? opcoesMaterial : opcoesTamanho;
    
        const jaExiste = listaCerta.some(item => 
          item[colunaNome].toLowerCase() === novoValorEnum.toLowerCase()
        );
      
        if (jaExiste) {
          // substituir esse alert eventualmente!
          alert(`Erro: Este ${enumAtual === 'tipo' ? 'material' : 'tamanho'} já está cadastrado!`);
          return; // Para a execução aqui e não envia para o banco
        }

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

            // 1. Função para editar o nome de um item existente
      const handleEditarValorEnum = async () => {
        if (!novoValorEnum.trim() || !enumEditandoId) return;
      
        const listaCerta = enumAtual === 'tipo' ? opcoesMaterial : opcoesTamanho;
        const tabelaAlvo = enumAtual === 'tipo' ? 'tipo' : 'tamanho';
        const colunaNome = enumAtual === 'tipo' ? 'tipo_tip' : 'tamanho_tam';
        const colunaId = enumAtual === 'tipo' ? 'id_tip' : 'id_tam';
      
        const jaExisteEmOutro = listaCerta.some(item => 
          item[colunaNome].toLowerCase() === novoValorEnum.toLowerCase() && 
          item[colunaId] !== enumEditandoId
        );
      
        if (jaExisteEmOutro) {
          // substituir esse alert eventualmente!
          alert("Erro: Já existe outro item com este mesmo nome!");
          return;
        }

        const { error } = await supabase
          .from(tabelaAlvo)
          .update({ [colunaNome]: novoValorEnum.trim() })
          .eq(colunaId, enumEditandoId); // Usa o ID que guardamos no .find()
      
        if (error) {
          console.error("Erro ao editar:", error);
        } else {
          await carregarFiltros(); // Atualiza os dropdowns da tela principal
          setModalEnumAberto(false);
          setEnumEditandoId(null);
          setNovoValorEnum("");
        }
      };

      // 2. Função para ocultar (soft delete)
      const handleOcultarEnum = async (idParaOcultar) => {
        const tabelaAlvo = enumAtual === 'tipo' ? 'tipo' : 'tamanho';
        const colunaId = enumAtual === 'tipo' ? 'id_tip' : 'id_tam';
      
        const { error } = await supabase
          .from(tabelaAlvo)
          .update({ excluido: true })
          .eq(colunaId, idParaOcultar);
      
        if (error) {
          console.error("Erro ao ocultar:", error);
        } else {
          await carregarFiltros();
          setModalEnumAberto(false);
          setEnumEditandoId(null);
          setNovoValorEnum("");    
        }
      };
    
      const sacolasFiltradas = sacolas.filter((sacola) => {
        if (!sacola) return false;
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
        <button onClick={() => router.push('/')} className="bg-[#264f41] hover:bg-[#403c37] text-white px-2.5 py-2.5 rounded-xl font-bold transition shadow-md flex items-left gap-2 text-md lg:text-md w-max mb-5">
          ← Voltar
        </button>

        <title>Painel Administrador</title>

        <div className="mb-4">
          <h1 className="text-lg lg:text-xl font-extrabold text-[#264f41]">Painel Administrador</h1>
          <h2 className="text-md lg:text-lg text-gray-600">Gerencie seus produtos</h2>
        </div>

        <Dialog.Root open={modalAberto} onOpenChange={setModalAberto}>
          <div className="flex items-center mb-5 justify-between bg-white p-4 rounded-xl shadow-sm border border-[#e4f4ed]">
            <div className="flex flex-row flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 cursor-pointer">
                <Checkbox.Root
                  className="flex size-5 lg:size-6 appearance-none items-center justify-center rounded border-2 border-green-400 bg-white outline-none hover:bg-blue-50 data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 transition-colors"
                  id="chkAtivas"
                  checked={mostrarSacolasAtivas}
                  onCheckedChange={setMostrarSacolasAtivas}
                >
                  <Checkbox.Indicator className="text-white"><CheckIcon className="size-5" /></Checkbox.Indicator>
                </Checkbox.Root>
                <label className="text-sm lg:text-base font-medium leading-none text-black cursor-pointer flex items-center gap-1.5 select-none" htmlFor="chkAtivas">
                  <CheckCircledIcon className="size-5 text-green-600 hidden sm:block" /> Mostrar sacolas ativas
                </label>
              </div>

              <div className="flex items-center gap-2 cursor-pointer">
                <Checkbox.Root
                  className="flex size-5 lg:size-6 appearance-none items-center justify-center rounded border-2 border-red-400 bg-white outline-none hover:bg-red-50 data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600 transition-colors"
                  id="chkOcultas"
                  checked={mostrarSacolasOcultas}
                  onCheckedChange={setMostrarSacolasOcultas}
                >
                  <Checkbox.Indicator className="text-white"><CheckIcon className="size-5" /></Checkbox.Indicator>
                </Checkbox.Root>
                <label className="text-sm lg:text-base font-medium leading-none text-black cursor-pointer flex items-center gap-1.5 select-none" htmlFor="chkOcultas">
                  <TrashIcon className="size-5 text-red-600 hidden sm:block" /> Mostrar sacolas excluídas
                </label>
              </div>
            </div>

            <Dialog.Trigger asChild>
              <button 
                className="bg-[#264f41] hover:bg-[#403c37] text-white px-5 py-2.5 rounded-xl font-bold transition shadow-md flex items-center gap-2 text-sm lg:text-md"
                onClick={() => {
                  setSacolaEditandoId(null);
                  handleAbrirNovaSacola();
                }}
              >
                <PlusIcon className="size-5" /> Nova Sacola
              </button>
            </Dialog.Trigger>
          </div>

          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 fixed inset-0 backdrop-blur-sm z-40" />
            <Dialog.Content aria-describedby={undefined} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl w-[min(92vw,40rem)] max-h-[90vh] z-[100] overflow-y-auto custom-scrollbar">
              <Dialog.Title className="text-md lg:text-xl font-extrabold mb-6 text-[#264f41]">
                {sacolaEditandoId ? 'Editar Sacola' : 'Adicionar Nova Sacola'}
              </Dialog.Title>

              <form onSubmit={handleSalvarSacola} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-xs lg:text-sm select-none text-gray-700">Nome de Exibição</label>
                  <input 
                    type="text"
                    placeholder="Sacola de Plástico Alça-fita"
                    className="border border-gray-300 p-3 rounded-xl outline-none focus:border-[#5ab58f] transition text-sm lg:text-md font-extralight"
                    value={novaSacola.nome_sac}
                    onChange={(e) => setNovaSacola({ ...novaSacola, nome_sac: e.target.value })}
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-xs lg:text-sm select-none text-gray-700">Material</label>
                  <div className="flex gap-2">
                    <Select.Root value={novaSacola.tipo_sac} onValueChange={(v) => setNovaSacola({ ...novaSacola, tipo_sac: v })}>
                      <Select.Trigger className="flex flex-1 items-center justify-between border border-gray-300 p-3 rounded-xl bg-white focus:border-[#5ab58f] outline-none transition text-sm lg:text-md font-extralight">
                        <Select.Value placeholder="Selecione o material..."/>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="bg-white rounded-xl shadow-2xl border border-gray-200 z-[110]">
                          <Select.Viewport className="p-2">
                            {opcoesMaterial.map((m) => (
                              <Select.Item key={m.id_tip} value={m.tipo_tip} className="p-3 rounded-lg outline-none cursor-pointer hover:bg-[#f0faf5] focus:bg-[#f0faf5] transition text-sm lg:text-md font-extralight">
                                <Select.ItemText>{m.tipo_tip}</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                    <button type="button" onClick={() => {
                      setEnumAtual('tipo');
                      setEnumEditandoId(null);
                      setNovoValorEnum("");
                      setModalEnumAberto(true);
                      }}
                      className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50"><GearIcon/></button>
                    
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-xs lg:text-sm select-none text-gray-700">Qtd. Mínima</label>
                    <input 
                      type="number"
                      min="1"
                      step="1"
                      className="border border-gray-300 p-3 rounded-xl outline-none focus:border-[#5ab58f] transition text-sm lg:text-md font-extralight"
                      value={novaSacola.quantidademin_sac}
                      onChange={(e) => setNovaSacola({...novaSacola, quantidademin_sac: e.target.value})} required/>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-xs lg:text-sm select-none text-gray-700">Preço Unit. (R$)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="border border-gray-300 p-3 rounded-xl outline-none focus:border-[#5ab58f] transition text-sm lg:text-md font-extralight"
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

<div className="grid grid-cols-2 gap-4">
{/* PESO À ESQUERDA */}
<div className="flex flex-col gap-1">
  <label className="font-bold text-xs lg:text-sm select-none text-gray-700">Peso</label>
  <input 
    type="text"
    placeholder="Ex: 50g"
    className="border border-gray-300 p-3 rounded-xl outline-none focus:border-[#5ab58f] transition text-sm lg:text-md font-extralight"
    value={novaSacola.peso_sac}
    onChange={(e) => setNovaSacola({...novaSacola, peso_sac: e.target.value})} 
    required
  />
</div>

{/* TAMANHO À DIREITA */}
<div className="flex flex-col gap-1">
  <label className="font-bold text-xs lg:text-sm select-none text-gray-700">Tamanho</label>
  <div className="flex gap-2">
    <Select.Root value={novaSacola.tamanho_sac} onValueChange={(v) => setNovaSacola({ ...novaSacola, tamanho_sac: v })}>
      <Select.Trigger className="flex flex-1 items-center justify-between border border-gray-300 p-3 rounded-xl bg-white focus:border-[#5ab58f] outline-none transition text-sm lg:text-md font-extralight">
        <Select.Value placeholder="Selecione o tamanho..."/>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-white rounded-xl shadow-2xl border border-gray-200 z-[110]">
          <Select.Viewport className="p-2">
            {opcoesTamanho.map((t) => (
              <Select.Item key={t.id_tam} value={t.tamanho_tam} className="p-3 rounded-lg outline-none cursor-pointer hover:bg-[#f0faf5] focus:bg-[#f0faf5] transition text-sm lg:text-md font-extralight">
                <Select.ItemText>{t.tamanho_tam}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
    <button type="button" onClick={() => {
      setEnumAtual('tamanho');
      setEnumEditandoId(null);
      setNovoValorEnum("");
      setModalEnumAberto(true);
      }} className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition">
      <GearIcon/>
    </button>
  </div>
</div>
</div>

<div className="flex flex-col gap-1">
<label className="font-bold text-sm text-gray-700">Status</label>

{/* Aviso movido para FORA do Select.Root, mantendo seu estilo exato */}
{novaSacola.status_sac === 'Oculto' && (
  <span className="text-sm italic text-gray-700">Altere o status para restaurar esse item de volta aos ativos</span>
)}

<Select.Root value={novaSacola.status_sac} onValueChange={(v) => setNovaSacola({ ...novaSacola, status_sac: v })}>
  <Select.Trigger className="flex items-center justify-between border border-gray-300 p-3 rounded-xl bg-white focus:border-[#5ab58f] outline-none transition text-sm lg:text-md font-extralight">
    <Select.Value placeholder="Status da sacola..."/>
  </Select.Trigger>

  <Select.Portal>
    <Select.Content className="bg-white rounded-xl shadow-2xl border border-gray-200 z-[110]">
      <Select.Viewport className="p-2">
        
        <Select.Item value="Disponível" className="p-3 rounded-lg outline-none cursor-pointer hover:bg-[#f0faf5]">
          <Select.ItemText>Disponível</Select.ItemText>
        </Select.Item>
        
        <Select.Item value="Fora de Estoque" className="p-3 rounded-lg outline-none cursor-pointer hover:bg-[#f0faf5]">
          <Select.ItemText>Fora de Estoque</Select.ItemText>
        </Select.Item>
        
        {novaSacola.status_sac === 'Oculto' && (
          <Select.Item value="Oculto" className="p-3 rounded-lg text-red-600 font-bold outline-none cursor-pointer hover:bg-red-50">
            <Select.ItemText>Oculto</Select.ItemText>
          </Select.Item>
        )}

      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
</div>

                <button type="submit" className="mt-4 bg-[#5ab58f] hover:bg-[#2e8f65] text-white p-4 rounded-xl font-bold transition shadow-lg">
                  {sacolaEditandoId ? 'Salvar Alterações' : 'Cadastrar Sacola'}
                </button>
                <div className="flex-row flex items-center">
              <ExclamationTriangleIcon className="size-6 lg:size-7"></ExclamationTriangleIcon>
                <div className="px-3 flex-col flex font-semibold text-md">
                  <span>Cuidado ao salvar!</span>
                <span>Suas alterações podem ter grandes pesos.</span>
              </div>
              </div>

                {sacolaEditandoId && novaSacola.status_sac !== 'Oculto' && (
                  <button type="button" onClick={handleOcultarSacola} className="flex items-center justify-center gap-2 text-red-500 font-bold hover:underline">
                    <TrashIcon className="size-5"/> Quero excluir e ocultar essa sacola
                  </button>
                )}
              </form>
              <Dialog.Close asChild>
                <button className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold">✕</button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-[#e4f4ed] overflow-hidden">
          <div className="max-h-full overflow-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 z-10 bg-[#264f41] text-white">
                <tr>
                  <th className="p-4 font-semibold text-sm">Nome</th>
                  <th className="p-4 font-semibold text-sm">Material</th>
                  <th className="p-4 font-semibold text-sm text-center">Qtd. Mín</th>
                  <th className="p-4 font-semibold text-sm text-center">Preço (R$)</th>
                  <th className="p-4 font-semibold text-sm text-center">Tamanho</th>
                  <th className="p-4 font-semibold text-sm text-center">Status</th>
                  <th className="p-4 font-semibold text-sm text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sacolasFiltradas.length === 0 ? (
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
                ) : (
                  sacolasFiltradas.map((sacola) => (
                    <tr key={sacola.id_sac} className="hover:bg-[#f0faf5] transition">
                      <td 
                      className="p-4 font-bold text-[#264f41] max-w-[250px] truncate"
                      title={sacola.nome_sac}
                    >
                      {sacola.nome_sac}
                    </td>
                      <td className="p-4">{sacola.tipo_sac}</td>
                      <td className="p-4 text-center">{sacola.quantidademin_sac}</td>
                      <td className="p-4 text-center">R$ {Number(sacola.precounitario_sac).toFixed(2)}</td>
                      <td className="p-4 text-center">{sacola.tamanho_sac}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${sacola.status_sac === 'Disponível' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {sacola.status_sac}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleAbrirEdicao(sacola)} className="text-blue-600 hover:bg-white p-2 rounded-lg transition inline-flex items-center gap-1 font-bold">
                          <Pencil2Icon/> Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal para novos valores de filtros (Tamanho/Material) */}
        <Dialog.Root open={modalEnumAberto} onOpenChange={setModalEnumAberto}>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/40 fixed inset-0 z-[120]" />
            <Dialog.Content aria-describedby={undefined} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm z-[130]">
              
              {/* O Título agora é mais geral, pois gerencia as duas coisas */}
              <Dialog.Title className="text-lg font-extrabold mb-4 text-[#264f41]">
                Gerenciar {enumAtual === 'tipo' ? 'Material' : 'Tamanho'}
              </Dialog.Title>

              {/* === INÍCIO DAS ABAS === */}
              <Tabs.Root 
                defaultValue="novo"
                onValueChange={(abaClicada) => {
                  // Limpa a memória ao trocar de aba para não bugar o input
                  if (abaClicada === "novo") {
                    setEnumEditandoId(null);
                    setNovoValorEnum("");
                  }
                }}
              >
                {/* Botões de Navegação das Abas */}
                <Tabs.List className="flex border-b border-gray-200 mb-6">
                  <Tabs.Trigger 
                    value="novo" 
                    className="flex-1 p-2 font-semibold text-gray-500 data-[state=active]:text-[#264f41] data-[state=active]:border-b-2 data-[state=active]:border-[#5ab58f] transition outline-none"
                  >
                    Adicionar
                  </Tabs.Trigger>
                  <Tabs.Trigger 
                    value="gerenciar" 
                    className="flex-1 p-2 font-semibold text-gray-500 data-[state=active]:text-[#264f41] data-[state=active]:border-b-2 data-[state=active]:border-[#5ab58f] transition outline-none"
                  >
                    Editar
                  </Tabs.Trigger>
                </Tabs.List>

                {/* ABA 1: ADICIONAR NOVO (O seu formulário atual vai aqui dentro) */}
                <Tabs.Content value="novo" className="outline-none">
                  <form onSubmit={handleAdicionarValorEnum} className="flex flex-col gap-4">
                    <input 
                      type="text"
                      placeholder={enumAtual === 'tipo' ? "Ex: Papel, Plástico..." : "Ex: 20x30, 30x40..."}
                      className="border border-gray-300 p-3 rounded-xl outline-none focus:border-[#5ab58f]"
                      value={novoValorEnum}
                      onChange={(e) => setNovoValorEnum(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <Dialog.Close asChild>
                        <button type="button" className="flex-1 p-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition">Cancelar</button>
                      </Dialog.Close>
                      <button type="submit" className="flex-1 p-3 bg-[#5ab58f] hover:bg-[#489474] text-white rounded-xl font-bold transition">Salvar</button>
                    </div>
                  </form>
                </Tabs.Content>

                {/* ABA 2: EDITAR / OCULTAR EXISTENTE */}
                <Tabs.Content value="gerenciar" className="outline-none flex flex-col gap-4">
                  
                  {/* O Dropdown para selecionar o item que tem erro */}
                  <Select.Root 
                    onValueChange={(nomeSelecionado) => {
                      if (enumAtual === 'tipo') {
                        // Busca na lista de materiais usando tipo_tip
                        const itemEncontrado = opcoesMaterial.find(item => item.tipo_tip === nomeSelecionado);
                        if (itemEncontrado) {
                          setEnumEditandoId(itemEncontrado.id_tip); // Salva o id_tip
                          setNovoValorEnum(itemEncontrado.tipo_tip);
                        }
                      } else {
                        // Busca na lista de tamanhos usando tamanho_tam
                        const itemEncontrado = opcoesTamanho.find(item => item.tamanho_tam === nomeSelecionado);
                        if (itemEncontrado) {
                          setEnumEditandoId(itemEncontrado.id_tam); // Salva o id_tam
                          setNovoValorEnum(itemEncontrado.tamanho_tam);
                        }
                      }
                    }}
                  >
                    <Select.Trigger className="border border-gray-300 p-3 rounded-xl flex justify-between items-center outline-none focus:border-[#5ab58f]">
                      <Select.Value placeholder="Selecione um item..." />
                    </Select.Trigger>
                    
                    <Select.Portal>
                      <Select.Content className="bg-white rounded-md shadow-2xl border border-gray-200 z-[140]">
                        <Select.Viewport>
                          
                          {/* Desenhando as opções adaptadas */}
                          {(enumAtual === 'tipo' ? opcoesMaterial : opcoesTamanho).map((item) => {
                            // Descobre qual chave usar dependendo do contexto
                            const itemId = enumAtual === 'tipo' ? item.id_tip : item.id_tam;
                            const itemNome = enumAtual === 'tipo' ? item.tipo_tip : item.tamanho_tam;

                            return (
                              <Select.Item key={itemId} value={itemNome} className="p-3 outline-none hover:bg-gray-100 cursor-pointer">
                                <Select.ItemText>{itemNome}</Select.ItemText>
                              </Select.Item>
                            );
                          })}

                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>

                  {/* A área de edição (Só aparece DEPOIS que o usuário escolhe algo na lista acima) */}
                  {enumEditandoId && (
                    <div className="flex flex-col gap-3 mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <label className="font-bold text-sm text-gray-700">Alterar nome:</label>
                      <input 
                        type="text"
                        className="border border-gray-300 p-3 rounded-xl outline-none focus:border-[#5ab58f]"
                        value={novoValorEnum}
                        onChange={(e) => setNovoValorEnum(e.target.value)}
                      />
                      
                      <div className="flex gap-3 mt-2">
                        {/* Botão de Ocultar (precisa da função handleOcultarEnum) */}
                        {/* === ALERT DIALOG PARA CONFIRMAÇÃO DE EXCLUSÃO === */}
<AlertDialog.Root>
  <AlertDialog.Trigger asChild>
    {/* O botão da lixeira agora apenas abre o alerta, não exclui direto */}
    <button 
      type="button" 
      className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-outfit font-bold transition flex items-center justify-center"
    >
      <TrashIcon className="size-5" />
    </button>
  </AlertDialog.Trigger>

  <AlertDialog.Portal>
    <AlertDialog.Overlay className="bg-black/40 fixed inset-0 z-[150] backdrop-blur-sm" />
    <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xs z-[160] outline-none">
      
      <AlertDialog.Title className="text-lg font-extrabold text-[#264f41] mb-2">
        Tem certeza absoluta?
      </AlertDialog.Title>
      
      {/* Aqui resolvemos aquele aviso de "Description" do console! */}
      <AlertDialog.Description className="text-gray-600 text-sm mb-6 leading-relaxed">
        Essa ação é permanente. O {enumAtual === 'tipo' ? 'material' : 'tamanho'} selecionado deixará de estar disponível para novos produtos.
      </AlertDialog.Description>

      <div className="flex gap-3 justify-end">
        <AlertDialog.Cancel asChild>
          <button className="flex-1 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition outline-none">
            Cancelar
          </button>
        </AlertDialog.Cancel>
        
        <AlertDialog.Action asChild>
          <button 
            onClick={() => handleOcultarEnum(enumEditandoId)}
            className="flex-1 p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition outline-none"
          >
            Sim, excluir
          </button>
        </AlertDialog.Action>
      </div>

    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>

                        {/* Botão de Salvar Alteração (precisa da função handleEditarValorEnum) */}
                        <button 
                          type="button" 
                          onClick={handleEditarValorEnum}
                          className="flex-1 p-3 bg-[#5ab58f] hover:bg-[#489474] text-white rounded-xl font-bold transition"
                        >
                          Salvar Alteração
                        </button>
                      </div>
                    </div>
                  )}

                </Tabs.Content>
              </Tabs.Root>
              {/* === FIM DAS ABAS === */}

              <Dialog.Close asChild>
                <button className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold text-lg transition">✕</button>
              </Dialog.Close>

            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </main>
    </RotaAdmin>
  );
}