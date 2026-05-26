"use client";

import { useEffect } from "react";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  type?: "error" | "success";
  onDismiss: () => void;
  duration?: number;
}

export default function Toast({ message, type = "error", onDismiss, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div className={`${styles.toast} ${type === "error" ? styles.error : styles.success}`} role="alert" aria-live="assertive">
      <span className={styles.icon} aria-hidden="true">
        {type === "error" ? "✕" : "✓"}
      </span>
      <p className={styles.message}>{message}</p>
      <button className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">✕</button>
    </div>
  );
}
