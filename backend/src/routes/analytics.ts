import { Router } from 'express';
import { requireAdminScope, requireAuth } from '../middleware/auth';
import { getAnalyticsSummary } from '../controllers/analyticsController';

const router = Router();

router.get('/summary', requireAuth(['admin', 'manager']), requireAdminScope(['analytics']), getAnalyticsSummary);

export default router;
