"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { StarIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";

export default function ReviewForm({ pedidoId, produtoId, onReviewSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [enviando, setEnviando] = useState(false);

  const send = async () => {
    if (enviando) return;
    setEnviando(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para avaliar.");
        setEnviando(false);
        return;
      }

      // Verifica se o usuário existe na tabela 'usuario' para evitar erro de FK
      const { data: perfil } = await supabase
        .from("usuario")
        .select("uuid_usu")
        .eq("uuid_usu", user.id)
        .maybeSingle();

      if (!perfil) {
        const { error: insertError } = await supabase
          .from("usuario")
          .insert([{
            uuid_usu: user.id,
            email_usu: user.email,
            nome_usu: user.user_metadata?.full_name || user.email?.split("@")[0]
          }]);
        
        if (insertError) {
          toast.error("Erro ao registrar seu perfil de usuário.");
          setEnviando(false);
          return;
        }
      }

      const { error } = await supabase.from("avaliacao").insert([{
        usu_uuid: user.id, 
        id_sac: produtoId, 
        id_ped: pedidoId || null, 
        nota_ava: rating, 
        comentario_ava: comment, 
        nome_usu: user.email
      }]);

      if (!error) { 
        toast.success("Avaliação enviada com sucesso!"); 
        if (onReviewSuccess) onReviewSuccess(); 
      } else {
        console.error("Erro ao inserir avaliação:", error);
        toast.error("Erro ao enviar avaliação.");
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      toast.error("Ocorreu um erro ao processar sua avaliação.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl mt-2 border border-gray-100">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Sua nota</p>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <StarIcon 
            key={s} 
            onClick={() => setRating(s)} 
            className={`w-8 h-8 cursor-pointer transition-transform hover:scale-110 ${s <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
      
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Seu comentário</p>
      <textarea 
        value={comment} 
        onChange={e => setComment(e.target.value)} 
        className="w-full p-3 border border-gray-200 rounded-xl text-sm mb-4 focus:ring-2 focus:ring-[#264f41]/20 focus:border-[#264f41] outline-none min-h-[100px]" 
        placeholder="Conte-nos o que achou deste produto..."
      />
      
      <button 
        onClick={send} 
        disabled={enviando}
        className="w-full bg-[#264f41] hover:bg-[#1a3a2e] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#264f41]/20 disabled:opacity-50"
      >
        {enviando ? "Enviando..." : "Enviar Avaliação"}
      </button>
    </div>
  );
}
