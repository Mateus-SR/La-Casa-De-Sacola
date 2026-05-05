// Basicamente aqui podemos digitar o nome da cor, escolher hex no input color, salvar, listar e excluir cor individualmente

"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { TrashIcon } from "@radix-ui/react-icons";

export default function EditarCoresDialog({
  open,
  onOpenChange,
  novaCorNome,
  novaCorHex,
  onNomeChange,
  onHexChange,
  onSalvarCor,
  onExcluirCor,
  cores,
}) {
  const [corEmExclusao, setCorEmExclusao] = useState(null);

  const handleConfirmarExclusao = async () => {
    if (!corEmExclusao) return;

    const corParaExcluir = corEmExclusao;
    setCorEmExclusao(null);
    await onExcluirCor(corParaExcluir);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0 z-[170]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm z-[180]"
        >
          <Dialog.Title className="text-lg font-extrabold mb-4 text-[#264f41]">Editar Cores</Dialog.Title>

          <div className="flex flex-col gap-3">
            <div className="p-3 border border-gray-200 rounded-xl bg-gray-50 flex flex-col gap-2">
              <p className="text-xs font-bold uppercase text-gray-500">Adicionar nova cor</p>

              <input
                type="text"
                placeholder="Nome da cor"
                className="border border-gray-300 p-2 rounded-lg outline-none focus:border-[#5ab58f] text-sm"
                value={novaCorNome}
                onChange={(e) => onNomeChange(e.target.value)}
              />

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={novaCorHex}
                  onChange={(e) => onHexChange(e.target.value)}
                  className="w-11 h-9 p-0 border border-gray-300 rounded cursor-pointer"
                />
                <span className="text-xs text-gray-500 font-mono">{novaCorHex}</span>
              </div>

              <button
                type="button"
                onClick={onSalvarCor}
                className="self-start px-3 py-2 text-xs font-bold bg-[#5ab58f] hover:bg-[#489474] text-white rounded-lg transition"
              >
                Salvar cor
              </button>
            </div>

            <div className="p-3 border border-gray-200 rounded-xl bg-white flex flex-col gap-2">
              <p className="text-xs font-bold uppercase text-gray-500">Cores cadastradas</p>

              <div className="max-h-52 overflow-auto custom-scrollbar border border-gray-200 rounded-lg bg-white divide-y divide-gray-100">
                {cores.map((cor) => (
                  <div key={`${cor.nome}-${cor.hex}`} className="flex items-center gap-2 p-2">
                    <span
                      className="w-4 h-4 rounded-sm border border-gray-300 shrink-0"
                      style={{ backgroundColor: cor.hex }}
                      aria-hidden
                    />
                    <span className="text-sm text-gray-700 font-medium">{cor.nome}</span>

                    <button
                      type="button"
                      className="ml-auto p-1 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition"
                      onClick={() => setCorEmExclusao(cor)}
                      aria-label={`Excluir cor ${cor.nome}`}
                      title={`Excluir cor ${cor.nome}`}
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Dialog.Close asChild>
            <button className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold text-lg transition">✕</button>
          </Dialog.Close>

          <AlertDialog.Root
            open={!!corEmExclusao}
            onOpenChange={(aberto) => {
              if (!aberto) setCorEmExclusao(null);
            }}
          >
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="bg-black/45 fixed inset-0 z-[190] backdrop-blur-sm" />
              <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl w-[min(92vw,32rem)] z-[200] outline-none border border-[#e4f4ed]">
                <div className="flex items-start gap-4 mb-5">
                  <div className="bg-[#f0faf5] text-[#3ca779] rounded-2xl p-3 border border-[#d7efe3]">
                    <TrashIcon className="size-5" />
                  </div>

                  <div className="flex-1">
                    <AlertDialog.Title className="text-xl font-extrabold text-[#264f41] leading-tight">
                      Excluir cor do catálogo?
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-sm text-gray-600 mt-2 leading-relaxed">
                      A cor{' '}
                      <span className="font-bold text-[#264f41]">
                        {corEmExclusao?.nome}
                      </span>
                      {corEmExclusao?.hex ? (
                        <>
                          {' '}
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="inline-block w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: corEmExclusao.hex }}
                              aria-hidden
                            />
                            <span className="font-mono text-xs text-gray-500">{corEmExclusao.hex}</span>
                          </span>
                        </>
                      ) : null}{' '}
                      será removida do painel e deixará de aparecer nas seleções disponíveis.
                    </AlertDialog.Description>
                  </div>
                </div>

                <div className="rounded-xl bg-[#f4f7f5] border border-[#e4f4ed] p-4 mb-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Ação permanente</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Depois de excluir, você poderá cadastrar essa cor novamente, se precisar.
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <AlertDialog.Cancel asChild>
                    <button className="px-4 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition outline-none">
                      Cancelar
                    </button>
                  </AlertDialog.Cancel>

                  <AlertDialog.Action asChild>
                    <button
                      onClick={handleConfirmarExclusao}
                      className="px-4 py-3 rounded-xl font-bold text-white bg-[#d94f4f] hover:bg-[#c74242] transition outline-none shadow-sm"
                    >
                      Sim, excluir
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}