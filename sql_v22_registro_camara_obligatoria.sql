
-- TTRAIGO V22 — REGISTRO REAL CON FOTO + CÉDULA OBLIGATORIA
-- Ejecutar una sola vez en Supabase SQL Editor.
-- No borra datos.

alter table usuarios add column if not exists nombre text;
alter table usuarios add column if not exists telefono text;
alter table usuarios add column if not exists email text;
alter table usuarios add column if not exists rol text default 'cliente';
alter table usuarios add column if not exists cedula_id text;
alter table usuarios add column if not exists foto_base64 text;
alter table usuarios add column if not exists foto_id_base64 text;
alter table usuarios add column if not exists tipo_documento text default 'cedula';
alter table usuarios add column if not exists documento_verificado boolean default false;
alter table usuarios add column if not exists verificado boolean default false;
alter table usuarios add column if not exists estado text default 'activo';
alter table usuarios add column if not exists creado_en timestamp with time zone default now();

alter table choferes add column if not exists nombre text;
alter table choferes add column if not exists usuario_id uuid;
alter table choferes add column if not exists licencia text;
alter table choferes add column if not exists vehiculo_marca text;
alter table choferes add column if not exists vehiculo_modelo text;
alter table choferes add column if not exists placa text;
alter table choferes add column if not exists foto_cedula text;
alter table choferes add column if not exists foto_vehiculo text;
alter table choferes add column if not exists foto_licencia text;
alter table choferes add column if not exists foto_seguro text;
alter table choferes add column if not exists foto_documento text;
alter table choferes add column if not exists estado_verificacion text default 'pendiente';

alter table acompanantes add column if not exists usuario_id uuid;
alter table acompanantes add column if not exists cedula text;
alter table acompanantes add column if not exists experiencia text;
alter table acompanantes add column if not exists foto_cedula text;
alter table acompanantes add column if not exists foto_base64 text;
alter table acompanantes add column if not exists estado_verificacion text default 'pendiente';

-- Políticas MVP para permitir registro desde la app.
do $$
begin
  begin create policy "usuarios_all_v22" on usuarios for all using (true) with check (true); exception when duplicate_object then null; end;
  begin create policy "choferes_all_v22" on choferes for all using (true) with check (true); exception when duplicate_object then null; end;
  begin create policy "acompanantes_all_v22" on acompanantes for all using (true) with check (true); exception when duplicate_object then null; end;
end $$;
