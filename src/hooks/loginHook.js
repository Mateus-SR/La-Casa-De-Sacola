"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from "../lib/supabaseClient";

const getMensagemErroLogin = (error) => {
  const message = (error?.message || '').toLowerCase();
  const code = error?.code;

  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return 'E-mail ou senha inválidos.';
  }

  if (message.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar.';
  }

  if (message.includes('invalid email') || message.includes('unable to validate email address')) {
    return 'E-mail inválido.';
  }

  return 'Não foi possível realizar o login. Tente novamente.';
};

export default function useLoginHook() {
    const router = useRouter();
    const [formData, setFormData] = useState({
      email: '',
      senha: ''
    });
    const [loading, setLoading] = useState(false);
  
    const handleSignIn = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      // 1. Tenta realizar a autenticação
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha,
      });
  
      if (authError) {
        toast.error(getMensagemErroLogin(authError));
        setLoading(false);
        return;
      }

      // 2. Se logou com sucesso, busca o cargo do usuário na tabela personalizada
      try {

      const { data: perfil, error: perfilError } = await supabase
        .from('usuario')
        .select('cargo')
        .eq('uuid_usu', authData.user.id)
        .single();

      if (perfilError) {
        console.error("Erro ao buscar perfil:", perfilError);
        toast.success('Bem-vindo(a)!');
        router.push("/"); // Por segurança, se não achar o cargo, manda pra home
        return;
      }

      toast.success('Bem-vindo(a)!');
      setFormData({ email: '', senha: '' });
      
      // 3. Redireciona todos para a home após 2 segundos
      setTimeout(() => {
        router.push("/");
      }, 2000);

      
    } finally {
      setLoading(false);
    }
    };

    return {
        formData,
        setFormData,
        loading,
        handleSignIn
      };
}