import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { StarIcon } from "@heroicons/react/24/solid";

export default function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("avaliacao")
        .select("*, usuario(email_usu)") 
        .eq("id_sac", productId) 
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar avaliações:", error);
      } else {
        setReviews(data);
      }
      setLoading(false);
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  if (loading) {
    return <p>Carregando avaliações...</p>;
  }

  if (reviews.length === 0) {
    return <p>Nenhuma avaliação para este produto ainda.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id_ava} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <p className="font-bold mr-2">{review.nome_usu || review.usuario.email_usu}</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon
                  key={s}
                  className={`w-5 h-5 ${s <= review.nota_ava ? 'text-yellow-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-700 mb-2">{review.comentario_ava}</p>
          {review.imagens_ava && review.imagens_ava.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {review.imagens_ava.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Avaliação imagem ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {new Date(review.created_at).toLocaleDateString("pt-BR", { dateStyle: "medium" })}
          </p>
        </div>
      ))}
    </div>
  );
}
