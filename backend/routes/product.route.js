import express from 'express';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import { createProductSchema } from '../validations/product.validation.js';
import { createProduct } from '../controllers/product.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorizeRole from '../middlewares/authorizeRole.middleware.js';

const router = express.Router();

router.route('/products')
             .post(authMiddleware, authorizeRole('admin'), validateMiddleware(createProductSchema), createProduct);

export default router;