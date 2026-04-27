import { UpdateIcon } from "@radix-ui/react-icons";

// Conteúdo JSX do toast de erro de autenticação da Navbar.
// Exportado como função pois o react-hot-toast espera (t) => JSX no toast.error().
// Usado tanto no timeout de segurança quanto no erro da query de cargo.
export default function ToastErroAuth(t) {
  return (
    <span className="flex flex-col gap-2">
      <span className="font-bold">Opa! Tivemos um problema ao carregar sua conta.</span>
      <span className="text-sm font-normal">Verifique sua conexão e tente novamente.</span>
      <button
        onClick={() => window.location.reload()}
        className="bg-[#5ab58f] hover:bg-[#2e8f65] text-white p-2.5 rounded-xl font-bold transition shadow-lg flex flex-row items-center justify-center gap-2"
      >
        <UpdateIcon />
        Recarregar
      </button>
    </span>
  );
}

// Opções fixas do toast: permanente e sem duplicatas
export const opcoesErroAuth = { duration: Infinity, id: "erro-auth" };