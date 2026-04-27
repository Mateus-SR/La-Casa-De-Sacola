// Renderiza a lista de cores disponíveis para um material, permitindo selecionar e editar as cores

"use client";

export default function CoresMaterialSection({
  show,
  nomesCores,
  coresSelecionadas,
  onAbrirFormulario,
  onToggleCor,
}) {
  if (!show) {
    return null;
  }

  return (
    <div className="mt-1 p-3 rounded-xl border border-gray-200 bg-gray-50 flex flex-col gap-2">
      <p className="text-xs font-bold uppercase text-gray-500">Cores disponiveis</p>

      <div className="max-h-40 overflow-auto custom-scrollbar border border-gray-200 rounded-lg bg-white divide-y divide-gray-100">
        {nomesCores.map((cor) => (
          <button
            key={`${cor.nome}-${cor.hex}`}
            type="button"
            onClick={() => onToggleCor(cor)}
            className={`w-full flex items-center gap-2 p-2 text-left transition ${
              coresSelecionadas.some((selecionada) => selecionada.nome === cor.nome && selecionada.hex === cor.hex)
                ? "bg-[#f0faf5]"
                : "hover:bg-gray-50"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-sm border shrink-0 ${
                coresSelecionadas.some((selecionada) => selecionada.nome === cor.nome && selecionada.hex === cor.hex)
                  ? "border-[#5ab58f] ring-2 ring-[#c8e3d5]"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: cor.hex }}
              aria-hidden
            />
            <span className="text-sm text-gray-700 font-medium">{cor.nome}</span>
            {coresSelecionadas.some((selecionada) => selecionada.nome === cor.nome && selecionada.hex === cor.hex) && (
              <span className="ml-auto text-xs font-bold text-[#5ab58f] uppercase">Selecionada</span>
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onAbrirFormulario}
        className="self-start text-sm font-bold text-[#264f41] hover:underline"
      >
        Editar cores
      </button>
    </div>
  );
}