# WasteWise

**Community-driven smart waste management platform.**

WasteWise is a neighbourhood-first platform, beginning with a Hyderabad pilot. It brings together waste guidance, issue reporting, collection coordination, community updates, local mapping and verified recycling information.

## Product principles

- Community-first, accessible and mobile responsive.
- Calm, minimal interface: off-white, charcoal and restrained muted-green accents.
- No invented collection schedules, recycler listings or municipal affiliations.
- Clear distinction between preview content and verified live information.
- Privacy-aware reporting, moderation and role-based access.
- Free/open-source-first infrastructure wherever practical.

## Current milestone

The repository includes a responsive product landing page, Supabase email/password authentication, a curated waste guide, a Panjagutta pilot locality, resident membership requests, database schema with row-level security, and private report-media storage policies.

**Not production-ready yet:** report submission and photo upload, resident-facing report history, collector/manager review tools, community publishing, verified schedules, and recycling-partner management still need to be implemented and tested end to end. The current report section is explicitly a preview; it does not create a database report.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS
- Lucide icons
- Supabase (planned: PostgreSQL, Auth, Storage, Realtime and row-level security)
- OpenStreetMap + Leaflet (planned map layer)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment

Copy `.env.example` to `.env.local` after creating the Supabase project. Never commit secret service-role keys.

## Planned modules

1. Resident: reports, waste analyzer, collection calendar, community feed, map, recycling directory and impact.
2. Collector: assigned reports, status updates and before/after verification.
3. Locality manager: verified collection schedules, pickup slots, team assignments and announcements.
4. Recycling partner: verified profile, accepted materials and service areas.
5. Admin: moderation, user/role management, locality configuration, audit logs and platform settings.

## Delivery roadmap

- **Foundation:** responsive app, navigation, design system and waste-guide seed data.
- **Backend foundation:** Supabase schema, authentication, storage policies, RLS and Panjagutta pilot locality.
- **Resident workflows (next):** persistent reports, private photo uploads, approximate location, status tracking and community feed.
- **Operations:** collector dashboard, locality manager tools, verified schedules, pickup requests and notifications.
- **Discovery:** OpenStreetMap/Leaflet, verified recycling directory and educational content.
- **Intelligence:** optional in-browser image classification only after a safe, tested model is selected; always show uncertainty and allow manual correction.
- **Hardening:** accessibility, multilingual English/Telugu/Hindi, abuse reporting, moderation, backups and production checks.

## Important

Collection schedules and recycling-partner details must be supplied and verified by an authorised local source before being shown as live. This project is not an official GHMC service and must not imply municipal endorsement without a formal agreement.
