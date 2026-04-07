"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Importado para redirecionar o usuário
import { supabase } from "../lib/supabaseClient";
import AuthBackground from "../components/auth/AuthBackground";
import AuthButton from "../components/auth/AuthButton";
import AuthCard from "../components/auth/AuthCard";
import AuthField from "../components/auth/AuthField";
import AuthPasswordField from "../components/auth/AuthPasswordField";
import styles from "../components/auth/auth.module.css";

export default function Cadastro() {
  const router = useRouter(); // Inicializa o roteador
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.senha,
      options: {
        data: {
          full_name: formData.nome,
        },
      },
    });

    if (error) {
      alert("Erro no cadastro: " + error.message);
    } else {
      alert("Cadastro realizado com sucesso! Verifique seu e-mail.");
      setFormData({ nome: '', email: '', senha: '' });
      
      // Redireciona para o login após 2 segundos para o usuário ler o alerta
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <>
      <title>Cadastro | La Casa De Sacola</title>
      
      {/* Google Fonts importadas corretamente via link */}
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Quicksand:wght@500;700&display=swap"
        rel="stylesheet"
      />

      <AuthBackground>
        <AuthCard>
          <h1 className={`${styles.reveal} ${styles.d1} ${styles.title} font-extrabold`}>
            Cadastro
          </h1>
          <p className={`${styles.reveal} ${styles.d2} ${styles.titleSub} mt-2`}>
            Crie sua conta e personalize sua sacola
          </p>

          <form className={`${styles.formBlock} mt-8 flex flex-col`} onSubmit={handleSignUp}>
            <AuthField 
              type="text" 
              placeholder="Nome completo" 
              revealClass={styles.d2} 
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
            
            <AuthField 
              type="email" 
              placeholder="Email" 
              revealClass={styles.d3} 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            
            <AuthPasswordField 
              placeholder="Senha" 
              revealClass={styles.d4} 
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              required
            />

            <AuthButton type="submit" revealClass={styles.d5} disabled={loading}>
              {loading ? "Processando..." : "Cadastrar"}
            </AuthButton>
          </form>

          <p className={`${styles.reveal} ${styles.d5} mt-7 text-center text-[#3f705d]`}>
            Já tem conta?{" "}
            <Link href="/login" className={`${styles.softLink} font-semibold underline-offset-4 hover:underline`}>
              Voltar para login
            </Link>
          </p>
        </AuthCard>
      </AuthBackground>
    </>
  );
}