"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/layout/Navbar";
import { useCart } from "../../context/CartContext";
import { TrashIcon, PlusIcon, MinusIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient";

export default function CarrinhoPage() {
const { cartItems, removeFromCart, updateQuantity, cartCount, clearCart } = useCart();
  const router = useRouter();
  
  // Estados de controle de acesso
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Estados do Frete
  const [tipoFrete, setTipoFrete] = useState("");
  const [cep, setCep] = useState("");
  const [valorFrete, setValorFrete] = useState(0);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Usuário não logado: redireciona para login e não autoriza
          toast.error("Você precisa estar logado para acessar o carrinho.");
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
          toast.error("Administradores não possuem acesso ao carrinho de compras.");
          router.push("/painel"); // Redireciona para o painel administrativo
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error("Erro ao verificar acesso:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.precounitario_sac * item.quantity,
    0
  );

  const total = subtotal + valorFrete;

  // Adicione estes estados dentro do seu componente
const [loadingFrete, setLoadingFrete] = useState(false);

// Atualize a função calcularFrete
const calcularFrete = async () => {
  // Limpa o CEP (tira o traço, se houver, para a validação de tamanho)
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    toast.error("Insira um CEP válido.");
    return;
  }

  setLoadingFrete(true);

  try {
    const response = await fetch('/api/frete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cepDestino: cepLimpo,
        pacotes: cartItems.map(item => ({
          id: item.id_sac,
          weight: 0.5, // Peso em kg (ajuste conforme seu produto)
          width: 15,   // Largura em cm
          height: 15,  // Altura em cm
          length: 15,  // Comprimento em cm
          quantity: item.quantity,
          insurance_value: item.precounitario_sac
        }))
      })
    });

    const data = await response.json();

    // O Melhor Envio retorna um array de transportadoras. 
    // Aqui pegamos a primeira que não tem erro (ex: Correios PAC)
    const freteValido = data.find(opcao => !opcao.error);

    if (freteValido) {
      setValorFrete(parseFloat(freteValido.price));
      toast.success(`Frete calculado: ${freteValido.name}`);
    } else {
      toast.error("Nenhuma transportadora disponível para este CEP.");
      setValorFrete(0);
    }

  } catch (error) {
    console.error("Erro na requisição:", error);
    toast.error("Falha ao calcular o frete.");
  } finally {
    setLoadingFrete(false);
  }
};

