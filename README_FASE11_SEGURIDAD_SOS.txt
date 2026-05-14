# TTRAIGO PREMIUM V12 — FASE 9 PAGOS Y WALLET

## Qué incluye
- Pantalla `pagos.html`.
- Resumen del servicio.
- Métodos: efectivo, transferencia, tarjeta y wallet.
- Registro de pagos.
- Generación de comprobante.
- Tablas de wallet, pagos, movimientos y facturas.
- Preparación para pasarela real: Stripe, Azul, CardNet o PayPal.
- Botón de pago agregado al tracking.

## PASO 1 — Supabase
Ejecuta una sola vez:

sql_fase9_pagos_wallet.sql

## PASO 2 — GitHub
Sube todo el ZIP a GitHub.

Archivos importantes:
- pagos.html
- tracking.html
- sql_fase9_pagos_wallet.sql
- README_FASE9_PAGOS_WALLET.txt

## PASO 3 — Probar
Abre un servicio activo y entra a:

https://ttraigo-app.vercel.app/pagos.html?servicio=ID_DEL_SERVICIO

o desde tracking presiona “Pagar”.

## Nota
Esta fase crea la estructura de pagos y comprobantes.
La pasarela real se conecta en la próxima fase.
