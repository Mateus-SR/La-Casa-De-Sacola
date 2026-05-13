"use client";

import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import CoresMaterialPreview from "@/components/admin/CoresMaterialPreview";
import {
  ExclamationTriangleIcon,
  GearIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

/**
 * Props:
 * - aberto: boolean
 * - onOpenChange: (boolean) => void
 * - sacola: objeto com os campos da sacola (novaSacola no hook)
 * - onSacolaChange: (sacola) => void  (setNovaSacola no hook)
 * - sacolaEditandoId: number | null
 * - opcoesMaterial: array de { id_tip, tipo_tip }
 * - opcoesTamanho: array de { id_tam, tamanho_tam }
 * - coresDisponiveis: array de cores do material selecionado
 * - onSalvar: (e) => void  (handleSalvarSacola)
 * - onOcultar: () => void  (handleOcultarSacola)
 * - onAbrirGerenciarMaterial: () => void
 * - onAbrirGerenciarTamanho: () => void
 */
export default function ModalSacola({
  aberto,
  onOpenChange,
  sacola,
  onSacolaChange,
  sacolaEditandoId,
  opcoesMaterial,
  opcoesTamanho,
  coresDisponiveis,
  onSalvar,
  onOcultar,
  onAbrirGerenciarMaterial,
  onAbrirGerenciarTamanho,
}) {
  return (
    <Dialog.Root open={aberto} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0 backdrop-blur-sm z-40" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl w-[min(92vw,40rem)] max-h-[90vh] z-[100] overflow-y-auto custom-scrollbar"
        >
          <Dialog.Title className="text-md lg:text-xl font-extrabold mb-6 text-[#264f41]">
            {sacolaEditandoId ? 'Editar Sacola' : 'Adicionar Nova Sacola'}
          </Dialog.Title>

          <form onSubmit={onSalvar} className="flex flex-col gap-5">

            {/* Nome de exibição */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-xs lg:text-sm select-none text-gray-700">
                Nome de Exibição
              </label>
              <input
                type="text"
                placeholder="Sacola de Plástico Alça-fita"
                className="border border-gray-300 p-3 rounded-xl outline-none focus:border-[#5ab58f] transition text-sm lg:text-md font-extralight"
                value={sacola.nome_sac}
                onChange={(e) => onSacolaChange({ ...sacola, nome_sac: e.target.value })}
                required
              />
            </div>

            {/* Material */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-xs lg:text-sm select-none text-gray-700">
                Material
              </label>
              <div className="flex gap-2">
                <Select.Root
                  value={sacola.tipo_sac}
                  onValueChange={(v) => onSacolaChange({ ...sacola, tipo_sac: v })}
                >
                  <Select.Trigger className="flex flex-1 items-center justify-between border border-gray-300 p-3 rounded-xl bg-white focus:border-[#5ab58f] outline-none transition text-sm lg:text-md font-extralight">
                    <Select.Value placeholder="Selecione o material..." />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white rounded-xl shadow-2xl border border-gray-200 z-[110]">
                      <Select.Viewport className="p-2">
                        {opcoesMaterial.map((m) => (
                          <Select.Item
                            key={m.id_tip}
                            value={m.tipo_tip}
                            className="p-3 rounded-lg outline-none cursor-pointer hover:bg-[#f0faf5] focus:bg-[#f0faf5] transition text-sm lg:text-md font-extralight"
                          >
                            <Select.ItemText>{m.tipo_tip}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                <button
                  type="button"
                  onClick={onAbrirGerenciarMaterial}
                  className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  <GearIcon />
                </button>
              </div>

              <CoresMaterialPreview
                show={Boolean(sacola.tipo_sac)}
                nomesCores={coresDisponiveis}
              />
            </div>

            {/* Qtd. Mínima + Preço */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-xs lg:text-sm select-none text-gray-700">
                  Qtd. Mínima
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="border border-gray-300 p-3 rounded-xl outline-none focus:border-[#5ab58f] transition text-sm lg:text-md font-extralight"
                  value={sacola.quantidademin_sac}
                  onChange={(e) => onSacolaChange({ ...sacola, quantidademin_sac: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-xs lg:text-sm select-none text-gray-700">
                  Preço Unit. (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="border border-gray-300 p-3 rounded-xl outline-none focus:border-[#5ab58f] transition text-sm lg:text-md font-extralight"
                  value={sacola.precounitario_sac}
                  onChange={(e) => onSacolaChange({ ...sacola, precounitario_sac: e.target.value })}
                  onBlur={(e) => {
                    const valor = parseFloat(e.target.value);
                    if (!isNaN(valor)) {
                      onSacolaChange({ ...sacola, precounitario_sac: valor.toFixed(2) });
                    }
                  }}
                />
              </div>
            </div>

            {/* Peso + Tamanho */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-xs lg:text-sm select-none text-gray-700">
                  Peso
                </label>
                <input
                  type="text"
                  placeholder="Ex: 50g"
                  className="border border-gray-300 p-3 rounded-xl outline-none focus:border-[#5ab58f] transition text-sm lg:text-md font-extralight"
                  value={sacola.peso_sac}
                  onChange={(e) => onSacolaChange({ ...sacola, peso_sac: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-xs lg:text-sm select-none text-gray-700">
                  Tamanho
                </label>
                <div className="flex gap-2">
                  <Select.Root
                    value={sacola.tamanho_sac}
                    onValueChange={(v) => onSacolaChange({ ...sacola, tamanho_sac: v })}
                  >
                    <Select.Trigger className="flex flex-1 items-center justify-between border border-gray-300 p-3 rounded-xl bg-white focus:border-[#5ab58f] outline-none transition text-sm lg:text-md font-extralight">
                      <Select.Value placeholder="Selecione o tamanho..." />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white rounded-xl shadow-2xl border border-gray-200 z-[110]">
                        <Select.Viewport className="p-2">
                          {opcoesTamanho.map((t) => (
                            <Select.Item
                              key={t.id_tam}
                              value={t.tamanho_tam}
                              className="p-3 rounded-lg outline-none cursor-pointer hover:bg-[#f0faf5] focus:bg-[#f0faf5] transition text-sm lg:text-md font-extralight"
                            >
                              <Select.ItemText>{t.tamanho_tam}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>

                  <button
                    type="button"
                    onClick={onAbrirGerenciarTamanho}
                    className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition"
                  >
                    <GearIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-gray-700">Status</label>

              {sacola.status_sac === 'Oculto' && (
                <span className="text-sm italic text-gray-700">
                  Altere o status para restaurar esse item de volta aos ativos
                </span>
              )}

              <Select.Root
                value={sacola.status_sac}
                onValueChange={(v) => onSacolaChange({ ...sacola, status_sac: v })}
              >
                <Select.Trigger className="flex items-center justify-between border border-gray-300 p-3 rounded-xl bg-white focus:border-[#5ab58f] outline-none transition text-sm lg:text-md font-extralight">
                  <Select.Value placeholder="Status da sacola..." />
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
                      {sacola.status_sac === 'Oculto' && (
                        <Select.Item
                          value="Oculto"
                          className="p-3 rounded-lg text-red-600 font-bold outline-none cursor-pointer hover:bg-red-50"
                        >
                          <Select.ItemText>Oculto</Select.ItemText>
                        </Select.Item>
                      )}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Botão salvar */}
            <button
              type="submit"
              className="mt-4 bg-[#5ab58f] hover:bg-[#2e8f65] text-white p-4 rounded-xl font-bold transition shadow-lg"
            >
              {sacolaEditandoId ? 'Salvar Alterações' : 'Cadastrar Sacola'}
            </button>

            {/* Aviso */}
            <div className="flex-row flex items-center">
              <ExclamationTriangleIcon className="size-6 lg:size-7" />
              <div className="px-3 flex-col flex font-semibold text-md">
                <span>Cuidado ao salvar!</span>
                <span>Suas alterações podem ter grandes pesos.</span>
              </div>
            </div>

            {/* Botão ocultar — só aparece no modo edição e quando não está oculto */}
            {sacolaEditandoId && sacola.status_sac !== 'Oculto' && (
              <button
                type="button"
                onClick={onOcultar}
                className="flex items-center justify-center gap-2 text-red-500 font-bold hover:underline"
              >
                <TrashIcon className="size-5" /> Quero excluir e ocultar essa sacola
              </button>
            )}

          </form>

          {/* Botão fechar (X) */}
          <Dialog.Close asChild>
            <button className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold">
              ✕
            </button>
          </Dialog.Close>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}