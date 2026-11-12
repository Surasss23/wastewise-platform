# Supabase setup

WasteWise uses Supabase for authentication, PostgreSQL, file storage and realtime updates.

## 1. Create a project

Create a Supabase project in a region close to Hyderabad (for example, Mumbai if available). Keep the database password private.

## 2. Apply the database migration

Open **SQL Editor** in the Supabase dashboard and run:

`migrations/0001_initial_schema.sql`

This creates the initial data model and row-level security policies for profiles, localities, memberships, reports, report media, report history, collection schedules, pickup requests, community posts, comments, reactions, saved posts, recycling partners, waste-guide entries, notifications and moderation reports.

## 3. Add application environment variables

Copy `.env.example` to `.env.local` for local development and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Use the project URL and publishable/anon key from Supabase Project Settings → API. Never put the service-role key in browser code or commit it to GitHub.

## 4. Before enabling real users

- Configure email authentication and redirect URLs.
- Create a private Storage bucket for report photos.
- Add storage object policies scoped to report access.
- Add verified locality records and membership workflows.
- Add trusted locality managers and collector accounts through a controlled admin process.
- Seed only confirmed collection schedules and verified recycling partners.
- Test every RLS policy with resident, collector, manager and admin accounts.

The migration intentionally does not create fake schedules, partner records or user accounts. Storage policies and the application connection are the next integration task.
