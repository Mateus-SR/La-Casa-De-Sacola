"use client";

import styles from "./auth.module.css";

export default function AuthCard({ children }) {
  return (
    <section className={styles.loginCard}>
      <div className={styles.loginContent}>{children}</div>
    </section>
  );
}