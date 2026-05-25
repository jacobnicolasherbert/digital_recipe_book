"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { Recipe } from "@/lib/supabase";
import styles from "./RecipeModal.module.css";
import SubstitutionPanel from "./SubstitutionPanel";

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onEdit: () => void;
}

export default function RecipeModal({ recipe, onClose, onEdit }: RecipeModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const ingredients = recipe.ingredients
    ? recipe.ingredients.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  const steps = recipe.steps
    ? recipe.steps.split("\n").map((s) => s.replace(/^\d+\.\s*/, "").trim()).filter(Boolean)
    : [];

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={recipe.name}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Top-right controls */}
        <div className={styles.controls}>
          <button className={styles.editBtn} onClick={onEdit} aria-label="Edit recipe">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9.5 2.5L11.5 4.5L5 11H3V9L9.5 2.5Z"
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Edit
          </button>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Hero image */}
        {recipe.image_url && (
          <div className={styles.heroImage}>
            <Image src={recipe.image_url} alt={recipe.name} fill
              sizes="(max-width: 900px) 100vw, 860px" className={styles.image} />
            <div className={styles.imageGradient} />
          </div>
        )}

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

            {(recipe.servings || ingredients.length > 0 || steps.length > 0) && (
              <div className={styles.stats}>
                {recipe.servings && (
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Serves</span>
                    <span className={styles.statValue}>{recipe.servings}</span>
                  </div>
                )}
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

          {/* AI substitution assistant */}
          {ingredients.length > 0 && (
            <SubstitutionPanel
              recipeName={recipe.name}
              ingredients={recipe.ingredients}
            />
          )}
        </div>
      </div>
    </div>
  );
}
