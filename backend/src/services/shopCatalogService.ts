import fs from 'fs/promises';
import path from 'path';

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
  price: number;
  compareAtPrice?: number;
  rewardPoints: number;
  inStock: boolean;
  stockLabel: LocalText;
  badges: LocalText[];
  includes: LocalText[];
}

const STORE_PATH = path.resolve(__dirname, '../../../data/shop-products.json');

const CATEGORY_MAP: Record<string, LocalText> = {
  noodles: { en: 'Noodles', ko: '면류', hi: 'Noodles' },
  snacks: { en: 'Snacks', ko: '스낵', hi: 'Snacks' },
  'tea-coffee': { en: 'Tea & Coffee', ko: '차와 커피', hi: 'Tea & Coffee' },
  seaweed: { en: 'Seaweed', ko: '김/해조류', hi: 'Seaweed' },
  health: { en: 'Health & Supplements', ko: '건강식품', hi: 'Health & Supplements' },
  sauces: { en: 'Sauces & Pantry', ko: '소스/팬트리', hi: 'Sauces & Pantry' },
};

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
    image: String(product.image || 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80'),
    price: Number(product.price || 0),
    compareAtPrice: typeof product.compareAtPrice === 'number' ? product.compareAtPrice : undefined,
    rewardPoints: Number(product.rewardPoints || 0),
    inStock: Boolean(product.inStock ?? true),
    stockLabel: readText(product.stockLabel, product.inStock ? 'In stock' : 'Out of stock'),
    badges: Array.isArray(product.badges) && product.badges.length ? product.badges.map((badge, index) => readText(badge, `Badge ${index + 1}`)) : [{ en: 'New', ko: '신규', hi: 'New' }],
    includes: Array.isArray(product.includes) && product.includes.length ? product.includes.map((item, index) => readText(item, `Item ${index + 1}`)) : [{ en: 'Product item', ko: '상품', hi: 'Product item' }],
  };
};

const readStore = async (): Promise<ShopProductRecord[]> => {
  const raw = await fs.readFile(STORE_PATH, 'utf8');
  const parsed = JSON.parse(raw) as Partial<ShopProductRecord>[];
  return parsed.map((item) => normalizeProduct(item));
};

const writeStore = async (products: ShopProductRecord[]) => {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(products, null, 2), 'utf8');
};

export const listShopProducts = async () => readStore();

export const getShopProductBySlug = async (slug: string) => {
  const products = await readStore();
  return products.find((product) => product.slug === slug) || null;
};

export const upsertShopProduct = async (input: Partial<ShopProductRecord>) => {
  const products = await readStore();
  const normalized = normalizeProduct(input);
  const index = products.findIndex((product) => product.slug === normalized.slug || product.id === normalized.id);
  if (index >= 0) {
    products[index] = normalized;
  } else {
    products.unshift(normalized);
  }
  await writeStore(products);
  return normalized;
};

export const createShopProduct = async (input: Partial<ShopProductRecord>) => {
  const products = await readStore();
  const normalized = normalizeProduct(input);
  if (products.some((product) => product.slug === normalized.slug || product.id === normalized.id)) {
    throw new Error('Product slug already exists');
  }
  products.unshift(normalized);
  await writeStore(products);
  return normalized;
};

export const updateShopProduct = async (slug: string, input: Partial<ShopProductRecord>) => {
  const products = await readStore();
  const index = products.findIndex((product) => product.slug === slug || product.id === slug);
  if (index < 0) return null;
  const merged = normalizeProduct({ ...products[index], ...input, id: products[index].id, slug: input.slug || products[index].slug });
  products[index] = merged;
  await writeStore(products);
  return merged;
};

export const deleteShopProduct = async (slug: string) => {
  const products = await readStore();
  const filtered = products.filter((product) => product.slug !== slug && product.id !== slug);
  if (filtered.length === products.length) return false;
  await writeStore(filtered);
  return true;
};
