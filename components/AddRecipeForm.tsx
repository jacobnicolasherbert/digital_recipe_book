"use client";

import { useState, useEffect } from "react";
import type { Recipe, Tag } from "@/lib/supabase";
import { createClient } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import styles from "./AddRecipeForm.module.css";

interface AddRecipeFormProps {
  allTags: Tag[];
  session: Session | null;
  onClose: () => void;
  onSuccess: (recipe: Recipe) => void;
}

export default function AddRecipeForm({ allTags, session, onClose, onSuccess }: AddRecipeFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Tag IDs are bigint → number
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());

  const [form, setForm] = useState({
    name: "",
    servings: "",
    ingredients: "",
    steps: "",
  });

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const toggleTag = (tagId: number) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tagId) ? next.delete(tagId) : next.add(tagId);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    setError(null);

    // ── Anonymous: local-only, nothing persisted ──
    if (!session) {
      const localRecipe: Recipe = {
        id: -Date.now(),                          // negative so it never clashes with real bigint PKs
        name: form.name.trim(),
        servings: form.servings ? parseInt(form.servings) : null,
        ingredients: form.ingredients.trim() || null,
        steps: form.steps.trim() || null,
        user_id: null,
        created_at: new Date().toISOString(),
        tags: allTags.filter((t) => selectedTags.has(t.id)),
      };
      setLoading(false);
      onSuccess(localRecipe);
      return;
    }

    // ── Authenticated: persist to Supabase ──
    try {
      const { data: newRecipe, error: insertError } = await supabase
        .from("recipe")
        .insert({
          name: form.name.trim(),
          servings: form.servings ? parseInt(form.servings) : null,
          ingredients: form.ingredients.trim() || null,
          steps: form.steps.trim() || null,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);

      if (selectedTags.size > 0) {
        const tagRows = Array.from(selectedTags).map((tag_id) => ({
          recipe_id: newRecipe.id,
          tag_id,
        }));
        const { error: tagError } = await supabase.from("recipe_tags").insert(tagRows);
        if (tagError) throw new Error(tagError.message);
      }

      const tags = allTags.filter((t) => selectedTags.has(t.id));
      onSuccess({ ...newRecipe, tags });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Add recipe"
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>New Recipe</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close form">✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Name */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">Recipe name *</label>
            <input
              id="name"
              required
              className={styles.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Lemon Tart"
            />
          </div>

          {/* Servings */}
          <div className={styles.field} style={{ maxWidth: "180px" }}>
            <label className={styles.label} htmlFor="servings">Servings</label>
            <input
              id="servings"
              type="number"
              min="1"
              className={styles.input}
              value={form.servings}
              onChange={(e) => setForm({ ...form, servings: e.target.value })}
              placeholder="4"
            />
          </div>

          {/* Ingredients */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ingredients">
              Ingredients
              <span className={styles.hint}> — one per line</span>
            </label>
            <textarea
              id="ingredients"
              className={styles.textarea}
              rows={6}
              value={form.ingredients}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
              placeholder={"200g plain flour\n3 large eggs\n1 tsp vanilla extract"}
            />
          </div>

          {/* Steps */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="steps">
              Method
              <span className={styles.hint}> — one step per line</span>
            </label>
            <textarea
              id="steps"
              className={styles.textarea}
              rows={8}
              value={form.steps}
              onChange={(e) => setForm({ ...form, steps: e.target.value })}
              placeholder={"Preheat the oven to 180°C.\nMix flour and eggs until smooth.\nBake for 25 minutes."}
            />
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className={styles.field}>
              <span className={styles.label}>Tags</span>
              <div className={styles.tagGrid}>
                {allTags.map((tag) => (
                  <label key={tag.id} className={styles.tagLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedTags.has(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                    />
                    <span className={`${styles.tagChip} ${selectedTags.has(tag.id) ? styles.tagChipActive : ""}`}>
                      {tag.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Guest notice */}
          {!session && (
            <div className={styles.guestNotice} role="note">
              <span className={styles.guestIcon} aria-hidden="true">👤</span>
              <p>
                You&rsquo;re not signed in. Your recipe will appear this session
                only.{" "}
                <strong>Sign in with Google to save it permanently.</strong>
              </p>
            </div>
          )}

          {error && <p className={styles.error} role="alert">{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Saving…" : "Add to cookbook"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
