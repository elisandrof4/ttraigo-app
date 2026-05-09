
-- TTRAIGO FASE 4 REALTIME
-- Ejecutar una sola vez en Supabase SQL Editor.
-- No borra datos. Activa mejor soporte realtime y columnas de ubicación.

alter table servicios add column if not exists origen_lat numeric;
alter table servicios add column if not exists origen_lng numeric;
alter table servicios add column if not exists destino_lat numeric;
alter table servicios add column if not exists destino_lng numeric;
alter table servicios add column if not exists eta_min integer;
alter table servicios add column if not exists matching_modo text default 'automatico';

alter table disponibilidad_choferes add column if not exists estado text default 'online';
alter table disponibilidad_choferes add column if not exists servicio_actual_id uuid;

alter table servicios replica identity full;
alter table disponibilidad_choferes replica identity full;
alter table ofertas_servicio replica identity full;

do $$
begin
  begin
    alter publication supabase_realtime add table servicios;
  exception when duplicate_object then null;
  end;

  begin
    alter publication supabase_realtime add table disponibilidad_choferes;
  exception when duplicate_object then null;
  end;

  begin
    alter publication supabase_realtime add table ofertas_servicio;
  exception when duplicate_object then null;
  end;
end $$;
