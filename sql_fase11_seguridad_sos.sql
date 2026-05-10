
-- TTRAIGO FASE 11 — SEGURIDAD, SOS Y CONTACTO FAMILIAR
-- Ejecutar una sola vez en Supabase SQL Editor.
-- No borra datos.

alter table usuarios add column if not exists contacto_emergencia_nombre text;
alter table usuarios add column if not exists contacto_emergencia_telefono text;
alter table usuarios add column if not exists contacto_familiar_nombre text;
alter table usuarios add column if not exists contacto_familiar_telefono text;

alter table servicios add column if not exists codigo_seguridad text;
alter table servicios add column if not exists compartir_tracking boolean default false;
alter table servicios add column if not exists enlace_tracking_familiar text;
alter table servicios add column if not exists sos_activo boolean default false;
alter table servicios add column if not exists sos_activado_en timestamp with time zone;

create table if not exists alertas_sos (
  id uuid default gen_random_uuid() primary key,
  servicio_id uuid,
  usuario_id uuid,
  rol text,
  latitud numeric,
  longitud numeric,
  estado text default 'activa',
  mensaje text,
  creado_en timestamp with time zone default now(),
  atendido_en timestamp with time zone
);

create table if not exists contactos_emergencia (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid,
  nombre text not null,
  telefono text not null,
  relacion text,
  principal boolean default false,
  creado_en timestamp with time zone default now()
);

create table if not exists eventos_seguridad (
  id uuid default gen_random_uuid() primary key,
  servicio_id uuid,
  usuario_id uuid,
  tipo text not null,
  detalle text,
  latitud numeric,
  longitud numeric,
  creado_en timestamp with time zone default now()
);

alter table alertas_sos replica identity full;
alter table contactos_emergencia replica identity full;
alter table eventos_seguridad replica identity full;

do $$
begin
  begin alter publication supabase_realtime add table alertas_sos; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table eventos_seguridad; exception when duplicate_object then null; end;
end $$;
