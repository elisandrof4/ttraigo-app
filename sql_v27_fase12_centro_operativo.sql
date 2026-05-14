-- TTRAIGO V27 / FASE 12 — CENTRO OPERATIVO INTELIGENTE
-- Ejecutar en Supabase SQL Editor. No borra datos.

alter table servicios add column if not exists prioridad text default 'normal';
alter table servicios add column if not exists tipo_asistencia text;
alter table servicios add column if not exists paciente boolean default false;
alter table servicios add column if not exists silla_ruedas boolean default false;
alter table servicios add column if not exists oxigeno boolean default false;
alter table servicios add column if not exists contacto_familiar text;
alter table servicios add column if not exists fecha_programada timestamp with time zone;
alter table servicios add column if not exists nota_operativa text;

create table if not exists centro_operativo_eventos (
  id uuid default gen_random_uuid() primary key,
  servicio_id uuid,
  usuario_id uuid,
  tipo text not null,
  prioridad text default 'normal',
  detalle text,
  estado text default 'abierto',
  creado_en timestamp with time zone default now(),
  cerrado_en timestamp with time zone
);

create table if not exists verificaciones_admin (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid,
  rol text,
  estado text default 'pendiente',
  observacion text,
  verificado_por uuid,
  creado_en timestamp with time zone default now(),
  actualizado_en timestamp with time zone default now()
);

create table if not exists viajes_programados (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid,
  servicio_id uuid,
  nombre_pasajero text,
  telefono_pasajero text,
  origen text,
  destino text,
  fecha_programada timestamp with time zone not null,
  asistencia text,
  estado text default 'programado',
  creado_en timestamp with time zone default now()
);

alter table centro_operativo_eventos replica identity full;
alter table verificaciones_admin replica identity full;
alter table viajes_programados replica identity full;

do $$
begin
  begin alter publication supabase_realtime add table centro_operativo_eventos; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table verificaciones_admin; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table viajes_programados; exception when duplicate_object then null; end;
  begin create policy "centro_operativo_all_v27" on centro_operativo_eventos for all using (true) with check (true); exception when duplicate_object then null; end;
  begin create policy "verificaciones_all_v27" on verificaciones_admin for all using (true) with check (true); exception when duplicate_object then null; end;
  begin create policy "programados_all_v27" on viajes_programados for all using (true) with check (true); exception when duplicate_object then null; end;
end $$;