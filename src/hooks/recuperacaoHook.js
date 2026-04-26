"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export default function useRecuperacaoHook() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleEnviarEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://la-casa-de-sacola-test.vercel.app/nova-senha",
    });

    if (error) {
      toast.error("Não foi possível enviar o email. Tente novamente.");
    } else {
      setEnviado(true);
      toast.success("Email enviado! Verifique sua caixa de entrada.");
    }

    setLoading(false);
  };

  return { email, setEmail, loading, enviado, handleEnviarEmail };
}
