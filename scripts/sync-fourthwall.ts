/**
 * sync-fourthwall.ts
 *
 * Scrapes product data, variant options, prices, images, and direct checkout
 * URLs directly from Fourthwall store (teaonalamb-shop.fourthwall.com).
 * Outputs src/merch-products.json.
 */

import * as fs from 'fs';
import * as path from 'path';

interface FourthwallVariant {
  name: string;
  price: number;
  url: string;
  inStock: boolean;
}

interface FourthwallProduct {
  id: string;
  slug: string;
  name: string;
  category: 'Apparel' | 'Desk Mats' | 'Stickers & Accessories';
  tag: string;
  price: number;
  currency: string;
  images: string[];
  description: string;
  fourthwallUrl: string;
  variants: FourthwallVariant[];
  details: string[];
}

const STORE_URL = 'https://teaonalamb-shop.fourthwall.com';

const KNOWN_SLUGS = [
  'tea-in-a-cup-t-shirt',
  'mini-tea-in-a-cup-t-shirt',
  'tea-in-a-cup-hoodie',
  'mini-tea-in-a-cup-hoodie',
  'embroidered-logo-dad-cap',
  'embroidered-logo-vintage-wash-dad-hat',
  'sheep-mascot-music-player-desk-mat',
  'teaonalamb-and-mascot-music-player-desk-mat',
  'onesie-music-player-desk-mat',
  'tea-in-a-cup-sticker',
  'teaonalamb-and-friends-picnic-sticker',
  'lamb-on-a-tea-mascot-iphone-case-black',
  'lamb-on-a-tea-mascot-iphone-case-white',
];

function determineCategory(slug: string, name: string): 'Apparel' | 'Desk Mats' | 'Stickers & Accessories' {
  const lower = (slug + ' ' + name).toLowerCase();
  if (lower.includes('mat')) return 'Desk Mats';
  if (lower.includes('sticker') || lower.includes('case') || lower.includes('pin')) return 'Stickers & Accessories';
  return 'Apparel';
}

function determineTag(slug: string, name: string): string {
  const lower = (slug + ' ' + name).toLowerCase();
  if (lower.includes('t-shirt') || lower.includes('tee')) return 'Community Favorite';
  if (lower.includes('hoodie')) return 'Ultra Cozy';
  if (lower.includes('mat')) return 'Desk Essential';
  if (lower.includes('sticker')) return 'Vinyl Die-Cut';
  if (lower.includes('hat') || lower.includes('cap')) return 'Embroidered';
  if (lower.includes('iphone')) return 'Phone Case';
  return 'Official Merch';
}

function generateDetails(name: string, category: string, variantsCount: number): string[] {
  const details: string[] = [];
  if (category === 'Apparel') {
    details.push('Ultra-comfortable premium ring-spun cotton fabric');
    details.push('Pre-shrunk relaxed unisex streetwear fit');
    details.push(`${variantsCount} sizes and colorways available`);
    details.push('Official Teaonalamb custom illustrated graphic');
  } else if (category === 'Desk Mats') {
    details.push('Smooth micro-weave cloth surface for precision mouse tracking');
    details.push('Anti-slip natural rubber base stays locked on desks');
    details.push('Durable stitched edges prevent fraying over time');
    details.push('Retro music player and sheep mascot aesthetic');
  } else {
    details.push('High-durability scratch and water-resistant materials');
    details.push('Vibrant precision-cut print with rich color fidelity');
    details.push('Matches the cozy TeaOS blue and cloud palette');
    details.push('Ships worldwide directly from Fourthwall');
  }
  return details;
}

async function fetchProduct(slug: string): Promise<FourthwallProduct | null> {
  const url = `${STORE_URL}/products/${slug}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!res.ok) {
      console.warn(`[Fourthwall] Failed to fetch ${url} (HTTP ${res.status})`);
      return null;
    }

    const html = await res.text();
    const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

    if (!ldMatch) {
      console.warn(`[Fourthwall] No JSON-LD found on ${url}`);
      return null;
    }

    const raw = JSON.parse(ldMatch[1]);
    const name = raw.name || slug;
    const description = raw.description || '';
    const images: string[] = Array.isArray(raw.image)
      ? raw.image
      : raw.image
      ? [raw.image]
      : [];

    const offers = Array.isArray(raw.offers) ? raw.offers : [];
    const minPrice = offers.length > 0
      ? Math.min(...offers.map((o: { price: string }) => parseFloat(o.price) || 0))
      : 20;

    const variants: FourthwallVariant[] = offers.map((o: { name: string; price: string; url: string; availability: string }) => ({
      name: o.name || 'Standard',
      price: parseFloat(o.price) || minPrice,
      url: o.url || url,
      inStock: (o.availability || '').includes('InStock'),
    }));

    const category = determineCategory(slug, name);
    const tag = determineTag(slug, name);
    const details = generateDetails(name, category, variants.length);

    return {
      id: `fourthwall-${slug}`,
      slug,
      name,
      category,
      tag,
      price: minPrice,
      currency: 'USD',
      images,
      description,
      fourthwallUrl: url,
      variants,
      details,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[Fourthwall] Error parsing ${slug}:`, message);
    return null;
  }
}

async function main() {
  console.log('[Fourthwall] Starting Fourthwall store sync...');
  console.log(`[Fourthwall] Target domain: ${STORE_URL}`);

  const products: FourthwallProduct[] = [];

  for (const slug of KNOWN_SLUGS) {
    process.stdout.write(`Fetching ${slug}... `);
    const prod = await fetchProduct(slug);
    if (prod) {
      products.push(prod);
      console.log(`OK ($${prod.price}, ${prod.variants.length} variants)`);
    } else {
      console.log('SKIPPED');
    }
  }

  const outPath = path.resolve(process.cwd(), 'src/merch-products.json');
  fs.writeFileSync(outPath, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`\n[Fourthwall] Successfully wrote ${products.length} products to ${outPath}`);
}

main();
