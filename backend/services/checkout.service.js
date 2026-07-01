import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";
import { calculateShippingCharge } from "../utils/shipping.js";

const createOrderFromCart = async ({
  userId,
  shippingAddress,
  paymentMethod,
  session,
  clearCart = true,
}) => {
  const cart = await Cart.findOne({ user: userId }).session(session);

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Your shopping cart is empty");
  }

  let subtotalAmount = 0;
  const orderItems = [];
  const validCartItems = [];

  for (const cartItem of cart.items) {
    const product = await Product.findById(cartItem.product).session(session);

    if (!product || !product.isActive) {
      continue;
    }

    const priceAtPurchase = Number(product.price.toString());
    subtotalAmount += priceAtPurchase * cartItem.quantity;

    const stockUpdateResult = await Product.updateOne(
      {
        _id: product._id,
        inventoryQuantity: { $gte: cartItem.quantity },
        isActive: true,
      },
      {
        $inc: { inventoryQuantity: -cartItem.quantity },
      },
      { session },
    );

    if (stockUpdateResult.modifiedCount !== 1) {
      throw new ApiError(400, `Insufficient stock for product: ${product.name}`);
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
      "No valid products in your cart. Please remove outdated items and add products again from the shop.",
    );
  }

  if (validCartItems.length !== cart.items.length) {
    cart.items = validCartItems;
    await cart.save({ session });
  }

  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const shippingCharge = calculateShippingCharge(subtotalAmount);
  const totalAmount = subtotalAmount + shippingCharge;

  const [order] = await Order.create(
    [
      {
        user: userId,
        orderNumber,
        items: orderItems,
        subtotalAmount,
        shippingCharge,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentStatus: "pending",
        orderStatus: "pending",
      },
    ],
    { session },
  );

  if (clearCart) {
    cart.items = [];
    await cart.save({ session });
  }

  return order;
};

const clearUserCart = async (userId, session) => {
  const cart = await Cart.findOne({ user: userId }).session(session);

  if (!cart) {
    return;
  }

  cart.items = [];
  await cart.save({ session });
};

export { createOrderFromCart, clearUserCart };
