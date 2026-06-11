import express from "express";
import { processCheckout } from "../controllers/checkout.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/authorizeRole.middleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import { checkoutSchema } from "../validations/checkout.validation.js";

const router = express.Router();

router
  .route("/checkout")
  .post(authMiddleware, authorizeRole("user"), validateMiddleware(checkoutSchema), processCheckout);

export default router;
