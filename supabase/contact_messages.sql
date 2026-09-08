-- Run this in Supabase SQL Editor.
-- First create an Auth user for the admin from Authentication > Users.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read')),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique
);

alter table public.contact_messages enable row level security;
alter table public.admin_users enable row level security;

create or replace function public.is_buildly_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_buildly_admin() from public;
grant execute on function public.is_buildly_admin() to anon, authenticated;

drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (
  char_length(name) between 1 and 120
  and char_length(email) between 3 and 255
  and char_length(message) between 1 and 5000
);

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages"
on public.contact_messages for select
to authenticated
using (public.is_buildly_admin());

drop policy if exists "Admins can update contact messages" on public.contact_messages;
create policy "Admins can update contact messages"
on public.contact_messages for update
to authenticated
using (public.is_buildly_admin())
with check (public.is_buildly_admin());

drop policy if exists "Admins can delete contact messages" on public.contact_messages;
create policy "Admins can delete contact messages"
on public.contact_messages for delete
to authenticated
using (public.is_buildly_admin());

-- After creating the Auth user, replace the email below and run this once:
-- insert into public.admin_users (user_id, email)
-- select id, email from auth.users where email = 'admin@example.com'
-- on conflict (user_id) do update set email = excluded.email;