"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthBackground from "../components/auth/AuthBackground";
import AuthButton from "../components/auth/AuthButton";
import AuthCard from "../components/auth/AuthCard";
import AuthField from "../components/auth/AuthField";
import AuthPasswordField from "../components/auth/AuthPasswordField";
import AuthTextLink from "../components/auth/AuthTextLink";
import styles from "../components/auth/auth.module.css";

export default function NovaSenha() {
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [autorizado, setAutorizado] = useState(false);
  const router = useRouter();

  const handleNovaSenha = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: senha });

    if (error) {
      toast.error("Não foi possível atualizar a senha.");
    } else {
      toast.success("Senha atualizada!");
      setTimeout(() => router.push("/login"), 2000);
    }

    setLoading(false);
  };

  useEffect(() => {
      const hash = window.location.hash;

      if (hash.includes("type=recovery")) {
        setAutorizado(true);
      } else {
        toast.error("Acesso não autorizado.");
        router.push("/recuperacao");
      }
    }, []);
    if (!autorizado) return null;

  return (
    <AuthBackground>
      <AuthCard>
        <h1
          className={`${styles.reveal} ${styles.d1} ${styles.title} font-extrabold`}
        >
          Nova Senha
        </h1>

        <p className={`${styles.reveal} ${styles.d2} ${styles.titleSub} mt-2`}>
          Digite sua nova senha
        </p>

        <form
          onSubmit={handleNovaSenha}
          className={`${styles.formBlock} mt-8 flex flex-col`}
        >
          <AuthPasswordField
            placeholder="Nova Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required={true}
          />

          <AuthButton type="submit" disabled={loading}>
            Salvar Nova Senha
          </AuthButton>
        </form>
      </AuthCard>
    </AuthBackground>
  );
}
