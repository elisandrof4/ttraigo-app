
// TTRAIGO PUSH NOTIFICATIONS FRONTEND
// Requiere firebase-config.js y Firebase SDK.

async function ttraigoGetCurrentUserProfile() {
  if (typeof supabaseClient === "undefined") return null;
  const sessionRes = await supabaseClient.auth.getSession();
  const session = sessionRes?.data?.session;
  if (!session) return null;
  const uid = session.user.id;
  const profileRes = await supabaseClient.from("usuarios").select("*").eq("id", uid).single();
  return profileRes.data || null;
}

async function ttraigoInitPush() {
  try {
    if (!("Notification" in window)) {
      console.log("Este navegador no soporta notificaciones.");
      return null;
    }

    if (!window.TTRAIGO_FIREBASE_CONFIG || !window.TTRAIGO_FIREBASE_VAPID_KEY) {
      console.log("Falta firebase-config.js");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Permiso de notificación no concedido.");
      return null;
    }

    const app = firebase.initializeApp(window.TTRAIGO_FIREBASE_CONFIG);
    const messaging = firebase.messaging();

    const token = await messaging.getToken({
      vapidKey: window.TTRAIGO_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.register("/firebase-messaging-sw.js")
    });

    const profile = await ttraigoGetCurrentUserProfile();

    if (token && profile && typeof supabaseClient !== "undefined") {
      await supabaseClient.from("push_tokens").upsert([{
        usuario_id: profile.id,
        rol: profile.rol,
        token,
        plataforma: "web-pwa",
        activo: true,
        actualizado_en: new Date().toISOString()
      }], { onConflict: "token" });
    }

    messaging.onMessage((payload) => {
      const title = payload.notification?.title || "Ttraigo";
      const body = payload.notification?.body || "Nueva notificación";
      try {
        new Notification(title, { body, icon: "/icon-192.svg" });
      } catch (e) {
        console.log(title, body);
      }
      if (typeof toast === "function") toast(title + ": " + body);
      if (typeof beep === "function") beep();
    });

    return token;
  } catch (err) {
    console.error("Error inicializando push:", err);
    return null;
  }
}

async function ttraigoNotifyInApp(usuario_id, servicio_id, titulo, mensaje, tipo = "general") {
  if (typeof supabaseClient === "undefined") return;
  await supabaseClient.from("notificaciones").insert([{
    usuario_id,
    servicio_id,
    titulo,
    mensaje,
    tipo
  }]);
}
