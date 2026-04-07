"use client";

import styles from "./auth.module.css";

// Adicionada a propriedade 'disabled' com valor padrão 'false'
export default function AuthButton({ children, type = "button", disabled = false, revealClass = styles.d5 }) {
  return (
    <button 
      type={type} 
      disabled={disabled} // Aplica o estado de desativado ao botão
      className={`${styles.reveal} ${revealClass} ${styles.loginBtn} mt-2 rounded-xl p-4 text-base font-bold shadow-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className={styles.btnLabel}>{children}</span>
    </button>
  );
}