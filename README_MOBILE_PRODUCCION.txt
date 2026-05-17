TTRAIGO — ARREGLO FINAL MOBILE PRODUCCIÓN

Qué corrige:
- Quita dependencia de server.url para producción.
- Usa webDir real: www.
- Incluye www/index.html.
- Agrega @capgo/background-geolocation para chofer en segundo plano.
- Mantiene fallback con @capacitor/geolocation y navegador.
- Agrega permisos Android/iOS como referencia.

Sube a GitHub:
- package.json
- capacitor.config.ts
- carpeta www completa

Importante:
- www/index.html es la app móvil local de producción.
- El admin NO va en la app móvil.
- Para compilar:
  npm install
  npx cap add android
  npx cap sync
  npx cap open android

Luego en Android Studio revisa AndroidManifest.xml con android_snippets/AndroidManifest_permissions.txt.
