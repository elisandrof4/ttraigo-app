# TTRAIGO V23 — FIX SOLO SERVICE WORKER

## Qué corrige
Este fix NO cambia la aplicación, NO cambia diseño, NO cambia registro, NO cambia botones.

Solo corrige `sw.js` para que el modo offline NO intercepte Supabase.

## Por qué
El diagnóstico devolvía `offline.html` con status 200.
Eso demuestra que el Service Worker estaba interceptando llamadas externas.

## Subir a GitHub
Solo sube/reemplaza:
- sw.js
- diagnostico-supabase.html

## Supabase
No requiere SQL.

## Después de subir
1. Espera 1 minuto.
2. Abre:
   https://ttraigo-app.vercel.app/diagnostico-supabase.html
3. Debe devolver JSON de Supabase, no HTML de offline.
