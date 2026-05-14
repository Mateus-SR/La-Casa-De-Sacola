import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { StarIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";

export default function ReviewForm({ pedidoId, produtoId, onReviewSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const uploadImages = async (userId) => {
    const imageUrls = [];
    if (imageFiles.length === 0) return imageUrls;

    setUploading(true);
    for (const file of imageFiles) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("review_images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Erro ao fazer upload da imagem:", uploadError);
        toast.error("Erro ao fazer upload da imagem.");
        setUploading(false);
        return [];
      }

      const { data: publicUrlData } = supabase.storage
        .from("review_images")
        .getPublicUrl(filePath);
      
      imageUrls.push(publicUrlData.publicUrl);
    }
    setUploading(false);
    return imageUrls;
  };

  const send = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Você precisa estar logado para avaliar!");
      return;
    }

    // Validação para a constraint chk_sac_ped_not_null
    if (!produtoId && !pedidoId) {
      toast.error("É necessário selecionar um produto ou um pedido para avaliar.");
      console.error("Erro de validação: produtoId e pedidoId são nulos.", { produtoId, pedidoId });
      return;
    }

    console.log("Dados sendo enviados para avaliação:", { usu_uuid: user.id, id_sac: produtoId, id_ped: pedidoId, nota_ava: rating, comentario_ava: comment, nome_usu: user.email });

    const uploadedImageUrls = await uploadImages(user.id);
    if (imageFiles.length > 0 && uploadedImageUrls.length === 0) {
      // Se houve tentativa de upload e falhou, parar aqui
      return;
    }

    const { error } = await supabase.from("avaliacao").insert([{
      usu_uuid: user.id,
      id_sac: produtoId,
      id_ped: pedidoId || null,
      nota_ava: rating,
      comentario_ava: comment,
      nome_usu: user.email, // Ou user.user_metadata.full_name se disponível
      imagens_ava: uploadedImageUrls // Adicionar as URLs das imagens
    }]);

    if (!error) {
      toast.success("Avaliado!");
      onReviewSuccess();
      setComment("");
      setRating(5);
      setImageFiles([]);
    } else {
      console.error("Erro ao enviar avaliação:", error);
      toast.error("Erro ao enviar avaliação. Tente novamente.");
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl mt-2">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <StarIcon
            key={s}
            onClick={() => setRating(s)}
            className={`w-6 h-6 cursor-pointer ${s <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2 border rounded-lg text-sm mb-2"
        placeholder="Sua opinião..."
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-2 border rounded-lg text-sm mb-2"
      />
      <button
        onClick={send}
        disabled={uploading}
        className="w-full bg-[#264f41] text-white py-2 rounded-lg font-bold text-sm disabled:opacity-60"
      >
        {uploading ? "Enviando imagens..." : "Enviar Avaliação"}
      </button>
    </div>
  );
}
