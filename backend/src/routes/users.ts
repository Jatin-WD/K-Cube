import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getUserProfile, listUsers, updateUser } from '../controllers/userController';

const router = Router();

router.get('/', requireAuth(['admin', 'manager']), listUsers);
router.get('/profile', requireAuth(), getUserProfile);
router.patch('/:id', requireAuth(['admin']), updateUser);

export default router;
