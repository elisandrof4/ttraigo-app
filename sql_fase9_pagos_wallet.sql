
-- TTRAIGO FASE 9 — PAGOS, WALLET, FACTURAS Y COMPROBANTES
-- Ejecutar una sola vez en Supabase SQL Editor.
-- No borra datos.

alter table servicios add column if not exists subtotal numeric default 0;
alter table servicios add column if not exists impuesto numeric default 0;
alter table servicios add column if not exists comision_plataforma numeric default 0;
alter table servicios add column if not exists total_final numeric default 0;
alter table servicios add column if not exists estado_pago text default 'pendiente';
alter table servicios add column if not exists referencia_pago text;
alter table servicios add column if not exists metodo_pago_final text;
alter table servicios add column if not exists pagado_en timestamp with time zone;

create table if not exists wallet_usuarios (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid,
  balance numeric default 0,
  moneda text default 'DOP',
  actualizado_en timestamp with time zone default now()
);

create table if not exists movimientos_wallet (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid,
  servicio_id uuid,
  tipo text not null, -- credito, debito, retencion, liberacion, comision
  monto numeric not null,
  moneda text default 'DOP',
  descripcion text,
  creado_en timestamp with time zone default now()
);

create table if not exists pagos (
  id uuid default gen_random_uuid() primary key,
  servicio_id uuid,
  usuario_id uuid,
  metodo text not null,
  monto numeric not null,
  moneda text default 'DOP',
  estado text default 'pendiente',
  referencia text,
  proveedor text default 'manual',
  creado_en timestamp with time zone default now(),
  confirmado_en timestamp with time zone
);

create table if not exists facturas (
  id uuid default gen_random_uuid() primary key,
  servicio_id uuid,
  usuario_id uuid,
  numero text,
  subtotal numeric default 0,
  impuesto numeric default 0,
  total numeric default 0,
  moneda text default 'DOP',
  estado text default 'emitida',
  creado_en timestamp with time zone default now()
);

alter table wallet_usuarios replica identity full;
alter table movimientos_wallet replica identity full;
alter table pagos replica identity full;
alter table facturas replica identity full;

do $$
begin
  begin alter publication supabase_realtime add table wallet_usuarios; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table movimientos_wallet; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table pagos; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table facturas; exception when duplicate_object then null; end;
end $$;
