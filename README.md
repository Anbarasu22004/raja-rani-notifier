# Raja Rani notifier (VPS)

Sends invite and rematch push notifications. The app writes a small
`notifications` doc; this service sends it through Firebase Cloud Messaging
and deletes it. Free: FCM costs nothing and the app stays on the Spark plan.

## 1. Get the service account key (once)

Firebase console → ⚙ Project settings → **Service accounts** →
**Generate new private key**. Save it as `service-account.json` in this folder.
Keep it secret — never put it in the app or in git.

## 2. Run on the VPS

```bash
scp -r notifier you@your-vps:~/raja-rani-notifier
ssh you@your-vps
cd ~/raja-rani-notifier
docker compose up -d --build
docker compose logs -f        # should say: listening for notifications…
```

No Docker? `npm install && node index.js` (use pm2 to keep it running:
`pm2 start index.js --name raja-rani-notifier`).

No ports need opening — it only connects out to Google.
