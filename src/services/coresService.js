// Pendente: mover toast para o handler, não deve estar aqui
// Ele não pode fazer várias coisas (query no banco, transformação de valores, chama toast, etc)
import { supabase } from "@/lib/supabaseClient";

export const salvarCorNoBanco = async (nome, hex) => {
    const { data, error } = await supabase
      .from('cores')
      .insert([
        {
          nome_cor: nome,
          hex_cor: hex
        }
      ])
      .select();
  
    if (error) {
      console.error("Erro ao salvar cor:", error);
/*       toast.custom(() => (
        <PainelToast
          variant="error"
          title="Não foi possível salvar a cor"
          description="Tente novamente em instantes."
        />
      )); */
      return null;
    }
  
    return data[0];
  };

export const excluirCorNoBanco = async (id) => {
    console.log("Excluindo cor ID:", id);
  
    const { error } = await supabase
      .from('cores')
      .update({ excluido: true })
      .eq('id_cor', id);
  
    if (error) {
      console.error("Erro ao excluir cor:", error);
/*       toast.custom(() => (
        <PainelToast
          variant="error"
          title="Não foi possível excluir a cor"
          description="Tente novamente em instantes."
        />
      )); */
      return false;
    }
  
    return true;
  };