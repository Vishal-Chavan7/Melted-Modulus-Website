import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import slugify from "slugify";
import {
  getUploadedImagePaths,
  parseExistingImages,
} from "../middlewares/upload.middleware.js";

const buildProductImages = (req) => {
  const uploadedImages = getUploadedImagePaths(req.files);
  const existingImages = parseExistingImages(req.body.existingImages);
  return [...existingImages, ...uploadedImages];
};

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, material, price, category, inventoryQuantity, sku, isActive } = req.body;
  const userId = req.user._id;
  const images = buildProductImages(req);

  if (images.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  if (images.length > 5) {
    throw new ApiError(400, "Maximum 5 images are allowed");
  }

  const existingSku = await Product.findOne({ sku });
  if (existingSku) {
    throw new ApiError(409, `Product with SKU ${sku} already exists`);
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  let generatedSlug = slugify(name, { lower: true, strict: true });
  const existingSlug = await Product.findOne({ slug: generatedSlug });
  if (existingSlug) {
    generatedSlug = `${generatedSlug}-${existingSlug._id.toString().slice(0, 4)}`;
  }

  const product = await Product.create({
    user: userId,
    name,
    slug: generatedSlug,
    description,
    material,
    price,
    images,
    category,
    inventoryQuantity,
    sku,
    isActive,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .populate("category");

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("category");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, material, price, category, inventoryQuantity, sku, isActive } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const hasNewImages = req.files?.length > 0 || req.body.existingImages !== undefined;
  if (hasNewImages) {
    const images = buildProductImages(req);
    if (images.length === 0) {
      throw new ApiError(400, "At least one product image is required");
    }
    if (images.length > 5) {
      throw new ApiError(400, "Maximum 5 images are allowed");
    }
    product.images = images;
  }

  if (sku && sku !== product.sku) {
    const existingSku = await Product.findOne({ sku, _id: { $ne: id } });
    if (existingSku) {
      throw new ApiError(409, `Product with SKU ${sku} already exists`);
    }
    product.sku = sku;
  }

  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new ApiError(404, "Category not found");
    }
    product.category = category;
  }

  if (name && name !== product.name) {
    let generatedSlug = slugify(name, { lower: true, strict: true });
    const existingSlug = await Product.findOne({ slug: generatedSlug, _id: { $ne: id } });
    if (existingSlug) {
      generatedSlug = `${generatedSlug}-${existingSlug._id.toString().slice(0, 4)}`;
    }
    product.name = name;
    product.slug = generatedSlug;
  } else if (name) {
    product.name = name;
  }

  product.description = description ?? product.description;
  product.material = material ?? product.material;
  product.price = price ?? product.price;
  product.inventoryQuantity = inventoryQuantity ?? product.inventoryQuantity;
  if (isActive !== undefined) product.isActive = isActive;

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await product.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product deleted successfully"));
});

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
