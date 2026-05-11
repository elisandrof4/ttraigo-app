# TTRAIGO V24 — FIX MEMORIA INSUFICIENTE CON STORAGE

## Qué corrige
El error de memoria insuficiente en celular.

## Qué se hizo
- NO cambia diseño.
- NO cambia botones.
- NO cambia el flujo visual.
- Las fotos ya no se convierten a base64 pesado.
- Las fotos se suben directo a Supabase Storage.
- En la tabla se guarda la URL de la foto.

## Supabase
Ejecuta:
sql_v24_fix_memoria_storage.sql

Esto crea:
- bucket ttraigo-docs
- columnas URL para fotos
- políticas de Storage

## GitHub
Sube:
- login.html
- sql_v24_fix_memoria_storage.sql

## Resultado
El registro ya no debe dar memoria insuficiente.
