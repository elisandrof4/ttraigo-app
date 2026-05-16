// TTRAIGO FASE FINAL A — CONFIGURACIÓN MAPA REAL
// IMPORTANTE:
// 1) Crea cuenta en Mapbox o Google Cloud Maps.
// 2) Pega tu token/API key abajo.
// 3) En GitHub sube este archivo como config-mapas.js.
// 4) Si usas Mapbox, deja MAP_PROVIDER='mapbox'.
// 5) Si usas Google Maps, cambia a MAP_PROVIDER='google'.

const MAP_PROVIDER = "mapbox";

// PON AQUÍ TU TOKEN REAL DE MAPBOX
const MAPBOX_TOKEN = "PON_AQUI_TU_TOKEN_MAPBOX";

// OPCIONAL: PON AQUÍ TU API KEY DE GOOGLE MAPS
const GOOGLE_MAPS_KEY = "PON_AQUI_TU_API_KEY_GOOGLE_MAPS";

// Configuración visual
const TTRAIGO_MAP_STYLE = "mapbox://styles/mapbox/dark-v11";
const TTRAIGO_DEFAULT_CENTER = [-69.9312, 18.4861]; // Santo Domingo
const TTRAIGO_DEFAULT_ZOOM = 12;
