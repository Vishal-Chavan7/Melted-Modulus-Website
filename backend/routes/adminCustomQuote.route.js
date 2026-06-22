import express from "express";
import {
  deleteCustomQuote,
  getAllCustomQuotes,
  getCustomQuoteById,
  updateCustomQuoteStatus,
} from "../controllers/Admin/customQuoteManagement.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/authorizeRole.middleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import { updateCustomQuoteStatusSchema } from "../validations/adminCustomQuote.validation.js";

const router = express.Router();

router
  .route("/admin/custom-quotes")
  .get(authMiddleware, authorizeRole("admin"), getAllCustomQuotes);

router
  .route("/admin/custom-quotes/:id")
  .get(authMiddleware, authorizeRole("admin"), getCustomQuoteById)
  .delete(authMiddleware, authorizeRole("admin"), deleteCustomQuote);

router
  .route("/admin/custom-quotes/:id/status")
  .patch(
    authMiddleware,
    authorizeRole("admin"),
    validateMiddleware(updateCustomQuoteStatusSchema),
    updateCustomQuoteStatus,
  );

export default router;
