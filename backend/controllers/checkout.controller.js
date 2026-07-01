import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { createOrderFromCart } from "../services/checkout.service.js";
import {
  finalizePaidOrder,
  sendConfirmationIfNeeded,
} from "../services/orderPayment.service.js";
import {
  getRazorpayClient,
  getRazorpayKeyId,
  isOnlinePaymentMethod,
  toPaise,
} from "../utils/razorpay.js";
import { verifyRazorpayPaymentSignature } from "../utils/paymentVerification.js";

const createRazorpayOrderForDbOrder = async (order, user) => {
  const razorpay = getRazorpayClient();
  const amountInPaise = toPaise(order.totalAmount);

  if (amountInPaise < 100) {
    throw new ApiError(400, "Order total must be at least ₹1 for online payment");
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: order.orderNumber,
    notes: {
      orderId: String(order._id),
      orderNumber: order.orderNumber,
      userId: String(user._id),
    },
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save({ validateBeforeSave: false });

  return {
    keyId: getRazorpayKeyId(),
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    razorpayOrderId: razorpayOrder.id,
    orderNumber: order.orderNumber,
    customer: {
      name: order.shippingAddress?.fullName || user.name,
      email: user.email,
      contact: order.shippingAddress?.phone || user.phone,
    },
  };
};

const processCheckout = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress, paymentMethod } = req.body;

  if (isOnlinePaymentMethod(paymentMethod)) {
    throw new ApiError(
      400,
      "Online payments must be completed through the Razorpay checkout flow",
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await createOrderFromCart({
      userId,
      shippingAddress,
      paymentMethod,
      session,
      clearCart: true,
    });

    await session.commitTransaction();

    await sendConfirmationIfNeeded(order);

    return res.status(201).json(
      new ApiResponse(201, order, "Checkout completed successfully"),
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

const createOnlineCheckout = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress, paymentMethod } = req.body;

  if (!isOnlinePaymentMethod(paymentMethod)) {
    throw new ApiError(400, "Selected payment method requires online checkout");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await createOrderFromCart({
      userId,
      shippingAddress,
      paymentMethod,
      session,
      clearCart: false,
    });

    await session.commitTransaction();

    const payment = await createRazorpayOrderForDbOrder(order, req.user);

    return res.status(201).json(
      new ApiResponse(
        201,
        { order, payment },
        "Online checkout initiated successfully",
      ),
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

const verifyCheckoutPayment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    orderId,
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order id");
  }

  const isValidSignature = verifyRazorpayPaymentSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  if (!isValidSignature) {
    throw new ApiError(400, "Payment verification failed. Invalid signature.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    }).session(session);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.orderStatus === "cancelled") {
      throw new ApiError(400, "This order has been cancelled");
    }

    if (order.razorpayOrderId && order.razorpayOrderId !== razorpayOrderId) {
      throw new ApiError(400, "Payment does not match this order");
    }

    if (order.paymentStatus === "paid") {
      await session.commitTransaction();
      return res.status(200).json(
        new ApiResponse(200, order, "Payment already verified"),
      );
    }

    order.paymentId = razorpayPaymentId;
    order.razorpayOrderId = razorpayOrderId;
    await finalizePaidOrder(order, session);

    await session.commitTransaction();

    await sendConfirmationIfNeeded(order);

    return res.status(200).json(
      new ApiResponse(200, order, "Payment verified successfully"),
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

const retryOnlinePayment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order id");
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.paymentStatus === "paid") {
    throw new ApiError(400, "This order is already paid");
  }

  if (order.orderStatus === "cancelled") {
    throw new ApiError(400, "Cancelled orders cannot be paid");
  }

  if (!isOnlinePaymentMethod(order.paymentMethod)) {
    throw new ApiError(400, "This order does not support online payment");
  }

  const user = await User.findById(userId).select("name email phone");
  const payment = await createRazorpayOrderForDbOrder(order, user);

  return res.status(200).json(
    new ApiResponse(200, { order, payment }, "Payment session created successfully"),
  );
});

export {
  processCheckout,
  createOnlineCheckout,
  verifyCheckoutPayment,
  retryOnlinePayment,
};
