// TTRAIGO MAPBOX CORE — usa config-mapas.js
// Requiere que config-mapas.js tenga MAPBOX_TOKEN real.

const TTRAIGO_SUPABASE_URL = "https://lvqzkvahfklwzxbxbljv.supabase.co";
const TTRAIGO_SUPABASE_KEY = "sb_publishable_A122LY08w-r23qZADKtXlA__zPm6E8Q";

const TTRAIGO_CENTER = typeof TTRAIGO_DEFAULT_CENTER !== "undefined"
  ? TTRAIGO_DEFAULT_CENTER
  : [-69.9312, 18.4861];

const TTRAIGO_ZOOM = typeof TTRAIGO_DEFAULT_ZOOM !== "undefined"
  ? TTRAIGO_DEFAULT_ZOOM
  : 12;

function ttraigoMoney(n){
  return "RD$ " + Number(n || 0).toLocaleString("es-DO", {minimumFractionDigits:2, maximumFractionDigits:2});
}

function ttraigoEscape(v){
  return String(v || "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function ttraigoHasMapbox(){
  return typeof MAPBOX_TOKEN !== "undefined" && MAPBOX_TOKEN && !MAPBOX_TOKEN.includes("PON_AQUI");
}

function ttraigoCreateMap(container, center = TTRAIGO_CENTER, zoom = TTRAIGO_ZOOM){
  if(!ttraigoHasMapbox()){
    document.getElementById(container).innerHTML = `
      <div style="padding:24px;color:white">
        <h2>Falta token Mapbox</h2>
        <p>Abre config-mapas.js y pega tu token real.</p>
      </div>`;
    return null;
  }
  mapboxgl.accessToken = MAPBOX_TOKEN;
  const map = new mapboxgl.Map({
    container,
    style: typeof TTRAIGO_MAP_STYLE !== "undefined" ? TTRAIGO_MAP_STYLE : "mapbox://styles/mapbox/dark-v11",
    center,
    zoom
  });
  map.addControl(new mapboxgl.NavigationControl(), "top-right");
  return map;
}

function ttraigoMarker(map, lng, lat, color = "#16C47F", html = ""){
  if(!map || !lng || !lat) return null;
  const marker = new mapboxgl.Marker({color}).setLngLat([Number(lng), Number(lat)]).addTo(map);
  if(html) marker.setPopup(new mapboxgl.Popup({offset:25}).setHTML(html));
  return marker;
}

async function ttraigoGetSessionOrLogin(supabaseClient){
  const session = await supabaseClient.auth.getSession();
  if(!session.data.session){
    location.href = "login.html";
    return null;
  }
  const id = session.data.session.user.id;
  const perfil = await supabaseClient.from("usuarios").select("*").eq("id", id).single();
  return perfil.data;
}

function ttraigoWatchGPS({supabaseClient, perfil, rol, servicioId, onPosition, onError}){
  if(!navigator.geolocation){
    if(onError) onError("Este equipo no soporta GPS.");
    return null;
  }
  return navigator.geolocation.watchPosition(async pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const payload = {
      usuario_id: perfil.id,
      servicio_id: servicioId || null,
      rol,
      latitud: lat,
      longitud: lng,
      precision_metros: pos.coords.accuracy || 0,
      velocidad: pos.coords.speed || 0,
      rumbo: pos.coords.heading || 0,
      activo: true
    };

    await supabaseClient.from("ubicaciones_realtime").insert([payload]);
    await supabaseClient.from("usuarios").update({
      ultimo_lat: lat,
      ultimo_lng: lng,
      online: true,
      ultima_conexion: new Date().toISOString()
    }).eq("id", perfil.id);

    if(servicioId){
      const upd = {};
      upd[rol + "_lat"] = lat;
      upd[rol + "_lng"] = lng;
      await supabaseClient.from("servicios").update(upd).eq("id", servicioId);
    }

    if(onPosition) onPosition({lat, lng, accuracy: pos.coords.accuracy || 0});
  }, err => {
    if(onError) onError(err.message);
  }, {enableHighAccuracy:true, maximumAge:2000, timeout:12000});
}

async function ttraigoRoute(map, fromLng, fromLat, toLng, toLat){
  if(!map || !ttraigoHasMapbox()) return null;
  try{
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLng},${fromLat};${toLng},${toLat}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    const route = data.routes && data.routes[0];
    if(!route) return null;
    const geojson = {type:"Feature", properties:{}, geometry:route.geometry};
    if(map.getSource("ttraigo-route")){
      map.getSource("ttraigo-route").setData(geojson);
    }else{
      map.addSource("ttraigo-route", {type:"geojson", data:geojson});
      map.addLayer({
        id:"ttraigo-route-line",
        type:"line",
        source:"ttraigo-route",
        layout:{"line-join":"round","line-cap":"round"},
        paint:{"line-color":"#16C47F","line-width":6,"line-opacity":0.92}
      });
    }
    return {
      distanceKm: route.distance / 1000,
      durationMin: Math.round(route.duration / 60)
    };
  }catch(e){
    return null;
  }
}
