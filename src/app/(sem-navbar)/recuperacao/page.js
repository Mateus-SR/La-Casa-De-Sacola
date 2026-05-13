"use client";

import Link from "next/link";
import AuthBackground from "@/components/auth/AuthBackground";
import AuthButton from "@/components/auth/AuthButton";
import AuthCard from "@/components/auth/AuthCard";
import AuthField from "@/components/auth/AuthField";
import AuthPasswordField from "@/components/auth/AuthPasswordField";
import AuthTextLink from "@/components/auth/AuthTextLink";
import styles from "@/components/auth/auth.module.css";
import useLoginHook from "@/hooks/loginHook.js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import useRecuperacaoHook from "@/hooks/recuperacaoHook";

export default function RecuperacaoSenha() {
  const { email, setEmail, enviado, loading, handleEnviarEmail } =
    useRecuperacaoHook();

  const router = useRouter();

  return (
    <>
      <meta charSet="UTF-8" />
      <title>Recuperação de Senha</title>

      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Quicksand:wght@500;700&display=swap"
        rel="stylesheet"
      />

      <AuthBackground>
        <AuthCard>
          <button
            onClick={() => router.push("/login")}
            className={`${styles.reveal} ${styles.d1} flex items-center gap-2 text-sm font-medium text-[#6b9e8a] hover:text-[#3ca779] transition-colors -ml-2 -mt-2 mb-2`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Voltar
          </button>

          <h1
            className={`${styles.reveal} ${styles.d1} ${styles.title} font-extrabold`}
          >
            Recuperação de Senha
          </h1>

          <p
            className={`${styles.reveal} ${styles.d2} ${styles.titleSub} mt-2`}
          >
            Digite seu email para receber as instruções de recuperação de senha
          </p>

          <form
            onSubmit={handleEnviarEmail}
            className={`${styles.formBlock} mt-8 flex flex-col`}
          >
            <AuthField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />

            <AuthButton type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Instruções"}
            </AuthButton>
          </form>

          {enviado && (
            <p className="text-center text-[#3ca779] mt-4 text-sm">
              Email enviado! Verifique sua caixa de entrada.
            </p>
          )}
        </AuthCard>
      </AuthBackground>
    </>
  );
}
