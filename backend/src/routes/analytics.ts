import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getAnalyticsSummary } from '../controllers/analyticsController';

const router = Router();

router.get('/summary', requireAuth(['admin', 'manager']), getAnalyticsSummary);

export default router;
