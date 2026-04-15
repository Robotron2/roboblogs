import express from 'express';
import * as likeController from '../controllers/like.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/:postId', protect, likeController.likePost);
router.delete('/:postId', protect, likeController.unlikePost);

export default router;
