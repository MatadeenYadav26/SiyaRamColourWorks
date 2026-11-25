create table public.client_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(btrim(name)) between 1 and 150),
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  area text not null check (char_length(btrim(area)) between 1 and 150),
  property_type text not null check (property_type in ('Home', 'Office', 'Cafe', 'Showroom', 'Other')),
  message text check (message is null or char_length(message) <= 5000),
  status text not null default 'new'
    check (status in ('new', 'assigned', 'contacted', 'quoted', 'completed', 'cancelled')),
  assigned_to text check (
    assigned_to is null or char_length(btrim(assigned_to)) between 1 and 120
  ),
  assigned_at timestamptz,
  check (status <> 'assigned' or assigned_to is not null),
  check (assigned_to is not null or assigned_at is null)
);

create index client_requests_created_at_idx on public.client_requests (created_at desc);
create index client_requests_assigned_to_idx on public.client_requests (assigned_to)
  where assigned_to is not null;

create function public.stamp_client_request_assignment()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.assigned_to is distinct from old.assigned_to then
    new.assigned_at := case
      when new.assigned_to is null then null
      else pg_catalog.now()
    end;
  end if;
  return new;
end;
$$;

create trigger client_requests_assignment_timestamp
before update of assigned_to on public.client_requests
for each row execute function public.stamp_client_request_assignment();

alter table public.client_requests enable row level security;

revoke all on public.client_requests from anon, authenticated;
grant usage on schema public to anon;
grant insert (name, phone, area, property_type, message)
  on public.client_requests to anon;

create policy "Anyone can submit a client request"
  on public.client_requests
  for insert
  to anon
  with check (
    status = 'new'
    and assigned_to is null
    and assigned_at is null
  );

create view public.assigned_client_requests
with (security_invoker = true)
as
select
  id,
  created_at,
  assigned_at,
  assigned_to,
  status,
  name,
  phone,
  area,
  property_type,
  message
from public.client_requests
where assigned_to is not null;
