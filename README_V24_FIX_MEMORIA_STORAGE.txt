# TTRAIGO V20 — REGISTRO Y LOGIN REAL

## Qué hace
- Quita demo.
- Permite registro real de clientes sin foto obligatoria.
- Mantiene foto obligatoria para chofer y acompañante.
- Login real con cuentas existentes.
- Muestra errores exactos en pantalla.
- Conserva todo lo anterior.

## PASO 1 — Supabase
Ejecuta:
sql_v20_registro_login_real.sql

## PASO 2 — Supabase Auth
Para que puedan entrar inmediatamente:
Authentication → Providers → Email
Desactiva “Confirm email” si está activo.

## PASO 3 — GitHub
Sube:
- login.html
- sql_v20_registro_login_real.sql

## Probar
https://ttraigo-app.vercel.app/login.html
