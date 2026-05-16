// TTRAIGO CORE REALTIME PARTE 2
// Requiere:
// - config-mapas.js
// - ttraigo-realtime-core.js

function rt2SmoothMove(marker, lng, lat){
  if(!marker) return;
  marker.setLngLat([Number(lng), Number(lat)]);
}

async function rt2GetTarifa(supabaseClient){
  const r = await supabaseClient.from("realtime_tarifas").select("*").eq("activa", true).limit(1).maybeSingle();
  return r.data || {
    tarifa_base:150,
    precio_km:65,
    precio_minuto:8,
    cargo_acompanante:1000,
    cargo_silla_ruedas:250,
    multiplicador_demanda:1
  };
}

function rt2CalcularPrecio({tarifa, km, min, acompanante=false, silla=false}){
  let total =
    Number(tarifa.tarifa_base || 0) +
    (Number(km || 0) * Number(tarifa.precio_km || 0)) +
    (Number(min || 0) * Number(tarifa.precio_minuto || 0));

  if(acompanante) total += Number(tarifa.cargo_acompanante || 0);
  if(silla) total += Number(tarifa.cargo_silla_ruedas || 0);

  total = total * Number(tarifa.multiplicador_demanda || 1);
  return Math.round(total);
}

async function rt2GuardarPuntoRuta({supabaseClient, servicioId, perfil, rol, lat, lng, velocidad=0, rumbo=0}){
  await supabaseClient.from("realtime_rutas_historial").insert([{
    servicio_id: servicioId || null,
    usuario_id: perfil.id,
    rol,
    latitud: lat,
    longitud: lng,
    velocidad,
    rumbo
  }]);

  if(servicioId){
    await supabaseClient.from("realtime_servicios").update({
      ultima_actualizacion_gps: new Date().toISOString()
    }).eq("id", servicioId);
  }
}

async function rt2BuscarChoferesCercanos({supabaseClient, servicio, limite=10}){
  const choferes = await supabaseClient
    .from("usuarios")
    .select("*")
    .eq("realtime_rol", "chofer")
    .eq("realtime_online", true)
    .not("realtime_lat", "is", null)
    .limit(50);

  const data = choferes.data || [];
  const origenLat = Number(servicio.origen_lat || servicio.cliente_lat || 0);
  const origenLng = Number(servicio.origen_lng || servicio.cliente_lng || 0);

  const scored = data.map(c => {
    const dist = rtDistanceKm(origenLat, origenLng, Number(c.realtime_lat), Number(c.realtime_lng));
    const eta = Math.max(2, Math.round((dist / 28) * 60));
    const score = Math.max(0, 100 - (dist * 8) - (eta * 1.2));
    return {chofer:c, dist, eta, score};
  }).sort((a,b)=>b.score-a.score).slice(0, limite);

  await supabaseClient.from("realtime_matching").delete().eq("servicio_id", servicio.id);

  if(scored.length){
    await supabaseClient.from("realtime_matching").insert(scored.map(x => ({
      servicio_id: servicio.id,
      chofer_id: x.chofer.id,
      chofer_nombre: x.chofer.nombre || x.chofer.email || "Chofer",
      chofer_lat: x.chofer.realtime_lat,
      chofer_lng: x.chofer.realtime_lng,
      distancia_cliente_km: x.dist,
      eta_min: x.eta,
      score: x.score,
      estado: "sugerido"
    })));
  }

  return scored;
}

async function rt2CrearSOS({supabaseClient, servicioId, perfil, rol, lat, lng, mensaje}){
  const r = await supabaseClient.from("realtime_sos_mapa").insert([{
    servicio_id: servicioId || null,
    usuario_id: perfil.id,
    rol,
    latitud: lat || null,
    longitud: lng || null,
    mensaje: mensaje || "SOS activado",
    estado: "abierta"
  }]).select().single();

  if(servicioId){
    await supabaseClient.from("realtime_servicios").update({
      sos_activo:true
    }).eq("id", servicioId);
  }

  return r.data;
}

function rt2PintarSOS(map, sos){
  if(!map || !sos.latitud || !sos.longitud) return null;
  return rtMarker(map, sos.longitud, sos.latitud, "#EF4444", `<b>SOS</b><br>${rtEscape(sos.mensaje)}<br>${new Date(sos.creado_en).toLocaleString()}`);
}

async function rt2CargarHistorialRuta({supabaseClient, map, servicioId, rol}){
  const q = supabaseClient
    .from("realtime_rutas_historial")
    .select("*")
    .eq("servicio_id", servicioId)
    .order("creado_en", {ascending:true})
    .limit(500);

  const r = rol ? await q.eq("rol", rol) : await q;
  const points = r.data || [];
  if(points.length < 2 || !map) return points;

  const coords = points.map(p => [Number(p.longitud), Number(p.latitud)]);
  const geojson = {type:"Feature", properties:{}, geometry:{type:"LineString", coordinates:coords}};

  if(map.getSource("rt2-history")){
    map.getSource("rt2-history").setData(geojson);
  }else{
    map.addSource("rt2-history", {type:"geojson", data:geojson});
    map.addLayer({
      id:"rt2-history-line",
      type:"line",
      source:"rt2-history",
      layout:{"line-join":"round","line-cap":"round"},
      paint:{"line-color":"#D8B76A","line-width":4,"line-opacity":0.9}
    });
  }

  return points;
}
