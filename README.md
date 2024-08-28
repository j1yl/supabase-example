### VIEW OWN RECORD
```
create policy "User can see their own profile only."
on public.users
for select using ( (select auth.uid()) = id );
```

### USERS TABLE
```
create table public.users (
  id uuid not null references auth.users on delete cascade,
  full_name text,
  user_name text,
  avatar_url text,
  email text,

  primary key (id)
);

alter table public.users enable row level security;
```

### FUNCTION FOR NEW USER LINK TO PUBLIC.USER
```
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, full_name, user_name, avatar_url, email)
  values (
    new.id, 
    new.raw_user_meta_data ->> 'full_name', 
    new.raw_user_meta_data ->> 'user_name', 
    new.raw_user_meta_data ->> 'avatar_url', 
    new.raw_user_meta_data ->> 'email'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```