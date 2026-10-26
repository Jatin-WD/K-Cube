import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export interface LocalText {
  en: string;
  ko: string;
  hi: string;
}

export interface ShopProductRecord {
  id: string;
  slug: string;
  sku: string;
  title: LocalText;
  subtitle: LocalText;
  description: LocalText;
  category: LocalText;
  categoryKey: string;
  image: string;
  gallery: string[];
  status: 'draft' | 'published';
  featured: boolean;
  externalProductUrl?: string;
  store?: 'koreanshop' | 'moa_beauty';
  price: number;
  compareAtPrice?: number;
  rewardPoints: number;
  inStock: boolean;
  stockLabel: LocalText;
  badges: LocalText[];
  includes: LocalText[];
}

export const SHOP_DATA_DIR = path.resolve(process.env.KCUBE_SHOP_DATA_DIR || path.resolve(__dirname, '../../data'));
const STORE_PATH = path.join(SHOP_DATA_DIR, 'shop-products.json');
const invalid = (message: string, status = 400): never => { throw Object.assign(new Error(message), { status, code: 'VALIDATION_ERROR' }); };
export const imageReference = (value: unknown): string => {
  const url = String(value || '').trim();
  if (!url) return '';
  if (/^\/api\/v1\/shop\/media\/[a-f0-9-]+\.(png|jpg|webp)$/.test(url)) return url;
  try { const parsed = new URL(url); if (parsed.protocol === 'https:' && !parsed.username && !parsed.password) return url; } catch {}
  return invalid('Use an uploaded image or a valid HTTPS image URL');
};

const CATEGORY_MAP: Record<string, LocalText> = {
  noodles: { en: 'Noodles', ko: '면류', hi: 'Noodles' },
  snacks: { en: 'Snacks', ko: '스낵', hi: 'Snacks' },
  'tea-coffee': { en: 'Tea & Coffee', ko: '차와 커피', hi: 'Tea & Coffee' },
  seaweed: { en: 'Seaweed', ko: '김/해조류', hi: 'Seaweed' },
  health: { en: 'Health & Supplements', ko: '건강식품', hi: 'Health & Supplements' },
  sauces: { en: 'Sauces & Pantry', ko: '소스/팬트리', hi: 'Sauces & Pantry' },
};

CATEGORY_MAP.beauty = { en: 'K-Beauty', ko: 'K-Beauty', hi: 'K-Beauty' };
CATEGORY_MAP.lifestyle = { en: 'Lifestyle', ko: 'Lifestyle', hi: 'Lifestyle' };
const fallbackCategory = { en: 'Shop', ko: '샵', hi: 'Shop' };

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

const slugify = (value: string) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeProduct = (product: Partial<ShopProductRecord>): ShopProductRecord => {
  const title = readText(product.title, product.id || product.slug || 'New product');
  const slug = slugify(product.slug || product.id || title.en);
  const categoryKey = String(product.categoryKey || 'sauces');

  return {
    id: String(product.id || slug),
    slug,
    sku: String(product.sku || `SKU-${slug.toUpperCase().slice(0, 8)}`),
    title,
    subtitle: readText(product.subtitle, title.en),
    description: readText(product.description, title.en),
    category: CATEGORY_MAP[categoryKey] || fallbackCategory,
    categoryKey,
    image: imageReference(product.image),
    gallery: Array.isArray(product.gallery) ? [...new Set(product.gallery.map(imageReference).filter(Boolean))].slice(0, 10) : [],
    status: product.status === 'draft' ? 'draft' : 'published',
    featured: Boolean(product.featured),
    externalProductUrl: product.externalProductUrl ? imageReference(product.externalProductUrl) : undefined,
    store: product.store === 'moa_beauty' || (!product.store && categoryKey === 'beauty') ? 'moa_beauty' : 'koreanshop',
    price: Number(product.price || 0),
    compareAtPrice: typeof product.compareAtPrice === 'number' ? product.compareAtPrice : undefined,
    rewardPoints: Number(product.rewardPoints || 0),
    inStock: Boolean(product.inStock ?? true),
    stockLabel: (product.inStock ?? true) ? readText(product.stockLabel, 'In stock') : { en: 'Out of stock', ko: '품절', hi: 'Out of stock' },
    badges: Array.isArray(product.badges) ? product.badges.map((badge, index) => readText(badge, `Badge ${index + 1}`)) : [],
    includes: Array.isArray(product.includes) ? product.includes.map((item, index) => readText(item, `Item ${index + 1}`)) : [],
  };
};

