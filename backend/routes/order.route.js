import express from "express";
import {
  cancelOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/order.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/authorizeRole.middleware.js";

const router = express.Router();

router
  .route("/orders/my-orders")
  .get(authMiddleware, authorizeRole("user"), getMyOrders);

router
  .route("/orders/:id")
  .get(authMiddleware, authorizeRole("user"), getOrderById);

router
  .route("/orders/:id/cancel")
  .patch(authMiddleware, authorizeRole("user"), cancelOrder);

export default router;
