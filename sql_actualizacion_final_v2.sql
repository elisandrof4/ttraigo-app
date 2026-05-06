
-- TTRAIGO SQL FINAL V2
create extension if not exists "uuid-ossp";

alter table usuarios add column if not exists cedula_id text;
alter table usuarios add column if not exists foto_base64 text;
alter table usuarios add column if not exists verificado boolean default false;
alter table usuarios add column if not exists estado text default 'activo';

alter table choferes add column if not exists nombre text;
alter table choferes add column if not exists foto_vehiculo text;
alter table choferes add column if not exists foto_licencia text;
alter table choferes add column if not exists foto_seguro text;
alter table choferes add column if not exists foto_documento text;
alter table choferes add column if not exists estado_verificacion text default 'pendiente';
alter table choferes add column if not exists score_ia integer default 0;
alter table choferes add column if not exists resultado_ia text;

alter table acompanantes add column if not exists cedula text;
alter table acompanantes add column if not exists foto_base64 text;
alter table acompanantes add column if not exists estado_verificacion text default 'pendiente';
alter table acompanantes add column if not exists score_ia integer default 0;
alter table acompanantes add column if not exists resultado_ia text;

alter table servicios add column if not exists invitado_nombre text;
alter table servicios add column if not exists invitado_cedula text;
alter table servicios add column if not exists invitado_foto text;
alter table servicios add column if not exists tipo_destino text;
alter table servicios add column if not exists es_destino_privado boolean default false;
alter table servicios add column if not exists requiere_validacion_destino boolean default false;
alter table servicios add column if not exists contacto_emergencia_nombre text;
alter table servicios add column if not exists contacto_emergencia_telefono text;
alter table servicios add column if not exists notas_seguridad text;
alter table servicios add column if not exists aceptado_en timestamp with time zone;
alter table servicios add column if not exists iniciado_en timestamp with time zone;
alter table servicios add column if not exists finalizado_en timestamp with time zone;

create table if not exists disponibilidad_choferes (
  id uuid default gen_random_uuid() primary key,
  chofer_id uuid,
  latitud numeric,
  longitud numeric,
  disponible boolean default true,
  actualizado_en timestamp with time zone default now()
);

create table if not exists ofertas_servicio (
  id uuid default gen_random_uuid() primary key,
  servicio_id uuid,
  chofer_id uuid,
  estado text default 'pendiente',
  creado_en timestamp with time zone default now()
);

create table if not exists verificaciones_ia (
  id uuid default gen_random_uuid() primary key,
  chofer_id uuid,
  acompanante_id uuid,
  score integer,
  resultado text,
  creado_en timestamp with time zone default now()
);

create table if not exists chat_mensajes (
  id uuid default gen_random_uuid() primary key,
  servicio_id uuid,
  usuario_id uuid,
  nombre text,
  rol text,
  mensaje text not null,
  creado_en timestamp with time zone default now()
);

create table if not exists comprobantes_pago (
  id uuid default gen_random_uuid() primary key,
  servicio_id uuid,
  usuario_id uuid,
  monto numeric,
  metodo text,
  comprobante_base64 text,
  estado text default 'pendiente',
  creado_en timestamp with time zone default now()
);
