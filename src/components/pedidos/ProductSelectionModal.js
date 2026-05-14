"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { XMarkIcon, StarIcon } from "@heroicons/react/24/outline";
import { ReloadIcon } from "@radix-ui/react-icons";
import ReviewForm from "./ReviewForm";

export default function ProductSelectionModal({ isOpen, onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sacola")
      .select("*")
      .order("nome_sac", { ascending: true });
    
    if (!error) {
      setProducts(data);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden relative">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#264f41]">
            {selectedProduct ? "Avaliar Produto" : "Selecione um Produto"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#6b9e8a] gap-3">
              <ReloadIcon className="animate-spin size-6" />
              <p>Carregando produtos...</p>
            </div>
          ) : selectedProduct ? (
            <div>
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                <div className="w-16 h-16 bg-[#A8DCAB]/20 rounded-xl flex items-center justify-center text-[#264f41] font-bold">
                  {selectedProduct.nome_sac?.substring(0, 2).toUpperCase() || "SC"}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedProduct.nome_sac}</h3>
                  <p className="text-sm text-gray-500">{selectedProduct.tipo_sac}</p>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="ml-auto text-sm text-[#d48a2f] font-bold hover:underline"
                >
                  Alterar
                </button>
              </div>
              
              <ReviewForm 
                produtoId={selectedProduct.id_sac} 
                pedidoId={null} 
                onReviewSuccess={() => {
                  setTimeout(onClose, 1500);
                }} 
              />
            </div>
          ) : (
            <div className="grid gap-3">
              {products.map((product) => (
                <button
                  key={product.id_sac}
                  onClick={() => setSelectedProduct(product)}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#A8DCAB] hover:bg-[#f0faf5] transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#A8DCAB]/30 rounded-xl flex items-center justify-center text-[#264f41] font-bold transition-colors">
                    {product.nome_sac?.substring(0, 2).toUpperCase() || "SC"}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#264f41]">{product.nome_sac}</h4>
                    <p className="text-xs text-gray-500">{product.tipo_sac}</p>
                  </div>
                  <StarIcon className="w-5 h-5 text-gray-300 group-hover:text-[#d48a2f]" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
