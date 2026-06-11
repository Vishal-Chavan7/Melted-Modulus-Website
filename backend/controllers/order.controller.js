import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("items.product", "name price images sku");

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order id");
  }

  const order = await Order.findOne({
    _id: id,
    user: req.user._id,
  }).populate("items.product", "name price images sku");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order id");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    }).session(session);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.orderStatus === "cancelled") {
      throw new ApiError(400, "Order is already cancelled");
    }

    if (!["pending", "processing"].includes(order.orderStatus)) {
      throw new ApiError(400, "Only pending or processing orders can be cancelled");
    }

    if (order.paymentStatus === "paid") {
      throw new ApiError(400, "Paid orders cannot be cancelled from this endpoint");
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { inventoryQuantity: item.quantity } },
        { session },
      );
    }

    order.orderStatus = "cancelled";
    await order.save({ session });

    await session.commitTransaction();

    const populatedOrder = await Order.findById(order._id)
      .populate("items.product", "name price images sku");

    return res
      .status(200)
      .json(new ApiResponse(200, populatedOrder, "Order cancelled successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export { getMyOrders, getOrderById, cancelOrder };
