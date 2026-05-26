"use client";

import { useState } from "react";
import type { Recipe, Tag } from "@/lib/supabase";
import { createClient } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import RecipeCard from "./RecipeCard";
import RecipeModal from "./RecipeModal";
import AddRecipeForm from "./AddRecipeForm";
import EditRecipeForm from "./EditRecipeForm";
import ConfirmDialog from "./ConfirmDialog";
import styles from "./RecipeGrid.module.css";

interface RecipeGridProps {
  recipes: Recipe[];
  allTags: Tag[];
  session: Session | null;
}

export default function RecipeGrid({ recipes, allTags, session }: RecipeGridProps) {
  const supabase = createClient();

  const [localRecipes, setLocalRecipes] = useState<Recipe[]>(recipes);
  const [activeTag, setActiveTag] = useState<number | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Recipe | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredRecipes = activeTag
    ? localRecipes.filter((r) => r.tags?.some((t) => t.id === activeTag))
    : localRecipes;

  // ── Add ──
  const handleRecipeAdded = (newRecipe: Recipe) => {
    setLocalRecipes((prev) => [newRecipe, ...prev]);
    setShowAddForm(false);
  };

  // ── Edit ──
  const handleRecipeEdited = (updated: Recipe) => {
    setLocalRecipes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    if (selectedRecipe?.id === updated.id) setSelectedRecipe(updated);
    setEditingRecipe(null);
  };

  const openEdit = (recipe: Recipe) => {
    setSelectedRecipe(null);
    setEditingRecipe(recipe);
  };

  // ── Delete ──
  const handleDeleteConfirmed = async () => {
    const recipe = confirmDelete!;
    setConfirmDelete(null);
    // Close modal if it was showing this recipe
    if (selectedRecipe?.id === recipe.id) setSelectedRecipe(null);

    // Optimistic removal
    setLocalRecipes((prev) => prev.filter((r) => r.id !== recipe.id));

    // Local-only recipe (negative id) — nothing to delete in DB
    if (recipe.id < 0) {
      toast.success("Recipe removed");
      return;
    }

    // Supabase delete
    const { error } = await supabase.from("recipe").delete().eq("id", recipe.id);

    if (error) {
      // Rollback
      setLocalRecipes((prev) => {
        // Re-insert at original position by created_at order
        const next = [...prev, recipe];
        next.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return next;
      });
      toast.error(`Couldn't delete "${recipe.name}"`, {
        description: error.message,
      });
    } else {
      toast.success("Recipe deleted", { description: recipe.name });
    }
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
        <button className={styles.addBtn} onClick={() => setShowAddForm(true)} aria-label="Add new recipe">
          <span aria-hidden="true">+</span> Add Recipe
        </button>
      </div>

      {/* Recipe grid */}
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
              onEdit={() => openEdit(recipe)}
              onDelete={() => setConfirmDelete(recipe)}
            />
          ))}
        </div>
      )}

      {/* Recipe detail modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onEdit={() => openEdit(selectedRecipe)}
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

      {/* Edit recipe panel */}
      {editingRecipe && (
        <EditRecipeForm
          recipe={editingRecipe}
          allTags={allTags}
          session={session}
          onClose={() => setEditingRecipe(null)}
          onSuccess={handleRecipeEdited}
        />
      )}

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete recipe?"
          message={`"${confirmDelete.name}" will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          dangerous
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

    </div>
  );
}
