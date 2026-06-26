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
  adjustPoints,
  listKFoodClaims,
  reviewKFoodClaim,
} from '../controllers/adminController';
import {
  checkInEvent,
  createEvent,
  listCalendarConnections,
  runCalendarSync,
  syncEventToGoogleCalendar,
  updateEvent,
  upsertCalendarConnection,
} from '../controllers/eventController';

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
router.post('/points/adjust', adjustPoints);
router.get('/kfood/claims', listKFoodClaims);
router.patch('/kfood/claims/:id/review', reviewKFoodClaim);
router.post('/events', createEvent);
router.patch('/events/:id', updateEvent);
router.post('/events/:id/check-in', checkInEvent);
router.post('/events/:id/sync/google-calendar', syncEventToGoogleCalendar);
router.get('/google-calendar/connections', listCalendarConnections);
router.post('/google-calendar/connections', upsertCalendarConnection);
router.post('/google-calendar/sync', runCalendarSync);

export default router;
