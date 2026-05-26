# 📖 The Recipe Book

A beautiful digital cookbook built with Next.js 14 and Supabase — collect, organise, and share recipes with a warm, editorial aesthetic.

## Features

- **Recipe cards** — click any card to open a full-detail modal (ingredients, method, timing)
- **Google OAuth** — one-click sign-in via Supabase Auth
- **Add recipes** — slide-in form with image upload (Supabase Storage) and tag checkboxes
- **Tag filtering** — filter the grid by category
- **Responsive** — works on mobile and desktop

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-username/digital-cookbook.git
cd digital-cookbook
npm install
```

### 2. Set up Supabase tables

Run this SQL in your Supabase project's SQL editor:

```sql
-- Recipes table
create table recipe (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  ingredients text,
  instructions text,
  prep_time int,
  cook_time int,
  servings int,
  image_url text,
  created_at timestamptz default now()
);

-- Tags lookup table
create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- Join table
create table recipe_tags (
  recipe_id uuid references recipe(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (recipe_id, tag_id)
);

-- Enable Row Level Security
alter table recipe enable row level security;
alter table tags enable row level security;
alter table recipe_tags enable row level security;

-- Public reads
create policy "Public read recipes" on recipe for select using (true);
create policy "Public read tags" on tags for select using (true);
create policy "Public read recipe_tags" on recipe_tags for select using (true);

-- Authenticated writes
create policy "Auth insert recipe" on recipe for insert with check (auth.role() = 'authenticated');
create policy "Auth insert recipe_tags" on recipe_tags for insert with check (auth.role() = 'authenticated');
```

### 3. Create the storage bucket

Supabase dashboard → Storage → New bucket:
- **Name:** `Recipe_Images`
- **Public:** ✅

### 4. Enable Google OAuth

Supabase dashboard → Authentication → Providers → Google:
1. Enable the Google provider and paste in your Client ID + Secret from Google Cloud Console
2. In Google Cloud Console, add `https://<your-supabase-ref>.supabase.co/auth/v1/callback` as an authorised redirect URI

### 5. Environment variables

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 6. Run locally

```bash
npm run dev
# open http://localhost:3000
```

---

## Project Structure

```
app/
  layout.tsx                  # Root layout, fonts
  globals.css                 # CSS design tokens & global styles
  page.tsx                    # Homepage (server component, fetches recipes)
  page.module.css
  api/auth/callback/route.ts  # Google OAuth callback

components/
  Header.tsx / .module.css          # Sticky header + Google sign-in button
  RecipeGrid.tsx / .module.css      # Client-side grid with tag filter + state
  RecipeCard.tsx / .module.css      # Individual card with hover animations
  RecipeModal.tsx / .module.css     # Full-detail modal (ingredients + method)
  AddRecipeForm.tsx / .module.css   # Slide-in drawer with image upload + tags

lib/
  supabase.ts         # createClient() + shared types
  supabase-server.ts  # Server-component Supabase client
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — then add your production URL to Supabase Auth allowed redirects and Google Cloud Console
