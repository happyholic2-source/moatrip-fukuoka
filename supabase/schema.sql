-- Prototype only: possession of a room code grants read/write access.
-- Enable anonymous sign-ins in Supabase Auth before testing.
create table if not exists public.places (
 id text primary key,
 room_id text not null,
 name text not null check (char_length(name) between 1 and 150),
 category text not null check(category in ('맛집','카페','관광','기타')),
 latitude double precision not null check(latitude between -90 and 90),
 longitude double precision not null check(longitude between -180 and 180),
 created_by text not null,
 created_at timestamptz not null default now()
);
create index if not exists places_room_idx on public.places(room_id);
alter table public.places enable row level security;
-- Demonstration policies; NOT adequate for a public production service.
create policy "prototype read" on public.places for select to authenticated using (true);
create policy "prototype insert" on public.places for insert to authenticated with check (true);
create policy "prototype delete" on public.places for delete to authenticated using (true);
alter publication supabase_realtime add table public.places;
