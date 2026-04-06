"use client";

import styles from "./auth.module.css";

export default function AuthBackground({ children }) {
  return <main className={`${styles.animatedPage} ${styles.loginBg} flex min-h-screen items-center justify-center px-4 py-8 lg:justify-end lg:px-0 lg:py-0`}>{children}</main>;
}