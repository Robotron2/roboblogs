import express from 'express';
import * as postController from '../controllers/post.controller';
import { protect } from '../middlewares/auth.middleware';
import { restrictTo } from '../middlewares/role.middleware';
import { validatePost } from '../validators/post.validator';

const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:slug', postController.getPost);

router.post('/', protect, restrictTo('admin'), validatePost, postController.createPost);
router.put('/:id', protect, restrictTo('admin'), validatePost, postController.updatePost);
router.delete('/:id', protect, restrictTo('admin'), postController.deletePost);

export default router;
