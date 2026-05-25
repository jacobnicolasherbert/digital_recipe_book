import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const createClient = () =>
  createClientComponentClient({ supabaseUrl, supabaseKey });

// Mirrors public.recipe + image_url (add via ALTER TABLE — see README)
export type Recipe = {
  id: number;
  name: string;
  servings: number | null;
  ingredients: string | null;
  steps: string | null;
  image_url: string | null;
  user_id: string | null;
  created_at: string;
  tags?: Tag[];
};

// Mirrors public.tags
export type Tag = {
  id: number;
  name: string;
};
