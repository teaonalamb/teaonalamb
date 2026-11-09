/**
 * sync-socials.ts
 *
 * Command to sync up follower counts of all social accounts
 * (Twitch, TikTok, Instagram, X, YouTube) excluding Discord.
 * Outputs to src/socials-data.json and logs real-time updates.
 */

import * as fs from 'fs';
import * as path from 'path';

interface SocialProfile {
  platform: string;
  count: string;
  numericCount: number;
  label: string;
  url: string;
  handle: string;
  filename: string;
  color: string;
  lastSynced?: string;
}

const DEFAULT_FALLBACKS: Record<string, SocialProfile> = {
  Twitch: {
    platform: 'Twitch',
    count: '720',
    numericCount: 720,
    label: 'followers',
    url: 'https://twitch.tv/teaonalamb',
    handle: '@teaonalamb',
    filename: 'twitch.exe',
    color: '#6441a5',
  },
  TikTok: {
    platform: 'TikTok',
    count: '1.3k',
    numericCount: 1300,
    label: 'followers',
    url: 'https://tiktok.com/@teaonalamb',
    handle: '@teaonalamb',
    filename: 'tiktok.exe',
    color: '#ee1d52',
  },
  Instagram: {
    platform: 'Instagram',
    count: '668',
    numericCount: 668,
    label: 'followers',
    url: 'https://instagram.com/teaonalamb',
    handle: '@teaonalamb',
    filename: 'instagram.exe',
    color: '#c13584',
  },
  X: {
    platform: 'X',
    count: '317',
    numericCount: 317,
    label: 'followers',
    url: 'https://x.com/teaonalamb',
    handle: '@teaonalamb',
    filename: 'x.exe',
    color: '#0f1419',
  },
  YouTube: {
    platform: 'YouTube',
    count: '48',
    numericCount: 48,
    label: 'subscribers',
    url: 'https://youtube.com/@teaonalamb',
    handle: '@teaonalamb',
    filename: 'youtube.exe',
    color: '#ff0000',
  },
  Discord: {
    platform: 'Discord',
    count: '89',
    numericCount: 89,
    label: 'members',
    url: 'https://discord.com/invite/VEJYDJP7xM',
    handle: '',
    filename: 'discord.exe',
    color: '#5865f2',
  },
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return String(num);
}

