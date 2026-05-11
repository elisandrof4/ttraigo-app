# TTRAIGO V25 — FIX DE ACCESO SIN CAMBIAR DISEÑO

## Qué corrige
Quita el bloqueo previo `testConnection()` que estaba deteniendo el registro/login antes de que Supabase Auth intentara trabajar.

## Qué NO cambia
- No cambia diseño.
- No cambia botones.
- No cambia flujo visual.
- No cambia la obligación de foto perfil y cédula.
- No cambia Storage.
- No borra nada.

## GitHub
Sube/reemplaza SOLO:
- login.html

## Supabase
No requiere SQL nuevo si ya ejecutaste V24.
Si no ejecutaste V24, ejecuta primero:
- sql_v24_fix_memoria_storage.sql

## Resultado esperado
Al tocar Crear cuenta, la app debe intentar crear Auth y subir fotos, y si falla mostrará el error real de Supabase.
