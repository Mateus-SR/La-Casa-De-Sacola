"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("avaliacao").select("*, sacola(nome_sac)").order("data_ava", { ascending: false });
      setReviews(data || []);
    };
    fetch();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#264f41] mb-12">Avaliações Reais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(r => (
            <div key={r.id_ava} className="p-6 border rounded-3xl bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="font-bold">{r.nome_usu}</span>
                <span className="text-yellow-500">{"★".repeat(r.nota_ava)}</span>
              </div>
              <p className="text-sm text-gray-600 italic">"{r.comentario_ava}"</p>
              <p className="text-xs text-[#3ca779] mt-2 font-bold">{r.sacola?.nome_sac}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
