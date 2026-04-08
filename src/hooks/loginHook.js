"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "../lib/supabaseClient";
import { getAuthErrorMessage } from "../lib/authErrorMessage";

export default function useLoginHook({ onError, onSuccess } = {}) {
    const router = useRouter(); // Inicializa o roteador
    const [formData, setFormData] = useState({
      email: '',
      senha: ''
    });
    const [loading, setLoading] = useState(false);
  
    const handleSignIn = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha,
      });
  
      if (error) {
        onError?.(getAuthErrorMessage(error, "login"));
      } else {
        onSuccess?.("Bem-vindo(a)!");
        setFormData({ email: '', senha: '' });
        
        // Redireciona para o login após 2 segundos para o usuário ler o alerta
        setTimeout(() => {
          router.push("/painel");
        }, 1800);
      }
      setLoading(false);
    };

    return {
        formData,
        setFormData,
        loading,
        handleSignIn
      };
}
