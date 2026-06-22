import express from "express";
import {
  blockUser,
  unblockUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/Admin/userManagement.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/authorizeRole.middleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import { updateAdminUserSchema } from "../validations/adminUser.validation.js";

const router = express.Router();

router
  .route("/admin/users")
  .get(authMiddleware, authorizeRole("admin"), getAllUsers);

router
  .route("/admin/users/:id")
  .get(authMiddleware, authorizeRole("admin"), getUserById)
  .patch(authMiddleware, authorizeRole("admin"), validateMiddleware(updateAdminUserSchema), updateUser)
  .delete(authMiddleware, authorizeRole("admin"), deleteUser);

router
  .route("/admin/users/:id/block")
  .patch(authMiddleware, authorizeRole("admin"), blockUser);

router
  .route("/admin/users/:id/unblock")
  .patch(authMiddleware, authorizeRole("admin"), unblockUser);

export default router;
