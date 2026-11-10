-- Foundation for phase 2. The prototype does not yet sync its local archive.
create table public.profiles (
 id uuid primary key references auth.users on delete cascade,
 first_name text not null default '', last_name text not null default '',
 avatar_url text, created_at timestamptz not null default now()
);
create table public.memories (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users on delete cascade,
 title text not null check(length(title)>0), description text, content text,
 category text not null, memory_date text not null, date_precision text not null check(date_precision in ('day','year')),
 visibility text not null default 'private' check(visibility='private'),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.memory_media (
 id uuid primary key default gen_random_uuid(), memory_id uuid not null references public.memories on delete cascade,
 media_type text not null check(media_type in ('audio','image','video')), storage_path text not null,
 created_at timestamptz not null default now()
);
create table public.questions (id uuid primary key default gen_random_uuid(), question text not null, category text not null, active boolean not null default true);
create table public.question_answers (
 id uuid primary key default gen_random_uuid(), question_id uuid not null references public.questions,
 memory_id uuid not null references public.memories on delete cascade, owner_id uuid not null references auth.users on delete cascade,
 created_at timestamptz not null default now(), unique(owner_id,question_id)
);
create table public.family_invitations (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users on delete cascade,
 invited_email text not null, invited_user_id uuid references auth.users on delete cascade,
 status text not null default 'pending' check(status in ('pending','accepted','revoked')),
 created_at timestamptz not null default now()
);
create table public.memory_shares (
 id uuid primary key default gen_random_uuid(), memory_id uuid not null references public.memories on delete cascade,
 invited_user_id uuid not null references auth.users on delete cascade, permission text not null default 'view' check(permission='view'),
 created_at timestamptz not null default now(), unique(memory_id,invited_user_id)
);
create index on public.memories(owner_id);
create index on public.memory_shares(invited_user_id,memory_id);
create index on public.memory_media(memory_id);
alter table public.profiles enable row level security;
alter table public.memories enable row level security;
alter table public.memory_media enable row level security;
alter table public.questions enable row level security;
alter table public.question_answers enable row level security;
alter table public.family_invitations enable row level security;
alter table public.memory_shares enable row level security;
-- Security-definer helpers prevent recursive policy evaluation. Only authenticated users execute them.
create function public.owns_memory(mid uuid) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.memories where id=mid and owner_id=(select auth.uid())) $$;
create function public.can_read_memory(mid uuid) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.memories where id=mid and owner_id=(select auth.uid())) or exists(select 1 from public.memory_shares where memory_id=mid and invited_user_id=(select auth.uid())) $$;
revoke all on function public.owns_memory(uuid),public.can_read_memory(uuid) from public;
grant execute on function public.owns_memory(uuid),public.can_read_memory(uuid) to authenticated;
create policy profile_owner on public.profiles for all to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
create policy memory_read on public.memories for select to authenticated using(public.can_read_memory(id));
create policy memory_insert on public.memories for insert to authenticated with check(owner_id=(select auth.uid()));
create policy memory_update on public.memories for update to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
create policy memory_delete on public.memories for delete to authenticated using(owner_id=(select auth.uid()));
create policy media_read on public.memory_media for select to authenticated using(public.can_read_memory(memory_id));
create policy media_write on public.memory_media for all to authenticated using(public.owns_memory(memory_id)) with check(public.owns_memory(memory_id) and storage_path like auth.uid()::text||'/'||memory_id::text||'/%');
create policy questions_read on public.questions for select to authenticated using(active);
create policy answer_owner on public.question_answers for all to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()) and public.owns_memory(memory_id));
create policy invitations_owner on public.family_invitations for all to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
-- Acceptance and e-mail delivery must run in a verified backend function, never from client claims.
create policy shares_read on public.memory_shares for select to authenticated using(invited_user_id=(select auth.uid()) or public.owns_memory(memory_id));
create policy shares_owner on public.memory_shares for all to authenticated using(public.owns_memory(memory_id)) with check(public.owns_memory(memory_id));
insert into storage.buckets(id,name,public) values('memories','memories',false) on conflict(id) do nothing;
create policy file_owner on storage.objects for all to authenticated using(bucket_id='memories' and (storage.foldername(name))[1]=auth.uid()::text) with check(bucket_id='memories' and (storage.foldername(name))[1]=auth.uid()::text);
create policy file_shared_read on storage.objects for select to authenticated using(bucket_id='memories' and exists(select 1 from public.memory_media mm where mm.storage_path=name and public.can_read_memory(mm.memory_id)));
-- Use short-lived signed URLs, never public URLs, when phase 2 media sync is implemented.
