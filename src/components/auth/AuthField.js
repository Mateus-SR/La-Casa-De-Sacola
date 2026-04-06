"use client";

import styles from "./auth.module.css";

export default function AuthField({ type, placeholder, revealClass = styles.d2 }) {
  return (
    <div className={`${styles.reveal} ${revealClass} ${styles.tagField}`}>
      <span className={styles.tagHole} />
      <input type={type} placeholder={placeholder} className={`${styles.formControl} rounded-xl p-4 outline-none`} />
    </div>
  );
}