"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Buscamos as avaliações ordenando pelo campo 'created_at' que existe no seu schema
        const { data, error } = await supabase
          .from("avaliacao")
          .select("*, sacola(nome_sac)")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar avaliações:", error);
        } else {
          setReviews(data || []);
        }
      } catch (err) {
        console.error("Erro inesperado:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 italic">Carregando depoimentos...</p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Não exibe a seção se não houver avaliações
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#d48a2f] mb-2">Depoimentos</p>
          <h2 className="text-4xl font-extrabold text-[#264f41]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            Avaliações Reais
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <div key={r.id_ava} className="p-8 border border-gray-100 rounded-[2rem] bg-gray-50/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-[#264f41]">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H13.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H8.017C7.46472 8 7.017 8.44772 7.017 9V12C7.017 12.5523 6.56932 13 6.017 13H5.017V21H6.017Z" />
                </svg>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <span className="font-bold text-[#264f41] text-lg">{r.nome_usu || "Cliente"}</span>
                  <span className="text-xs text-[#d48a2f] font-bold uppercase tracking-wider">
                    {r.sacola?.nome_sac || "Produto LCS"}
                  </span>
                </div>
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-xl">
                      {i < r.nota_ava ? "★" : "☆"}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 italic leading-relaxed">
                "{r.comentario_ava}"
              </p>
              
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {new Date(r.created_at).toLocaleDateString('pt-BR')}
                </span>
                <div className="w-8 h-1 bg-[#3ca779] rounded-full opacity-30"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
