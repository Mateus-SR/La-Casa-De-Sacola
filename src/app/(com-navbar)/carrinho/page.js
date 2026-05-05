"use client";
import Navbar from "../../../components/layout/Navbar";
import { useCart } from "../../../context/CartContext";
import ShippingCalculator from "../../../components/carrinho/ShippingCalculator";
import { Toaster } from "react-hot-toast";

export default function CarrinhoPage() {
  const { cartItems, updateQuantity, cartCount, freteSelected } = useCart();
  const subtotal = cartItems.reduce((acc, i) => acc + i.precounitario_sac * i.quantity, 0);
  const total = freteSelected ? subtotal + parseFloat(freteSelected.price) : subtotal;

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <Navbar /><Toaster />
      <main className="container mx-auto p-8 mt-20">
        <h1 className="text-3xl font-bold text-[#264f41] mb-8">Meu Carrinho ({cartCount})</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id_sac} className="bg-white p-6 rounded-3xl flex justify-between items-center border border-gray-100">
                <div>
                  <p className="font-bold">{item.nome_sac}</p>
                  <p className="text-sm text-gray-500">R$ {Number(item.precounitario_sac).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id_sac, item.quantity - 1)} className="p-2 bg-gray-100 rounded-lg">-</button>
                  <span className="font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id_sac, item.quantity + 1)} className="p-2 bg-gray-100 rounded-lg">+</button>
                </div>
              </div>
            ))}
            <ShippingCalculator />
          </div>
          <div className="bg-white p-8 rounded-3xl border h-fit sticky top-28">
            <h3 className="text-xl font-bold mb-6">Resumo</h3>
            <div className="flex justify-between mb-2"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
            {freteSelected && <div className="flex justify-between mb-2 text-green-600 font-bold"><span>Frete</span><span>R$ {Number(freteSelected.price).toFixed(2)}</span></div>}
            <div className="border-t my-4 pt-4 flex justify-between text-2xl font-black"><span>Total</span><span>R$ {total.toFixed(2)}</span></div>
            <button disabled={!freteSelected} className="w-full bg-[#264f41] text-white py-4 rounded-2xl font-bold disabled:bg-gray-300">Finalizar Compra</button>
          </div>
        </div>
      </main>
    </div>
  );
}
