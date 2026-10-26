import { Router } from 'express';
import { serveProductMedia } from '../controllers/productMediaController';
import { getPublicShopProduct, listPublicShopProducts } from '../controllers/shopController';

const router = Router();

router.get('/media/:filename', serveProductMedia);
router.get('/products', listPublicShopProducts);
router.get('/products/:slug', getPublicShopProduct);

export default router;

