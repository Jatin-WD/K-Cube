import { Request, Response } from 'express';
import { fail, ok } from '../lib/apiResponse';
import {
  createShopProduct,
  getShopProductBySlug,
  listShopProducts,
  upsertShopProduct,
  type LocalText,
  type ShopProductRecord,
} from '../services/shopCatalogService';

type SyncInput = {
  urls?: string[];
  sourceUrl?: string;
};

type ImportCandidate = Partial<ShopProductRecord> & {
  sourceUrl?: string;
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80';

const slugify = (value: string) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const readText = (value: unknown, fallback: string): LocalText => {
  if (value && typeof value === 'object') {
    const record = value as Partial<LocalText>;
    return {
      en: String(record.en || fallback),
      ko: String(record.ko || record.en || fallback),
      hi: String(record.hi || record.en || fallback),
    };
  }

  return { en: fallback, ko: fallback, hi: fallback };
};

const asNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(String(value ?? '').replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseJsonLdBlocks = (html: string) => {
  const blocks: unknown[] = [];
  const scriptPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null = null;
  while ((match = scriptPattern.exec(html))) {
    const raw = match[1].trim();
    if (!raw) continue;
    try {
      blocks.push(JSON.parse(raw));
    } catch {
      // Ignore invalid JSON-LD fragments.
    }
  }
  return blocks;
};

const flattenJsonLd = (value: unknown): any[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap((item) => flattenJsonLd(item));
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const current = [value];
    if (record['@graph']) return current.concat(flattenJsonLd(record['@graph']));
    return current;
  }
  return [];
};

const firstMatch = (html: string, patterns: RegExp[]) => {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return '';
};

const decodeHtml = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const getDomain = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
};

const toAbsoluteUrl = (maybeUrl: string, baseUrl: string) => {
  try {
    return new URL(maybeUrl, baseUrl).toString();
  } catch {
    return '';
  }
};

const normalizeShopRecord = (input: ImportCandidate): Partial<ShopProductRecord> => {
  const title = readText(input.title, String(input.slug || input.id || 'Imported product'));
  const slug = slugify(String(input.slug || input.id || title.en));
  const sku = String(input.sku || `WOOCOM-${slug.slice(0, 12).toUpperCase()}`);
  const price = Number.isFinite(Number(input.price)) ? Number(input.price) : 0;
  const rewardPoints = Number.isFinite(Number(input.rewardPoints)) ? Number(input.rewardPoints) : Math.max(10, Math.round(price * 0.1));

  return {
    id: String(input.id || slug),
    slug,
    sku,
    title,
    subtitle: readText(input.subtitle, title.en),
    description: readText(input.description, title.en),
    category: readText(input.category, 'Shop'),
    categoryKey: String(input.categoryKey || 'sauces'),
    image: String(input.image || DEFAULT_IMAGE),
    price,
    compareAtPrice: typeof input.compareAtPrice === 'number' ? input.compareAtPrice : undefined,
    rewardPoints,
    inStock: Boolean(input.inStock ?? true),
    stockLabel: readText(input.stockLabel, input.inStock ? 'In stock' : 'Out of stock'),
    badges: Array.isArray(input.badges) ? input.badges : [{ en: 'WooCommerce Sync', ko: 'WooCommerce Sync', hi: 'WooCommerce Sync' }],
    includes: Array.isArray(input.includes) ? input.includes : [{ en: 'Imported from source', ko: 'Imported from source', hi: 'Imported from source' }],
  };
};

