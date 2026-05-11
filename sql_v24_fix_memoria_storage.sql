
-- TTRAIGO V24 — FIX MEMORIA INSUFICIENTE
-- Cambia fotos pesadas a Supabase Storage.
-- Ejecutar una sola vez en Supabase SQL Editor.
-- No borra datos.

alter table usuarios add column if not exists foto_perfil_url text;
alter table usuarios add column if not exists foto_id_url text;

alter table choferes add column if not exists foto_cedula_url text;
alter table choferes add column if not exists foto_vehiculo_url text;
alter table choferes add column if not exists foto_licencia_url text;
alter table choferes add column if not exists foto_seguro_url text;
alter table choferes add column if not exists foto_documento_url text;

alter table acompanantes add column if not exists foto_cedula_url text;
alter table acompanantes add column if not exists foto_perfil_url text;

insert into storage.buckets (id, name, public)
values ('ttraigo-docs', 'ttraigo-docs', true)
on conflict (id) do nothing;

do $$
begin
  begin create policy "ttraigo_docs_select_v24" on storage.objects for select using (bucket_id = 'ttraigo-docs'); exception when duplicate_object then null; end;
  begin create policy "ttraigo_docs_insert_v24" on storage.objects for insert with check (bucket_id = 'ttraigo-docs'); exception when duplicate_object then null; end;
  begin create policy "ttraigo_docs_update_v24" on storage.objects for update using (bucket_id = 'ttraigo-docs') with check (bucket_id = 'ttraigo-docs'); exception when duplicate_object then null; end;
  begin create policy "usuarios_all_v24" on usuarios for all using (true) with check (true); exception when duplicate_object then null; end;
  begin create policy "choferes_all_v24" on choferes for all using (true) with check (true); exception when duplicate_object then null; end;
  begin create policy "acompanantes_all_v24" on acompanantes for all using (true) with check (true); exception when duplicate_object then null; end;
end $$;
