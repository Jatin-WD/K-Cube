import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  claimKFoodPurchase,
  completeLesson,
  createContentUpload,
  listMyUploads,
  trackKFoodClick,
  trackLearningCourseAction,
} from '../controllers/engagementController';

const router = Router();

router.post('/uploads', requireAuth(), createContentUpload);
router.get('/uploads/me', requireAuth(), listMyUploads);
router.post('/lessons/complete', requireAuth(), completeLesson);
router.post('/kfood/click', requireAuth(), trackKFoodClick);
router.post('/kfood/purchase-claim', requireAuth(), claimKFoodPurchase);
router.post('/learning/course-action', requireAuth(), trackLearningCourseAction);

export default router;
