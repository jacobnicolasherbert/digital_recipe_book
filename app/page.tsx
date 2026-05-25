import { createServerClient } from "@/lib/supabase-server";
import Header from "@/components/Header";
import RecipeGrid from "@/components/RecipeGrid";
import type { Recipe, Tag } from "@/lib/supabase";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Fetch recipes with their tags
  const { data: recipes } = await supabase
    .from("recipe")
    .select(`*, recipe_tags ( tags ( id, name ) )`)
    .order("created_at", { ascending: false });

  // Flatten tag joins and attach computed image_url
  const formattedRecipes: Recipe[] = (recipes ?? []).map((r: any) => ({
    ...r,
    tags: r.recipe_tags?.map((rt: any) => rt.tags).filter(Boolean) ?? [],
  }));

  // Fetch all tags for the add/edit forms
  const { data: allTags } = await supabase.from("tags").select("*").order("name");

  return (
    <div className={styles.page}>
      <Header session={session} />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>A collection of cherished dishes</p>
          <h1 className={styles.heroTitle}>The Recipe Book</h1>
          <p className={styles.heroSubtitle}>
            Handcrafted recipes passed down, perfected over time, and gathered
            here for good keeping.
          </p>
          <div className={styles.heroDivider}><span>✦</span></div>
        </div>
        <div className={styles.heroIllustration} aria-hidden="true">
          <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 280 Q80 220 60 180 Q40 140 50 100 Q60 60 100 40 Q140 60 150 100 Q160 140 140 180 Q120 220 100 280Z"
              fill="none" stroke="#c49a3c" strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>
            <circle cx="100" cy="40" r="8" fill="none" stroke="#6b7b5a" strokeWidth="1.5" opacity="0.5"/>
            <path d="M70 120 Q50 110 40 90" stroke="#6b7b5a" strokeWidth="1" opacity="0.4"/>
            <circle cx="38" cy="87" r="5" fill="none" stroke="#6b7b5a" strokeWidth="1" opacity="0.4"/>
            <path d="M130 120 Q150 110 160 90" stroke="#6b7b5a" strokeWidth="1" opacity="0.4"/>
            <circle cx="162" cy="87" r="5" fill="none" stroke="#6b7b5a" strokeWidth="1" opacity="0.4"/>
            <path d="M85 200 Q65 195 55 178" stroke="#b84c21" strokeWidth="1" opacity="0.3"/>
            <path d="M115 200 Q135 195 145 178" stroke="#b84c21" strokeWidth="1" opacity="0.3"/>
          </svg>
        </div>
      </section>

      <main className={styles.main}>
        <RecipeGrid
          recipes={formattedRecipes}
          allTags={allTags ?? []}
          session={session}
        />
      </main>

      <footer className={styles.footer}>
        <p>Made with care &amp; good ingredients.</p>
      </footer>
    </div>
  );
}
