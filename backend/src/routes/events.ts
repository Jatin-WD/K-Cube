import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { cancelRsvp, checkInEvent, getEventBySlug, listEvents, rsvpEvent } from '../controllers/eventController';

const router = Router();

router.get('/', listEvents);
router.get('/:slug', getEventBySlug);
router.post('/:id/rsvp', requireAuth(), rsvpEvent);
router.delete('/:id/rsvp', requireAuth(), cancelRsvp);
router.post('/:id/check-in', requireAuth(['admin']), checkInEvent);

export default router;