const readStore = async (): Promise<ShopProductRecord[]> => {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    return (JSON.parse(raw) as Partial<ShopProductRecord>[]).map(normalizeProduct);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
};

const writeStore = async (products: ShopProductRecord[]) => {
  await fs.mkdir(SHOP_DATA_DIR, { recursive: true });
  const temporary = path.join(SHOP_DATA_DIR, `shop-products-${randomUUID()}.tmp`);
  try {
    await fs.writeFile(temporary, JSON.stringify(products, null, 2), 'utf8');
    await fs.rename(temporary, STORE_PATH);
  } finally { await fs.unlink(temporary).catch(() => undefined); }
};

// Serialize read/modify/write operations in this server process.
let pending: Promise<unknown> = Promise.resolve();
const mutate = <T>(operation: () => Promise<T>): Promise<T> => {
  const result = pending.then(operation);
  pending = result.catch(() => undefined);
  return result;
};
const validate = (input: Partial<ShopProductRecord>) => {
  if (typeof input.title?.en !== 'string' || !input.title.en.trim()) invalid('English product title is required');
  if (!slugify(input.slug || input.title?.en || '')) invalid('A valid product slug is required');
  for (const key of ['price', 'rewardPoints', 'compareAtPrice'] as const) {
    const value = input[key];
    if (key === 'compareAtPrice' && value === null) continue;
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) invalid(`${key} must be a non-negative number`);
  }
  if (input.rewardPoints !== undefined && !Number.isInteger(input.rewardPoints)) invalid('Reward points must be a whole number');
  if (input.price === undefined) invalid('Price is required');
  if (input.status !== undefined && !['draft', 'published'].includes(input.status)) invalid('Invalid publication status');
  if (input.gallery !== undefined && (!Array.isArray(input.gallery) || input.gallery.length > 10)) invalid('Gallery supports up to 10 images');
  return normalizeProduct(input);
};

export const listShopProducts = () => readStore();
export const getShopProductBySlug = async (slug: string) => (await readStore()).find((product) => product.slug === slug) || null;

export const upsertShopProduct = (input: Partial<ShopProductRecord>) => mutate(async () => {
  const products = await readStore();
  const normalized = validate(input);
  const index = products.findIndex((product) => product.slug === normalized.slug || product.id === normalized.id);
  if (index >= 0) products[index] = normalized;
  else products.unshift(normalized);
  await writeStore(products);
  return normalized;
});

export const createShopProduct = (input: Partial<ShopProductRecord>) => mutate(async () => {
  const products = await readStore();
  const normalized = validate(input);
  if (products.some((product) => product.slug === normalized.slug || product.id === normalized.id)) invalid('Product slug or ID already exists', 409);
  products.unshift(normalized);
  await writeStore(products);
  return normalized;
});

export const updateShopProduct = (slug: string, input: Partial<ShopProductRecord>) => mutate(async () => {
  const products = await readStore();
  const index = products.findIndex((product) => product.slug === slug || product.id === slug);
  if (index < 0) return null;
  const stockChanged = input.inStock !== undefined && input.inStock !== products[index].inStock;
  const merged = validate({ ...products[index], ...input, ...(stockChanged && !input.stockLabel ? { stockLabel: undefined } : {}), id: products[index].id, slug: input.slug || products[index].slug });
  if (products.some((product, other) => other !== index && product.slug === merged.slug)) invalid('Product slug already exists', 409);
  products[index] = merged;
  await writeStore(products);
  return merged;
});

export const deleteShopProduct = (slug: string) => mutate(async () => {
  const products = await readStore();
  const filtered = products.filter((product) => product.slug !== slug && product.id !== slug);
  if (filtered.length === products.length) return false;
  await writeStore(filtered);
  return true;
});
