-- WasteWise resident locality membership requests
-- Residents may request membership in active localities. Requests remain
-- unverified until a trusted locality manager/admin reviews them.

drop policy if exists "Residents request own locality membership" on public.locality_memberships;
create policy "Residents request own locality membership"
on public.locality_memberships
for insert
to authenticated
with check (
  user_id = auth.uid()
  and membership_role = 'resident'
  and verified_at is null
  and exists (
    select 1
    from public.localities l
    where l.id = locality_memberships.locality_id
      and l.is_active = true
  )
);
