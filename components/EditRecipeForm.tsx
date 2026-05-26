"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { Recipe, Tag } from "@/lib/supabase";
import { createClient } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
// Reuse identical panel styles from AddRecipeForm
import styles from "./AddRecipeForm.module.css";

interface EditRecipeFormProps {
  recipe: Recipe;
  allTags: Tag[];
  session: Session | null;
  onClose: () => void;
  onSuccess: (updated: Recipe) => void;
}

export default function EditRecipeForm({
  recipe,
  allTags,
  session,
  onClose,
  onSuccess,
}: EditRecipeFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // Image state — start with existing URL
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(recipe.image_url);
  const [imageClear, setImageClear] = useState(false); // user explicitly removed image
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill form from existing recipe
  const [form, setForm] = useState({
    name: recipe.name,
    servings: recipe.servings?.toString() ?? "",
    ingredients: recipe.ingredients ?? "",
    steps: recipe.steps ?? "",
  });

  // Pre-select existing tags
  const [selectedTags, setSelectedTags] = useState<Set<number>>(
    new Set(recipe.tags?.map((t) => t.id) ?? [])
  );

  // Determine if this user owns the recipe (can persist edits)
  const ownsRecipe =
    session &&
    (recipe.user_id === session.user.id || recipe.user_id === null);

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
    setImageClear(false);
  };

  const handleImageRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    setImageClear(true);
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

    const updatedTags = allTags.filter((t) => selectedTags.has(t.id));

    // ── Local-only update (anonymous, or auth user editing someone else's recipe) ──
    if (!ownsRecipe || recipe.id < 0) {
      const updated: Recipe = {
        ...recipe,
        name: form.name.trim(),
        servings: form.servings ? parseInt(form.servings) : null,
        ingredients: form.ingredients.trim() || null,
        steps: form.steps.trim() || null,
        image_url: imageClear ? null : imagePreview,
        tags: updatedTags,
      };
      setLoading(false);
      onSuccess(updated);
      return;
    }

    // ── Authenticated owner: persist to Supabase ──
    try {
      let image_url: string | null = recipe.image_url ?? null;

      if (imageClear) {
        image_url = null;
      } else if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${session!.user.id}/${Date.now()}.${ext}`;
        const { data: upload, error: uploadErr } = await supabase.storage
          .from("Recipe_Images")
          .upload(path, imageFile, { upsert: false });
        if (uploadErr) throw new Error(`Image upload failed: ${uploadErr.message}`);
        image_url = supabase.storage.from("Recipe_Images").getPublicUrl(upload.path).data.publicUrl;
      }

      const { data: updated, error: updateErr } = await supabase
        .from("recipe")
        .update({
          name: form.name.trim(),
          servings: form.servings ? parseInt(form.servings) : null,
          ingredients: form.ingredients.trim() || null,
          steps: form.steps.trim() || null,
          image_url,
        })
        .eq("id", recipe.id)
        .select()
        .single();
      if (updateErr) throw new Error(updateErr.message);

      // Replace tags: delete existing then insert new set
      await supabase.from("recipe_tags").delete().eq("recipe_id", recipe.id);
      if (selectedTags.size > 0) {
        const { error: tagErr } = await supabase.from("recipe_tags").insert(
          Array.from(selectedTags).map((tag_id) => ({ recipe_id: recipe.id, tag_id }))
        );
        if (tagErr) throw new Error(tagErr.message);
      }

      onSuccess({ ...updated, tags: updatedTags });
      toast.success("Recipe updated!", { description: updated.name });
    } catch (err: any) {
      toast.error("Couldn't save changes", { description: err.message ?? "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Edit recipe">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Edit Recipe</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Image */}
          <div className={styles.imageUpload} onClick={() => fileInputRef.current?.click()} role="button" aria-label="Upload image">
            {imagePreview ? (
              <div className={styles.imagePreviewWrapper}>
                <Image src={imagePreview} alt="Recipe photo" fill className={styles.imagePreviewImg} sizes="520px" />
                <button type="button" className={styles.imageRemoveBtn}
                  onClick={handleImageRemove} aria-label="Remove image">✕</button>
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
            <label className={styles.label} htmlFor="edit-name">Recipe name *</label>
            <input id="edit-name" required className={styles.input} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className={styles.field} style={{ maxWidth: "180px" }}>
            <label className={styles.label} htmlFor="edit-servings">Servings</label>
            <input id="edit-servings" type="number" min="1" className={styles.input} value={form.servings}
              onChange={(e) => setForm({ ...form, servings: e.target.value })} placeholder="4" />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-ingredients">
              Ingredients <span className={styles.hint}>— one per line</span>
            </label>
            <textarea id="edit-ingredients" className={styles.textarea} rows={6} value={form.ingredients}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-steps">
              Method <span className={styles.hint}>— one step per line</span>
            </label>
            <textarea id="edit-steps" className={styles.textarea} rows={8} value={form.steps}
              onChange={(e) => setForm({ ...form, steps: e.target.value })} />
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

          {/* Show notice if user can't persist */}
          {session && !ownsRecipe && (
            <div className={styles.guestNotice} role="note">
              <span className={styles.guestIcon} aria-hidden="true">ℹ️</span>
              <p>This recipe belongs to another user — changes will only apply locally this session.</p>
            </div>
          )}
          {!session && (
            <div className={styles.guestNotice} role="note">
              <span className={styles.guestIcon} aria-hidden="true">👤</span>
              <p>Not signed in — changes will only apply this session.{" "}
                <strong>Sign in with Google to save edits permanently.</strong></p>
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
