// Public pages for the Play Store listing: privacy policy and terms.
// Change CONTACT to the email you use in Play Console.
const CONTACT = 'YOUR-EMAIL@example.com';
const UPDATED = '3 November 2026';

const shell = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} · Raja Rani</title>
<style>
  :root{color-scheme:dark}
  body{margin:0;background:#22073A;color:#FBF6EA;font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  main{max-width:720px;margin:0 auto;padding:40px 20px 64px}
  h1{color:#F5C04A;font-size:30px;margin:0 0 4px}
  h2{color:#F5C04A;font-size:19px;margin:28px 0 6px}
  p,li{color:#E9DFF7}
  small{color:#B7ABD6}
  a{color:#F5C04A}
</style></head>
<body><main>${body}</main></body></html>`;

const privacy = shell('Privacy Policy', `
<h1>Privacy Policy</h1>
<small>Raja Rani · Last updated ${UPDATED}</small>

<p>Raja Rani is a party card game you play with friends on your phones. This page explains what the app stores and why.</p>

<h2>No account, no login</h2>
<p>You don’t sign up. The app creates a random player ID on your phone and asks for a display name. We never ask for your email, phone number, contacts or location.</p>

<h2>What we store</h2>
<ul>
  <li><b>Display name</b> and <b>random player ID</b> — so friends in a room can see who is playing.</li>
  <li><b>Game data</b> — rooms you create or join, cards dealt, scores, and your game history and stats (games, wins, points).</li>
  <li><b>Recent players</b> — names and player IDs of people you’ve played with, so you can invite them again.</li>
  <li><b>Push token (Android)</b> — a device token from Firebase Cloud Messaging, used only to send you invites and rematch requests.</li>
</ul>

<h2>Camera</h2>
<p>The camera is used only to scan a room QR code when you choose “Scan QR”. No photos or video are saved or uploaded.</p>

<h2>Where it is stored</h2>
<p>Data is stored in Google Firebase (Cloud Firestore) and push notifications are sent through Firebase Cloud Messaging. Google processes this data on our behalf under its own privacy terms.</p>

<h2>What we don’t do</h2>
<ul>
  <li>No ads and no advertising IDs.</li>
  <li>No analytics or tracking.</li>
  <li>We never sell or share your data with anyone else.</li>
</ul>

<h2>Deleting your data</h2>
<p>In the app, open <b>Settings → Delete my data</b>. This deletes your stats, game history, recent players and push token, and gives your phone a new player ID. Uninstalling the app also removes your player ID from the phone. You can also email us to ask for deletion.</p>

<h2>Children</h2>
<p>Raja Rani is not directed at children under 13, and we don’t knowingly collect data from them.</p>

<h2>Changes</h2>
<p>If this policy changes, we’ll update this page and the date above.</p>

<h2>Contact</h2>
<p><a href="mailto:${CONTACT}">${CONTACT}</a></p>
`);

const terms = shell('Terms of Use', `
<h1>Terms of Use</h1>
<small>Raja Rani · Last updated ${UPDATED}</small>
<p>Raja Rani is a free game for fun with friends. There is no real money, betting or prizes.</p>
<h2>Fair play</h2>
<p>Please play fairly and use friendly display names. Don’t use the app to spam invites or harass other players.</p>
<h2>No warranty</h2>
<p>The app is provided as is. We try to keep it running, but games may occasionally be interrupted or lost.</p>
<h2>Contact</h2>
<p><a href="mailto:${CONTACT}">${CONTACT}</a></p>
`);

module.exports = { privacy, terms };
