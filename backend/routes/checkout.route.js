import express from "express";
import {
  createOnlineCheckout,
  processCheckout,
  retryOnlinePayment,
  verifyCheckoutPayment,
} from "../controllers/checkout.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/authorizeRole.middleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import {
  checkoutSchema,
  onlineCheckoutSchema,
  retryPaymentSchema,
  verifyPaymentSchema,
} from "../validations/checkout.validation.js";

const router = express.Router();

router
  .route("/checkout")
  .post(authMiddleware, authorizeRole("user"), validateMiddleware(checkoutSchema), processCheckout);

router
  .route("/checkout/online")
  .post(
    authMiddleware,
    authorizeRole("user"),
    validateMiddleware(onlineCheckoutSchema),
    createOnlineCheckout,
  );

router
  .route("/checkout/verify-payment")
  .post(
    authMiddleware,
    authorizeRole("user"),
    validateMiddleware(verifyPaymentSchema),
    verifyCheckoutPayment,
  );

router
  .route("/checkout/retry-payment")
  .post(
    authMiddleware,
    authorizeRole("user"),
    validateMiddleware(retryPaymentSchema),
    retryOnlinePayment,
  );

export default router;
