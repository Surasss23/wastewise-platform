-- WasteWise private report-media storage policies
-- Run after creating the private "report-media" bucket in Supabase Storage.
-- Upload path convention: <report-uuid>/<filename>
-- The first path segment must be the UUID of an existing waste_reports row.

update storage.buckets
set public = false,
    file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/heic']
where id = 'report-media';

drop policy if exists "Report members view report photos" on storage.objects;
create policy "Report members view report photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'report-media'
  and exists (
    select 1
    from public.waste_reports r
    where r.id::text = (storage.foldername(name))[1]
      and (
        r.reporter_id = auth.uid()
        or r.assigned_collector_id = auth.uid()
        or public.is_locality_manager(r.locality_id)
        or exists (
          select 1
          from public.locality_memberships m
          where m.locality_id = r.locality_id
            and m.user_id = auth.uid()
            and m.verified_at is not null
        )
      )
  )
);

drop policy if exists "Report owners and managers upload report photos" on storage.objects;
create policy "Report owners and managers upload report photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'report-media'
  and (storage.foldername(name))[1] is not null
  and exists (
    select 1
    from public.waste_reports r
    where r.id::text = (storage.foldername(name))[1]
      and (
        r.reporter_id = auth.uid()
        or public.is_locality_manager(r.locality_id)
      )
  )
);

drop policy if exists "Report owners and managers delete report photos" on storage.objects;
create policy "Report owners and managers delete report photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'report-media'
  and exists (
    select 1
    from public.waste_reports r
    where r.id::text = (storage.foldername(name))[1]
      and (
        r.reporter_id = auth.uid()
        or public.is_locality_manager(r.locality_id)
      )
  )
);

-- Deliberately no UPDATE policy: replace an image by deleting and uploading a new one.
