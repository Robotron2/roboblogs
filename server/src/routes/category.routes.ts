import express from 'express';
import * as categoryController from '../controllers/category.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', categoryController.getCategories);

// Admin only routes
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
