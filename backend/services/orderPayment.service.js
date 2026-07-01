import Order from "../models/order.model.js";
import { sendOrderConfirmationEmail } from "../utils/orderEmailService.js";
import { clearUserCart } from "./checkout.service.js";

const populateOrderForEmail = (orderId) =>
  Order.findById(orderId)
    .populate("user", "name email")
    .populate("items.product", "name sku");

const finalizePaidOrder = async (order, session) => {
  if (order.paymentStatus === "paid") {
    return order;
  }

  order.paymentStatus = "paid";
  order.paidAt = new Date();

  if (order.orderStatus === "pending") {
    order.orderStatus = "processing";
  }

  await order.save({ session });
  await clearUserCart(order.user, session);

  return order;
};

const sendConfirmationIfNeeded = async (order) => {
  try {
    const populatedOrder = await populateOrderForEmail(order._id);
    await sendOrderConfirmationEmail(populatedOrder);
  } catch (emailError) {
    console.error("Order confirmation email failed:", emailError.message);
  }
};

export { finalizePaidOrder, sendConfirmationIfNeeded };
