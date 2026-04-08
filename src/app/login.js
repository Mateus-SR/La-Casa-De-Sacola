"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AuthBackground from "../components/auth/AuthBackground";
import AuthButton from "../components/auth/AuthButton";
import AuthCard from "../components/auth/AuthCard";
import AuthField from "../components/auth/AuthField";
import AuthPasswordField from "../components/auth/AuthPasswordField";
import AuthTextLink from "../components/auth/AuthTextLink";
import AuthToast from "../components/auth/AuthToast";
import styles from "../components/auth/auth.module.css";
import useLoginHook from "../hooks/loginHook.js";

export default function Login() {
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

  const { formData, setFormData, loading, handleSignIn } = useLoginHook({
    onError: (message) => showToast("error", message),
    onSuccess: (message) => showToast("success", message),
  });
  return (
    <>
      <meta charSet="UTF-8" />
      <title>Login</title>

      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Quicksand:wght@500;700&display=swap"
        rel="stylesheet"
      />

      <AuthBackground>
        <AuthToast show={toast.show} type={toast.type} message={toast.message} />
        <AuthCard>
          <h1 className={`${styles.reveal} ${styles.d1} ${styles.title} font-extrabold`}>Login</h1>
          <p className={`${styles.reveal} ${styles.d2} ${styles.titleSub} mt-2`}>
            Entre e transforme suas sacolas em parte da sua marca
          </p>

          <form onSubmit={handleSignIn} className={`${styles.formBlock} mt-8 flex flex-col`}>
            <AuthField
              type="email"
              placeholder="Email"
              revealClass={styles.d2}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <AuthPasswordField
              placeholder="Senha"
              revealClass={styles.d3}
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              required
            />

            <AuthTextLink href="#" alignRight revealClass={`${styles.reveal} ${styles.d4}`}>
              Esqueci minha senha
            </AuthTextLink>

            <AuthButton type="submit" revealClass={styles.d5} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </AuthButton>
          </form>

          <p className={`${styles.reveal} ${styles.d5} mt-7 text-center text-[#3f705d]`}>
            Nao tem conta?{" "}
            <Link href="/cadastro" className={`${styles.softLink} font-semibold underline-offset-4 hover:underline`}>
              Criar conta
            </Link>
          </p>
        </AuthCard>
      </AuthBackground>
    </>
  );
}