const finalizarCompra = async () => {
  setLoading(true);
  try {
    // 1. Obtém o usuário de forma segura
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    // 2. Cria o registro do pedido
    // Verifique se as colunas 'uuid_usu', 'valor_total' e 'status' existem exatamente com esses nomes
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedido")
      .insert({
        uuid_usu: user.id,
        valor_total: total,
        status: "pendente"
      })
      .select()
      .single();

    if (pedidoError) {
      console.error("Erro na tabela pedido:", pedidoError);
      throw new Error(`Erro no pedido: ${pedidoError.message}`);
    }

    // 3. Cria os itens do pedido
    // Verifique se a chave primária da sua tabela pedido é 'id' ou 'id_pedido'
    const itens = cartItems.map((item) => ({
      pedido_id: pedido.id, 
      sacola_id: item.id_sac,
      quantidade: item.quantity,
      preco_unitario: item.precounitario_sac,
    }));

    const { error: itensError } = await supabase.from("item_pedido").insert(itens);

    if (itensError) {
      console.error("Erro na tabela item_pedido:", itensError);
      throw new Error(`Erro nos itens: ${itensError.message}`);
    }

    // 4. Sucesso e Limpeza
    clearCart();
    toast.success("Pedido realizado com sucesso!");
    router.push("/pedidos"); 

  } catch (error) {
    console.error("Erro detalhado:", error);
    toast.error(error.message || "Erro ao finalizar o pedido.");
  } finally {
    setLoading(false);
  }
};

  // Enquanto verifica o login/tipo de usuário, exibe um estado de carregamento ou nada
  if (loading) return null; 

  // Se não estiver autorizado (não logado ou admin), não renderiza o conteúdo
  if (!authorized) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7f5]">
      <Navbar />
      <Toaster position="bottom-right" />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/catalogo" className="flex items-center gap-2 text-[#6b9e8a] hover:text-[#3ca779] transition-colors font-bold text-sm mb-2">
                <ChevronLeftIcon /> Continuar comprando
              </Link>
              <h1 className="text-4xl font-extrabold text-[#264f41]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                Meu Carrinho
              </h1>
            </div>
            <div className="text-right">
              <span className="bg-white px-4 py-2 rounded-2xl border border-[#e4f4ed] text-[#264f41] font-bold shadow-sm">
                {cartCount} {cartCount === 1 ? 'item' : 'itens'}
              </span>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#c8e3d5] shadow-sm">
              <div className="w-20 h-20 bg-[#f0faf5] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3ca779" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#264f41] mb-2">Seu carrinho está vazio</h2>
              <p className="text-[#6b9e8a] mb-8">Parece que você ainda não adicionou nenhum modelo de sacola.</p>
              <Link href="/catalogo" className="bg-[#3ca779] hover:bg-[#2e8f65] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#3ca779]/30 inline-block">
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lista de Itens */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {cartItems.map((item) => (
                  <div key={item.id_sac} className="bg-white rounded-3xl p-6 border border-[#e4f4ed] shadow-sm flex items-center gap-6 group hover:border-[#3ca779] transition-all">
                    <div className="w-24 h-24 bg-[#f0faf5] rounded-2xl flex items-center justify-center text-[#6b9e8a] font-bold text-[10px] text-center p-2 uppercase tracking-tighter">
                      {item.tipo_sac}
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-[#264f41] group-hover:text-[#3ca779] transition-colors">{item.nome_sac}</h3>
                      <p className="text-sm text-[#6b9e8a] font-medium">{item.tamanho_sac} • {item.cor_sac || 'Cor padrão'}</p>
                      <p className="text-[#3ca779] font-black mt-1">R$ {Number(item.precounitario_sac).toFixed(2)} <span className="text-[10px] text-gray-400 font-normal">/unid</span></p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center bg-[#f0faf5] rounded-xl border border-[#e4f4ed] p-1">
                        <button 
                          onClick={() => updateQuantity(item.id_sac, item.quantity - 1)}
                          className="p-1.5 hover:bg-white rounded-lg text-[#3ca779] transition-colors"
                        >
                          <MinusIcon />
                        </button>
                        <span className="w-8 text-center font-bold text-[#264f41]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id_sac, item.quantity + 1)}
                          className="p-1.5 hover:bg-white rounded-lg text-[#3ca779] transition-colors"
                        >
                          <PlusIcon />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => {
                          removeFromCart(item.id_sac);
                          toast.error("Item removido");
                        }}
                        className="text-[#8f0000] hover:bg-red-50 p-2 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
                      >
                        <TrashIcon /> Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumo */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-8 border border-[#e4f4ed] shadow-md sticky top-28">
                  <h3 className="text-xl font-bold text-[#264f41] mb-6">Resumo do Pedido</h3>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-[#264f41] mb-3">Opções de Entrega</h4>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-[#6b9e8a] font-medium text-sm">
                        <input
                          type="radio"
                          name="frete"
                          value="correios"
                          checked={tipoFrete === "correios"}
                          onChange={(e) => setTipoFrete(e.target.value)}
                          className="text-[#3ca779] focus:ring-[#3ca779] w-4 h-4"
                        />
                        Correios (Calcular frete)
                      </label>

                      {tipoFrete === "correios" && (
                        <div className="pl-6 flex gap-2 transition-all mt-1">
                          <input
                            type="text"
                            placeholder="00000-000"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            className="w-full border border-[#e4f4ed] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#3ca779] text-[#264f41]"
                            maxLength="9"
                          />
                          <button 
  onClick={calcularFrete}
  disabled={loadingFrete}
  className="bg-[#f0faf5] text-[#3ca779] font-bold px-4 py-2 rounded-xl border border-[#e4f4ed] hover:bg-[#e4f4ed] transition-colors text-sm disabled:opacity-50"
>
  {loadingFrete ? "Calculando..." : "OK"}
</button>
                        </div>
                      )}

                      <label className="flex items-center gap-2 cursor-pointer text-[#6b9e8a] font-medium text-sm mt-2">
                        <input
                          type="radio"
                          name="frete"
                          value="combinar"
                          checked={tipoFrete === "combinar"}
                          onChange={(e) => {
                            setTipoFrete(e.target.value);
                            setValorFrete(0);
                          }}
                          className="text-[#3ca779] focus:ring-[#3ca779] w-4 h-4"
                        />
                        A combinar
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mb-8">
                    <div className="flex justify-between text-[#6b9e8a] font-medium">
                      <span>Subtotal</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#6b9e8a] font-medium">
                      <span>Frete</span>
                      <span className="text-[#3ca779] font-bold">
                        {tipoFrete === "combinar" ? "A combinar" : valorFrete > 0 ? `R$ ${valorFrete.toFixed(2)}` : "-"}
                      </span>
                    </div>
                    <div className="h-px bg-[#e4f4ed] my-2" />
                    <div className="flex justify-between items-end">
                      <span className="text-[#264f41] font-bold">Total</span>
                      <div className="text-right">
                        <span className="text-3xl font-black text-[#264f41]">R$ {total.toFixed(2)}</span>
                        <p className="text-[10px] text-[#6b9e8a] font-bold uppercase mt-1">Em até 12x no cartão</p>
                      </div>
                    </div>
                  </div>

                 <button 
  onClick={finalizarCompra}
  disabled={loading || cartItems.length === 0}
  className="w-full bg-[#264f41] hover:bg-[#1a362c] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#264f41]/20 mb-4 disabled:opacity-50"
>
  {loading ? "Processando..." : "Finalizar Compra"}
</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}