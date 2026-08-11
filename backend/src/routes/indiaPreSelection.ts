import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getMyIndiaPreSelectionApplication,
  submitIndiaPreSelectionApplication,
} from '../controllers/indiaPreSelectionController';

const router = Router();

router.get('/applications/me', requireAuth(), getMyIndiaPreSelectionApplication);
router.post('/applications', requireAuth(), submitIndiaPreSelectionApplication);

export default router;
