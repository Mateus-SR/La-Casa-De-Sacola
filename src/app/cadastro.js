import Link from "next/link";
import AuthBackground from "../components/auth/AuthBackground";
import AuthButton from "../components/auth/AuthButton";
import AuthCard from "../components/auth/AuthCard";
import AuthField from "../components/auth/AuthField";
import AuthPasswordField from "../components/auth/AuthPasswordField";
import AuthTextLink from "../components/auth/AuthTextLink";
import styles from "../components/auth/auth.module.css";

export default function Cadastro() {
  return (
    <>
      <meta charSet="UTF-8" />
      <title>Cadastro</title>

      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Quicksand:wght@500;700&display=swap"
        rel="stylesheet"
      />

      <AuthBackground>
        <AuthCard>
          <h1 className={`${styles.reveal} ${styles.d1} ${styles.title} font-extrabold`}>Cadastro</h1>
          <p className={`${styles.reveal} ${styles.d2} ${styles.titleSub} mt-2`}>
            Crie sua conta e personalize sua sacola
          </p>

          <form className={`${styles.formBlock} mt-8 flex flex-col`}>
            <AuthField type="text" placeholder="Nome completo" revealClass={styles.d2} />
            <AuthField type="email" placeholder="Email" revealClass={styles.d3} />
            <AuthPasswordField placeholder="Senha" revealClass={styles.d4} />

            <AuthButton type="submit" revealClass={styles.d5}>
              Cadastrar
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
