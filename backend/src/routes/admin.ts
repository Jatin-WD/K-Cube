import { Router } from 'express';
import { requireAdminScope, requireAuth } from '../middleware/auth';
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
  syncStaticCmsContent,
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
  reviewAdminSubmission,
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
import { getAdminEmailRecipientCount, listSentAdminEmails, sendAdminEmailMessage } from '../controllers/adminEmailController';

const router = Router();

router.use(requireAuth(['admin']));
router.get('/dashboard', requireAdminScope(['analytics']), getAdminDashboard);
router.get('/recent-actions', requireAdminScope(['analytics']), listRecentAdminActions);
router.get('/email/sent', requireAdminScope(['analytics']), listSentAdminEmails);
router.get('/email/recipients', requireAdminScope(['analytics']), getAdminEmailRecipientCount);
router.post('/email/send', requireAdminScope(['analytics']), sendAdminEmailMessage);
router.get('/profile', getAdminProfile);
router.patch('/profile', updateAdminProfile);
router.patch('/profile/password', changeAdminPassword);
router.get('/accounts', requireAdminScope(['__super_admin__']), listAdminAccounts);
router.post('/accounts', requireAdminScope(['__super_admin__']), createAdminAccount);
router.patch('/user/:id', requireAdminScope(['user_management']), manageUser);
router.post('/chapter/:id/approve', requireAdminScope(['events']), approveChapter);
router.get('/chapters', requireAdminScope(['events']), listChapters);
router.post('/chapters', requireAdminScope(['events']), upsertChapter);
router.patch('/chapters/:id', requireAdminScope(['events']), upsertChapter);
router.delete('/chapters/:id', requireAdminScope(['events']), deleteChapter);
router.post('/announcement', requireAdminScope(['content']), publishAnnouncement);
router.get('/announcements', requireAdminScope(['content']), listAnnouncements);
router.get('/cms/blocks', requireAdminScope(['content']), listCmsBlocks);
router.post('/cms/blocks', requireAdminScope(['content']), upsertCmsBlock);
router.patch('/cms/blocks/:id', requireAdminScope(['content']), upsertCmsBlock);
router.delete('/cms/blocks/:id', requireAdminScope(['content']), deleteCmsBlock);
router.post('/cms/sync-static', requireAdminScope(['content']), syncStaticCmsContent);
router.get('/analytics', requireAdminScope(['analytics']), getSystemAnalytics);
router.get('/uploads', requireAdminScope(['content']), listContentUploads);
router.patch('/uploads/:id/review', requireAdminScope(['content']), reviewContentUpload);
router.get('/points', requireAdminScope(['commerce']), listPointTransactions);
router.post('/points/adjust', requireAdminScope(['commerce']), adjustPoints);
router.get('/kfood/claims', requireAdminScope(['commerce']), listKFoodClaims);
router.patch('/kfood/claims/:id/review', requireAdminScope(['commerce']), reviewKFoodClaim);
router.get('/kfood/products', requireAdminScope(['commerce']), listKFoodProducts);
router.post('/kfood/products', requireAdminScope(['commerce']), createKFoodProduct);
router.patch('/kfood/products/:slug', requireAdminScope(['commerce']), updateKFoodProduct);
router.delete('/kfood/products/:slug', requireAdminScope(['commerce']), deleteKFoodProduct);
router.post('/kfood/products/import', requireAdminScope(['commerce']), syncWooCommerceProducts);
router.get('/kfood/overview', requireAdminScope(['commerce']), getKFoodOverview);
router.get('/kfood/fulfillments', requireAdminScope(['commerce']), listKFoodFulfillments);
router.post('/kfood/fulfillments', requireAdminScope(['commerce']), upsertKFoodFulfillment);
router.patch('/kfood/fulfillments', requireAdminScope(['commerce']), upsertKFoodFulfillment);
router.get('/india-pre-selection/applications', requireAdminScope(['india_pre_selection']), listIndiaPreSelectionApplications);
router.patch('/india-pre-selection/applications/:id', requireAdminScope(['india_pre_selection']), reviewIndiaPreSelectionApplication);
router.get('/submissions', requireAdminScope(['submissions']), listAdminSubmissions);
router.patch('/submissions/:source/:id/review', requireAdminScope(['submissions']), reviewAdminSubmission);
router.get('/rewards', requireAdminScope(['commerce']), listRewards);
router.post('/rewards', requireAdminScope(['commerce']), upsertReward);
router.patch('/rewards/:id', requireAdminScope(['commerce']), upsertReward);
router.delete('/rewards/:id', requireAdminScope(['commerce']), retireReward);
router.get('/events', requireAdminScope(['events']), listAdminEvents);
router.post('/events', requireAdminScope(['events']), createEvent);
router.patch('/events/:id', requireAdminScope(['events']), updateEvent);
router.delete('/events/:id', requireAdminScope(['events']), archiveEvent);
router.post('/events/:id/check-in', requireAdminScope(['events']), checkInEvent);
router.post('/events/:id/sync/google-calendar', requireAdminScope(['events']), syncEventToGoogleCalendar);
router.get('/google-calendar/connections', requireAdminScope(['events']), listCalendarConnections);
router.post('/google-calendar/connections', requireAdminScope(['events']), upsertCalendarConnection);
router.post('/google-calendar/sync', requireAdminScope(['events']), runCalendarSync);

export default router;