const extractProductFromHtml = async (url: string, html: string): Promise<ImportCandidate> => {
  const jsonLd = parseJsonLdBlocks(html).flatMap((block) => flattenJsonLd(block));
  const productJsonLd = jsonLd.find((entry) => entry && typeof entry === 'object' && String(entry['@type'] || '').toLowerCase().includes('product')) as any | undefined;

  const title = decodeHtml(
    String(
      productJsonLd?.name ||
        firstMatch(html, [
          /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
          /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
          /<title[^>]*>([^<]+)<\/title>/i,
          /<h1[^>]*>([^<]+)<\/h1>/i,
        ]) ||
        url,
    ),
  );

  const description = decodeHtml(
    String(
      productJsonLd?.description ||
        firstMatch(html, [
          /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
          /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
        ]) ||
        title,
    ),
  );

  const image = decodeHtml(
    String(
      Array.isArray(productJsonLd?.image) ? productJsonLd.image[0] : productJsonLd?.image ||
        firstMatch(html, [
          /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
          /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
        ]) ||
        DEFAULT_IMAGE,
    ),
  );

  const offers = productJsonLd?.offers && Array.isArray(productJsonLd.offers) ? productJsonLd.offers[0] : productJsonLd?.offers;
  const price = asNumber(offers?.price || firstMatch(html, [
    /<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([^"']+)["']/i,
    /"price"\s*:\s*"?([0-9.]+)"?/i,
  ]), 0);
  const compareAtPrice = asNumber(firstMatch(html, [
    /<meta[^>]+property=["']product:price:regular["'][^>]+content=["']([^"']+)["']/i,
    /"highPrice"\s*:\s*"?([0-9.]+)"?/i,
  ]), 0) || undefined;
  const inStock = String(offers?.availability || firstMatch(html, [
    /<meta[^>]+property=["']product:availability["'][^>]+content=["']([^"']+)["']/i,
    /"availability"\s*:\s*"([^"]+)"/i,
  ])).toLowerCase().includes('instock');

  const sku = String(productJsonLd?.sku || firstMatch(html, [
    /<meta[^>]+property=["']product:sku["'][^>]+content=["']([^"']+)["']/i,
    /"sku"\s*:\s*"([^"]+)"/i,
  ]) || slugify(title).toUpperCase());

  const sourceDomain = getDomain(url) || 'woocommerce';
  const sourceLabel = `Imported from ${sourceDomain}`;

  return normalizeShopRecord({
    id: sku || slugify(title),
    slug: slugify(title) || slugify(url),
    sku,
    title: { en: title, ko: title, hi: title },
    subtitle: { en: description.slice(0, 180), ko: description.slice(0, 180), hi: description.slice(0, 180) },
    description: { en: description, ko: description, hi: description },
    category: { en: 'Shop', ko: 'Shop', hi: 'Shop' },
    categoryKey: 'sauces',
    image,
    price,
    compareAtPrice,
    rewardPoints: Math.max(10, Math.round(price * 0.1)),
    inStock,
    stockLabel: { en: inStock ? 'In stock' : 'Out of stock', ko: inStock ? 'In stock' : 'Out of stock', hi: inStock ? 'In stock' : 'Out of stock' },
    badges: [
      { en: 'WooCommerce Sync', ko: 'WooCommerce Sync', hi: 'WooCommerce Sync' },
      { en: sourceLabel, ko: sourceLabel, hi: sourceLabel },
    ],
    includes: [
      { en: `Source: ${url}`, ko: `Source: ${url}`, hi: `Source: ${url}` },
    ],
  });
};

const discoverProductLinks = (html: string, baseUrl: string) => {
  const links = new Set<string>();
  const anchorPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null = null;
  while ((match = anchorPattern.exec(html))) {
    const href = match[1];
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    const absolute = toAbsoluteUrl(href, baseUrl);
    if (!absolute) continue;
    const parsed = new URL(absolute);
    const path = parsed.pathname.replace(/\/+$/, '');
    const isProductPath = /^\/shop\/(?!page\/)[^/]+$/i.test(path) || /\/product\//i.test(path);
    if (isProductPath) links.add(parsed.toString());
  }
  return [...links];
};

export const listPublicShopProducts = async (_req: Request, res: Response) => {
  const products = await listShopProducts();
  return ok(res, products);
};

export const getPublicShopProduct = async (req: Request, res: Response) => {
  const product = await getShopProductBySlug(String(req.params.slug || ''));
  if (!product) return fail(res, 404, 'NOT_FOUND', 'Product not found');
  return ok(res, product);
};

export const syncWooCommerceProducts = async (req: Request, res: Response) => {
  const body = (req.body || {}) as SyncInput;
  const candidates = [
    ...(Array.isArray(body.urls) ? body.urls : []),
    body.sourceUrl,
  ].filter((value): value is string => Boolean(value && String(value).trim()));

  if (!candidates.length) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Provide at least one URL to sync');
  }

  const imported: Array<{ slug: string; title: string; url: string; action: string }> = [];
  const errors: Array<{ url: string; message: string }> = [];

  for (const rawUrl of candidates) {
    try {
      const listingResponse = await fetch(rawUrl, { headers: { 'user-agent': 'K-CUBE-ShopSync/1.0' } });
      if (!listingResponse.ok) {
        throw new Error(`Failed to fetch ${rawUrl} (${listingResponse.status})`);
      }

      const html = await listingResponse.text();
      const links = discoverProductLinks(html, rawUrl);
      const targetUrls = links.length ? links : [rawUrl];

      for (const targetUrl of targetUrls) {
        try {
          const productResponse = targetUrl === rawUrl ? listingResponse : await fetch(targetUrl, { headers: { 'user-agent': 'K-CUBE-ShopSync/1.0' } });
          if (!productResponse.ok) {
            throw new Error(`Failed to fetch ${targetUrl} (${productResponse.status})`);
          }

          const productHtml = targetUrl === rawUrl ? html : await productResponse.text();
          const candidate = await extractProductFromHtml(targetUrl, productHtml);
          const normalized = normalizeShopRecord(candidate);
          const exists = await getShopProductBySlug(String(normalized.slug || ''));
          const saved = exists ? await upsertShopProduct(normalized) : await createShopProduct(normalized);
          imported.push({ slug: String(saved.slug), title: saved.title.en, url: targetUrl, action: exists ? 'updated' : 'created' });
        } catch (error: any) {
          errors.push({ url: targetUrl, message: error?.message || 'Import failed' });
        }
      }
    } catch (error: any) {
      errors.push({ url: rawUrl, message: error?.message || 'Import failed' });
    }
  }

  return ok(res, {
    imported,
    errors,
    counts: {
      imported: imported.length,
      errors: errors.length,
    },
  });
};
