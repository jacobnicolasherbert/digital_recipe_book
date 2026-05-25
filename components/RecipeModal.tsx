"use client";

import { useEffect } from "react";
import type { Recipe } from "@/lib/supabase";
import styles from "./RecipeModal.module.css";

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Parse ingredients — newline-separated
  const ingredients = recipe.ingredients
    ? recipe.ingredients.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  // Parse steps — newline-separated, strip leading numbers
  const steps = recipe.steps
    ? recipe.steps.split("\n").map((s) => s.replace(/^\d+\.\s*/, "").trim()).filter(Boolean)
    : [];

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={recipe.name}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.body}>
          {/* Header */}
          <div className={styles.header}>
            {recipe.tags && recipe.tags.length > 0 && (
              <div className={styles.tags}>
                {recipe.tags.map((t) => (
                  <span key={t.id} className={styles.tag}>{t.name}</span>
                ))}
              </div>
            )}

            <h2 className={styles.title}>{recipe.name}</h2>

            {recipe.servings && (
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Serves</span>
                  <span className={styles.statValue}>{recipe.servings}</span>
                </div>
                {ingredients.length > 0 && (
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Ingredients</span>
                    <span className={styles.statValue}>{ingredients.length}</span>
                  </div>
                )}
                {steps.length > 0 && (
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Steps</span>
                    <span className={styles.statValue}>{steps.length}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.divider}><span>✦</span></div>

          <div className={styles.content}>
            {ingredients.length > 0 && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Ingredients</h3>
                <ul className={styles.ingredientList}>
                  {ingredients.map((item, i) => (
                    <li key={i} className={styles.ingredientItem}>
                      <span className={styles.bullet}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {steps.length > 0 && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Method</h3>
                <ol className={styles.instructionList}>
                  {steps.map((step, i) => (
                    <li key={i} className={styles.instructionItem}>
                      <span className={styles.stepNumber}>{i + 1}</span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
