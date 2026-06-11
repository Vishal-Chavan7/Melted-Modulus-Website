import express from 'express';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import { createProductSchema, updateProductSchema } from '../validations/product.validation.js';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct     } from '../controllers/product.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorizeRole from '../middlewares/authorizeRole.middleware.js';

const router = express.Router();

router.route('/products')
             .post(authMiddleware, authorizeRole('admin'), validateMiddleware(createProductSchema), createProduct)
             .get(getAllProducts)

router.route('/products/:id')
             .get(getProductById)
             .patch(authMiddleware, authorizeRole('admin'), validateMiddleware(updateProductSchema), updateProduct)
             .delete(authMiddleware, authorizeRole('admin'), deleteProduct);

export default router;