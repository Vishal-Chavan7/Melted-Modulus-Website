import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Category from "../models/category.model.js";
import slugify from "slugify";

const createCategory = asyncHandler(async (req, res) => {
    const { name, description, isActive }  = req.body;

    const existingCategory = await Category.findOne({ name });
    if(existingCategory){
        throw new ApiError(409, `Category with name ${name} already exists`);
    }

    let generatedSlug = slugify(name, { lower: true, strict: true });

    const existingSlug = await Category.findOne({ slug: generatedSlug });

    if(existingSlug){
        generatedSlug = `${generatedSlug}-${existingSlug._id.toString().slice(0, -4)}`;
    }

    const category = await Category.create({
        name,
        slug: generatedSlug,
        description,
        isActive,
    });

    return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

// get all categories


const getAllCategories = asyncHandler(async (req, res) => {
    
    const categories = await Category.find().sort({ name: 1 });
    return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

// get category by id

const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);

    if(!category){
        throw new ApiError(404, "Category not found");
    }

    return res.status(200).json(new ApiResponse(200, category, "Category fetched successfully"));
});

// update category

const updateCategory = asyncHandler( async (req, res) => {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await Category.findById(id);

    if(!category){
        throw new ApiError(404, "Category not found");
    }

    if(name && name !== category.name){
        const existingCategory = await Category.findOne({
            name,
            _id: { $ne: id },
        });

        if(existingCategory){
            throw new ApiError(409, `Category with name ${name} already exists`);
        }

        let generatedSlug = slugify(name, { lower: true, strict: true });

        const existingSlug = await Category.findOne({
            slug: generatedSlug,
            _id: { $ne: id },
        });

        if(existingSlug){
            generatedSlug = `${generatedSlug}-${existingSlug._id.toString().slice(0, -4)}`;
        }

        category.name = name;
        category.slug = generatedSlug;
    }

    category.description = description ?? category.description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
});

// delete category

const deleteCategory = asyncHandler( async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);

    if(!category){
        throw new ApiError(404, "Category not found");
    }

    await category.deleteOne();

    return res.status(200).json(new ApiResponse(200, category, "Category deleted successfully"));
});

export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };