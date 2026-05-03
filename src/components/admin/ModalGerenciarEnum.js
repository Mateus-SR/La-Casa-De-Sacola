import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as Tabs from '@radix-ui/react-tabs';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { TrashIcon } from "@radix-ui/react-icons";
import CoresMaterialSection from "@/components/admin/CoresMaterialSection";

export default function ModalGerenciarEnum({ enum_, cores }) {
  return (
    <Dialog.Root
      open={enum_.modalEnumAberto}
      onOpenChange={(aberto) => {
        enum_.setModalEnumAberto(aberto);
        if (!aberto) cores.resetFormularioCor();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0 z-[120]" />
        <Dialog.Content aria-describedby={undefined} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm z-[130]">
          
          <Dialog.Title className="text-lg font-extrabold mb-4 text-[#264f41]">
            Gerenciar {enum_.enumAtual === 'tipo' ? 'Material' : 'Tamanho'}
          </Dialog.Title>

          <Tabs.Root 
            defaultValue="novo"
            onValueChange={(abaClicada) => {
              if (abaClicada === "novo") {
                enum_.setEnumEditandoId(null);
                enum_.setNovoValorEnum("");
              }
              cores.resetFormularioCor();
            }}
          >
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

            <Tabs.Content value="novo" className="outline-none">
              <form onSubmit={enum_.handleAdicionarValorEnum} className="flex flex-col gap-4">
                <input 
                  type="text"
                  placeholder={enum_.enumAtual === 'tipo' ? "Ex: Papel, Plástico..." : "Ex: 20x30, 30x40..."}
                  className="border border-gray-300 p-3 rounded-xl outline-none focus:border-[#5ab58f]"
                  value={enum_.novoValorEnum}
                  onChange={(e) => enum_.setNovoValorEnum(e.target.value)}
                  autoFocus
                />

                <CoresMaterialSection
                  show={enum_.enumAtual === 'tipo'}
                  nomesCores={cores.coresPrincipais}
                  coresSelecionadas={cores.obterCoresSelecionadasDoMaterial(enum_.novoValorEnum)}
                  onAbrirFormulario={() => cores.setModalEditarCoresAberto(true)}
                  onToggleCor={(cor) => cores.handleToggleSelecaoCor(enum_.novoValorEnum, cor)}
                />

                <div className="flex gap-3">
                  <Dialog.Close asChild>
                    <button type="button" className="flex-1 p-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition">Cancelar</button>
                  </Dialog.Close>
                  <button type="submit" className="flex-1 p-3 bg-[#5ab58f] hover:bg-[#489474] text-white rounded-xl font-bold transition">Salvar</button>
                </div>
              </form>
            </Tabs.Content>

            <Tabs.Content value="gerenciar" className="outline-none flex flex-col gap-4">
              
              <Select.Root 
                onValueChange={(nomeSelecionado) => {
                  if (enum_.enumAtual === 'tipo') {
                    const itemEncontrado = enum_.opcoesMaterial.find(item => item.tipo_tip === nomeSelecionado);
                    if (itemEncontrado) {
                      enum_.setEnumEditandoId(itemEncontrado.id_tip);
                      enum_.setNovoValorEnum(itemEncontrado.tipo_tip);
                    }
                  } else {
                    const itemEncontrado = enum_.opcoesTamanho.find(item => item.tamanho_tam === nomeSelecionado);
                    if (itemEncontrado) {
                      enum_.setEnumEditandoId(itemEncontrado.id_tam);
                      enum_.setNovoValorEnum(itemEncontrado.tamanho_tam);
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
                      {(enum_.enumAtual === 'tipo' ? enum_.opcoesMaterial : enum_.opcoesTamanho).map((item) => {
                        const itemId = enum_.enumAtual === 'tipo' ? item.id_tip : item.id_tam;
                        const itemNome = enum_.enumAtual === 'tipo' ? item.tipo_tip : item.tamanho_tam;

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

              {enum_.enumEditandoId && (
                <div className="flex flex-col gap-3 mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="font-bold text-sm text-gray-700">Alterar nome:</label>
                  <input 
                    type="text"
                    className="border border-gray-300 p-3 rounded-xl outline-none focus:border-[#5ab58f]"
                    value={enum_.novoValorEnum}
                    onChange={(e) => enum_.setNovoValorEnum(e.target.value)}
                  />

                  <CoresMaterialSection
                    show={enum_.enumAtual === 'tipo'}
                    nomesCores={cores.coresPrincipais}
                    coresSelecionadas={cores.obterCoresSelecionadasDoMaterial(enum_.novoValorEnum)}
                    onAbrirFormulario={() => cores.setModalEditarCoresAberto(true)}
                    onToggleCor={(cor) => cores.handleToggleSelecaoCor(enum_.novoValorEnum, cor)}
                  />
                  
                  <div className="flex gap-3 mt-2">
                    <AlertDialog.Root>
                      <AlertDialog.Trigger asChild>
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
                          
                          <AlertDialog.Description className="text-gray-600 text-sm mb-6 leading-relaxed">
                            Essa ação é permanente. O {enum_.enumAtual === 'tipo' ? 'material' : 'tamanho'} selecionado deixará de estar disponível para novos produtos.
                          </AlertDialog.Description>

                          <div className="flex gap-3 justify-end">
                            <AlertDialog.Cancel asChild>
                              <button className="flex-1 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition outline-none">
                                Cancelar
                              </button>
                            </AlertDialog.Cancel>
                            
                            <AlertDialog.Action asChild>
                              <button 
                                onClick={() => enum_.handleOcultarEnum(enum_.enumEditandoId)}
                                className="flex-1 p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition outline-none"
                              >
                                Sim, excluir
                              </button>
                            </AlertDialog.Action>
                          </div>

                        </AlertDialog.Content>
                      </AlertDialog.Portal>
                    </AlertDialog.Root>

                    <button 
                      type="button" 
                      onClick={enum_.handleEditarValorEnum}
                      className="flex-1 p-3 bg-[#5ab58f] hover:bg-[#489474] text-white rounded-xl font-bold transition"
                    >
                      Salvar Alteração
                    </button>
                  </div>
                </div>
              )}

            </Tabs.Content>
          </Tabs.Root>

          <Dialog.Close asChild>
            <button className="absolute top-5 right-5 text-gray-400 hover:text-black font-bold text-lg transition">✕</button>
          </Dialog.Close>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}