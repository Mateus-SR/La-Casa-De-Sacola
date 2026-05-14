"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { StarIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import ReviewForm from "./ReviewForm";

export default function UserReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("avaliacao")
        .select("*, sacola(nome_sac)")
        .eq("usu_uuid", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error("Erro ao buscar suas avaliações:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta avaliação?")) return;

    try {
      const { error } = await supabase
        .from("avaliacao")
        .delete()
        .eq("id_ava", id);

      if (error) throw error;
      
      toast.success("Avaliação excluída.");
      setReviews(reviews.filter(r => r.id_ava !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
      toast.error("Erro ao excluir avaliação.");
    }
  };

  if (loading) return <p className="text-center py-4 text-sm italic text-gray-500">Carregando suas avaliações...</p>;

  if (reviews.length === 0) return (
    <div className="text-center py-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
      <p className="text-sm text-gray-500">Você ainda não fez nenhuma avaliação.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id_ava} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
          {editingReview?.id_ava === review.id_ava ? (
            <div className="relative">
              <button 
                onClick={() => setEditingReview(null)}
                className="absolute -top-2 -right-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <XMarkIcon className="w-4 h-4 text-gray-500" />
              </button>
              <h4 className="text-sm font-bold text-[#264f41] mb-2">Editando avaliação de: {review.sacola?.nome_sac}</h4>
              <ReviewForm 
                reviewToEdit={review} 
                onReviewSuccess={() => {
                  setEditingReview(null);
                  fetchUserReviews();
                }} 
              />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-[#264f41]">{review.sacola?.nome_sac || "Produto LCS"}</h4>
                  <div className="flex text-yellow-400 my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIconSolid key={i} className={`w-4 h-4 ${i < review.nota_ava ? 'text-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingReview(review)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Editar"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(review.id_ava)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Excluir"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">"{review.comentario_ava}"</p>
              <p className="text-[10px] text-gray-400 mt-3 uppercase font-bold tracking-widest">
                {new Date(review.created_at).toLocaleDateString('pt-BR')}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
