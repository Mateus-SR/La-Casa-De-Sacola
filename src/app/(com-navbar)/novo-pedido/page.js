"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CriadorDeSacola from "@/components/pedidos/criadorSacola";
import { useCart } from "@/context/CartContext";
import { TrashIcon, PlusIcon, MinusIcon, ChevronLeftIcon, ArchiveIcon } from "@radix-ui/react-icons";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

export default function novoPedido() {
  const { cartItems, removeFromCart, updateQuantity, cartCount, addToCart } = useCart();
  const router = useRouter();
  
  // Estados de controle de acesso
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Estados do Frete
  const [tipoFrete, setTipoFrete] = useState("");
  const [cep, setCep] = useState("");
  const [valorFrete, setValorFrete] = useState(0);

  const [userId, setUserId] = useState(null);
  const [pedidoId, setPedidoId] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Usuário não logado: redireciona para login e não autoriza
          toast.error("Você precisa estar logado para fazer um pedido.");
          router.push("/login");
          return;
        }

        // Verifica o tipo de usuário no banco de dados
        const { data: profile } = await supabase
          .from("usuario")
          .select("cargo")
          .eq("uuid_usu", user.id)
          .single();

        if (profile?.cargo === "administrador") {
          // Administrador: não deve ver o carrinho
          toast.error("No momento, administradores não podem registrar pedidos em nome dos clientes.");
          router.push("/painel"); // Redireciona para o painel administrativo
          return;
        }

        setAuthorized(true);
        setUserId(user.id);
      } catch (error) {
        console.error("Erro ao verificar acesso:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  // Enquanto verifica o login/tipo de usuário, exibe um estado de carregamento ou nada
  if (loading) return null; 

  // Se não estiver autorizado (não logado ou admin), não renderiza o conteúdo
  if (!authorized) return null;

  const handleSacolaAdicionada = (novaSacolaConfigurada) => {
    addToCart(novaSacolaConfigurada); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7f5]">
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/catalogo" className="flex items-center gap-2 text-[#6b9e8a] hover:text-[#3ca779] transition-colors font-bold text-sm mb-2">
                <ChevronLeftIcon /> Voltar para Página Inicial
              </Link>
              <h1 className="text-4xl font-extrabold text-[#264f41]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                Novo pedido
              </h1>
            </div>
            <div className="text-right">
              <span className="bg-white px-4 py-2 rounded-2xl border border-[#e4f4ed] text-[#264f41] font-bold shadow-sm">
                {cartCount} {cartCount === 1 ? 'item' : 'itens'}
              </span>
            </div>
          </div>

            <CriadorDeSacola
                pedidoId={pedidoId}
                setPedidoId={setPedidoId}
                userId={userId}
                temItens={cartCount > 0} 
                onSacolaAdicionada={handleSacolaAdicionada}
            />
        </div>
      </main>
    </div>
  );
}