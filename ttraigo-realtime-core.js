// TTRAIGO CORE REALTIME PARTE 1
// Requiere config-mapas.js con MAPBOX_TOKEN real.

const TTRAIGO_SUPABASE_URL = "https://lvqzkvahfklwzxbxbljv.supabase.co";
const TTRAIGO_SUPABASE_KEY = "sb_publishable_A122LY08w-r23qZADKtXlA__zPm6E8Q";
const TTRAIGO_DEFAULT_MAP_CENTER = [-69.9312, 18.4861];

function rtMsg(id, text, color = "white"){
  const el = document.getElementById(id);
  if(el){ el.textContent = text; el.style.color = color; }
}

function rtEscape(v){
  return String(v || "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function rtMoney(n){
  return "RD$ " + Number(n || 0).toLocaleString("es-DO", {minimumFractionDigits:2, maximumFractionDigits:2});
}

function rtHasMapbox(){
  return typeof MAPBOX_TOKEN !== "undefined" && MAPBOX_TOKEN && !MAPBOX_TOKEN.includes("PON_AQUI");
}

function rtCreateSupabase(){
  return window.supabase.createClient(TTRAIGO_SUPABASE_URL, TTRAIGO_SUPABASE_KEY);
}

async function rtRequireUser(supabaseClient){
  const s = await supabaseClient.auth.getSession();
  if(!s.data.session){
    location.href = "login.html";
    return null;
  }
  const id = s.data.session.user.id;
  const p = await supabaseClient.from("usuarios").select("*").eq("id", id).single();
  return p.data || { id, email:s.data.session.user.email };
}

function rtCreateMap(containerId){
  if(!rtHasMapbox()){
    document.getElementById(containerId).innerHTML = "<div style='padding:24px;color:white'><h2>Falta token Mapbox</h2><p>Verifica config-mapas.js</p></div>";
    return null;
  }
  mapboxgl.accessToken = MAPBOX_TOKEN;
  const map = new mapboxgl.Map({
    container: containerId,
    style: typeof TTRAIGO_MAP_STYLE !== "undefined" ? TTRAIGO_MAP_STYLE : "mapbox://styles/mapbox/dark-v11",
    center: typeof TTRAIGO_DEFAULT_CENTER !== "undefined" ? TTRAIGO_DEFAULT_CENTER : TTRAIGO_DEFAULT_MAP_CENTER,
    zoom: typeof TTRAIGO_DEFAULT_ZOOM !== "undefined" ? TTRAIGO_DEFAULT_ZOOM : 12
  });
  map.addControl(new mapboxgl.NavigationControl(), "top-right");
  return map;
}

function rtMarker(map, lng, lat, color, popupHtml){
  if(!map || !lat || !lng) return null;
  const m = new mapboxgl.Marker({ color: color || "#16C47F" })
    .setLngLat([Number(lng), Number(lat)])
    .addTo(map);
  if(popupHtml) m.setPopup(new mapboxgl.Popup({offset:25}).setHTML(popupHtml));
  return m;
}

function rtSetMarker(marker, map, lng, lat, color, popupHtml){
  if(marker){
    marker.setLngLat([Number(lng), Number(lat)]);
    return marker;
  }
  return rtMarker(map, lng, lat, color, popupHtml);
}

async function rtSetOnline(supabaseClient, perfil, rol, online){
  await supabaseClient.from("usuarios").update({
    realtime_online: online,
    realtime_rol: rol,
    realtime_ultima_conexion: new Date().toISOString()
  }).eq("id", perfil.id);
}

function rtStartGPS({supabaseClient, perfil, rol, servicioId, onPosition, onError}){
  if(!navigator.geolocation){
    if(onError) onError("Este dispositivo no soporta GPS.");
    return null;
  }

  return navigator.geolocation.watchPosition(async pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    await supabaseClient.from("usuarios").update({
      realtime_online: true,
      realtime_rol: rol,
      realtime_lat: lat,
      realtime_lng: lng,
      realtime_ultima_conexion: new Date().toISOString()
    }).eq("id", perfil.id);

    await supabaseClient.from("realtime_ubicaciones").insert([{
      usuario_id: perfil.id,
      servicio_id: servicioId || null,
      rol,
      latitud: lat,
      longitud: lng,
      precision_metros: pos.coords.accuracy || 0,
      velocidad: pos.coords.speed || 0,
      rumbo: pos.coords.heading || 0,
      activo: true
    }]);

    if(onPosition) onPosition({lat, lng, accuracy: pos.coords.accuracy || 0});
  }, err => {
    if(onError) onError(err.message);
  }, {
    enableHighAccuracy: true,
    maximumAge: 2000,
    timeout: 12000
  });
}

function rtDistanceKm(lat1, lon1, lat2, lon2){
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

async function rtRoute(map, fromLng, fromLat, toLng, toLat){
  if(!map || !rtHasMapbox()) return null;
  try{
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLng},${fromLat};${toLng},${toLat}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    const route = data.routes && data.routes[0];
    if(!route) return null;

    const geojson = { type:"Feature", properties:{}, geometry:route.geometry };

    if(map.getSource("rt-route")){
      map.getSource("rt-route").setData(geojson);
    } else {
      map.addSource("rt-route", {type:"geojson", data:geojson});
      map.addLayer({
        id:"rt-route-line",
        type:"line",
        source:"rt-route",
        layout: {"line-join":"round","line-cap":"round"},
        paint: {"line-color":"#16C47F","line-width":6,"line-opacity":0.92}
      });
    }

    return { distanceKm: route.distance/1000, durationMin: Math.round(route.duration/60) };
  }catch(e){
    return null;
  }
}
