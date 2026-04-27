"use client";
import Link from "next/link";
import Navbar from "../../components/layout/Navbar";
import { useCart } from "../../context/CartContext";
import { TrashIcon, PlusIcon, MinusIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { Toaster, toast } from "react-hot-toast";

export default function CarrinhoPage() {
  const { cartItems, removeFromCart, updateQuantity, cartCount } = useCart();

  const total = cartItems.reduce(
    (acc, item) => acc + item.precounitario_sac * item.quantity,
    0
  );

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
                  
                  <div className="flex flex-col gap-4 mb-8">
                    <div className="flex justify-between text-[#6b9e8a] font-medium">
                      <span>Subtotal</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#6b9e8a] font-medium">
                      <span>Frete</span>
                      <span className="text-[#3ca779] font-bold">Grátis*</span>
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

                  <button className="w-full bg-[#264f41] hover:bg-[#1a362c] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#264f41]/20 mb-4">
                    Finalizar Compra
                  </button>
                  
                  <p className="text-[10px] text-center text-[#6b9e8a] font-medium px-4">
                    *Frete grátis para pedidos acima de R$500. Personalização inclusa no valor.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
