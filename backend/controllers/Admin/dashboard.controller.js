import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import User from "../../models/user.model.js";
import Contact from "../../models/contact.model.js";
import CustomQuote from "../../models/customQuote.model.js";

const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalAdmins,
    blockedUsers,
    totalProducts,
    activeProducts,
    lowStockProducts,
    totalOrders,
    paidOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    revenueResult,
    totalContacts,
    pendingContacts,
    totalCustomQuotes,
    pendingCustomQuotes,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ isBlocked: true }),
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ inventoryQuantity: { $lte: 5 } }),
    Order.countDocuments(),
    Order.countDocuments({ paymentStatus: "paid" }),
    Order.countDocuments({ orderStatus: "pending" }),
    Order.countDocuments({ orderStatus: "processing" }),
    Order.countDocuments({ orderStatus: "shipped" }),
    Order.countDocuments({ orderStatus: "delivered" }),
    Order.countDocuments({ orderStatus: "cancelled" }),
    Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          orderStatus: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]),
    Contact.countDocuments(),
    Contact.countDocuments({ status: "pending" }),
    CustomQuote.countDocuments(),
    CustomQuote.countDocuments({ status: "pending" }),
  ]);

  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users: {
          totalUsers,
          totalAdmins,
          blockedUsers,
        },
        products: {
          totalProducts,
          activeProducts,
          lowStockProducts,
        },
        orders: {
          totalOrders,
          paidOrders,
          byStatus: {
            pending: pendingOrders,
            processing: processingOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders,
          },
        },
        revenue: {
          totalRevenue,
        },
        inquiries: {
          totalContacts,
          pendingContacts,
          totalCustomQuotes,
          pendingCustomQuotes,
        },
      },
      "Admin dashboard fetched successfully",
    ),
  );
});

export { getAdminDashboard };
