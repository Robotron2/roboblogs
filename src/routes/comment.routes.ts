import express from 'express';
import * as commentController from '../controllers/comment.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateComment } from '../validators/comment.validator';

const router = express.Router();

router.post('/', protect, validateComment, commentController.addComment);
router.get('/:postId', commentController.getComments);
router.delete('/:id', protect, commentController.deleteComment);

export default router;
