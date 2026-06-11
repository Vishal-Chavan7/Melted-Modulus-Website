import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

const processCheckout = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Your shopping cart is empty");
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (!product || !product.isActive) {
        throw new ApiError(400, "One product is no longer available");
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
          paymentStatus: "pending",
          orderStatus: "processing",
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