"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { supabase } from "../lib/supabaseClient";
import AuthBackground from "../components/auth/AuthBackground";
import AuthButton from "../components/auth/AuthButton";
import AuthCard from "../components/auth/AuthCard";
import AuthField from "../components/auth/AuthField";
import AuthPasswordField from "../components/auth/AuthPasswordField";
import styles from "../components/auth/auth.module.css";

export default function Cadastro() {
  const router = useRouter(); 
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  
  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  
  const [loading, setLoading] = useState(false);

  // Lista de domínios permitidos
  const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];

  const validateEmail = (email) => {
    const emailLower = email.toLowerCase();
    
    // 1. Validação de formato básico (Regex)
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(emailLower)) return { valid: false, message: "Formato de e-mail inválido." };

    // 2. Validação de domínio específico
    const domain = emailLower.split('@')[1];
    if (!allowedDomains.includes(domain)) {
      return { 
        valid: false, 
        message: "Use um e-mail válido (Gmail, Yahoo, Outlook, etc)." 
      };
    }

    return { valid: true };
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    let currentErrors = { nome: '', email: '', senha: '', confirmarSenha: '' };
    let hasError = false;

    // Validação de Nome (Obrigatório)
    if (formData.nome.trim().length < 3) {
      currentErrors.nome = "Por favor, insira seu nome completo.";
      hasError = true;
    }

    // Validação de E-mail com restrição de domínio
    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.valid) {
      currentErrors.email = emailCheck.message;
      hasError = true;
    }

    // Validação de Senha (Mínimo 8 dígitos)
    if (formData.senha.length < 8) {
      currentErrors.senha = "A senha deve ter pelo menos 8 dígitos.";
      hasError = true;
    }

    if (formData.confirmarSenha !== formData.senha) {
      currentErrors.confirmarSenha = "As senhas não coincidem.";
      hasError = true;
    }

    setErrors(currentErrors);
    if (hasError) return;

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
      setFormData({ nome: '', email: '', senha: '', confirmarSenha: '' });
      setErrors({ nome: '', email: '', senha: '', confirmarSenha: '' });
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <>
      <title>Cadastro | La Casa De Sacola</title>
      
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
            <div className="mb-4">
              <AuthField
                type="text" 
                placeholder="Nome completo" 
                revealClass={styles.d2} 
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
              {errors.nome && (
                <span className="text-red-500 text-xs mt-1 ml-1 animate-pulse italic block">
                  {errors.nome}
                </span>
              )}
            </div>
            
            <div className="mb-4">
              <AuthField
                type="email" 
                placeholder="Email" 
                revealClass={styles.d3} 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1 ml-1 animate-pulse italic block">
                  {errors.email}
                </span>
              )}
            </div>
            
            <div className="mb-4">
              <AuthPasswordField
                placeholder="Senha" 
                revealClass={styles.d4} 
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                required
              />
              {errors.senha && (
                <span className="text-red-500 text-xs mt-1 ml-1 animate-pulse italic block">
                  {errors.senha}
                </span>
              )}
            </div>

            <div className="mb-4">
              <AuthPasswordField
                placeholder="Confirmar senha"
                revealClass={styles.d5}
                value={formData.confirmarSenha}
                onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                required
              />
              {errors.confirmarSenha && (
                <span className="text-red-500 text-xs mt-1 ml-1 animate-pulse italic block">
                  {errors.confirmarSenha}
                </span>
              )}
            </div>

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