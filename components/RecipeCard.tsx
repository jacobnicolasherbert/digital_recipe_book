"use client";

import type { Recipe } from "@/lib/supabase";
import styles from "./RecipeCard.module.css";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <article
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`View recipe: ${recipe.name}`}
    >
      {/* Decorative placeholder — no image_url in schema */}
      <div className={styles.imageWrapper} aria-hidden="true">
        <div className={styles.imagePlaceholder}>
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 6C24 6 14 16 14 24C14 32 19 36 24 36C29 36 34 32 34 24C34 16 24 6 24 6Z"
              fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            />
            <path
              d="M24 12L24 36M18 20Q24 17 30 20"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Tags overlay on the placeholder */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className={styles.tagOverlay}>
            {recipe.tags.slice(0, 2).map((tag) => (
              <span key={tag.id} className={styles.tag}>{tag.name}</span>
            ))}
            {recipe.tags.length > 2 && (
              <span className={styles.tag}>+{recipe.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{recipe.name}</h3>
        <div className={styles.meta}>
          {recipe.servings && (
            <span className={styles.metaItem}>
              <ServingsIcon /> {recipe.servings} servings
            </span>
          )}
          {recipe.ingredients && (
            <span className={styles.metaItem}>
              <ListIcon />
              {recipe.ingredients.split("\n").filter(Boolean).length} ingredients
            </span>
          )}
        </div>
      </div>

      <div className={styles.cornerAccent} aria-hidden="true">✦</div>
    </article>
  );
}

function ServingsIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M4 3C4 3 2 5 2 7C2 9 3 11 7 11C11 11 12 9 12 7C12 5 10 3 10 3"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7 7L7 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 4h10M2 7h10M2 10h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
