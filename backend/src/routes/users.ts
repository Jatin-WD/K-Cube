import { Router } from 'express';
import { requireAdminScope, requireAuth } from '../middleware/auth';
import { changeOwnPassword, deleteUser, getUserProfile, listUsers, updateOwnProfile, updateUser } from '../controllers/userController';

const router = Router();

router.get('/', requireAuth(['admin', 'manager']), requireAdminScope(['user_management']), listUsers);
router.get('/profile', requireAuth(), getUserProfile);
router.patch('/profile', requireAuth(), updateOwnProfile);
router.patch('/profile/password', requireAuth(), changeOwnPassword);
router.patch('/:id', requireAuth(['admin']), requireAdminScope(['user_management']), updateUser);
router.delete('/:id', requireAuth(['admin']), requireAdminScope(['user_management']), deleteUser);

export default router;
