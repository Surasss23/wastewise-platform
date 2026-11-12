-- WasteWise initial data model
-- Apply in Supabase SQL Editor. All user-facing data is protected by RLS.
create extension if not exists pgcrypto;

create type public.app_role as enum ('resident', 'collector', 'locality_manager', 'recycling_partner', 'admin');
create type public.report_status as enum ('submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'rejected');
create type public.report_category as enum ('missed_collection', 'garbage_hotspot', 'overflowing_bin', 'illegal_dumping', 'segregation');
create type public.waste_category as enum ('wet', 'dry', 'sanitary', 'special_care');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  preferred_language text not null default 'en' check (preferred_language in ('en','te','hi')),
  role public.app_role not null default 'resident',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.localities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null default 'Hyderabad',
  state text not null default 'Telangana',
  country text not null default 'India',
  description text,
  boundary_geojson jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(name, city, state)
);

create table public.locality_memberships (
  id uuid primary key default gen_random_uuid(),
  locality_id uuid not null references public.localities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  membership_role public.app_role not null default 'resident',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique(locality_id, user_id)
);

create table public.waste_reports (
  id uuid primary key default gen_random_uuid(),
  locality_id uuid not null references public.localities(id),
  reporter_id uuid references public.profiles(id) on delete set null,
  category public.report_category not null,
  title text not null,
  description text not null,
  address_label text,
  latitude double precision,
  longitude double precision,
  is_anonymous boolean not null default false,
  status public.report_status not null default 'submitted',
  assigned_collector_id uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_latitude check (latitude is null or latitude between -90 and 90),
  constraint valid_longitude check (longitude is null or longitude between -180 and 180)
);

