import mongoose from "mongoose";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import { sendOrderStatusEmail } from "../../utils/orderEmailService.js";

const allowedStatusTransitions = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const getAllOrders = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const { orderStatus, paymentStatus, search } = req.query;

  const queryConditions = {};

  if (orderStatus) {
    queryConditions.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    queryConditions.paymentStatus = paymentStatus;
  }

  if (search) {
    const searchConditions = [
      { orderNumber: { $regex: search, $options: "i" } },
    ];

    if (mongoose.Types.ObjectId.isValid(search)) {
      searchConditions.push(
        { _id: search },
        { user: search },
      );
    }

    queryConditions.$or = searchConditions;
  }

  const [orders, totalOrders] = await Promise.all([
    Order.find(queryConditions)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email phone address")
      .populate("items.product", "name price images sku")
      .lean(),
    Order.countDocuments(queryConditions),
  ]);

  const totalPages = Math.ceil(totalOrders / limit);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          orders,
          pagination: {
            totalOrders,
            totalPages,
            currentPage: page,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
        "Orders fetched successfully",
      ),
    );
});

const getAdminOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order id");
  }

  const order = await Order.findById(id)
    .populate("user", "name email phone")
    .populate("items.product", "name price images sku");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order id");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(id).session(session);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.orderStatus === orderStatus) {
      throw new ApiError(400, `Order is already ${orderStatus}`);
    }

    const allowedNextStatuses = allowedStatusTransitions[order.orderStatus] || [];

    if (!allowedNextStatuses.includes(orderStatus)) {
      throw new ApiError(
        400,
        `Order cannot be changed from ${order.orderStatus} to ${orderStatus}`,
      );
    }

    if (orderStatus === "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { inventoryQuantity: item.quantity } },
          { session },
        );
      }
    }

    order.orderStatus = orderStatus;
    await order.save({ session });

    await session.commitTransaction();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("items.product", "name price images sku");

    try {
      await sendOrderStatusEmail(updatedOrder, orderStatus);
    } catch (emailError) {
      console.error(`Order ${orderStatus} email failed:`, emailError.message);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedOrder, "Order status updated successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export { getAllOrders, getAdminOrderById, updateOrderStatus };