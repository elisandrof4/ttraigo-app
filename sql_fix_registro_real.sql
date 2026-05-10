
-- TTRAIGO FIX REGISTRO REAL
-- Ejecutar una sola vez en Supabase SQL Editor.
-- No borra datos.

alter table usuarios add column if not exists cedula_id text;
alter table usuarios add column if not exists foto_base64 text;
alter table usuarios add column if not exists verificado boolean default false;
alter table usuarios add column if not exists creado_en timestamp with time zone default now();

alter table choferes add column if not exists foto_vehiculo text;
alter table choferes add column if not exists foto_licencia text;
alter table choferes add column if not exists foto_seguro text;
alter table choferes add column if not exists foto_documento text;
alter table choferes add column if not exists estado_verificacion text default 'pendiente';
alter table choferes add column if not exists score_ia numeric default 0;

alter table acompanantes add column if not exists foto_base64 text;
alter table acompanantes add column if not exists estado_verificacion text default 'pendiente';

do $$
begin
  begin create policy "usuarios_insert_register" on usuarios for insert with check (true); exception when duplicate_object then null; end;
  begin create policy "usuarios_select_register" on usuarios for select using (true); exception when duplicate_object then null; end;
  begin create policy "usuarios_update_register" on usuarios for update using (true); exception when duplicate_object then null; end;
  begin create policy "choferes_insert_register" on choferes for insert with check (true); exception when duplicate_object then null; end;
  begin create policy "choferes_select_register" on choferes for select using (true); exception when duplicate_object then null; end;
  begin create policy "acompanantes_insert_register" on acompanantes for insert with check (true); exception when duplicate_object then null; end;
  begin create policy "acompanantes_select_register" on acompanantes for select using (true); exception when duplicate_object then null; end;
end $$;
