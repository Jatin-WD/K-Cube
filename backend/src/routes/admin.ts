import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getAdminDashboard,
  manageUser,
  approveChapter,
  publishAnnouncement,
  getSystemAnalytics,
  listContentUploads,
  reviewContentUpload,
  listPointTransactions,
  listKFoodClaims,
  reviewKFoodClaim,
} from '../controllers/adminController';

const router = Router();

router.use(requireAuth(['admin']));
router.get('/dashboard', getAdminDashboard);
router.patch('/user/:id', manageUser);
router.post('/chapter/:id/approve', approveChapter);
router.post('/announcement', publishAnnouncement);
router.get('/analytics', getSystemAnalytics);
router.get('/uploads', listContentUploads);
router.patch('/uploads/:id/review', reviewContentUpload);
router.get('/points', listPointTransactions);
router.get('/kfood/claims', listKFoodClaims);
router.patch('/kfood/claims/:id/review', reviewKFoodClaim);

export default router;
