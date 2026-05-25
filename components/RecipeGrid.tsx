"use client";

import { useState } from "react";
import type { Recipe, Tag } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import RecipeCard from "./RecipeCard";
import RecipeModal from "./RecipeModal";
import AddRecipeForm from "./AddRecipeForm";
import styles from "./RecipeGrid.module.css";

interface RecipeGridProps {
  recipes: Recipe[];
  allTags: Tag[];
  session: Session | null;
}

export default function RecipeGrid({ recipes, allTags, session }: RecipeGridProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [localRecipes, setLocalRecipes] = useState<Recipe[]>(recipes);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredRecipes = activeTag
    ? localRecipes.filter((r) => r.tags?.some((t) => t.id === activeTag))
    : localRecipes;

  const handleRecipeAdded = (newRecipe: Recipe) => {
    setLocalRecipes((prev) => [newRecipe, ...prev]);
    setShowAddForm(false);
  };

  return (
    <div>
      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <div className={styles.tagBar}>
          <button
            className={`${styles.tagPill} ${activeTag === null ? styles.tagPillActive : ""}`}
            onClick={() => setActiveTag(null)}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag.id}
              className={`${styles.tagPill} ${activeTag === tag.id ? styles.tagPillActive : ""}`}
              onClick={() => setActiveTag(activeTag === tag.id ? null : tag.id)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {/* Section header + add button */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {activeTag
            ? allTags.find((t) => t.id === activeTag)?.name ?? "Recipes"
            : "All Recipes"}
        </h2>
        <span className={styles.recipeCount}>{filteredRecipes.length} recipes</span>
        <button
          className={styles.addBtn}
          onClick={() => setShowAddForm(true)}
          aria-label="Add new recipe"
        >
          <span aria-hidden="true">+</span> Add Recipe
        </button>
      </div>

      {/* Grid */}
      {filteredRecipes.length === 0 ? (
        <div className={styles.empty}>
          <p>No recipes yet — be the first to add one!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
            />
          ))}
        </div>
      )}

      {/* Recipe detail modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Add recipe panel */}
      {showAddForm && (
        <AddRecipeForm
          allTags={allTags}
          session={session}
          onClose={() => setShowAddForm(false)}
          onSuccess={handleRecipeAdded}
        />
      )}
    </div>
  );
}
