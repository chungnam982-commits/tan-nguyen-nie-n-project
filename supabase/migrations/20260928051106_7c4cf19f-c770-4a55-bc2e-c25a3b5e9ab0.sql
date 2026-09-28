create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.claim_first_admin()
returns boolean language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then return false; end if;
  if exists (select 1 from public.user_roles where role = 'admin') then
    return public.has_role(auth.uid(), 'admin');
  end if;
  insert into public.user_roles(user_id, role) values (auth.uid(), 'admin');
  return true;
end $$;
revoke execute on function public.claim_first_admin() from anon, public;
grant execute on function public.claim_first_admin() to authenticated;

create table public.character_portraits (
  astra_id text primary key,
  image_url text,
  removed boolean not null default false,
  updated_at timestamptz not null default now()
);
grant select on public.character_portraits to anon, authenticated;
grant insert, update, delete on public.character_portraits to authenticated;
grant all on public.character_portraits to service_role;
alter table public.character_portraits enable row level security;
create policy "Anyone can view portraits" on public.character_portraits for select to anon, authenticated using (true);
create policy "Admins insert portraits" on public.character_portraits for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update portraits" on public.character_portraits for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete portraits" on public.character_portraits for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Public read portraits bucket" on storage.objects for select using (bucket_id = 'portraits');
create policy "Admins upload portraits" on storage.objects for insert to authenticated with check (bucket_id = 'portraits' and public.has_role(auth.uid(), 'admin'));
create policy "Admins update portrait files" on storage.objects for update to authenticated using (bucket_id = 'portraits' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete portrait files" on storage.objects for delete to authenticated using (bucket_id = 'portraits' and public.has_role(auth.uid(), 'admin'));