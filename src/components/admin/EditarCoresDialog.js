// Basicamente aqui podemos digitar o nome da cor, escolher hex no input color, salvar, listar e excluir cor individualmente

"use client";

import * as Dialog from "@radix-ui/react-dialog";
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
                      onClick={() => onExcluirCor(cor)}
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}