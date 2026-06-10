import express from 'express';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import { categorySchema, updateCategorySchema } from '../validations/category.validation.js';
import {
       createCategory,
       getAllCategories,
       getCategoryById,
       updateCategory,
       deleteCategory,
} from '../controllers/category.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorizeRole from '../middlewares/authorizeRole.middleware.js';

const router  = express.Router();

router.route('/categories')
       .get(getAllCategories)
       .post(authMiddleware, authorizeRole('admin'), validateMiddleware(categorySchema), createCategory);

router.route('/categories/:id')
       .get(getCategoryById)
       .patch(authMiddleware, authorizeRole('admin'), validateMiddleware(updateCategorySchema), updateCategory)
       .delete(authMiddleware, authorizeRole('admin'), deleteCategory);

export default router;