import fs from 'node:fs';
import path from 'node:path';

/**
 * Command script: pulls the latest published blog post from src/posts/
 * and generates src/latest-blog.json so Home page always links to the newest post.
 */
interface PostMeta {
  title: string;
  date: string;
  category?: string;
  tags?: string;
  excerpt?: string;
  draft?: string;
  slug?: string;
}

const postsDir = path.resolve(process.cwd(), 'src/posts');
const outputFile = path.resolve(process.cwd(), 'src/latest-blog.json');

function stripQuotes(str: string): string {
  return str.trim().replace(/^["']|["']$/g, '');
}

function parseMarkdownFile(content: string): { meta: PostMeta; body: string } | null {
  const match = content.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;

  const rawMeta = match[1];
  const body = match[2].trim();
  const meta: Record<string, string> = {};

  rawMeta.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex < 1 || line.trim().startsWith('#')) return;
    const key = line.slice(0, colonIndex).trim().toLowerCase();
    const value = stripQuotes(line.slice(colonIndex + 1));
    meta[key] = value;
  });

  return { meta: meta as unknown as PostMeta, body };
}

function run() {
  if (!fs.existsSync(postsDir)) {
    console.error(`Posts directory not found: ${postsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
  const posts: Array<{ slug: string; title: string; date: string; excerpt: string; timestamp: number }> = [];

  const now = Date.now();

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parseMarkdownFile(content);
    if (!parsed) continue;

    const { meta, body } = parsed;
    if (meta.draft === 'true' || meta.draft === 'yes') continue;

    const fileSlug = file.replace(/\.md$/, '');
    const slug = meta.slug ? meta.slug : fileSlug;
    const dateStr = meta.date || '2026-01-01';
    const timestamp = new Date(dateStr).getTime() || 0;

    // Skip future posts if scheduled
    if (timestamp > now) continue;

    let excerpt = meta.excerpt;
    if (!excerpt) {
      const cleanBody = body
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/[#>*`_-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      excerpt = cleanBody.slice(0, 150) + '...';
    }

    posts.push({
      slug,
      title: meta.title || fileSlug,
      date: dateStr,
      excerpt,
      timestamp,
    });
  }

  posts.sort((a, b) => b.timestamp - a.timestamp);

  const latest = posts[0] || {
    slug: 'origin-story',
    title: 'Why I named my channel after a sheep and a teacup',
    date: '2026-11-02',
    excerpt: 'The story behind the name teaonalamb and high school jerseys.',
    timestamp: Date.now(),
  };

  fs.writeFileSync(outputFile, JSON.stringify(latest, null, 2), 'utf-8');
  console.log(`Latest blog post synced: "${latest.title}" (${latest.slug})`);
}

run();
