import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { fail, ok } from '../lib/apiResponse';
import { listShopProducts, SHOP_DATA_DIR } from '../services/shopCatalogService';

const directory = path.join(SHOP_DATA_DIR, 'product-media');
const validName = /^[a-f0-9-]+\.(png|jpg|webp)$/;
const mediaUrl = (name: string) => `/api/v1/shop/media/${name}`;
const format = (buffer: Buffer) => {
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) && buffer.toString('ascii', 12, 16) === 'IHDR') return 'png';
  if (buffer.length >= 12 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 && buffer[buffer.length - 2] === 255 && buffer[buffer.length - 1] === 217) return 'jpg';
  if (buffer.length >= 20 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP' && buffer.readUInt32LE(4) === buffer.length - 8) return 'webp';
  return null;
};

export const uploadProductMedia = async (req: Request, res: Response) => {
  if (!Buffer.isBuffer(req.body) || !req.body.length) return fail(res, 400, 'INVALID_IMAGE', 'Select a PNG, JPEG or WebP image');
  const extension = format(req.body);
  const expected = extension === 'jpg' ? 'image/jpeg' : `image/${extension}`;
  if (!extension || req.get('content-type')?.split(';')[0] !== expected) return fail(res, 400, 'INVALID_IMAGE', 'The file contents must match a PNG, JPEG or WebP image');
  let image: Buffer;
  try {
    image = await sharp(req.body, { limitInputPixels: 40_000_000, animated: false }).rotate().resize({ width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  } catch { return fail(res, 400, 'INVALID_IMAGE', 'Image could not be decoded. Select a valid PNG, JPEG or WebP file'); }
  const filename = `${randomUUID()}.webp`;
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, filename), image, { flag: 'wx' });
  return ok(res, { filename, url: mediaUrl(filename), size: image.length });
};

export const listProductMedia = async (_req: Request, res: Response) => {
  await fs.mkdir(directory, { recursive: true });
  const files = (await fs.readdir(directory)).filter((name) => validName.test(name));
  const items = await Promise.all(files.map(async (filename) => {
    const stat = await fs.stat(path.join(directory, filename));
    return { filename, url: mediaUrl(filename), size: stat.size, createdAt: stat.birthtime.toISOString() };
  }));
  return ok(res, items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
};

export const serveProductMedia = async (req: Request, res: Response) => {
  const name = String(req.params.filename || '');
  if (!validName.test(name)) return fail(res, 404, 'NOT_FOUND', 'Image not found');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.sendFile(name, { root: directory }, (error) => {
    if (error && !res.headersSent) fail(res, 404, 'NOT_FOUND', 'Image not found');
  });
};

export const deleteProductMedia = async (req: Request, res: Response) => {
  const name = String(req.params.filename || '');
  if (!validName.test(name)) return fail(res, 404, 'NOT_FOUND', 'Image not found');
  const url = mediaUrl(name);
  const products = await listShopProducts();
  if (products.some((product) => product.image === url || product.gallery.includes(url))) return fail(res, 409, 'IMAGE_IN_USE', 'Remove this image from saved products before deleting it');
  try { await fs.unlink(path.join(directory, name)); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return fail(res, 404, 'NOT_FOUND', 'Image not found');
    throw error;
  }
  return ok(res, { deleted: true });
};
