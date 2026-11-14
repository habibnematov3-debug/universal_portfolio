# Portfolio

Student portfolio service for the existing GitHub Pages site. Each signed-in person chooses a username, edits their information, and shares a permanent public link. Profile data and uploaded images are stored in Supabase.

## Supabase setup

1. Create a Supabase project.
2. In SQL Editor run `supabase/migrations/001_profiles.sql`. This creates `profiles`, row access policies, and the public `avatars` and `project-images` buckets.
3. In Authentication / Sign In / Providers, enable Email. Enable Google only after configuring Google OAuth credentials in both Google Cloud and Supabase.
4. In Authentication / URL Configuration, set Site URL to `https://habibnematov3-debug.github.io/universal_portfolio/`. Add redirect URLs `https://habibnematov3-debug.github.io/universal_portfolio/auth/callback/` and `https://habibnematov3-debug.github.io/universal_portfolio/auth/confirm/`.
5. Copy the project URL and publishable key into `.env.local` using `.env.example` as a guide. Never use a service role key in the browser.

Supabase default email sending is rate limited and intended for testing. Configure custom SMTP before offering email login to customers.

## Run locally

Use Node.js 22 or newer. Run `npm install`, create `.env.local`, then `npm run dev`. Visit `http://localhost:3000/universal_portfolio/`.

## Publish to GitHub Pages

The `main` branch workflow builds `dist` and deploys it to GitHub Pages. In repository Settings / Pages choose GitHub Actions as the publishing source. The workflow includes the public Supabase URL and publishable key; database access is restricted by row policies in the migration.

A username is served through GitHub Pages' 404 fallback and rendered by the browser after it loads profile data. This preserves clean links such as `https://habibnematov3-debug.github.io/universal_portfolio/xabib`, but search crawlers and social link previews cannot read per-profile content before JavaScript runs.
