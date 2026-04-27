// Apenas exibe visualmente as cores já selecionadas para o material atual)

"use client";

export default function CoresMaterialPreview({ show, nomesCores }) {
  if (!show) {
    return null;
  }

  return (
    <div className="mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 flex flex-col gap-2">
      <p className="text-xs font-bold uppercase text-gray-500">Cores disponiveis deste material</p>

      {nomesCores.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-lg bg-white p-3 text-sm text-gray-500 italic">
          Nenhuma cor foi selecionada para este material ainda.
        </div>
      ) : (
        <div className="max-h-40 overflow-auto custom-scrollbar border border-gray-200 rounded-lg bg-white divide-y divide-gray-100">
          {nomesCores.map((cor) => (
            <div key={`${cor.nome}-${cor.hex}`} className="flex items-center gap-2 p-2">
              <span
                className="w-4 h-4 rounded-sm border border-gray-300 shrink-0"
                style={{ backgroundColor: cor.hex }}
                aria-hidden
              />
              <span className="text-sm text-gray-700 font-medium">{cor.nome}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}