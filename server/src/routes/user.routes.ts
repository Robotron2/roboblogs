import express from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/me', protect, userController.getMe);

export default router;
