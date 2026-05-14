"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { StarIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";

export default function ReviewForm({ pedidoId, produtoId, onReviewSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const send = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("avaliacao").insert([{
      usu_uuid: user.id, id_sac: produtoId, id_ped: pedidoId,
      nota_ava: rating, comentario_ava: comment, nome_usu: user.email
    }]);
    if (!error) { toast.success("Avaliado!"); onReviewSuccess(); }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl mt-2">
      <div className="flex gap-1 mb-2">
        {[1,2,3,4,5].map(s => <StarIcon key={s} onClick={() => setRating(s)} className={`w-6 h-6 cursor-pointer ${s <= rating ? 'text-yellow-500' : 'text-gray-300'}`}/>)}
      </div>
      <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full p-2 border rounded-lg text-sm mb-2" placeholder="Sua opinião..."/>
      <button onClick={send} className="w-full bg-[#264f41] text-white py-2 rounded-lg font-bold text-sm">Enviar Avaliação</button>
    </div>
  );
}
