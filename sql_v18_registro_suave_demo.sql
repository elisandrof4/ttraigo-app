
-- TTRAIGO V18 — REGISTRO SUAVE + MODO DEMO
-- Ejecutar una sola vez en Supabase SQL Editor.
-- No borra datos.

alter table usuarios add column if not exists cedula_id text;
alter table usuarios add column if not exists foto_base64 text;
alter table usuarios add column if not exists verificado boolean default false;
alter table usuarios add column if not exists estado text default 'activo';
alter table usuarios add column if not exists creado_en timestamp with time zone default now();

alter table choferes add column if not exists foto_vehiculo text;
alter table choferes add column if not exists foto_licencia text;
alter table choferes add column if not exists foto_seguro text;
alter table choferes add column if not exists foto_documento text;
alter table choferes add column if not exists estado_verificacion text default 'pendiente';

alter table acompanantes add column if not exists foto_base64 text;
alter table acompanantes add column if not exists estado_verificacion text default 'pendiente';

do $$
begin
  begin create policy "usuarios_all_register_v18" on usuarios for all using (true) with check (true); exception when duplicate_object then null; end;
  begin create policy "choferes_all_register_v18" on choferes for all using (true) with check (true); exception when duplicate_object then null; end;
  begin create policy "acompanantes_all_register_v18" on acompanantes for all using (true) with check (true); exception when duplicate_object then null; end;
  begin create policy "servicios_all_v18" on servicios for all using (true) with check (true); exception when duplicate_object then null; end;
end $$;
