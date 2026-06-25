-- User Profile Table
CREATE TABLE eventos (
    id BIGSERIAL PRIMARY KEY,

    tipo TEXT NOT NULL,

    detalhes JSONB,

    criado_em TIMESTAMP DEFAULT NOW()
);

-- User Profile Trigger Function
create or replace function public.criar_perfil_usuario()
returns trigger
language plpgsql
security definer
as $$
begin

  insert into public.perfis (
    id,
    nome
  )
  values (
    new.id,
    split_part(new.email, '@', 1)
  );

  return new;

end;
$$;

-- Create User Profile Trigger
create trigger ao_criar_usuario
after insert on auth.users
for each row
execute function public.criar_perfil_usuario();

-- Populate User Profiles From Auth Users
select
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
on tc.constraint_name = kcu.constraint_name
where tc.table_name = 'perfis';

-- Allow Nullable CPF in Perfis
insert into public.perfis (
    id,
    nome
)
select
    id,
    split_part(email, '@', 1)
from auth.users
where id not in (
    select id
    from public.perfis
);

-- Schema Column Introspection
select *
from pg_policies
where tablename = 'locais_salvos';

-- Create historico de buscas do usuário
create table historico_buscas (

  id bigint generated always as identity
  primary key,

  usuario_id uuid not null,

  origem text not null,

  destino text not null,

  criado_em timestamptz
  default now()

);

-- Enable Row-Level Security on Search History
alter table historico_buscas
enable row level security;

-- Create historico Acceso por Usuario
create policy "usuario_le_historico"

on historico_buscas

for select

using (

  auth.uid() = usuario_id

);

-- Restrict Inserts to Own User History
create policy "usuario_insere_historico"

on historico_buscas

for insert

with check (

  auth.uid() = usuario_id

);

-- Policy to Restrict Historico Deletes
create policy "usuario_remove_historico"

on historico_buscas

for delete

using (

  auth.uid() = usuario_id

);

-- Sample Rows from Perfis
select *
from perfis
limit 5;

-- Add Latitude and Longitude Columns
select * 
FROM locais_salvos

-- Add colum usuario_id in the pesquisas table
alter table pesquisas
add column usuario_id uuid references auth.users(id);

-- Criacao da tabela pesquisas com campos atualizados
create table pesquisas (

  id bigint generated always as identity primary key,

  usuario_id uuid references auth.users(id),

  origem text,

  destino text,

  distancia_km numeric,

  tempo_minutos integer,

  criado_em timestamptz default now()

);

-- Add colums endereco e telefone na tabela perfil
alter table perfis
add column telefone text;

alter table perfis
add column endereco text;

-- Add colum atualizado_em na tabela perfil
alter table perfis
add column atualizado_em timestamptz;