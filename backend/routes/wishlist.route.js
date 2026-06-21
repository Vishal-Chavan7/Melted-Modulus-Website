import express from "express";
import {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/authorizeRole.middleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import { addToWishlistSchema } from "../validations/wishlist.validation.js";

const router = express.Router();

router
  .route("/wishlist")
  .get(authMiddleware, authorizeRole("user"), getMyWishlist)
  .post(authMiddleware, authorizeRole("user"), validateMiddleware(addToWishlistSchema), addToWishlist);

router
  .route("/wishlist/:productId")
  .delete(authMiddleware, authorizeRole("user"), removeFromWishlist);

export default router;
