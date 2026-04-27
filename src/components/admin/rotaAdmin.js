"use client";
import useVerificaAcessoAdmin from "../../hooks/verificaAcesso";
import { UpdateIcon } from "@radix-ui/react-icons";

export default function RotaAdmin({ children }) {
    const { cargo, carregando, erro } = useVerificaAcessoAdmin();

    if (carregando) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-extrabold text-black">
                Por favor, aguarde.
              </h1>
              <h2 className="text-xl font-bold text-gray-600 animate-pulse italic">
                Validando perfil de usuário...
              </h2>
            </div>
          );
    };

    if (erro) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
          <div>          
            <h1 className="text-2xl font-extrabold text-black">
              Houve um erro inexperado.
            </h1>
            <h2 className="text-xl font-bold text-red-600 animate-pulse italic">
              {erro}
            </h2>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="bg-[#5ab58f] hover:bg-[#2e8f65] text-white p-2.5 rounded-xl font-bold transition shadow-lg flex flex-row items-center justify-center gap-2"
          >
            <UpdateIcon />
            Recarregar
          </button>
        </div>
      );
    }

    if (cargo !== 'administrador') return null;

        return <>{children}</>
}