-- ============================================================
-- CV App — Esquema de tablas + RLS
-- Ejecutar en Supabase: SQL Editor -> pegar -> Run
-- ============================================================

-- ===== TABLAS =====
create table perfil (
  id int primary key default 1,
  nombre text, titulo text, tagline text, perfil_texto text,
  ubicacion text, telefono text, email text, github text, portafolio text,
  disponible boolean default true,
  constraint solo_una_fila check (id = 1)
);

create table habilidades (
  id bigint generated always as identity primary key,
  categoria text not null,
  items text[] not null default '{}',
  orden int default 0
);

create table proyectos (
  id bigint generated always as identity primary key,
  titulo text not null,
  subtitulo text,
  stack text[] default '{}',
  bullets text[] default '{}',
  enlace text,
  rango text,
  orden int default 0
);

create table educacion (
  id bigint generated always as identity primary key,
  titulo text not null,
  institucion text,
  detalle text,
  orden int default 0
);

create table cursos (
  id bigint generated always as identity primary key,
  nombre text not null,
  entidad text,
  detalle text,
  orden int default 0
);

create table idiomas (
  id bigint generated always as identity primary key,
  idioma text not null,
  nivel text,
  orden int default 0
);

-- ===== RLS: cualquiera LEE, solo autenticado ESCRIBE =====
do $$
declare t text;
begin
  foreach t in array array['perfil','habilidades','proyectos','educacion','cursos','idiomas']
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('create policy "lectura publica" on %I for select using (true);', t);
    execute format('create policy "escritura autenticada" on %I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;
