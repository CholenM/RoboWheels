# RoboWheels × 2026 NSTW — Online Evaluation Dashboard

A kid- and adult-friendly trilingual (**English**, **Tagalog**, **Bisaya**) emoji evaluation kiosk and live records dashboard built with **Next.js**, **Tailwind CSS**, and **Supabase** (ready to deploy on **Vercel**).

## Features
- **Highlighted Dual-Brand Header & Hero:** Showcases both the **RoboWheels ("Innovation for Every-Juan")** and **2026 NSTW** logos.
- **Trilingual Kiosk Flow:** `Language Choice (EN / TL / CEB)` → `Enter Name (or Skip for Anonymous)` → `6 One-Per-Screen Emoji & Yes/No Questions` → `Thank You + Reset Button`.
- **Records & Analytics Dashboard (`/records`):** Live KPI cards, per-question rating bars, language breakdown, first-time robot interactor split, searchable/filterable table, and one-click **Export CSV** (`Name, Language, Q1–Q6, Date`).
- **Supabase + Offline/Local Fallback:** Syncs to Supabase when configured, and seamlessly falls back to browser `localStorage` for instant local testing.

---

## 1. Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Connect Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New Query**, paste the contents of `supabase/schema.sql`, and click **Run**.
3. Go to **Project Settings → API** and copy your **Project URL** and **anon public key**.
4. Create a `.env.local` file (based on `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Restart `npm run dev`. The `/records` page badge will automatically switch from **Local Browser Mode** to **Supabase Live**.

---

## 3. Deploy to Vercel

1. Push this repository to GitHub (or import directly into [vercel.com](https://vercel.com)).
2. In Vercel **Project Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Click **Deploy** — Vercel will automatically build and host your dashboard!
