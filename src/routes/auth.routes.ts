import express from 'express';
import * as authController from '../controllers/auth.controller';
import { validateRegister, validateLogin } from '../validators/auth.validator';
import { authLimiter } from '../middlewares/rateLimiter.middleware';

const router = express.Router();

router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password/:token', authLimiter, authController.resetPassword);

export default router;
