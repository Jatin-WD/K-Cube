import { Router } from 'express';
import { requireAdminScope, requireAuth } from '../middleware/auth';
import {
  adminDeleteLearningQuestion,
  adminDeleteLearningTrack,
  adminListLearningQuestions,
  adminListLearningTracks,
  adminUpsertLearningQuestion,
  adminUpsertLearningTrack,
  getLearningTrack,
  listLearningTracks,
  listCmsPages,
  listMyLearningProgress,
  upsertCmsPage,
} from '../controllers/learningController';

const router = Router();

router.get('/tracks', listLearningTracks);
router.get('/tracks/:slug', getLearningTrack);
router.get('/me/progress', requireAuth(), listMyLearningProgress);

router.get('/cms/pages', requireAuth(['admin']), requireAdminScope(['content']), listCmsPages);
router.post('/cms/pages', requireAuth(['admin']), requireAdminScope(['content']), upsertCmsPage);
router.patch('/cms/pages/:id', requireAuth(['admin']), requireAdminScope(['content']), upsertCmsPage);

router.get('/admin/tracks', requireAuth(['admin']), requireAdminScope(['content']), adminListLearningTracks);
router.post('/admin/tracks', requireAuth(['admin']), requireAdminScope(['content']), adminUpsertLearningTrack);
router.patch('/admin/tracks/:id', requireAuth(['admin']), requireAdminScope(['content']), adminUpsertLearningTrack);
router.delete('/admin/tracks/:id', requireAuth(['admin']), requireAdminScope(['content']), adminDeleteLearningTrack);

router.get('/admin/questions', requireAuth(['admin']), requireAdminScope(['content']), adminListLearningQuestions);
router.post('/admin/questions', requireAuth(['admin']), requireAdminScope(['content']), adminUpsertLearningQuestion);
router.patch('/admin/questions/:id', requireAuth(['admin']), requireAdminScope(['content']), adminUpsertLearningQuestion);
router.delete('/admin/questions/:id', requireAuth(['admin']), requireAdminScope(['content']), adminDeleteLearningQuestion);

export default router;
