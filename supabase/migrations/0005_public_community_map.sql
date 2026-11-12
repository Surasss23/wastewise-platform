-- WasteWise public community map and clean-up sharing.
-- Public views expose only safe report fields. Account-only writes remain protected.
create or replace view public.public_waste_reports
with (security_barrier = true)
as
select
  r.id,
  r.locality_id,
  l.name as locality_name,
  r.category,
  r.title,
  r.description,
  r.address_label,
  r.latitude,
  r.longitude,
  r.status,
  r.created_at,
  r.resolved_at
from public.waste_reports r
join public.localities l on l.id = r.locality_id
where r.latitude is not null and r.longitude is not null;

grant select on public.public_waste_reports to anon, authenticated;
create or replace view public.public_report_media
with (security_barrier = true)
as
select m.report_id, m.storage_path, m.stage, m.created_at
from public.report_media m
join public.waste_reports r on r.id = m.report_id
where r.latitude is not null and r.longitude is not null
  and exists (select 1 from public.localities l where l.id = r.locality_id and l.is_active = true);
grant select on public.public_report_media to anon, authenticated;


drop policy if exists "Public can view published community posts" on public.community_posts;
create policy "Public can view published community posts"
on public.community_posts for select to anon, authenticated
using (is_published = true);

drop policy if exists "Signed in residents can post to active localities" on public.community_posts;
create policy "Signed in residents can post to active localities"
on public.community_posts for insert to authenticated
with check (
  author_id = auth.uid()
  and exists (select 1 from public.localities l where l.id = locality_id and l.is_active = true)
);

drop policy if exists "Signed in users can report in active localities" on public.waste_reports;
create policy "Signed in users can report in active localities"
on public.waste_reports for insert to authenticated
with check (
  reporter_id = auth.uid()
  and status in ('submitted','resolved')
  and assigned_collector_id is null
  and exists (select 1 from public.localities l where l.id = locality_id and l.is_active = true)
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('community-waste-photos', 'community-waste-photos', true, 10485760, array['image/jpeg','image/png','image/webp','image/heic'])
on conflict (id) do update set public = true, file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/heic'];

drop policy if exists "Community photos are publicly viewable" on storage.objects;
create policy "Community photos are publicly viewable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'community-waste-photos');

drop policy if exists "Signed in users upload their community photos" on storage.objects;
create policy "Signed in users upload their community photos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'community-waste-photos'
  and exists (
    select 1 from public.waste_reports r
    where r.id::text = (storage.foldername(name))[1]
      and r.reporter_id = auth.uid()
  )
);

drop policy if exists "Report owners can add public photo records" on public.report_media;
create policy "Report owners can add public photo records"
on public.report_media for insert to authenticated
with check (
  uploaded_by = auth.uid()
  and exists (select 1 from public.waste_reports r where r.id = report_id and r.reporter_id = auth.uid())
);

drop policy if exists "Community photo records are public" on public.report_media;
create policy "Community photo records are public"
on public.report_media for select to anon, authenticated
using (exists (
  select 1 from public.waste_reports r
  where r.id = report_media.report_id and r.latitude is not null and r.longitude is not null
));

-- Public report counters are derived from published, geolocated reports.
create index if not exists waste_reports_public_map_idx
on public.waste_reports(locality_id, created_at desc)
where latitude is not null and longitude is not null;
