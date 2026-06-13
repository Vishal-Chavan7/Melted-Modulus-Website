import express from "express";
import { getAdminDashboard } from "../controllers/Admin/dashboard.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/authorizeRole.middleware.js";

const router = express.Router();

router
  .route("/admin/dashboard")
  .get(authMiddleware, authorizeRole("admin"), getAdminDashboard);

export default router;
