"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { UpdateIcon, ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "react-hot-toast";

export default function ModalAlterarStatus({ pedido, open, onOpenChange, onStatusAtualizado }) {
  const [statusDisponiveis, setStatusDisponiveis] = useState([]);
  const [statusSelecionado, setStatusSelecionado]   = useState("");
  const [carregando, setCarregando]                  = useState(false);
  const [salvando, setSalvando]                      = useState(false);

  // Busca os valores do enum "estatuse" via RPC ao abrir o modal
  useEffect(() => {
    if (!open) return;
    setStatusSelecionado(pedido?.status_ped ?? "");
    fetchEnumValues();
  }, [open, pedido]);

  const fetchEnumValues = async () => {
    setCarregando(true);
    try {
      // Chama a função SQL que lista os valores do enum
      // (ver instrução de criação abaixo no comentário do arquivo)
      const { data, error } = await supabase.rpc("listar_enum_estatuse");
      if (error) throw error;
      setStatusDisponiveis(data.map((row) => row.valor));
    } catch (e) {
      console.error("Erro ao buscar status:", e);
      toast.error("Não foi possível carregar os status disponíveis.");
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async () => {
    if (!statusSelecionado || statusSelecionado === pedido?.status_ped) {
      onOpenChange(false);
      return;
    }
  
    setSalvando(true);
    try {
      // Busca o usuário logado
      const { data: { user } } = await supabase.auth.getUser();
  
      // Busca o nome do usuário
      const { data: perfil } = await supabase
        .from("usuario")
        .select("nome_usu, email_usu")
        .eq("uuid_usu", user.id)
        .single();
  
      const nomeAlterador = perfil?.nome_usu || perfil?.email_usu || user.email;
  
      const { error } = await supabase
        .from("pedido")
        .update({ 
          status_ped: statusSelecionado,
          alterado_por: nomeAlterador,        // salva quem alterou
          ultima_alteracao: new Date().toISOString() // atualiza timestamp
        })
        .eq("id_ped", pedido.id_ped);
  
      if (error) throw error;
  
      toast.success("Status atualizado com sucesso!");
      onStatusAtualizado(pedido.id_ped, statusSelecionado, nomeAlterador);
      onOpenChange(false);
    } catch (e) {
      console.error("Erro ao atualizar status:", e);
      toast.error("Não foi possível atualizar o status.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0 backdrop-blur-sm z-40" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl w-[min(92vw,28rem)] z-[100] flex flex-col gap-6"
        >
          {/* Cabeçalho */}
          <Dialog.Title className="border-b border-gray-100 pb-4 m-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#f0faf5] rounded-lg flex items-center justify-center">
                <UpdateIcon className="text-[#3ca779] size-4" />
              </div>
              <div>
                <h2 className="text-md font-extrabold text-[#264f41] uppercase tracking-tight">
                  Alterar Status
                </h2>
                <p className="text-xs text-gray-400 font-bold">
                  Pedido #{pedido?.id_ped}
                </p>
              </div>
            </div>
          </Dialog.Title>

          {/* Status atual */}
          <div className="bg-[#f4f7f5] rounded-xl p-3 border border-[#e4f4ed]">
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Status atual</p>
            <p className="font-bold text-[#264f41]">{pedido?.status_ped}</p>
          </div>

          {/* Dropdown de novo status */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Novo status
            </label>

            {carregando ? (
              <div className="border border-gray-200 rounded-xl p-3 text-sm text-gray-400 flex items-center gap-2">
                <UpdateIcon className="animate-spin size-4" /> Carregando opções...
              </div>
            ) : (
              <Select.Root value={statusSelecionado} onValueChange={setStatusSelecionado}>
                <Select.Trigger className="border border-gray-300 p-3 rounded-xl flex justify-between items-center outline-none focus:border-[#5ab58f] w-full text-left text-sm font-semibold text-[#264f41]">
                  <Select.Value placeholder="Selecione um status..." />
                  <ChevronDownIcon className="text-gray-400" />
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content
                    position="popper"
                    sideOffset={4}
                    className="bg-white rounded-xl shadow-2xl border border-gray-200 z-[140] w-[--radix-select-trigger-width]"
                  >
                    <Select.Viewport className="p-1">
                      {statusDisponiveis.map((status) => (
                        <Select.Item
                          key={status}
                          value={status}
                          className="p-3 rounded-lg outline-none hover:bg-[#f0faf5] cursor-pointer text-sm font-semibold text-[#264f41] flex items-center justify-between data-[highlighted]:bg-[#f0faf5]"
                        >
                          <Select.ItemText>{status}</Select.ItemText>
                          <Select.ItemIndicator>
                            <CheckIcon className="text-[#3ca779] size-4" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex-1 p-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition text-sm"
              >
                Cancelar
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={handleSalvar}
              disabled={salvando || !statusSelecionado}
              className="flex-1 p-3 bg-[#5ab58f] hover:bg-[#489474] text-white rounded-xl font-bold transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {salvando ? (
                <><UpdateIcon className="animate-spin size-4" /> Salvando...</>
              ) : (
                "Salvar"
              )}
            </button>
          </div>

          {/* Botão X */}
          <Dialog.Close asChild>
            <button className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold text-lg transition">
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}