# TTRAIGO V22 — FOTO + CÉDULA OBLIGATORIA Y FIX FAILED FETCH

## Cambios
- Foto de perfil obligatoria para todos.
- Foto de cédula/ID obligatoria para todos.
- En móvil permite cámara o galería:
  - perfil usa cámara frontal
  - cédula/ID usa cámara trasera
- Reduce el tamaño de imágenes internamente para evitar fallo por peso.
- Agrega diagnóstico Supabase.

## Supabase
Ejecuta:
sql_v22_registro_camara_obligatoria.sql

## GitHub
Sube:
- login.html
- diagnostico-supabase.html
- sql_v22_registro_camara_obligatoria.sql

## Si sigue Failed to fetch
Abre:
https://ttraigo-app.vercel.app/diagnostico-supabase.html

Si falla ahí, NO es el registro: es conexión/API key/configuración de Supabase.
