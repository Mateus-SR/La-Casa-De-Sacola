"use client";

import styles from "./auth.module.css";

// Adicionei 'value' e 'onChange' às propriedades recebidas
export default function AuthField({ type, placeholder, value, onChange, revealClass = styles.d2 }) {
  return (
    <div className={`${styles.reveal} ${revealClass} ${styles.tagField}`}>
      <span className={styles.tagHole} />
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} // Define o valor do input
        onChange={onChange} // Captura a mudança de texto
        className={`${styles.formControl} rounded-xl p-4 outline-none`} 
      />
    </div>
  );
}