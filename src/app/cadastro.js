"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabaseClient";
import { getAuthErrorMessage } from "../lib/authErrorMessage";
import AuthBackground from "../components/auth/AuthBackground";
import AuthButton from "../components/auth/AuthButton";
import AuthCard from "../components/auth/AuthCard";
import AuthField from "../components/auth/AuthField";
import AuthPasswordField from "../components/auth/AuthPasswordField";
import AuthToast from "../components/auth/AuthToast";
import styles from "../components/auth/auth.module.css";

export default function Cadastro() {
<<<<<<< HEAD
  const router = useRouter();
=======
  const router = useRouter(); 
>>>>>>> 0099def (merge: resolve conflito no cadastro)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });
  
  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });
  const toastTimerRef = useRef(null);

  const showToast = (type, message) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast({ show: true, type, message });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3200);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

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
    
    let currentErrors = { nome: '', email: '', senha: '' };
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

    setErrors(currentErrors);
    if (hasError) return;

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.senha,
      options: {
        data: {
          full_name: formData.nome,
        },
      },
    });

    if (error) {
      showToast("error", getAuthErrorMessage(error, "signup"));
    } else {
<<<<<<< HEAD
      showToast("success", "Cadastro realizado com sucesso!");
      setFormData({ nome: "", email: "", senha: "" });
=======
      toast.success("Cadastro realizado com sucesso!");
      setFormData({ nome: '', email: '', senha: '' });
      setErrors({ nome: '', email: '', senha: '' });
      
>>>>>>> 0099def (merge: resolve conflito no cadastro)
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <>
      <title>Cadastro | La Casa De Sacola</title>
<<<<<<< HEAD

=======
      
>>>>>>> 0099def (merge: resolve conflito no cadastro)
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Quicksand:wght@500;700&display=swap"
        rel="stylesheet"
      />

      <AuthBackground>
        <AuthToast show={toast.show} type={toast.type} message={toast.message} />
        <AuthCard>
          <h1 className={`${styles.reveal} ${styles.d1} ${styles.title} font-extrabold`}>Cadastro</h1>
          <p className={`${styles.reveal} ${styles.d2} ${styles.titleSub} mt-2`}>
            Crie sua conta e personalize sua sacola
          </p>

          <form className={`${styles.formBlock} mt-8 flex flex-col`} onSubmit={handleSignUp}>
<<<<<<< HEAD
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
=======
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
>>>>>>> 0099def (merge: resolve conflito no cadastro)

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