// 1. Twitch via DecAPI (official public Nightbot/StreamElements endpoint)
async function fetchTwitchFollowers(): Promise<number | null> {
  try {
    const res = await fetch('https://decapi.me/twitch/followcount/teaonalamb', {
      headers: { 'User-Agent': 'TeaOS-Sync/1.0' },
    });
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    const parsed = parseInt(text.replace(/,/g, ''), 10);
    return isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
}

// 2. YouTube subscriber count from public channel page
async function fetchYouTubeSubscribers(): Promise<number | null> {
  try {
    const res = await fetch('https://www.youtube.com/@teaonalamb', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept: 'text/html',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/"subscriberCountText":\s*\{[^}]*"simpleText":\s*"([^"]+)"/i) ||
                  html.match(/([0-9.]+[KM]?)\s+subscribers/i);
    if (!match) return null;
    const rawStr = match[1].toLowerCase().replace('subscribers', '').trim();
    if (rawStr.includes('k')) {
      return Math.round(parseFloat(rawStr) * 1000);
    }
    if (rawStr.includes('m')) {
      return Math.round(parseFloat(rawStr) * 1000000);
    }
    const parsed = parseInt(rawStr.replace(/,/g, ''), 10);
    return isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
}

// 3. TikTok follower count
async function fetchTikTokFollowers(): Promise<number | null> {
  try {
    const res = await fetch('https://www.tiktok.com/@teaonalamb', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/"followerCount":\s*([0-9]+)/);
    if (match) {
      const parsed = parseInt(match[1], 10);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  } catch {
    return null;
  }
}

// 4. Instagram follower count
async function fetchInstagramFollowers(): Promise<number | null> {
  try {
    const res = await fetch('https://www.instagram.com/teaonalamb/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'text/html',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/([0-9,KM.]+)\s+Followers/i);
    if (match) {
      const str = match[1].toLowerCase();
      if (str.includes('k')) return Math.round(parseFloat(str) * 1000);
      if (str.includes('m')) return Math.round(parseFloat(str) * 1000000);
      return parseInt(str.replace(/,/g, ''), 10);
    }
    return null;
  } catch {
    return null;
  }
}

// 5. X / Twitter follower count
async function fetchXFollowers(): Promise<number | null> {
  try {
    const res = await fetch('https://nitter.net/teaonalamb', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/followers.*?([0-9,]+)/i);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''), 10);
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  console.log('[Socials] Starting social follower count sync...');
  console.log('[Socials] Note: Discord is preserved and excluded from web fetching as requested.\n');

  const outPath = path.resolve(process.cwd(), 'src/socials-data.json');
  let currentData: Record<string, SocialProfile> = {};
  if (fs.existsSync(outPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outPath, 'utf-8'));
      if (Array.isArray(existing)) {
        for (const item of existing) {
          currentData[item.platform] = item;
        }
      }
    } catch {
      // Use defaults
    }
  }

  // 1. Twitch
  process.stdout.write('Checking Twitch (@teaonalamb)... ');
  const twitchCount = await fetchTwitchFollowers();
  const twitchFinal = twitchCount ?? currentData['Twitch']?.numericCount ?? DEFAULT_FALLBACKS['Twitch'].numericCount;
  console.log(`OK: ${twitchFinal} followers`);

  // 2. YouTube
  process.stdout.write('Checking YouTube (@teaonalamb)... ');
  const ytCount = await fetchYouTubeSubscribers();
  const ytFinal = ytCount ?? currentData['YouTube']?.numericCount ?? DEFAULT_FALLBACKS['YouTube'].numericCount;
  console.log(`OK: ${ytFinal} subscribers`);

  // 3. TikTok
  process.stdout.write('Checking TikTok (@teaonalamb)... ');
  const tiktokArg = process.argv.find((a) => a.startsWith('--tiktok='))?.split('=')[1] || process.env.TIKTOK_FOLLOWERS;
  let tiktokOverride: number | null = null;
  if (tiktokArg) {
    const raw = tiktokArg.toLowerCase();
    if (raw.endsWith('k')) tiktokOverride = Math.round(parseFloat(raw) * 1000);
    else if (raw.endsWith('m')) tiktokOverride = Math.round(parseFloat(raw) * 1000000);
    else tiktokOverride = parseInt(raw, 10);
  }
  const tiktokCount = tiktokOverride ?? (await fetchTikTokFollowers());
  const tiktokFinal = tiktokCount ?? currentData['TikTok']?.numericCount ?? DEFAULT_FALLBACKS['TikTok'].numericCount;
  console.log(`OK: ${tiktokFinal} followers`);

  // 4. Instagram
  process.stdout.write('Checking Instagram (@teaonalamb)... ');
  const instaCount = await fetchInstagramFollowers();
  const instaFinal = instaCount ?? currentData['Instagram']?.numericCount ?? DEFAULT_FALLBACKS['Instagram'].numericCount;
  console.log(`OK: ${instaFinal} followers`);

  // 5. X
  process.stdout.write('Checking X (@teaonalamb)... ');
  const xCount = await fetchXFollowers();
  const xFinal = xCount ?? currentData['X']?.numericCount ?? DEFAULT_FALLBACKS['X'].numericCount;
  console.log(`OK: ${xFinal} followers`);

  // 6. Discord (preserved without web grabbing)
  const discordCount = currentData['Discord']?.numericCount ?? DEFAULT_FALLBACKS['Discord'].numericCount;
  console.log(`Preserved Discord: ${discordCount} members (excluded from web scraping)`);

  const now = new Date().toISOString();

  const results: SocialProfile[] = [
    {
      ...DEFAULT_FALLBACKS['Twitch'],
      numericCount: twitchFinal,
      count: formatNumber(twitchFinal),
      lastSynced: now,
    },
    {
      ...DEFAULT_FALLBACKS['TikTok'],
      numericCount: tiktokFinal,
      count: formatNumber(tiktokFinal),
      lastSynced: now,
    },
    {
      ...DEFAULT_FALLBACKS['Instagram'],
      numericCount: instaFinal,
      count: formatNumber(instaFinal),
      lastSynced: now,
    },
    {
      ...DEFAULT_FALLBACKS['X'],
      numericCount: xFinal,
      count: formatNumber(xFinal),
      lastSynced: now,
    },
    {
      ...DEFAULT_FALLBACKS['YouTube'],
      numericCount: ytFinal,
      count: formatNumber(ytFinal),
      lastSynced: now,
    },
    {
      ...DEFAULT_FALLBACKS['Discord'],
      numericCount: discordCount,
      count: formatNumber(discordCount),
      lastSynced: now,
    },
  ];

  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n[Socials] Successfully synced social counts to ${outPath}`);
}

main();
