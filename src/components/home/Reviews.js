"use client";
import { useState } from "react";

const reviews = [
  {
    id: 1,
    name: "Ana Paula Ferreira",
    business: "Boutique Flor de Liz",
    rating: 5,
    date: "Março 2026",
    product: "Sacola Kraft Premium",
    comment:
      "Ficaram simplesmente perfeitas! A qualidade da impressão superou minhas expectativas. Meus clientes adoraram as sacolas e vários perguntaram onde mandei fazer. Com certeza vou repetir o pedido!",
    avatar: "A",
    avatarColor: "bg-[#3ca779]",
    hasPhoto: true,
    photoColor: "from-[#f0faf5] to-[#e0f5ea]",
  },
  {
    id: 2,
    name: "Carlos Eduardo",
    business: "Confeitaria Doce Mel",
    rating: 5,
    date: "Fevereiro 2026",
    product: "Sacola com Cordão",
    comment:
      "Atendimento excelente desde o primeiro contato. A equipe me ajudou a ajustar a arte e o resultado ficou incrível. As sacolas com cordão deram um toque muito mais sofisticado para minha confeitaria.",
    avatar: "C",
    avatarColor: "bg-[#264f41]",
    hasPhoto: true,
    photoColor: "from-[#f5f0fa] to-[#ede0f5]",
  },
  {
    id: 3,
    name: "Mariana Costa",
    business: "Loja Veste Bem",
    rating: 5,
    date: "Janeiro 2026",
    product: "Sacola de Papel",
    comment:
      "Terceiro pedido e continuo muito satisfeita. Prazo sempre cumprido, qualidade constante e preço justo. A empresa familiar faz toda a diferença no atendimento personalizado.",
    avatar: "M",
    avatarColor: "bg-[#f59e0b]",
    hasPhoto: false,
    photoColor: "",
  },
  {
    id: 4,
    name: "Roberto Alves",
    business: "Farmácia Saúde Total",
    rating: 4,
    date: "Dezembro 2025",
    product: "Sacola Plástica",
    comment:
      "Ótimo custo-benefício para sacolas plásticas em grande quantidade. A impressão ficou bem nítida e as sacolas são resistentes. Recomendo para quem precisa de volume com qualidade.",
    avatar: "R",
    avatarColor: "bg-[#3b82f6]",
    hasPhoto: false,
    photoColor: "",
  },
  {
    id: 5,
    name: "Fernanda Lima",
    business: "Ateliê Criativo",
    rating: 5,
    date: "Novembro 2025",
    product: "Sacola Kraft",
    comment:
      "Pedi para minha linha de produtos artesanais e ficou lindo! A sacola kraft combina perfeitamente com a identidade da minha marca. O acabamento é impecável.",
    avatar: "F",
    avatarColor: "bg-[#ec4899]",
    hasPhoto: true,
    photoColor: "from-[#fff8f0] to-[#fef3c7]",
  },
  {
    id: 6,
    name: "Paulo Henrique",
    business: "Pet Shop Amigo Fiel",
    rating: 5,
    date: "Outubro 2025",
    product: "Sacola de Papel",
    comment:
      "Encomendei sacolas para o Natal do meu pet shop e ficaram maravilhosas! As cores saíram exatamente como na arte. Entrega antes do prazo. Muito obrigado!",
    avatar: "P",
    avatarColor: "bg-[#8b5cf6]",
    hasPhoto: false,
    photoColor: "",
  },
];

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
<<<<<<< HEAD
  const [visibleCount, setVisibleCount] = useState(3);

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

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
            Mais de 200 clientes satisfeitos. Veja o que eles falam sobre nossas sacolas personalizadas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12 p-6 bg-[#f8fdfb] rounded-3xl border border-[#e4f4ed] max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-6xl font-extrabold text-[#264f41]" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              {avgRating}
            </div>
            <StarRating rating={5} />
            <p className="text-[#6b9e8a] text-sm mt-1">de 5 estrelas</p>
          </div>
          <div className="w-px h-16 bg-[#e4f4ed] hidden sm:block" />
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, visibleCount).map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl border border-[#e4f4ed] p-6 hover:shadow-lg hover:border-[#c8e3d5] transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-[#264f41] text-sm">{review.name}</p>
                    <p className="text-[#6b9e8a] text-xs">{review.business}</p>
                  </div>
                </div>
                <span className="text-[#9ab8ae] text-xs">{review.date}</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <StarRating rating={review.rating} />
                <span className="text-xs text-[#6b9e8a] bg-[#f0faf5] px-2 py-0.5 rounded-full">
                  {review.product}
                </span>
              </div>

              <p className="text-[#4a7a66] text-sm leading-relaxed mb-4">"{review.comment}"</p>

              {review.hasPhoto && (
                <div className={`rounded-2xl bg-gradient-to-br ${review.photoColor} h-24 flex items-center justify-center border border-[#e4f4ed]`}>
                  <div className="flex items-center gap-2 text-[#6b9e8a]">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium">Foto do produto</span>
                  </div>
                </div>
              )}
=======
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
>>>>>>> parent of a8a5e0f (avaliação no site esta funcionando)
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
