import { Router } from 'express';
import { requireAdminScope, requireAuth } from '../middleware/auth';
import { cancelRsvp, checkInEvent, getEventAccess, getEventBySlug, listEvents, listMyRsvps, rsvpEvent } from '../controllers/eventController';

const router = Router();

router.get('/', listEvents);
router.get('/mine', requireAuth(), listMyRsvps);
router.get('/:id/access', requireAuth(), getEventAccess);
router.get('/:slug', getEventBySlug);
router.post('/:id/rsvp', requireAuth(), rsvpEvent);
router.delete('/:id/rsvp', requireAuth(), cancelRsvp);
router.post('/:id/check-in', requireAuth(['admin']), requireAdminScope(['events']), checkInEvent);

export default router;
