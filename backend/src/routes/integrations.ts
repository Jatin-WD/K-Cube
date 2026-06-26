import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getPetpoojaStatus, receivePetpoojaWebhook } from '../controllers/petpoojaController';

const router = Router();

router.post('/petpooja/webhook', receivePetpoojaWebhook);
router.get('/petpooja/status', requireAuth(['admin']), getPetpoojaStatus);

export default router;
