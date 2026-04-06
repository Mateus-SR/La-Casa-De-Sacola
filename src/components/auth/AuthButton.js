"use client";

import styles from "./auth.module.css";

export default function AuthButton({ children, type = "button", revealClass = styles.d5 }) {
  return (
    <button type={type} className={`${styles.reveal} ${revealClass} ${styles.loginBtn} mt-2 rounded-xl p-4 text-base font-bold shadow-lg`}>
      <span className={styles.btnLabel}>{children}</span>
    </button>
  );
}