"use client";

import styles from "./auth.module.css";

export default function AuthTextLink({ children, href = "#", alignRight = false, revealClass = styles.reveal }) {
  const alignmentClass = alignRight ? "text-right" : "";

  return (
    <a href={href} className={`${revealClass} ${styles.softLink} ${alignmentClass} text-sm font-medium`}>
      {children}
    </a>
  );
}