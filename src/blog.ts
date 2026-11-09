/// <reference types="vite/client" />
import { BlogPostData } from './types';

/**
 * Blog posts live as Markdown files in src/posts/.
 * Add a file, commit, site rebuilds. See HOW_TO_POST.md.
 * Files starting with "_" (like _template.md) are ignored.
 */
const files = import.meta.glob('./posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const stripQuotes = (s: string) => s.trim().replace(/^["']|["']$/g, '');

function parseFile(raw: string) {
  const m = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const meta: Record<string, string> = {};
  m[1].split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i < 1 || line.trim().startsWith('#')) return;
    meta[line.slice(0, i).trim().toLowerCase()] = stripQuotes(line.slice(i + 1));
  });
  return { meta, body: m[2].trim() };
}

// Dates are written in Pacific time: 2026-11-20 or 2026-11-20 19:00
function pacificToUtc(s: string): { when: Date; label: string } | null {
  const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?/);
  if (!m) return null;
  const [y, mo, d, h, mi] = [m[1], m[2], m[3], m[4] || '0', m[5] || '0'].map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hourCycle: 'h23',
    year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',
  });
  const offset = (t: number) => {
    const p = fmt.formatToParts(new Date(t));
    const g = (k: string) => Number(p.find((x) => x.type === k)!.value);
    return Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute')) - t;
  };
  let t = guess - offset(guess);
  t = guess - offset(t);
  const label = new Date(Date.UTC(y, mo - 1, d)).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
  return { when: new Date(t), label };
}

function plainText(md: string) {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[#>*`_-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export function loadPosts(now = new Date()): BlogPostData[] {
  const out: { post: BlogPostData; at: number }[] = [];

  Object.entries(files).forEach(([path, raw]) => {
    const fileName = path.split('/').pop()!.replace(/\.md$/, '');
    if (fileName.startsWith('_')) return;
    const parsed = parseFile(raw);
    if (!parsed) {
      console.warn(`[blog] ${fileName}.md is missing the --- header, skipped`);
      return;
    }
    const { meta, body } = parsed;
    if (/^(true|yes)$/i.test(meta.draft || '')) return;

    const dated = pacificToUtc(meta.date || '');
    if (!dated) console.warn(`[blog] ${fileName}.md has no valid date (use 2026-11-20), published now`);
    const when = dated ? dated.when : now;
    if (when.getTime() > now.getTime()) return; // scheduled for the future

    const tags = (meta.tags || '')
      .replace(/^\[|\]$/g, '')
      .split(',')
      .map(stripQuotes)
      .filter(Boolean);
    const text = plainText(body);
    const words = text ? text.split(' ').length : 0;
    const slug = slugify(meta.slug || fileName);
    const excerpt =
      meta.excerpt || (text.length > 180 ? text.slice(0, 180).trimEnd() + '...' : text);

    out.push({
      at: when.getTime(),
      post: {
        id: slug,
        slug,
        title: meta.title || fileName,
        date: dated ? dated.label : '',
        readTime: `${Math.max(1, Math.ceil(words / 200))} min read`,
        category: meta.category || tags[0] || 'Blog',
        excerpt,
        tags,
        featuredImage: meta.image || undefined,
        content: body,
      },
    });
  });

  return out.sort((a, b) => b.at - a.at).map((x) => x.post);
}

export const BLOG_POSTS: BlogPostData[] = loadPosts();
