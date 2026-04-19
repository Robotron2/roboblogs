import express from 'express';
import * as postController from '../controllers/post.controller';
import { protect, optionalProtect } from '../middlewares/auth.middleware';
import { restrictTo } from '../middlewares/auth.middleware';
import { validatePost } from '../validators/post.validator';

const router = express.Router();

router.get('/feed/rss', postController.getRssFeed);
router.get('/', optionalProtect, postController.getPosts);
router.get('/:slug', optionalProtect, postController.getPost);

router.post('/', protect, restrictTo('admin'), validatePost, postController.createPost);
router.put('/:id', protect, restrictTo('admin'), validatePost, postController.updatePost);
router.put('/:id/unpublish', protect, restrictTo('admin'), postController.unpublishPost);
router.put('/:id/publish', protect, restrictTo('admin'), postController.publishPost);
router.delete('/:id', protect, restrictTo('admin'), postController.deletePost);

export default router;
