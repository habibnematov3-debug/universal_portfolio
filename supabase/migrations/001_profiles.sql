begin;
create table public.profiles (
 id uuid primary key default gen_random_uuid(),
 user_id uuid unique not null references auth.users(id) on delete cascade,
 username text unique not null check (username ~ '^[a-z0-9-]{3,30}$' and username not in ('edit','login','api','admin','auth','onboarding','logout','portfolio','www','favicon','robots','sitemap','settings','account','support')),
 full_name text check(length(full_name)<=120), headline text check(length(headline)<=180), bio text check(length(bio)<=2000), avatar_url text check(length(avatar_url)<=2048),
 skills jsonb not null default '[]' check(jsonb_typeof(skills)='array' and jsonb_array_length(skills)<=40),
 projects jsonb not null default '[]' check(jsonb_typeof(projects)='array' and jsonb_array_length(projects)<=30 and octet_length(projects::text)<=150000),
 experience jsonb not null default '[]' check(jsonb_typeof(experience)='array' and jsonb_array_length(experience)<=30 and octet_length(experience::text)<=150000),
 education jsonb not null default '[]' check(jsonb_typeof(education)='array' and jsonb_array_length(education)<=20 and octet_length(education::text)<=100000),
 links jsonb not null default '{}' check(jsonb_typeof(links)='object' and octet_length(links::text)<=15000),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create function public.profiles_before_update() returns trigger language plpgsql set search_path='' as $$
begin
 if new.user_id is distinct from old.user_id or new.id is distinct from old.id or new.username is distinct from old.username then
   raise exception 'Profile identity cannot be changed';
 end if;
 new.created_at=old.created_at; new.updated_at=now(); return new;
end; $$;
create trigger profiles_before_update before update on public.profiles for each row execute function public.profiles_before_update();
alter table public.profiles enable row level security;
grant select on public.profiles to anon, authenticated;
grant insert,update,delete on public.profiles to authenticated;
revoke insert,update,delete on public.profiles from anon;
create policy "Public portfolios" on public.profiles for select to anon,authenticated using (true);
create policy "Create own portfolio" on public.profiles for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Update own portfolio" on public.profiles for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Delete own portfolio" on public.profiles for delete to authenticated using ((select auth.uid())=user_id);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('avatars','avatars',true,5242880,array['image/jpeg','image/png','image/webp']),
 ('project-images','project-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "Read portfolio images" on storage.objects for select to anon,authenticated using(bucket_id in ('avatars','project-images'));
create policy "Upload own portfolio images" on storage.objects for insert to authenticated with check(bucket_id in ('avatars','project-images') and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Update own portfolio images" on storage.objects for update to authenticated using(bucket_id in ('avatars','project-images') and (storage.foldername(name))[1]=(select auth.uid())::text) with check(bucket_id in ('avatars','project-images') and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Delete own portfolio images" on storage.objects for delete to authenticated using(bucket_id in ('avatars','project-images') and (storage.foldername(name))[1]=(select auth.uid())::text);
commit;
