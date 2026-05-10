
-- TTRAIGO V21 — FOTO DE CÉDULA / ID OBLIGATORIA
-- Ejecutar una sola vez en Supabase SQL Editor.
-- No borra datos.

alter table usuarios add column if not exists foto_id_base64 text;
alter table usuarios add column if not exists tipo_documento text default 'cedula';
alter table usuarios add column if not exists documento_verificado boolean default false;

alter table choferes add column if not exists foto_cedula text;
alter table acompanantes add column if not exists foto_cedula text;

do $$
begin
  begin create policy "usuarios_all_v21" on usuarios for all using (true) with check (true); exception when duplicate_object then null; end;
  begin create policy "choferes_all_v21" on choferes for all using (true) with check (true); exception when duplicate_object then null; end;
  begin create policy "acompanantes_all_v21" on acompanantes for all using (true) with check (true); exception when duplicate_object then null; end;
end $$;
