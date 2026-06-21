import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

const processCheckout = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress, paymentMethod } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: userId }).session(session);

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Your shopping cart is empty");
    }

    let totalAmount = 0;
    const orderItems = [];
    const validCartItems = [];

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product).session(session);

      if (!product || !product.isActive) {
        continue;
      }

      const priceAtPurchase = Number(product.price.toString());
      totalAmount += priceAtPurchase * cartItem.quantity;

      const stockUpdateResult = await Product.updateOne(
        {
          _id: product._id,
          inventoryQuantity: { $gte: cartItem.quantity },
          isActive: true,
        },
        {
          $inc: { inventoryQuantity: -cartItem.quantity },
        },
        { session }
      );

      if (stockUpdateResult.modifiedCount !== 1) {
        throw new ApiError(
          400,
          `Insufficient stock for product: ${product.name}`
        );
      }

      orderItems.push({
        product: product._id,
        quantity: cartItem.quantity,
        priceAtPurchase,
      });

      validCartItems.push(cartItem);
    }

    if (orderItems.length === 0) {
      cart.items = [];
      await cart.save({ session });
      throw new ApiError(
        400,
        "No valid products in your cart. Please remove outdated items and add products again from the shop."
      );
    }

    if (validCartItems.length !== cart.items.length) {
      cart.items = validCartItems;
      await cart.save({ session });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const [order] = await Order.create(
      [
        {
          user: userId,
          orderNumber,
          items: orderItems,
          totalAmount,
          shippingAddress,
          paymentMethod,
          paymentStatus: "pending",
          orderStatus: "pending",
        },
      ],
      { session }
    );

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();

    return res.status(201).json(
      new ApiResponse(
        201,
        order,
        "Checkout completed successfully"
      )
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export { processCheckout };
