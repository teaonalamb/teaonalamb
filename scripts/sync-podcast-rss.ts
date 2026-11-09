import fs from 'node:fs';
import path from 'node:path';

/**
 * Command script: pulls newest podcast episode information from RSS.com feed
 * and updates src/podcast-episodes.json for the podcast page.
 *
 * Usage:
 *   npm run sync:podcast
 *   or: npx tsx scripts/sync-podcast-rss.ts
 */

interface PodcastEpisodeItem {
  id: string;
  num: string;
  title: string;
  date: string;
  duration: string;
  isExplicit: boolean;
  url: string;
  description: string;
}

const RSS_FEED_URL = 'https://media.rss.com/tea-talks/feed.xml';
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/podcast-episodes.json');

function cleanXmlText(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function formatDate(pubDateStr: string): string {
  try {
    const d = new Date(pubDateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  } catch {
    // fallback
  }
  return pubDateStr;
}

function formatDuration(secOrFormatted: string): string {
  if (secOrFormatted.includes(':')) {
    const parts = secOrFormatted.split(':').map(Number);
    if (parts.length === 2) {
      return `${parts[0]}m`;
    }
    if (parts.length === 3) {
      return `${parts[0]}h ${parts[1]}m`;
    }
  }
  const sec = parseInt(secOrFormatted, 10);
  if (!isNaN(sec)) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
  return '1h';
}

async function run() {
  console.log(`Fetching latest RSS feed from: ${RSS_FEED_URL}...`);
  try {
    const response = await fetch(RSS_FEED_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: HTTP ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();
    const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

    if (itemMatches.length === 0) {
      console.log('No <item> elements found in RSS feed. Keeping existing episodes.');
      return;
    }

    const episodes: PodcastEpisodeItem[] = [];

    itemMatches.forEach((rawItem, idx) => {
      const titleMatch = rawItem.match(/<title>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? cleanXmlText(titleMatch[1]) : `Episode ${idx + 1}`;

      const linkMatch = rawItem.match(/<link>([\s\S]*?)<\/link>/i);
      const guidMatch = rawItem.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i);
      const url = linkMatch
        ? cleanXmlText(linkMatch[1])
        : guidMatch
        ? cleanXmlText(guidMatch[1])
        : `https://rss.com/podcasts/tea-talks/`;

      const pubDateMatch = rawItem.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
      const date = pubDateMatch ? formatDate(cleanXmlText(pubDateMatch[1])) : 'Recently';

      const durationMatch =
        rawItem.match(/<itunes:duration>([\s\S]*?)<\/itunes:duration>/i) ||
        rawItem.match(/<duration>([\s\S]*?)<\/duration>/i);
      const duration = durationMatch ? formatDuration(cleanXmlText(durationMatch[1])) : '1h';

      const explicitMatch = rawItem.match(/<itunes:explicit>([\s\S]*?)<\/itunes:explicit>/i);
      const isExplicit = explicitMatch
        ? /^(true|yes|explicit)$/i.test(cleanXmlText(explicitMatch[1]))
        : true;

      const descMatch =
        rawItem.match(/<description>([\s\S]*?)<\/description>/i) ||
        rawItem.match(/<itunes:summary>([\s\S]*?)<\/itunes:summary>/i);
      const description = descMatch ? cleanXmlText(descMatch[1]).slice(0, 220) : '';

      // Number badge detection
      let num = `E${idx + 1}`;
      const seasonMatch = rawItem.match(/<itunes:season>(\d+)<\/itunes:season>/i);
      const episodeMatch = rawItem.match(/<itunes:episode>(\d+)<\/itunes:episode>/i);
      if (seasonMatch && episodeMatch) {
        num = `S${seasonMatch[1]}E${episodeMatch[1]}`;
      } else {
        const titleNumMatch = title.match(/(?:S(\d+)\s*E(\d+)|Episode\s*(\d+)|E(\d+))/i);
        if (titleNumMatch) {
          if (titleNumMatch[1] && titleNumMatch[2]) {
            num = `S${titleNumMatch[1]}E${titleNumMatch[2]}`;
          } else {
            num = `E${titleNumMatch[3] || titleNumMatch[4]}`;
          }
        }
      }

      const id = url.split('/').filter(Boolean).pop() || `ep-${idx + 1}`;

      episodes.push({
        id,
        num,
        title,
        date,
        duration,
        isExplicit,
        url,
        description,
      });
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(episodes, null, 2), 'utf-8');
    console.log(`Successfully synced ${episodes.length} episodes to ${OUTPUT_FILE}!`);
  } catch (err: unknown) {
    console.warn(`Could not reach live RSS feed: ${(err as Error).message}`);
    console.log('Writing existing fallback episodes to src/podcast-episodes.json...');

    // Fallback baseline episodes from types.ts
    const fallbackEpisodes: PodcastEpisodeItem[] = [
      {
        id: 's2e1',
        num: 'S2E1',
        title: 'Mental Health and Self Discovery, ft. GodofPixelz',
        date: 'Oct 8, 2026',
        duration: '1h 20m',
        isExplicit: true,
        url: 'https://rss.com/podcasts/tea-talks/3217354/',
        description: 'Season 2 kickoff episode diving into navigating personal growth and mental well-being while streaming.',
      },
      {
        id: 's1e25',
        num: 'S1E25',
        title: 'What Is Loss? ft. pwnedman',
        date: 'Jun 6, 2024',
        duration: '1h 12m',
        isExplicit: true,
        url: 'https://rss.com/podcasts/tea-talks/1496937/',
        description: 'An open discussion on dealing with grief, gaming memories, and keeping perspective.',
      },
      {
        id: 's1e24',
        num: 'S1E24',
        title: 'Michelin Man? No, Michelin Cook, ft. Martin',
        date: 'May 30, 2024',
        duration: '1h 9m',
        isExplicit: true,
        url: 'https://rss.com/podcasts/tea-talks/1496926/',
        description: 'Stories from culinary high-stakes kitchens and the foods that bring comfort after long streams.',
      },
      {
        id: 'e23',
        num: 'E23',
        title: 'The Fling Strikes Back',
        date: 'Jan 11, 2024',
        duration: '1h 17m',
        isExplicit: true,
        url: 'https://rss.com/podcasts/tea-talks/1251986/',
        description: 'Hilarious dating stories, awkward meetups, and lessons learned the hard way.',
      },
      {
        id: 'e22',
        num: 'E22',
        title: 'New Place, New Stress, ft. Hari',
        date: 'Jan 4, 2024',
        duration: '1h 26m',
        isExplicit: true,
        url: 'https://rss.com/podcasts/tea-talks/1251981/',
        description: 'Moving apartments, room setup chaos, and adjusting to new creative environments.',
      },
    ];

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fallbackEpisodes, null, 2), 'utf-8');
    console.log(`Saved baseline episodes to ${OUTPUT_FILE}`);
  }
}

run();
