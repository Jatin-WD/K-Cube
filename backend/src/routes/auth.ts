import { Router } from 'express';
import {
  login,
  register,
  verifyToken,
  refreshToken,
  sendOtp,
  verifyOtp,
  googleAuth,
} from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/otp/send', sendOtp);
router.post('/otp/verify', verifyOtp);
router.post('/google', googleAuth);
router.get('/verify', verifyToken);
router.post('/refresh', refreshToken);

export default router;
