import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getChapters, getChapterDetails } from '../controllers/mapController';

const router = Router();

router.get('/chapters', requireAuth(['category_a', 'category_b']), getChapters);
router.get('/chapter/:id', requireAuth(['category_a']), getChapterDetails);

export default router;
