
-- TTRAIGO FASE 7 — PUSH NOTIFICATIONS FIREBASE
-- Ejecutar una sola vez en Supabase SQL Editor.
-- No borra datos.

create table if not exists push_tokens (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid,
  rol text,
  token text not null,
  plataforma text default 'web',
  activo boolean default true,
  creado_en timestamp with time zone default now(),
  actualizado_en timestamp with time zone default now()
);

create table if not exists notificaciones (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid,
  servicio_id uuid,
  titulo text not null,
  mensaje text not null,
  tipo text default 'general',
  leida boolean default false,
  creado_en timestamp with time zone default now()
);

alter table push_tokens replica identity full;
alter table notificaciones replica identity full;

do $$
begin
  begin
    alter publication supabase_realtime add table push_tokens;
  exception when duplicate_object then null;
  end;

  begin
    alter publication supabase_realtime add table notificaciones;
  exception when duplicate_object then null;
  end;
end $$;
