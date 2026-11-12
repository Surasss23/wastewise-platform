# Supabase setup

WasteWise uses Supabase for authentication, PostgreSQL, file storage and realtime updates.

## 1. Project configuration

Project reference: `jyobjiehfovietcvqmnb`

Project URL:
`https://jyobjiehfovietcvqmnb.supabase.co`

The URL is derived from the project reference in your Supabase dashboard URL. Confirm it in **Project Settings → API → Project URL** before deploying.

## 2. Add application environment variables

Copy `.env.example` to `.env.local` for local development and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

The publishable key is designed for browser use with correctly configured Row Level Security. Older projects can use `NEXT_PUBLIC_SUPABASE_ANON_KEY` instead. Never use a `sb_secret_...` key or service-role key in browser code, environment variables prefixed with `NEXT_PUBLIC_`, or GitHub.

For a hosted deployment, add the same two values to your hosting provider's environment-variable settings and redeploy. Do not commit `.env.local`.

## 3. Apply the database migration

Open **SQL Editor** in the Supabase dashboard and run:

`migrations/0001_initial_schema.sql`

This creates the initial data model and row-level security policies for profiles, localities, memberships, reports, report media, report history, collection schedules, pickup requests, community posts, comments, reactions, saved posts, recycling partners, waste-guide entries, notifications and moderation reports.

The SQL file must be run in your Supabase project; connecting the frontend does not apply the schema automatically.

## 4. Configure authentication

In Supabase **Authentication → URL Configuration**, set your deployed site's URL as the Site URL and add these redirect URLs:

- `http://localhost:3000/auth/callback` for local development
- `https://YOUR-DEPLOYED-DOMAIN/auth/callback` for production

Enable email/password sign-in. If email confirmation is enabled, users must confirm their email before signing in.

## 5. Before enabling real users

- Create a private Storage bucket for report photos.
- Add storage object policies scoped to report access.
- Add verified locality records and membership workflows.
- Add trusted locality managers and collector accounts through a controlled admin process.
- Seed only confirmed collection schedules and verified recycling partners.
- Test every RLS policy with resident, collector, manager and admin accounts.

The migration intentionally does not create fake schedules, partner records or user accounts. Storage policies, report submission, and community write workflows remain separate integration tasks. Authentication alone does not grant locality membership or elevated roles.
