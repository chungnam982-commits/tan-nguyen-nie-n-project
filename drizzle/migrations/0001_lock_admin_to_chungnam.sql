create or replace function public.claim_first_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then return false; end if;
  if (select email from auth.users where id = auth.uid()) <> 'chungnam982@gmail.com' then
    return public.has_role(auth.uid(), 'admin');
  end if;
  if not public.has_role(auth.uid(), 'admin') then
    insert into public.user_roles(user_id, role) values (auth.uid(), 'admin')
    on conflict do nothing;
  end if;
  return true;
end $$;

insert into public.user_roles(user_id, role)
select id, 'admin' from auth.users where email = 'chungnam982@gmail.com'
on conflict do nothing;