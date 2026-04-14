"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from "../lib/supabaseClient";

const getMensagemErroLogin = (error) => {
  const message = (error?.message || '').toLowerCase();
  const code = error?.code;

  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return 'E-mail ou senha invalidos.';
  }

  if (message.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar.';
  }

  if (message.includes('invalid email') || message.includes('unable to validate email address')) {
    return 'E-mail invalido.';
  }

  return 'Nao foi possivel realizar o login. Tente novamente.';
};

export default function useLoginHook() {
    const router = useRouter(); // Inicializa o roteador
    const [formData, setFormData] = useState({
      email: '',
      senha: ''
    });
    const [loading, setLoading] = useState(false);
  
    const handleSignIn = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha,
      });
  
      if (error) {
        toast.error(getMensagemErroLogin(error));
      } else {
        toast.success('Bem-vindo(a)!');
        setFormData({ email: '', senha: '' });
        
        // Redireciona para o painel apos 2 segundos para o usuario ler o toast
        setTimeout(() => {
          router.push("/painel");
        }, 2000);
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
