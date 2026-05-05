"use client";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { toast } from "react-hot-toast";

export default function ShippingCalculator() {
  const { freteOptions, freteSelected, setFreteSelected, loadingFrete, calcularFrete } = useCart();
  const [cep, setCep] = useState("");

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#e4f4ed] shadow-sm">
      <h3 className="text-lg font-bold text-[#264f41] mb-4">Calcular Frete</h3>
      <div className="flex gap-2 mb-4">
        <input type="text" value={cep} onChange={e => setCep(e.target.value)} placeholder="00000-000" className="flex-1 p-3 border rounded-xl outline-none focus:border-[#3ca779]"/>
        <button onClick={() => calcularFrete(cep)} disabled={loadingFrete} className="bg-[#3ca779] text-white px-4 rounded-xl font-bold">
          {loadingFrete ? "..." : <MagnifyingGlassIcon/>}
        </button>
      </div>
      {freteOptions.map(f => (
        <div key={f.id} onClick={() => setFreteSelected(f)} className={`p-3 mb-2 border-2 rounded-xl cursor-pointer ${freteSelected?.id === f.id ? 'border-[#3ca779] bg-[#f0faf5]' : 'border-gray-100'}`}>
          <div className="flex justify-between font-bold text-sm">
            <span>{f.name}</span>
            <span>R$ {Number(f.price).toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500">{f.delivery_time} dias úteis</p>
        </div>
      ))}
    </div>
  );
}
