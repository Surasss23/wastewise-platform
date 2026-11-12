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

Enable email/password sign-in. To allow users to create an account and sign in without waiting for a confirmation email, open **Authentication → Providers → Email** and turn off **Confirm email**. This is a Supabase project setting, not something the website can safely bypass. Keep password recovery enabled.

## 5. Configure private report-photo storage

1. In **Storage → New bucket**, create `report-media` and keep **Public bucket** off.
2. Run `migrations/0002_report_media_storage.sql` in the SQL Editor.
3. Upload objects using this path convention: `<report-uuid>/<filename>`. The report UUID must refer to an existing report, and the caller must own the report or manage its locality.
4. The migration enforces a 10 MB limit and JPEG, PNG, WebP or HEIC MIME types. The bucket remains private; authorized images should be displayed using authenticated downloads or short-lived signed URLs.

The storage policies allow report-access users to view images, report owners/locality managers to upload, and report owners/locality managers to delete. There is intentionally no public read or update policy.

## 6. Public community map and photo posts\n\nAfter the locality seed migration, run `migrations/0005_public_community_map.sql` once. It creates a public, limited-field map view, allows visitors to read published community posts, and creates the `community-waste-photos` public bucket for images intentionally shared with the community. Signed-in users can submit geotagged reports and before/after clean-up photos. These photos are public by design, so do not upload faces, vehicle number plates, private property interiors or other personal information.\n\nThe new workspace uses this migration for public map pins, community activity and report counters. The older `report-media` bucket remains private for any private records.\n\n## 7. Before enabling real users

- Run `migrations/0003_hyderabad_pilot_localities.sql` to seed Panjagutta as the initial pilot and nearby areas as inactive expansion candidates.
- `migrations/0004_resident_membership_requests.sql` is optional for the current public community posting flow. It only enables the separate locality membership request panel; a trusted manager/admin must verify those requests.
- Establish verified resident memberships and trusted locality managers through a controlled admin process.
- Add trusted locality managers and collector accounts through a controlled admin process.
- Seed only confirmed collection schedules and verified recycling partners.
- Test every RLS policy with resident, collector, manager and admin accounts.

The migrations intentionally do not create fake schedules, partner records or user accounts. Confirm the public-photo disclosure and test sign-in, posting, image upload and map display before inviting real users.
