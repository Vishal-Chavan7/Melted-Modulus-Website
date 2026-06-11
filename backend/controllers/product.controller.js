import asyncHandler  from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Product from '../models/product.model.js';
import Category from "../models/category.model.js";
import slugify from "slugify";


// Create Product controller


const createProduct = asyncHandler(async (req,res)=>{
    const { name, description, material,price, images, category, inventoryQuantity, sku, isActive } = req.body;

    const userId = req.user._id;

    const existingSku = await Product.findOne({ sku });
    if(existingSku){
        throw new ApiError(409, `Product with SKU ${sku} already exists`);
    }

    const categoryExists = await Category.findById(category);
    if(!categoryExists){
        throw new ApiError(404, "Category not found");
    }

    let generatedSlug = slugify(name, {lower: true, strict: true});

    const existingSlug = await Product.findOne({slug: generatedSlug});
    if(existingSlug){
        generatedSlug = `${generatedSlug}-${existingSlug._id.toString().slice(0, 4)}`;
    }

    if(!images || !Array.isArray(images) || images.length === 0){
        throw new ApiError(400, "At least one product image is required");
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
    

export { createProduct };