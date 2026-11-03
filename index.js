// Raja Rani notifier — runs on Render (free web service), a VPS, or Docker.
// Watches Firestore `notifications`, sends each one as a push via FCM,
// then deletes it. The app never needs a server key: only this service does.

const http = require('http');
const admin = require('firebase-admin');

// Key: FIREBASE_SERVICE_ACCOUNT env var (whole JSON, for Render) or a file.
function credentials() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) return JSON.parse(raw);
  return require(process.env.GOOGLE_APPLICATION_CREDENTIALS || '/app/service-account.json');
}
admin.initializeApp({ credential: admin.credential.cert(credentials()) });

const db = admin.firestore();
const fcm = admin.messaging();

const MAX_AGE_MS = 10 * 60 * 1000; // ignore anything older than 10 min
const PER_SENDER_PER_MIN = 20;      // simple spam guard
const recent = new Map();           // from -> [timestamps]
let sent = 0;
let lastEvent = null;

function allowed(from) {
  const now = Date.now();
  const list = (recent.get(from) || []).filter((t) => now - t < 60_000);
  if (list.length >= PER_SENDER_PER_MIN) return false;
  list.push(now);
  recent.set(from, list);
  return true;
}

function message(n) {
  const room = n.roomName || 'Raja Rani';
  switch (n.type) {
    case 'invite':
      return { title: `👑 ${n.fromName} invited you`, body: `Tap to join "${room}" (${n.code})` };
    case 'rematch':
      return { title: `🔁 ${n.fromName} wants a rematch`, body: `Tap to play again in "${room}"` };
    default:
      return null;
  }
}

async function handle(doc) {
  const n = doc.data();
  try {
    const created = n.createdAt ? n.createdAt.toMillis() : Date.now();
    if (Date.now() - created > MAX_AGE_MS) return;
    if (!n.to || !n.code || !allowed(n.from || 'unknown')) return;
    const text = message(n);
    if (!text) return;

    const device = await db.collection('devices').doc(n.to).get();
    const token = device.exists ? device.get('token') : null;
    if (!token) return;

    await fcm.send({
      token,
      notification: text,
      data: { type: String(n.type), code: String(n.code) },
      android: { priority: 'high', notification: { sound: 'default' } },
      apns: { payload: { aps: { sound: 'default' } } },
    });
    sent++;
    lastEvent = new Date().toISOString();
    console.log(lastEvent, 'sent', n.type, n.code, '->', n.to);
  } catch (e) {
    const code = e && e.errorInfo && e.errorInfo.code;
    if (code === 'messaging/registration-token-not-registered' || code === 'messaging/invalid-registration-token') {
      await db.collection('devices').doc(n.to).delete().catch(() => {});
    }
    console.error(new Date().toISOString(), 'failed', doc.id, code || e.message);
  } finally {
    await doc.ref.delete().catch(() => {});
  }
}

function listen() {
  console.log('Raja Rani notifier: listening for notifications…');
  db.collection('notifications').onSnapshot(
    (snap) => {
      for (const ch of snap.docChanges()) {
        if (ch.type === 'added') handle(ch.doc);
      }
    },
    (err) => {
      console.error('listener error, restarting in 5s:', err.message);
      setTimeout(listen, 5000);
    },
  );
}

listen();

// Tiny health page. Render needs a web port; a pinger hitting it keeps the
// free service awake.
const pages = require('./pages');
const port = process.env.PORT || 8080;
http
  .createServer((req, res) => {
    const path = (req.url || '/').split('?')[0].replace(/\/+$/, '');
    if (path === '/privacy' || path === '/terms') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(path === '/privacy' ? pages.privacy : pages.terms);
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, sent, lastEvent, uptime: Math.round(process.uptime()) }));
  })
  .listen(port, () => console.log('health on port', port));
