import { Router } from 'express';
import { getPublicShopProduct, listPublicShopProducts } from '../controllers/shopController';

const router = Router();

router.get('/products', listPublicShopProducts);
router.get('/products/:slug', getPublicShopProduct);

export default router;

