// Builds src/socials-data.json for the website.
// For each platform it tries several sources in order and uses the first number that looks right:
//   1. the platform itself, 2. stat tracker sites (Social Blade etc.), 3. your manual number.
// Manual numbers live in src/followers-manual.json and are also used to sanity check live numbers.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src', 'socials-data.json');
const MANUAL = path.join(ROOT, 'src', 'followers-manual.json');
const U = 'teaonalamb';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const PROFILES = [
  { platform: 'Twitch', label: 'followers', url: 'https://twitch.tv/teaonalamb', handle: '@teaonalamb', filename: 'twitch.exe', color: '#6441a5' },
  { platform: 'TikTok', label: 'followers', url: 'https://tiktok.com/@teaonalamb', handle: '@teaonalamb', filename: 'tiktok.exe', color: '#ee1d52' },
  { platform: 'Instagram', label: 'followers', url: 'https://instagram.com/teaonalamb', handle: '@teaonalamb', filename: 'instagram.exe', color: '#c13584' },
  { platform: 'X', label: 'followers', url: 'https://x.com/teaonalamb', handle: '@teaonalamb', filename: 'x.exe', color: '#0f1419' },
  { platform: 'YouTube', label: 'subscribers', url: 'https://youtube.com/@teaonalamb', handle: '@teaonalamb', filename: 'youtube.exe', color: '#ff0000' },
  { platform: 'Discord', label: 'members', url: 'https://discord.com/invite/VEJYDJP7xM', handle: '', filename: 'discord.exe', color: '#5865f2' },
];

// ---------- helpers ----------
export function parseCount(s) {
  const m = String(s).trim().replace(/,/g, '').match(/^([\d.]+)\s*([kKmM]?)/);
  if (!m) return null;
  const n = parseFloat(m[1]) * ({ k: 1e3, m: 1e6 }[m[2].toLowerCase()] || 1);
  return Number.isFinite(n) ? Math.round(n) : null;
}

export function formatNumber(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e4) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return n.toLocaleString('en-US');
}

async function get(url, headers = {}) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9', ...headers }, signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r;
}
const getText = async (url, h) => (await get(url, h)).text();
const getJson = async (url, h) => (await get(url, h)).json();
const toText = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');

// Stat site pages: find "Followers 1,742" or "Subscribers 143" in the page text
export function parseTrackerText(html) {
  const t = toText(html);
  const m = t.match(/(?:followers|subscribers)\s*[:\-]?\s*(\d[\d,.]*\s*[kKmM]?)(?![\w])/i);
  if (!m) throw new Error('no count found on page');
  return parseCount(m[1]);
}
const tracker = (url) => async () => parseTrackerText(await getText(url));

// ---------- the platforms themselves ----------
export function parseTikTok(html) {
  const m = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
  if (m) {
    try {
      const info = JSON.parse(m[1])?.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo;
      if (info?.user?.uniqueId?.toLowerCase() === U && Number.isFinite(info?.stats?.followerCount)) return info.stats.followerCount;
    } catch {}
  }
  const r = html.match(new RegExp(`"uniqueId":"${U}"[\\s\\S]{0,8000}?"followerCount":(\\d+)`, 'i'));
  if (r) return Number(r[1]);
  throw new Error('count not in page (TikTok may be hiding it)');
}
const tiktokDirect = async () => parseTikTok(await getText(`https://www.tiktok.com/@${U}`));

const instagramDirect = async () => {
  const j = await getJson(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${U}`, { 'x-ig-app-id': '936619743392459' });
  const n = j?.data?.user?.edge_followed_by?.count;
  if (!Number.isFinite(n)) throw new Error('no count in reply');
  return n;
};

const xDirect = async () => {
  const j = await getJson(`https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${U}`);
  const n = j?.[0]?.followers_count;
  if (!Number.isFinite(n)) throw new Error('no count in reply');
  return n;
};

export function parseYouTube(html) {
  const m = html.match(/"subscriberCountText"[\s\S]{0,300}?"simpleText":"([^"]+)"/) || html.match(/([\d.,]+\s*[KM]?)\s+subscribers/i);
  if (!m) throw new Error('no subscriber text found');
  return parseCount(m[1]);
}
const youtubeDirect = async () => parseYouTube(await getText(`https://www.youtube.com/@${U}`, { Cookie: 'SOCS=CAI; CONSENT=YES+1' }));

const twitchDecapi = async () => {
  const t = (await getText(`https://decapi.me/twitch/followcount/${U}`)).trim().replace(/,/g, '');
  if (!/^\d+$/.test(t)) throw new Error('unexpected reply: ' + t.slice(0, 40));
  return Number(t);
};

// ---------- sources per platform, tried in order. Add or remove lines freely. ----------
const SOURCES = {
  Twitch: [['decapi.me', twitchDecapi], ['twitchtracker', tracker(`https://twitchtracker.com/${U}`)], ['socialblade', tracker(`https://socialblade.com/twitch/user/${U}`)]],
  TikTok: [['tiktok.com', tiktokDirect], ['socialblade', tracker(`https://socialblade.com/tiktok/user/${U}`)]],
  Instagram: [['instagram.com', instagramDirect], ['socialblade', tracker(`https://socialblade.com/instagram/user/${U}`)]],
  X: [['twitter syndication', xDirect], ['socialblade', tracker(`https://socialblade.com/twitter/user/${U}`)]],
  YouTube: [['youtube.com', youtubeDirect], ['socialblade', tracker(`https://socialblade.com/youtube/handle/${U}`)]],
  Discord: [], // always manual
};

async function main() {
  const manual = JSON.parse(fs.readFileSync(MANUAL, 'utf8'));
  const now = new Date().toISOString();
  const out = [];
  for (const p of PROFILES) {
    const anchor = Number(manual[p.platform]);
    let n = anchor, source = 'manual';
    for (const [name, fn] of SOURCES[p.platform]) {
      try {
        const v = await fn();
        // Reject numbers that are far from your manual number. That means a wrong page or a blocked page.
        if (!Number.isFinite(v) || v < anchor * 0.5 || v > anchor * 2) throw new Error(`got ${v}, looks wrong next to ${anchor}`);
        n = v; source = name;
        break;
      } catch (e) {
        console.log(`${p.platform}: ${name} failed (${e.message})`);
      }
    }
    if (!Number.isFinite(n)) throw new Error(`No number for ${p.platform}`);
    console.log(`${p.platform}: ${n} (from ${source})`);
    out.push({ ...p, count: formatNumber(n), numericCount: n, lastSynced: now, source });
  }
  const strip = (a) => JSON.stringify(a.map(({ lastSynced, ...r }) => r));
  let prev = [];
  try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch {}
  if (strip(prev) === strip(out)) return console.log('No changes');
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log('Wrote src/socials-data.json');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

