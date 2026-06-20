import express from "express";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import { createProductFormSchema, updateProductFormSchema } from "../validations/product.validation.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/authorizeRole.middleware.js";
import { handleProductUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router
  .route("/products")
  .post(
    authMiddleware,
    authorizeRole("admin"),
    handleProductUpload,
    validateMiddleware(createProductFormSchema),
    createProduct,
  )
  .get(getAllProducts);

router
  .route("/products/:id")
  .get(getProductById)
  .patch(
    authMiddleware,
    authorizeRole("admin"),
    handleProductUpload,
    validateMiddleware(updateProductFormSchema),
    updateProduct,
  )
  .delete(authMiddleware, authorizeRole("admin"), deleteProduct);

export default router;
