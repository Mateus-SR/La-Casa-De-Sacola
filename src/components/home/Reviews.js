"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#f59e0b" : "none"}
          stroke={star <= rating ? "#f59e0b" : "#d1d5db"}
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
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

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.nota_ava, 0) / reviews.length).toFixed(1)
    : "5.0";

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 italic">Carregando depoimentos...</p>
        </div>
      </section>
    );
  }

  // Se não houver avaliações no banco, você pode optar por mostrar as fakes ou não mostrar a seção.
  // Aqui vamos mostrar a seção apenas se houver dados reais.
  if (reviews.length === 0) return null;

  return (
    <section id="avaliacoes" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#fff8f0] text-[#f59e0b] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            ★ Avaliações Reais
          </span>
          <h2
            className="text-4xl font-extrabold text-[#264f41] mb-4"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            O que nossos clientes dizem
          </h2>
          <p className="text-[#6b9e8a] text-lg max-w-2xl mx-auto">
            Veja o que nossos clientes estão falando sobre a qualidade das nossas sacolas personalizadas.
          </p>
        </div>

        {/* Resumo de Notas */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12 p-6 bg-[#f8fdfb] rounded-3xl border border-[#e4f4ed] max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-6xl font-extrabold text-[#264f41]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              {avgRating}
            </div>
            <StarRating rating={Math.round(parseFloat(avgRating))} />
            <p className="text-[#6b9e8a] text-sm mt-1">de 5 estrelas</p>
          </div>
          <div className="w-px h-16 bg-[#e4f4ed] hidden sm:block" />
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.nota_ava === star).length;
              const pct = Math.round((count / reviews.length) * 100);
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-[#6b9e8a] w-4">{star}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <div className="w-24 h-1.5 bg-[#e4f4ed] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#f59e0b] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#6b9e8a]">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid de Avaliações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, visibleCount).map((review) => (
            <div
              key={review.id_ava}
              className="bg-white rounded-3xl border border-[#e4f4ed] p-6 hover:shadow-lg hover:border-[#c8e3d5] transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-[#3ca779] flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {review.nome_usu?.charAt(0).toUpperCase() || "C"}
                  </div>
                  <div>
                    <p className="font-bold text-[#264f41] text-sm">{review.nome_usu || "Cliente"}</p>
                    <p className="text-[#6b9e8a] text-xs">Avaliação Verificada</p>
                  </div>
                </div>
                <span className="text-[#9ab8ae] text-xs">
                  {new Date(review.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <StarRating rating={review.nota_ava} />
                <span className="text-xs text-[#6b9e8a] bg-[#f0faf5] px-2 py-0.5 rounded-full">
                  {review.sacola?.nome_sac || "Produto LCS"}
                </span>
              </div>

              <p className="text-[#4a7a66] text-sm leading-relaxed mb-4">"{review.comentario_ava}"</p>
            </div>
          ))}
        </div>

        {visibleCount < reviews.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 3, reviews.length))}
              className="inline-flex items-center gap-2 border-2 border-[#c8e3d5] text-[#3ca779] font-semibold px-6 py-3 rounded-2xl hover:bg-[#f0faf5] transition-colors"
            >
              Ver mais avaliações
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
