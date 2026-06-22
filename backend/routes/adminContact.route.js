import express from "express";
import {
  deleteContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
} from "../controllers/Admin/contactManagement.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/authorizeRole.middleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import { updateContactStatusSchema } from "../validations/adminContact.validation.js";

const router = express.Router();

router
  .route("/admin/contacts")
  .get(authMiddleware, authorizeRole("admin"), getAllContacts);

router
  .route("/admin/contacts/:id")
  .get(authMiddleware, authorizeRole("admin"), getContactById)
  .delete(authMiddleware, authorizeRole("admin"), deleteContact);

router
  .route("/admin/contacts/:id/status")
  .patch(
    authMiddleware,
    authorizeRole("admin"),
    validateMiddleware(updateContactStatusSchema),
    updateContactStatus,
  );

export default router;
