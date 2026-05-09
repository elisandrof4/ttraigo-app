# TTRAIGO PREMIUM V10 — FASE 7 PUSH FIREBASE

## Qué incluye
- Preparación para notificaciones push reales.
- Firebase Cloud Messaging para PWA/app.
- `firebase-config.js`
- `firebase-messaging-sw.js`
- `push-notifications.js`
- Tabla `push_tokens`
- Tabla `notificaciones`
- Botón “Activar alertas”
- Registro de token del usuario en Supabase.
- Ejemplo de endpoint Vercel `/api/send-push`.

## Archivos nuevos
- sql_fase7_push_firebase.sql
- firebase-config.js
- firebase-messaging-sw.js
- push-notifications.js
- api/send-push.js
- README_FASE7_PUSH_FIREBASE.txt

## PASO 1 — Supabase
Ejecuta en Supabase SQL Editor:

sql_fase7_push_firebase.sql

## PASO 2 — Firebase
1. Entra a Firebase Console.
2. Crea proyecto `Ttraigo`.
3. Agrega una app Web.
4. Copia firebaseConfig.
5. Pega esos datos en:
   - firebase-config.js
   - firebase-messaging-sw.js

## PASO 3 — VAPID KEY
En Firebase:
Project Settings → Cloud Messaging → Web Push certificates

Genera o copia tu VAPID KEY.

Pégala en:

firebase-config.js

## PASO 4 — GitHub
Sube todos los archivos del ZIP a GitHub.

## PASO 5 — Vercel
Agrega variable de entorno si usarás endpoint de envío:

FIREBASE_SERVER_KEY

## Nota importante
Firebase Legacy Server Key está siendo reemplazada por HTTP v1.
Para producción seria conviene usar Firebase Admin SDK con service account.
Este pack deja la fase lista para arrancar.

## Resultado
El usuario puede tocar “Activar alertas”, aceptar permiso del navegador y su token queda guardado en Supabase.

## Siguiente fase
FASE 8:
- pagos reales
- comprobantes
- Stripe/Azul/CardNet
- wallet interna
