import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, PlusIcon } from "@radix-ui/react-icons";

export default function FiltrosSacola({
  mostrarAtivas,
  setMostrarAtivas,
  mostrarOcultas,
  setMostrarOcultas,
  onAbrirNovaSacola,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-[#e4f4ed] mb-5 gap-4">
      <div className="flex items-center gap-6">
        {/* Checkbox: Ativas */}
        <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700 font-semibold text-sm lg:text-base">
          <Checkbox.Root
            className="flex size-5 lg:size-6 appearance-none items-center justify-center rounded border-2 border-green-400 bg-white outline-none hover:bg-blue-50 data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 transition-colors"
            checked={mostrarAtivas}
            onCheckedChange={setMostrarAtivas}
          >
            <Checkbox.Indicator className="text-white">
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
          Mostrar sacolas ativas
        </label>

        {/* Checkbox: Ocultas */}
        <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700 font-semibold text-sm lg:text-base">
          <Checkbox.Root
            className="flex size-5 lg:size-6 appearance-none items-center justify-center rounded border-2 border-red-400 bg-white outline-none hover:bg-red-50 data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600 transition-colors"
            checked={mostrarOcultas}
            onCheckedChange={setMostrarOcultas}
          >
            <Checkbox.Indicator className="text-white">
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
          Mostrar Ocultas
        </label>
      </div>

      <button
        onClick={onAbrirNovaSacola}
        className="bg-[#264f41] hover:bg-[#403c37] text-white px-5 py-2.5 rounded-xl font-bold transition shadow-md flex items-center gap-2 text-sm lg:text-md w-full sm:w-auto justify-center"
      >
        <PlusIcon className="size-5 lg:size-6" /> Adicionar Sacola
      </button>
    </div>
  );
}
