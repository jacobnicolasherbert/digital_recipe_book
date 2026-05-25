"use client";

import Image from "next/image";
import type { Recipe } from "@/lib/supabase";
import styles from "./RecipeCard.module.css";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  onEdit: () => void;
}

export default function RecipeCard({ recipe, onClick, onEdit }: RecipeCardProps) {
  const ingredientCount = recipe.ingredients
    ? recipe.ingredients.split("\n").filter(Boolean).length
    : 0;

  return (
    <article
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`View recipe: ${recipe.name}`}
    >
      {/* Image area */}
      <div className={styles.imageWrapper}>
        {/* Decorative placeholder always sits underneath */}
        <div className={styles.imagePlaceholder} aria-hidden="true">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <path d="M24 6C24 6 14 16 14 24C14 32 19 36 24 36C29 36 34 32 34 24C34 16 24 6 24 6Z"
              fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M24 12L24 36M18 20Q24 17 30 20"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Real image overlaid on top */}
        {recipe.image_url && (
          <Image
            src={recipe.image_url}
            alt={recipe.name}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className={styles.image}
          />
        )}

        {/* Edit button — revealed on hover, stops propagation */}
        <button
          className={styles.editBtn}
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          aria-label={`Edit ${recipe.name}`}
        >
          <PencilIcon /> Edit
        </button>

        {/* Tag chips */}
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
          {ingredientCount > 0 && (
            <span className={styles.metaItem}>
              <ListIcon /> {ingredientCount} ingredients
            </span>
          )}
        </div>
      </div>

      <div className={styles.cornerAccent} aria-hidden="true">✦</div>
    </article>
  );
}

function PencilIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9.5 2.5L11.5 4.5L5 11H3V9L9.5 2.5Z"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
