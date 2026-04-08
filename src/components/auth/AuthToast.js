import styles from "./auth.module.css";

export default function AuthToast({ show, type = "success", message }) {
  if (!show || !message) {
    return null;
  }

  const isError = type === "error";

  return (
    <div className={styles.toastContainer} aria-live="polite" aria-atomic="true">
      <div
        className={`${styles.toast} ${isError ? styles.toastError : styles.toastSuccess}`}
        role="status"
      >
        <span className={styles.toastIcon}>{isError ? "!" : "✓"}</span>
        <div>
          <p className={styles.toastTitle}>{isError ? "Não foi possível" : "Sucesso"}</p>
          <p className={styles.toastMessage}>{message}</p>
        </div>
      </div>
    </div>
  );
}