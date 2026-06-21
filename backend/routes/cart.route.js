import express from "express";
import {
    addToCart,
    getMyCart,
    updateCartItemQuantity,
    deleteCartItem,
    clearCart,
    syncCart,
} from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import {
    addToCartSchema,
    updateCartItemQuantitySchema,
    syncCartSchema,
} from "../validations/cart.validation.js";
import authorizeRole from "../middlewares/authorizeRole.middleware.js";

const router = express.Router();

router
    .route("/cart")
    .post(authMiddleware, authorizeRole("user"), validateMiddleware(addToCartSchema), addToCart)
    .get(authMiddleware, authorizeRole("user"), getMyCart)
    .put(authMiddleware, authorizeRole("user"), validateMiddleware(syncCartSchema), syncCart)
    .patch(authMiddleware, authorizeRole("user"), validateMiddleware(updateCartItemQuantitySchema), updateCartItemQuantity)
    .delete(authMiddleware, authorizeRole("user"), clearCart);

router
    .route("/cart/:id")
    .delete(authMiddleware, authorizeRole("user"), deleteCartItem);

export default router;