import mongoose from "mongoose";
import Cart from '../models/cart.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import Product from '../models/product.model.js';

// 1. ADD TO CART
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "The provided product ID structure is invalid");
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
        throw new ApiError(404, "Product not found or unavailable");
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    const currentInCartQuantity = itemIndex !== -1 ? cart.items[itemIndex].quantity : 0;
    const totalTargetQuantity = currentInCartQuantity + quantity;

    if (product.inventoryQuantity < totalTargetQuantity) {
        throw new ApiError(
            400, 
            `Cannot add items. You already have ${currentInCartQuantity} in cart, and maximum available stock is ${product.inventoryQuantity}.`
        );
    }

    if (itemIndex !== -1) {
        cart.items[itemIndex].quantity = totalTargetQuantity;
    } else {
        cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product", "name price images sku");

    return res.status(200).json(new ApiResponse(200, populatedCart, "Product added to cart successfully"));
});

// 2. GET MY CART
const getMyCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // PRODUCTION OPTIMIZATION: Populate product details automatically on fetch
    let cart = await Cart.findOne({ user: userId }).populate("items.product", "name price images sku inventoryQuantity isActive");
    
    // FIXED: Return an empty structure instead of crashing with a 404 for new users
    if (!cart) {
        return res.status(200).json(new ApiResponse(200, { user: userId, items: [] }, "Cart is empty"));
    }

    return res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
}); 

// 3. UPDATE CART ITEM QUANTITY
const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (quantity < 1) {
        throw new ApiError(400, "Quantity must be at least 1. To remove an item, use the delete endpoint.");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart session not found");
    }

    const cartItem = cart.items.find(item => item.product.toString() === productId);
    if (!cartItem) {
        throw new ApiError(404, "Product does not exist inside your cart");
    }

    // Production Safe-Guard: Check stock levels before updating quantity
    const product = await Product.findById(productId);
    if (product && product.inventoryQuantity < quantity) {
        throw new ApiError(400, `Only ${product.inventoryQuantity} items are available in stock.`);
    }

    // FIXED: Save the parent document, not the subdocument child element
    cartItem.quantity = quantity;
    await cart.save();
    
    const populatedCart = await cart.populate("items.product", "name price images sku");

    return res.status(200).json(new ApiResponse(200, populatedCart, "Cart quantity updated successfully"));
});

// 4. DELETE CART ITEM
const deleteCartItem = asyncHandler(async (req, res) => {
    const { id } = req.params; // Expects the Product ID string
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    // FIXED: Replaced array filter dead-code with Mongoose atomic subdocument .pull()
    const initialLength = cart.items.length;
    cart.items.pull({ product: id }); 

    if (cart.items.length === initialLength) {
        throw new ApiError(404, "Target product not found inside your cart array");
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product", "name price images sku");

    return res.status(200).json(new ApiResponse(200, populatedCart, "Item removed from cart successfully"));              
});

// 5. CLEAR CART
const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart session not found");
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json(new ApiResponse(200, cart, "Cart cleared successfully"));
});

export { addToCart, getMyCart, updateCartItemQuantity, deleteCartItem, clearCart };
