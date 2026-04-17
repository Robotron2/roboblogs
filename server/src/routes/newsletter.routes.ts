import express from 'express';
import * as newsletterController from '../controllers/newsletter.controller';
import { newsletterLimiter } from '../middlewares/rateLimiter.middleware';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/subscribe', newsletterLimiter, newsletterController.subscribe);
// Accept both GET and POST for unsubscribe to make it easier for links in emails
router.get('/unsubscribe/:token', newsletterController.unsubscribe);
router.post('/unsubscribe/:token', newsletterController.unsubscribe);

// Admin routes
router.get('/logs', protect, restrictTo('admin'), newsletterController.getLogs);

export default router;
