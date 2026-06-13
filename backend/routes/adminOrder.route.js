import express from "express";
import {
  getAdminOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/Admin/orderManagement.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/authorizeRole.middleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import { updateOrderStatusSchema } from "../validations/adminOrder.validation.js";

const router = express.Router();

router
  .route("/admin/orders")
  .get(authMiddleware, authorizeRole("admin"), getAllOrders);

router
  .route("/admin/orders/:id")
  .get(authMiddleware, authorizeRole("admin"), getAdminOrderById);

router
  .route("/admin/orders/:id/status")
  .patch(
    authMiddleware,
    authorizeRole("admin"),
    validateMiddleware(updateOrderStatusSchema),
    updateOrderStatus,
  );

export default router;
