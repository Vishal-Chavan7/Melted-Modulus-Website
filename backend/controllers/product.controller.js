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
    
// get all products


const getAllProducts = asyncHandler(async (req,res)=>{
    const products = await Product.find().sort({
        createdAt: -1,
    }).populate('category');
    return res.status(200).
    json(new ApiResponse(200, products, "Products fetched successfully"))
    
})

// get product by id

const getProductById = asyncHandler(async (req,res)=>{
    const { id } = req.params;
    const product = await Product.findById(id).populate('category');
    if(!product){
        throw new ApiError(404, "Product not found");
    }
    return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
})

// update product


const updateProduct  = asyncHandler(async (req,res)=>{
    const { id } = req.params;
    const { name, description, material,price, images, category, inventoryQuantity, sku, isActive } = req.body;
    const product = await Product.findById(id);
    if(!product){
        throw new ApiError(404, "Product not found");
    }
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.material = material ?? product.material;
    product.price = price ?? product.price;
    product.images = images ?? product.images;
    product.category = category ?? product.category;
    product.inventoryQuantity = inventoryQuantity ?? product.inventoryQuantity;
    product.sku = sku ?? product.sku;
    product.isActive = isActive ?? product.isActive;
    await product.save();
    return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));

})

const deleteProduct = asyncHandler(async (req,res)=>{
    const { id }  = req.params;

    const product  = await Product.findById(id);

    if(!product){
        throw new ApiError(404, "Product not found");
    }

    await product.deleteOne();
    return res.status(200).json(new ApiResponse(200, product, "Product deleted successfully"));
    
})

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };