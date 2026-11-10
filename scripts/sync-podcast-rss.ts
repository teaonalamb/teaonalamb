import fs from 'node:fs';
import path from 'node:path';

interface PodcastEpisodeItem {
  id: string; num: string; title: string; date: string; duration: string;
  isExplicit: boolean; url: string; description: string; audioUrl?: string;
}
const RSS_FEED_URL = 'https://media.rss.com/tea-talks/feed.xml';
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/podcast-episodes.json');

const text = (value = '') => value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const tag = (item: string, name: string) => item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] ?? '';
const attribute = (item: string, name: string) => item.match(new RegExp(`<enclosure[^>]*\\b${name}=["']([^"']+)["']`, 'i'))?.[1] ?? '';
const duration = (raw: string) => {
  const value = text(raw);
  if (value.includes(':')) { const p = value.split(':').map(Number); return p.length === 3 ? `${p[0]}h ${p[1]}m` : `${p[0]}m`; }
  const seconds = Number.parseInt(value, 10); if (Number.isNaN(seconds)) return '—';
  return seconds >= 3600 ? `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m` : `${Math.floor(seconds / 60)}m`;
};
const date = (raw: string) => { const d = new Date(text(raw)); return Number.isNaN(d.getTime()) ? text(raw) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
const episodeNumber = (title: string, index: number) => title.match(/(?:season\s*(\d+)\s*)?(?:episode|ep)\.?\s*(\d+)/i) ? (() => { const m = title.match(/(?:season\s*(\d+)\s*)?(?:episode|ep)\.?\s*(\d+)/i)!; return m[1] ? `S${m[1]}E${m[2]}` : `E${m[2]}`; })() : `EP ${index + 1}`;

async function run() {
  const response = await fetch(RSS_FEED_URL, { headers: { 'User-Agent': 'TeaOS podcast sync/1.0', Accept: 'application/xml,text/xml,*/*' } });
  if (!response.ok) throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`);
  const items = (await response.text()).match(/<item[\s\S]*?<\/item>/gi) ?? [];
  if (!items.length) throw new Error('No episodes found in RSS feed.');
  const episodes: PodcastEpisodeItem[] = items.map((item, index) => {
    const title = text(tag(item, 'title')) || `Episode ${index + 1}`;
    const guid = text(tag(item, 'guid'));
    const link = text(tag(item, 'link'));
    const audioUrl = attribute(item, 'url');
    return { id: guid.replace(/^.*\//, '') || link.split('/').filter(Boolean).pop() || `episode-${index + 1}`, num: episodeNumber(title, index), title, date: date(tag(item, 'pubDate')), duration: duration(tag(item, 'itunes:duration')), isExplicit: /^(yes|true|explicit)$/i.test(text(tag(item, 'itunes:explicit'))), url: link || guid, description: text(tag(item, 'description')).slice(0, 360), ...(audioUrl ? { audioUrl } : {}) };
  });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(episodes, null, 2) + '\n');
  console.log(`Synced ${episodes.length} podcast episodes.`);
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
