import fs from 'node:fs';
import path from 'node:path';

interface PodcastEpisodeItem {
  id: string;
  num: string;
  title: string;
  date: string;
  duration: string;
  isExplicit: boolean;
  url: string;
  description: string;
  audioUrl?: string;
  imageUrl?: string;
  transcriptUrl?: string;
}

const RSS_FEED_URL = 'https://media.rss.com/tea-talks/feed.xml';
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/podcast-episodes.json');

const text = (value = '') =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const tag = (item: string, name: string) =>
  item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] ?? '';

const tagAttribute = (item: string, tagName: string, attributeName: string) =>
  item.match(new RegExp(`<${tagName}[^>]*\\b${attributeName}=["']([^"']+)["']`, 'i'))?.[1] ?? '';

const duration = (raw: string) => {
  const value = text(raw);
  if (value.includes(':')) {
    const parts = value.split(':').map(Number);
    return parts.length === 3 ? `${parts[0]}h ${parts[1]}m` : `${parts[0]}m`;
  }
  const seconds = Number.parseInt(value, 10);
  if (Number.isNaN(seconds)) return 'Unknown';
  return seconds >= 3600
    ? `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
    : `${Math.floor(seconds / 60)}m`;
};

const date = (raw: string) => {
  const parsed = new Date(text(raw));
  return Number.isNaN(parsed.getTime())
    ? text(raw)
    : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const episodeNumber = (title: string, index: number) => {
  const match = title.match(/(?:season\s*(\d+)\s*)?(?:episode|ep)\.?\s*(\d+)/i);
  return match ? (match[1] ? `S${match[1]}E${match[2]}` : `E${match[2]}`) : `EP ${index + 1}`;
};

async function run() {
  const response = await fetch(RSS_FEED_URL, {
    headers: {
      'User-Agent': 'TeaOS podcast sync/1.0',
      Accept: 'application/xml,text/xml,*/*',
    },
  });

  if (!response.ok) throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`);

  const items = (await response.text()).match(/<item[\s\S]*?<\/item>/gi) ?? [];
  if (!items.length) throw new Error('No episodes found in RSS feed.');

  const episodes: PodcastEpisodeItem[] = items.map((item, index) => {
    const title = text(tag(item, 'title')) || `Episode ${index + 1}`;
    const guid = text(tag(item, 'guid'));
    const link = text(tag(item, 'link'));
    const audioUrl = tagAttribute(item, 'enclosure', 'url');
    const imageUrl = tagAttribute(item, 'itunes:image', 'href');
    const transcriptUrl = tagAttribute(item, 'podcast:transcript', 'url');

    return {
      id: guid.replace(/^.*\//, '') || link.split('/').filter(Boolean).pop() || `episode-${index + 1}`,
      num: episodeNumber(title, index),
      title,
      date: date(tag(item, 'pubDate')),
      duration: duration(tag(item, 'itunes:duration')),
      isExplicit: /^(yes|true|explicit)$/i.test(text(tag(item, 'itunes:explicit'))),
      url: link || guid,
      description: text(tag(item, 'description')).slice(0, 1800),
      ...(audioUrl ? { audioUrl } : {}),
      ...(imageUrl ? { imageUrl } : {}),
      ...(transcriptUrl ? { transcriptUrl } : {}),
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(episodes, null, 2) + '\n');
  console.log(`Synced ${episodes.length} podcast episodes.`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
