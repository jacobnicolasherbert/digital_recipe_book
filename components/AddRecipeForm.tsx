"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    servings: "",
    ingredients: "",
    steps: "",
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

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

    // ── Anonymous: local only ──
    if (!session) {
      const localRecipe: Recipe = {
        id: -Date.now(),
        name: form.name.trim(),
        servings: form.servings ? parseInt(form.servings) : null,
        ingredients: form.ingredients.trim() || null,
        steps: form.steps.trim() || null,
        image_url: imagePreview,
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
      let image_url: string | null = null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${session.user.id}/${Date.now()}.${ext}`;
        const { data: upload, error: uploadErr } = await supabase.storage
          .from("Recipe_Images")
          .upload(path, imageFile, { upsert: false });
        if (uploadErr) throw new Error(`Image upload failed: ${uploadErr.message}`);
        image_url = supabase.storage.from("Recipe_Images").getPublicUrl(upload.path).data.publicUrl;
      }

      const { data: newRecipe, error: insertErr } = await supabase
        .from("recipe")
        .insert({
          name: form.name.trim(),
          servings: form.servings ? parseInt(form.servings) : null,
          ingredients: form.ingredients.trim() || null,
          steps: form.steps.trim() || null,
          image_url,
          user_id: session.user.id,
        })
        .select()
        .single();
      if (insertErr) throw new Error(insertErr.message);

      if (selectedTags.size > 0) {
        const { error: tagErr } = await supabase.from("recipe_tags").insert(
          Array.from(selectedTags).map((tag_id) => ({ recipe_id: newRecipe.id, tag_id }))
        );
        if (tagErr) throw new Error(tagErr.message);
      }

      onSuccess({ ...newRecipe, tags: allTags.filter((t) => selectedTags.has(t.id)) });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Add recipe">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>New Recipe</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Image upload */}
          <div className={styles.imageUpload} onClick={() => fileInputRef.current?.click()} role="button" aria-label="Upload image">
            {imagePreview ? (
              <div className={styles.imagePreviewWrapper}>
                <Image src={imagePreview} alt="Preview" fill className={styles.imagePreviewImg} sizes="520px" />
                <button type="button" className={styles.imageRemoveBtn}
                  onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                  aria-label="Remove image">✕</button>
              </div>
            ) : (
              <div className={styles.imagePlaceholder}>
                <span className={styles.uploadIcon} aria-hidden="true">📷</span>
                <p>Click to add a photo</p>
                <p className={styles.uploadHint}>JPEG, PNG, WebP — max 5 MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className={styles.hiddenInput} onChange={handleImageChange} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="add-name">Recipe name *</label>
            <input id="add-name" required className={styles.input} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Lemon Tart" />
          </div>

          <div className={styles.field} style={{ maxWidth: "180px" }}>
            <label className={styles.label} htmlFor="add-servings">Servings</label>
            <input id="add-servings" type="number" min="1" className={styles.input} value={form.servings}
              onChange={(e) => setForm({ ...form, servings: e.target.value })} placeholder="4" />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="add-ingredients">
              Ingredients <span className={styles.hint}>— one per line</span>
            </label>
            <textarea id="add-ingredients" className={styles.textarea} rows={6} value={form.ingredients}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
              placeholder={"200g plain flour\n3 large eggs\n1 tsp vanilla"} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="add-steps">
              Method <span className={styles.hint}>— one step per line</span>
            </label>
            <textarea id="add-steps" className={styles.textarea} rows={8} value={form.steps}
              onChange={(e) => setForm({ ...form, steps: e.target.value })}
              placeholder={"Preheat oven to 180°C.\nMix flour and eggs.\nBake 25 minutes."} />
          </div>

          {allTags.length > 0 && (
            <div className={styles.field}>
              <span className={styles.label}>Tags</span>
              <div className={styles.tagGrid}>
                {allTags.map((tag) => (
                  <label key={tag.id} className={styles.tagLabel}>
                    <input type="checkbox" className={styles.checkbox}
                      checked={selectedTags.has(tag.id)} onChange={() => toggleTag(tag.id)} />
                    <span className={`${styles.tagChip} ${selectedTags.has(tag.id) ? styles.tagChipActive : ""}`}>
                      {tag.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {!session && (
            <div className={styles.guestNotice} role="note">
              <span className={styles.guestIcon} aria-hidden="true">👤</span>
              <p>Not signed in — this recipe will appear this session only.{" "}
                <strong>Sign in with Google to save it permanently.</strong></p>
            </div>
          )}

          {error && <p className={styles.error} role="alert">{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Saving…" : "Add to cookbook"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
