import mongoose from "mongoose";
import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const PRODUCT_FIELDS = "name price images sku material category isActive slug inventoryQuantity";

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
};

const populateWishlist = (wishlist) =>
  wishlist.populate({
    path: "products",
    select: PRODUCT_FIELDS,
    populate: { path: "category", select: "name slug" },
  });

const getMyWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  const populated = await populateWishlist(wishlist);

  const activeProducts = populated.products.filter(
    (product) => product && product.isActive,
  );

  if (activeProducts.length !== populated.products.length) {
    wishlist.products = activeProducts.map((product) => product._id);
    await wishlist.save();
  }

  populated.products = activeProducts;
  return res
    .status(200)
    .json(new ApiResponse(200, populated, "Wishlist fetched successfully"));
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product id");
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new ApiError(404, "Product not found or unavailable");
  }

  const wishlist = await getOrCreateWishlist(userId);
  const exists = wishlist.products.some(
    (id) => id.toString() === productId,
  );

  if (!exists) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  const populated = await populateWishlist(wishlist);
  return res
    .status(200)
    .json(new ApiResponse(200, populated, "Product added to wishlist"));
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product id");
  }

  const wishlist = await getOrCreateWishlist(userId);
  const initialLength = wishlist.products.length;
  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId,
  );

  if (wishlist.products.length === initialLength) {
    throw new ApiError(404, "Product not found in wishlist");
  }

  await wishlist.save();
  const populated = await populateWishlist(wishlist);
  return res
    .status(200)
    .json(new ApiResponse(200, populated, "Product removed from wishlist"));
});

export { getMyWishlist, addToWishlist, removeFromWishlist };
