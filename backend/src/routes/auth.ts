import { Router } from 'express';
import {
  login,
  register,
  verifyToken,
  refreshToken,
  sendOtp,
  verifyOtp,
  googleAuth,
  logout,
} from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/otp/send', sendOtp);
router.post('/otp/verify', verifyOtp);
router.post('/google', googleAuth);
router.get('/verify', verifyToken);
router.post('/refresh', refreshToken);
router.post('/logout', requireAuth(), logout);

export default router;
