// Pulls blog posts from a Notion database and saves them as Markdown files in src/posts/.
// Runs in GitHub Actions. Needs env vars NOTION_TOKEN and NOTION_DATABASE_ID.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS = path.join(ROOT, 'src', 'posts');
const IMAGES = path.join(ROOT, 'public', 'blog');
const API = 'https://api.notion.com/v1';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const clean = (s) => String(s || '').replace(/"/g, "'").replace(/\s+/g, ' ').trim();

// Notion date -> "YYYY-MM-DD" or "YYYY-MM-DD HH:mm" in Pacific time
export function toPacific(start) {
  if (!start) return '';
  if (!start.includes('T')) return start;
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(new Date(start));
  const g = (k) => p.find((x) => x.type === k).value;
  return `${g('year')}-${g('month')}-${g('day')} ${g('hour')}:${g('minute')}`;
}

export function richText(arr = []) {
  return arr.map((t) => {
    let s = t.plain_text;
    if (!s.trim()) return s;
    const a = t.annotations || {};
    if (a.code) s = '`' + s + '`';
    else if (a.bold) s = `**${s.trim()}** `.replace(/ $/, s.endsWith(' ') ? ' ' : '');
    else if (a.italic) s = `*${s.trim()}*` + (s.endsWith(' ') ? ' ' : '');
    if (t.href) s = `[${s.trim()}](${t.href})`;
    return s;
  }).join('');
}

export async function blocksToMd(blocks, ctx) {
  const out = [];
  let prevList = false;
  let num = 0;
  for (const b of blocks) {
    const t = b.type;
    const rt = b[t]?.rich_text ? richText(b[t].rich_text) : '';
    let piece = '';
    let isList = false;
    if (t === 'paragraph') piece = rt;
    else if (t === 'heading_1' || t === 'heading_2') piece = `## ${rt}`;
    else if (t === 'heading_3') piece = `### ${rt}`;
    else if (t === 'bulleted_list_item' || t === 'to_do') { piece = `* ${rt}`; isList = true; }
    else if (t === 'numbered_list_item') { num += 1; piece = `${num}. ${rt}`; }
    else if (t === 'quote' || t === 'callout') piece = `> ${rt}`;
    else if (t === 'divider') piece = '---';
    else if (t === 'code') piece = rt;
    else if (t === 'image') {
      const url = b.image.type === 'file' ? b.image.file.url : b.image.external.url;
      const alt = richText(b.image.caption || []).replace(/[\[\]]/g, '');
      const local = b.image.type === 'file' ? await ctx.saveImage(url, b.id) : url;
      piece = `![${alt}](${local})`;
    }
    if (b.has_children && ['bulleted_list_item', 'numbered_list_item', 'toggle', 'quote', 'callout'].includes(t)) {
      const kids = await ctx.children(b.id);
      const sub = await blocksToMd(kids, ctx);
      if (sub.trim()) piece += (isList ? '\n' : '\n\n') + sub.split('\n').filter((l) => l.trim()).map((l) => (isList ? l : l)).join(isList ? '\n' : '\n\n');
    }
    if (t !== 'numbered_list_item') num = 0;
    if (!piece.trim()) continue;
    out.push(isList && prevList ? '\n' + piece : (out.length ? '\n\n' : '') + piece);
    prevList = isList;
  }
  return out.join('').trim();
}

async function main() {
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DATABASE_ID;
  if (!token || !dbId) throw new Error('Missing NOTION_TOKEN or NOTION_DATABASE_ID');
  const headers = { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' };
  const call = async (method, url, body) => {
    const r = await fetch(API + url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    if (!r.ok) throw new Error(`Notion ${method} ${url}: ${r.status} ${await r.text()}`);
    return r.json();
  };
  const children = async (id) => {
    let res = [], cursor;
    do {
      const q = await call('GET', `/blocks/${id}/children?page_size=100${cursor ? '&start_cursor=' + cursor : ''}`);
      res = res.concat(q.results); cursor = q.has_more ? q.next_cursor : undefined;
    } while (cursor);
    return res;
  };
  const ctx = {
    children,
    async saveImage(url, blockId) {
      fs.mkdirSync(IMAGES, { recursive: true });
      const r = await fetch(url);
      if (!r.ok) throw new Error('Image download failed ' + r.status);
      const type = r.headers.get('content-type') || '';
      let ext = (type.split('/')[1] || 'png').split(';')[0].replace('jpeg', 'jpg').replace('svg+xml', 'svg');
      const name = `notion-${blockId.replace(/-/g, '').slice(0, 12)}.${ext}`;
      const file = path.join(IMAGES, name);
      if (!fs.existsSync(file)) fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
      return `/blog/${name}`;
    },
  };

  // 1. get Ready rows (to write) and Published rows (to keep)
  let rows = [], cursor;
  do {
    const q = await call('POST', `/databases/${dbId}/query`, {
      page_size: 100, start_cursor: cursor,
      filter: { or: [{ property: 'Status', status: { equals: 'Ready' } }, { property: 'Status', status: { equals: 'Published' } }] },
    });
    rows = rows.concat(q.results); cursor = q.has_more ? q.next_cursor : undefined;
  } while (cursor);

  fs.mkdirSync(POSTS, { recursive: true });
  const keep = new Set();
  for (const row of rows) {
    const p = row.properties;
    const text = (prop) => (prop?.rich_text || prop?.title || []).map((x) => x.plain_text).join('');
    const title = clean(text(p.Title));
    if (!title) continue;
    const slug = slugify(text(p.Slug)) || slugify(title);
    const date = toPacific(p['Publish Date']?.date?.start) ||
      new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
    const tags = (p.Tags?.multi_select || []).map((x) => x.name).join(', ');
    // Published rows are left alone. Set a row back to Ready to publish its changes.
    if (p.Status?.status?.name === 'Published') { keep.add(`${slug}.md`); continue; }
    const body = await blocksToMd(await children(row.id), ctx);
    const fm = ['---', `title: "${title}"`, `date: ${date}`, `category: ${clean(p.Category?.select?.name) || 'Blog'}`,
      `tags: ${tags}`];
    const excerpt = clean(text(p.Excerpt));
    if (excerpt) fm.push(`excerpt: "${excerpt}"`);
    fm.push(`notion_id: ${row.id}`, '---', '');
    fs.writeFileSync(path.join(POSTS, `${slug}.md`), fm.join('\n') + '\n' + body + '\n');
    keep.add(`${slug}.md`);
    console.log(`wrote ${slug}.md (${p.Status?.status?.name}, ${date})`);
    if (p.Status?.status?.name === 'Ready') {
      await call('PATCH', `/pages/${row.id}`, { properties: { Status: { status: { name: 'Published' } } } });
    }
  }

  // 2. remove posts that came from Notion but are no longer Ready/Published
  for (const f of fs.readdirSync(POSTS)) {
    if (!f.endsWith('.md') || keep.has(f)) continue;
    if (/^notion_id:/m.test(fs.readFileSync(path.join(POSTS, f), 'utf8'))) {
      fs.unlinkSync(path.join(POSTS, f));
      console.log(`removed ${f}`);
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });
