"use client";
import useVerificaAcessoAdmin from "../../hooks/verificaAcesso";

export default function RotaAdmin({ children }) {
    const { cargo, carregando } = useVerificaAcessoAdmin();

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
        }

        if (cargo !== 'administrador') {
            return null;
        }

        return <>{children}</>
}