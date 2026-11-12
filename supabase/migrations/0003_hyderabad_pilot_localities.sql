-- WasteWise Hyderabad pilot locality seed
-- Panjagutta is the initial pilot locality. Nearby areas are recorded as
-- proposed expansion areas and remain inactive until local validation.
insert into public.localities (name, city, state, country, description, is_active)
values
  ('Panjagutta', 'Hyderabad', 'Telangana', 'India',
   'Initial WasteWise pilot locality. Collection schedules, local contacts and service partners are pending verification.',
   true),
  ('Somajiguda', 'Hyderabad', 'Telangana', 'India',
   'Proposed nearby expansion area. Activate only after local validation and onboarding.',
   false),
  ('Ameerpet', 'Hyderabad', 'Telangana', 'India',
   'Proposed nearby expansion area. Activate only after local validation and onboarding.',
   false),
  ('Khairatabad', 'Hyderabad', 'Telangana', 'India',
   'Proposed nearby expansion area. Activate only after local validation and onboarding.',
   false)
on conflict (name, city, state) do update
set description = excluded.description,
    is_active = excluded.is_active;
