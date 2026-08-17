import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getAdminDashboard,
  listRecentAdminActions,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  listAdminAccounts,
  createAdminAccount,
  manageUser,
  approveChapter,
  listChapters,
  upsertChapter,
  deleteChapter,
  publishAnnouncement,
  getSystemAnalytics,
  listAnnouncements,
  listCmsBlocks,
  upsertCmsBlock,
  deleteCmsBlock,
  listContentUploads,
  reviewContentUpload,
  listPointTransactions,
  adjustPoints,
  listKFoodClaims,
  reviewKFoodClaim,
  listKFoodProducts,
  createKFoodProduct,
  updateKFoodProduct,
  deleteKFoodProduct,
  syncWooCommerceProducts,
  getKFoodOverview,
  listKFoodFulfillments,
  upsertKFoodFulfillment,
  listAdminSubmissions,
  listRewards,
  upsertReward,
  retireReward,
} from '../controllers/adminController';
import {
  listIndiaPreSelectionApplications,
  reviewIndiaPreSelectionApplication,
} from '../controllers/indiaPreSelectionAdminController';
import {
  checkInEvent,
  createEvent,
  archiveEvent,
  listAdminEvents,
  listCalendarConnections,
  runCalendarSync,
  syncEventToGoogleCalendar,
  updateEvent,
  upsertCalendarConnection,
} from '../controllers/eventController';

const router = Router();

router.use(requireAuth(['admin']));
router.get('/dashboard', getAdminDashboard);
router.get('/recent-actions', listRecentAdminActions);
router.get('/profile', getAdminProfile);
router.patch('/profile', updateAdminProfile);
router.patch('/profile/password', changeAdminPassword);
router.get('/accounts', listAdminAccounts);
router.post('/accounts', createAdminAccount);
router.patch('/user/:id', manageUser);
router.post('/chapter/:id/approve', approveChapter);
router.get('/chapters', listChapters);
router.post('/chapters', upsertChapter);
router.patch('/chapters/:id', upsertChapter);
router.delete('/chapters/:id', deleteChapter);
router.post('/announcement', publishAnnouncement);
router.get('/announcements', listAnnouncements);
router.get('/cms/blocks', listCmsBlocks);
router.post('/cms/blocks', upsertCmsBlock);
router.patch('/cms/blocks/:id', upsertCmsBlock);
router.delete('/cms/blocks/:id', deleteCmsBlock);
router.get('/analytics', getSystemAnalytics);
router.get('/uploads', listContentUploads);
router.patch('/uploads/:id/review', reviewContentUpload);
router.get('/points', listPointTransactions);
router.post('/points/adjust', adjustPoints);
router.get('/kfood/claims', listKFoodClaims);
router.patch('/kfood/claims/:id/review', reviewKFoodClaim);
router.get('/kfood/products', listKFoodProducts);
router.post('/kfood/products', createKFoodProduct);
router.patch('/kfood/products/:slug', updateKFoodProduct);
router.delete('/kfood/products/:slug', deleteKFoodProduct);
router.post('/kfood/products/import', syncWooCommerceProducts);
router.get('/kfood/overview', getKFoodOverview);
router.get('/kfood/fulfillments', listKFoodFulfillments);
router.post('/kfood/fulfillments', upsertKFoodFulfillment);
router.patch('/kfood/fulfillments', upsertKFoodFulfillment);
router.get('/india-pre-selection/applications', listIndiaPreSelectionApplications);
router.patch('/india-pre-selection/applications/:id', reviewIndiaPreSelectionApplication);
router.get('/submissions', listAdminSubmissions);
router.get('/rewards', listRewards);
router.post('/rewards', upsertReward);
router.patch('/rewards/:id', upsertReward);
router.delete('/rewards/:id', retireReward);
router.get('/events', listAdminEvents);
router.post('/events', createEvent);
router.patch('/events/:id', updateEvent);
router.delete('/events/:id', archiveEvent);
router.post('/events/:id/check-in', checkInEvent);
router.post('/events/:id/sync/google-calendar', syncEventToGoogleCalendar);
router.get('/google-calendar/connections', listCalendarConnections);
router.post('/google-calendar/connections', upsertCalendarConnection);
router.post('/google-calendar/sync', runCalendarSync);

export default router;
