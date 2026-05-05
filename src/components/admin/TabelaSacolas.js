import { EyeClosedIcon, Pencil2Icon } from "@radix-ui/react-icons";

export default function TabelaSacolas({ sacolasFiltradas, onAbrirEdicao }) {
  return (
    <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-[#e4f4ed] overflow-hidden">
      <div className="max-h-full overflow-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="sticky top-0 z-10 bg-[#264f41] text-white">
            <tr>
              <th className="p-4 font-semibold text-sm">Nome</th>
              <th className="p-4 font-semibold text-sm">Material</th>
              <th className="p-4 font-semibold text-sm text-center">
                Qtd. Mín
              </th>
              <th className="p-4 font-semibold text-sm text-center">
                Preço (R$)
              </th>
              <th className="p-4 font-semibold text-sm text-center">Tamanho</th>
              <th className="p-4 font-semibold text-sm text-center">Status</th>
              <th className="p-4 font-semibold text-sm text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sacolasFiltradas.length === 0 ? (
              <tr>
                {/* colSpan ajustado para 7 para bater com o número de colunas reais */}
                <td colSpan="7" className="p-10 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <EyeClosedIcon className="size-10 text-gray-400" />
                    <p className="text-lg font-semibold">
                      Nenhuma sacola encontrada.
                    </p>
                    <p className="text-sm">
                      Selecione uma das opções acima para visualizar os itens.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sacolasFiltradas.map((sacola) => (
                <tr
                  key={sacola.id_sac}
                  className="hover:bg-[#f0faf5] transition"
                >
                  <td
                    className="p-4 font-bold text-[#264f41] max-w-[250px] truncate"
                    title={sacola.nome_sac}
                  >
                    {sacola.nome_sac}
                  </td>
                  <td className="p-4">{sacola.tipo_sac}</td>
                  <td className="p-4 text-center">
                    {sacola.quantidademin_sac}
                  </td>
                  <td className="p-4 text-center">
                    R$ {Number(sacola.precounitario_sac).toFixed(2)}
                  </td>
                  <td className="p-4 text-center">{sacola.tamanho_sac}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        sacola.status_sac === "Disponível"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {sacola.status_sac}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => onAbrirEdicao(sacola)}
                      className="text-blue-600 hover:bg-white p-2 rounded-lg transition inline-flex items-center gap-1 font-bold"
                    >
                      <Pencil2Icon /> Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
