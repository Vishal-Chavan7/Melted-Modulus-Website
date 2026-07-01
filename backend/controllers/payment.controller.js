import Order from "../models/order.model.js";
import {
  finalizePaidOrder,
  sendConfirmationIfNeeded,
} from "../services/orderPayment.service.js";
import { verifyRazorpayWebhookSignature } from "../utils/paymentVerification.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const rawBody = req.body;

  if (!Buffer.isBuffer(rawBody)) {
    throw new ApiError(400, "Invalid webhook payload");
  }

  const isValid = verifyRazorpayWebhookSignature(rawBody, signature);

  if (!isValid) {
    throw new ApiError(400, "Invalid webhook signature");
  }

  let event;

  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch {
    throw new ApiError(400, "Invalid webhook JSON payload");
  }

  if (event.event !== "payment.captured") {
    return res.status(200).json(new ApiResponse(200, null, "Webhook ignored"));
  }

  const paymentEntity = event.payload?.payment?.entity;

  if (!paymentEntity) {
    throw new ApiError(400, "Payment entity missing in webhook payload");
  }

  const razorpayOrderId = paymentEntity.order_id;
  const razorpayPaymentId = paymentEntity.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOne({ razorpayOrderId }).session(session);

    if (!order) {
      await session.commitTransaction();
      return res.status(200).json(new ApiResponse(200, null, "Order not found for webhook"));
    }

    if (order.paymentStatus === "paid") {
      await session.commitTransaction();
      return res.status(200).json(new ApiResponse(200, order, "Payment already processed"));
    }

    order.paymentId = razorpayPaymentId;
    await finalizePaidOrder(order, session);

    await session.commitTransaction();

    await sendConfirmationIfNeeded(order);

    return res.status(200).json(new ApiResponse(200, order, "Webhook processed successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export { handleRazorpayWebhook };