create table public.report_media (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.waste_reports(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  storage_path text not null,
  media_kind text not null default 'photo' check (media_kind in ('photo','video')),
  stage text not null default 'report' check (stage in ('report','before','after')),
  created_at timestamptz not null default now()
);

create table public.report_events (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.waste_reports(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  old_status public.report_status,
  new_status public.report_status not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.collection_schedules (
  id uuid primary key default gen_random_uuid(),
  locality_id uuid not null references public.localities(id) on delete cascade,
  waste_category public.waste_category not null,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  service_area text,
  instructions text,
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time)
);

create table public.pickup_requests (
  id uuid primary key default gen_random_uuid(),
  locality_id uuid not null references public.localities(id),
  resident_id uuid not null references public.profiles(id),
  waste_category public.waste_category not null,
  requested_date date not null,
  requested_window text,
  address_label text not null,
  notes text,
  status text not null default 'requested' check (status in ('requested','accepted','assigned','completed','cancelled')),
  assigned_collector_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  locality_id uuid not null references public.localities(id),
  author_id uuid references public.profiles(id) on delete set null,
  post_type text not null default 'update' check (post_type in ('update','report','tip','recycling')),
  title text not null,
  body text not null,
  linked_report_id uuid references public.waste_reports(id) on delete set null,
  is_anonymous boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.post_reactions (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction text not null default 'helpful' check (reaction in ('helpful','thanks')),
  created_at timestamptz not null default now(),
  primary key(post_id, user_id, reaction)
);

create table public.saved_posts (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(post_id, user_id)
);

create table public.recycling_partners (
  id uuid primary key default gen_random_uuid(),
  locality_id uuid references public.localities(id) on delete set null,
  name text not null,
  description text,
  accepted_materials text[] not null default '{}',
  service_area text,
  address text,
  phone text,
  website text,
  verification_status text not null default 'pending' check (verification_status in ('pending','verified','rejected')),
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.waste_guide_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category public.waste_category not null,
  keywords text[] not null default '{}',
  reason text not null,
  preparation text not null,
  destination text not null,
  language text not null default 'en' check (language in ('en','te','hi')),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.moderation_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  target_type text not null check (target_type in ('post','comment','waste_report','partner')),
  target_id uuid not null,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open','reviewing','actioned','dismissed')),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index waste_reports_locality_status_idx on public.waste_reports(locality_id, status, created_at desc);
create index waste_reports_geo_idx on public.waste_reports(latitude, longitude);
create index community_posts_locality_created_idx on public.community_posts(locality_id, created_at desc);
create index collection_schedules_locality_day_idx on public.collection_schedules(locality_id, weekday);
create index pickup_requests_resident_idx on public.pickup_requests(resident_id, requested_date desc);
create index notifications_user_unread_idx on public.notifications(user_id, created_at desc) where read_at is null;
create index partner_locality_verified_idx on public.recycling_partners(locality_id, verification_status) where is_active = true;

-- Role lookup is SECURITY DEFINER to avoid recursive profile RLS checks.
create or replace function public.current_app_role()
returns public.app_role
language sql stable security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_locality_manager(target_locality uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.locality_memberships
    where user_id = auth.uid()
      and locality_id = target_locality
      and membership_role in ('locality_manager','admin')
      and verified_at is not null
  ) or public.current_app_role() = 'admin'
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role and public.current_app_role() <> 'admin' then
    raise exception 'Only an administrator can change account roles';
  end if;
  return new;
end;
$$;

create trigger protect_profile_role_before_update
  before update on public.profiles
  for each row execute procedure public.protect_profile_role();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger reports_updated_at before update on public.waste_reports for each row execute procedure public.set_updated_at();
create trigger schedules_updated_at before update on public.collection_schedules for each row execute procedure public.set_updated_at();
create trigger posts_updated_at before update on public.community_posts for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.localities enable row level security;
alter table public.locality_memberships enable row level security;
alter table public.waste_reports enable row level security;
alter table public.report_media enable row level security;
alter table public.report_events enable row level security;
alter table public.collection_schedules enable row level security;
alter table public.pickup_requests enable row level security;
alter table public.community_posts enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_reactions enable row level security;
alter table public.saved_posts enable row level security;
alter table public.recycling_partners enable row level security;
alter table public.waste_guide_items enable row level security;
alter table public.notifications enable row level security;
alter table public.moderation_reports enable row level security;

create policy "Profiles visible to signed-in members" on public.profiles for select to authenticated using (true);
create policy "Users update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "Active localities are visible" on public.localities for select to anon, authenticated using (is_active = true);
create policy "Managers manage localities" on public.localities for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');

create policy "Users view own memberships" on public.locality_memberships for select to authenticated using (user_id = auth.uid() or public.is_locality_manager(locality_id));
create policy "Managers manage locality memberships" on public.locality_memberships for all to authenticated using (public.is_locality_manager(locality_id)) with check (public.is_locality_manager(locality_id));

create policy "Signed-in users view locality reports" on public.waste_reports for select to authenticated using (exists (select 1 from public.locality_memberships m where m.locality_id = waste_reports.locality_id and m.user_id = auth.uid() and m.verified_at is not null) or public.current_app_role() = 'admin');
create policy "Residents create reports" on public.waste_reports for insert to authenticated with check (reporter_id = auth.uid() and status = 'submitted' and assigned_collector_id is null);
create policy "Authors and assigned staff update reports" on public.waste_reports for update to authenticated using (reporter_id = auth.uid() or assigned_collector_id = auth.uid() or public.is_locality_manager(locality_id)) with check (reporter_id = auth.uid() or assigned_collector_id = auth.uid() or public.is_locality_manager(locality_id));

create policy "Report media visible with report access" on public.report_media for select to authenticated using (exists (select 1 from public.waste_reports r where r.id = report_id));
create policy "Users upload report media" on public.report_media for insert to authenticated with check (uploaded_by = auth.uid() and exists (select 1 from public.waste_reports r where r.id = report_id and (r.reporter_id = auth.uid() or public.is_locality_manager(r.locality_id))));
create policy "Report event history visible to report members" on public.report_events for select to authenticated using (exists (select 1 from public.waste_reports r where r.id = report_id));
create policy "Assigned staff and managers add report events" on public.report_events for insert to authenticated with check (actor_id = auth.uid() and exists (select 1 from public.waste_reports r where r.id = report_id and (r.assigned_collector_id = auth.uid() or public.is_locality_manager(r.locality_id))));

create policy "Published schedules visible" on public.collection_schedules for select to anon, authenticated using (is_published = true);
create policy "Managers manage schedules" on public.collection_schedules for all to authenticated using (public.is_locality_manager(locality_id)) with check (public.is_locality_manager(locality_id));

create policy "Residents view own pickup requests" on public.pickup_requests for select to authenticated using (resident_id = auth.uid() or assigned_collector_id = auth.uid() or public.is_locality_manager(locality_id));
create policy "Residents create pickup requests" on public.pickup_requests for insert to authenticated with check (resident_id = auth.uid());
create policy "Assigned staff manage pickup requests" on public.pickup_requests for update to authenticated using (assigned_collector_id = auth.uid() or public.is_locality_manager(locality_id)) with check (assigned_collector_id = auth.uid() or public.is_locality_manager(locality_id));

create policy "Published locality posts visible" on public.community_posts for select to authenticated using (is_published = true);
create policy "Signed-in users create posts" on public.community_posts for insert to authenticated with check (author_id = auth.uid());
create policy "Authors and admins update posts" on public.community_posts for update to authenticated using (author_id = auth.uid() or public.current_app_role() = 'admin') with check (author_id = auth.uid() or public.current_app_role() = 'admin');
create policy "Comments visible on published posts" on public.post_comments for select to authenticated using (exists (select 1 from public.community_posts p where p.id = post_id and p.is_published = true));
create policy "Users create own comments" on public.post_comments for insert to authenticated with check (author_id = auth.uid());
create policy "Authors update own comments" on public.post_comments for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "Reactions visible to signed-in users" on public.post_reactions for select to authenticated using (true);
create policy "Users manage own reactions" on public.post_reactions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage saved posts" on public.saved_posts for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Verified partners visible" on public.recycling_partners for select to anon, authenticated using (is_active = true and verification_status = 'verified');
create policy "Admins manage partners" on public.recycling_partners for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "Published waste guide visible" on public.waste_guide_items for select to anon, authenticated using (is_published = true);
create policy "Admins manage waste guide" on public.waste_guide_items for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "Users view own notifications" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "Users update own notifications" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users create moderation reports" on public.moderation_reports for insert to authenticated with check (reporter_id = auth.uid());
create policy "Users view own moderation reports and admins view all" on public.moderation_reports for select to authenticated using (reporter_id = auth.uid() or public.current_app_role() = 'admin');
create policy "Admins review moderation reports" on public.moderation_reports for update to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');

-- Storage buckets and object policies will be added in the storage setup step.
