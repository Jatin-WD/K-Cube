import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createPaymentOrder, verifyPaymentOrder } from '../controllers/paymentController';

const router = Router();

router.post('/orders', requireAuth(), createPaymentOrder);
router.post('/verify', requireAuth(), verifyPaymentOrder);

export default router;
