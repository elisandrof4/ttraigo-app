// Vercel Serverless Function: /api/send-push
// Requiere variable de entorno FIREBASE_SERVER_KEY.
// Nota: para producción se recomienda Firebase Admin SDK con service account.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, title, body, data } = req.body || {};

  if (!token || !title || !body) {
    return res.status(400).json({ error: "token, title and body are required" });
  }

  const serverKey = process.env.FIREBASE_SERVER_KEY;
  if (!serverKey) {
    return res.status(500).json({ error: "Missing FIREBASE_SERVER_KEY env var" });
  }

  const response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Authorization": "key=" + serverKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      to: token,
      notification: {
        title,
        body,
        icon: "/icon-192.svg"
      },
      data: data || {}
    })
  });

  const json = await response.json();
  return res.status(response.ok ? 200 : 500).json(json);
}
