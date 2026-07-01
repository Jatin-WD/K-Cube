import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
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

router.get('/cms/pages', requireAuth(['admin']), listCmsPages);
router.post('/cms/pages', requireAuth(['admin']), upsertCmsPage);
router.patch('/cms/pages/:id', requireAuth(['admin']), upsertCmsPage);

router.get('/admin/tracks', requireAuth(['admin']), adminListLearningTracks);
router.post('/admin/tracks', requireAuth(['admin']), adminUpsertLearningTrack);
router.patch('/admin/tracks/:id', requireAuth(['admin']), adminUpsertLearningTrack);
router.delete('/admin/tracks/:id', requireAuth(['admin']), adminDeleteLearningTrack);

router.get('/admin/questions', requireAuth(['admin']), adminListLearningQuestions);
router.post('/admin/questions', requireAuth(['admin']), adminUpsertLearningQuestion);
router.patch('/admin/questions/:id', requireAuth(['admin']), adminUpsertLearningQuestion);
router.delete('/admin/questions/:id', requireAuth(['admin']), adminDeleteLearningQuestion);

export default router;
