import Order from "../models/Order.js";
import {
  createUserNotification,
  createAdminNotification,
} from "../utils/notificationHelper.js";

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

// @GET /api/orders/my-orders — logged in user
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.productId", "name image")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

// @POST /api/orders/create — logged in user (updated for payment)
export const createOrder = async (req, res, next) => {
  
  try {
    const {
      customer,
      shippingAddress,
      items,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      paymentReference,
      notes,
    } = req.body;

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);

    // Set order status based on payment method
    const orderStatus =
      paymentMethod === "bank" ? "pending_payment" : "processing";

    const order = await Order.create({
      user: req.user?._id,
      customer: customer || {
        name: req.user?.name,
        email: req.user?.email,
        phone: req.user?.phone,
      },
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image,
      })),
      shippingAddress,
      subtotal,
      shippingFee: shippingCost,
      total,
      paymentMethod,
      paymentReference,
      paymentStatus: paymentReference ? "paid" : "pending",
      orderStatus: orderStatus,
      estimatedDeliveryDate,
      notes,
      statusHistory: [{ status: orderStatus, updatedBy: req.user?._id }],
    });

    

    // Create user notification
    await createUserNotification(
      req.user._id,
      "Order Placed",
      `Your order #${order.orderNumber} has been placed successfully. Total: ${formatPrice(order.total)}`,
      "order",
      { orderId: order._id, orderNumber: order.orderNumber },
    );

    // Create admin notification
    await createAdminNotification(
      "New Order Placed",
      `${order.customer.name} placed order #${order.orderNumber} worth ${formatPrice(order.total)}`,
      "order",
      "high",
      { orderId: order._id, orderNumber: order.orderNumber },
    );

    res.status(201).json({
      message: "Order placed successfully.",
      order,
      estimatedDelivery: estimatedDeliveryDate,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    next(error);
  }
};

// @PATCH /api/orders/:id/payment-status — admin only
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found." });

    order.paymentStatus = paymentStatus;
    await order.save();

    res.json({ message: "Payment status updated.", order });
  } catch (error) {
    next(error);
  }
};

// @GET /api/orders — admin/superadmin
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.orderStatus = status;

    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .populate("items.productId", "name image")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    // Calculate stats for admin dashboard
    const stats = {
      total: await Order.countDocuments(),
      pending: await Order.countDocuments({ orderStatus: "processing" }),
      shipped: await Order.countDocuments({ orderStatus: "shipped" }),
      delivered: await Order.countDocuments({ orderStatus: "delivered" }),
      cancelled: await Order.countDocuments({ orderStatus: "cancelled" }),
      revenue: await Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    };

    res.json({ orders, total, stats });
  } catch (error) {
    next(error);
  }
};

// @GET /api/orders/track/:orderNumber — public endpoint
export const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    
    const order = await Order.findOne({ orderNumber })
      .populate("items.productId", "name image");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    
    // Only return tracking info, not sensitive data
    res.json({
      orderNumber: order.orderNumber,
      status: order.orderStatus,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: order.createdAt,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      deliveredAt: order.deliveredAt,
      total: order.total,
    });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/orders/:id/delete — users can delete their own cancelled orders
export const deleteUserOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    // Check if user owns the order
    const isOwner = order.user?.toString() === req.user._id.toString();
    if (!isOwner) {
      return res
        .status(403)
        .json({ message: "You can only delete your own orders." });
    }

    // Only allow deletion of cancelled orders
    if (order.orderStatus !== "cancelled") {
      return res
        .status(400)
        .json({ message: "You can only delete cancelled orders." });
    }

    await order.deleteOne();
    res.json({ message: "Order deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// @GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.productId", "name image");

    if (!order) return res.status(404).json({ message: "Order not found." });

    if (
      req.user.role === "user" &&
      order.user?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized." });
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
};

// @PATCH /api/orders/:id/cancel — users cancel their own orders
// @PATCH /api/orders/:id/status — admin/superadmin update any status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found." });

    // Check if this is a cancel request from user or status update from admin
    const isCancelRequest = req.path.includes("/cancel");
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
    const isOwner = order.user?.toString() === req.user._id.toString();

    // Handle user cancel request
    if (isCancelRequest) {
      if (!isOwner) {
        return res
          .status(403)
          .json({ message: "You can only cancel your own orders." });
      }
      if (
        order.orderStatus === "delivered" ||
        order.orderStatus === "cancelled"
      ) {
        return res
          .status(400)
          .json({ message: "This order cannot be cancelled." });
      }
      order.orderStatus = "cancelled";
      order.statusHistory.push({
        status: "cancelled",
        updatedBy: req.user._id,
        notes: "Cancelled by user",
        timestamp: new Date(),
      });
      await order.save();

      // Notify admin about cancellation
      await createAdminNotification(
        "Order Cancelled",
        `Order #${order.orderNumber} was cancelled by ${order.customer?.name}`,
        "order",
        "medium",
        { orderId: order._id, orderNumber: order.orderNumber },
      );

      return res.json({ message: "Order cancelled successfully.", order });
    }

    // Admin status update
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to update order status." });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = status;

    // If status is being changed to 'processing' (payment approved), also mark payment as paid
    if (status === "processing" && order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";

      // Notify user that payment was approved
      await createUserNotification(
        order.user,
        "Payment Approved",
        `Your payment for order #${order.orderNumber} has been approved. Your order is now being processed. Estimated delivery: ${new Date(order.estimatedDeliveryDate).toLocaleDateString()}`,
        "payment",
        { orderId: order._id, orderNumber: order.orderNumber },
      );

      // Notify admin about payment approval
      await createAdminNotification(
        "Payment Approved",
        `Payment for order #${order.orderNumber} (${formatPrice(order.total)}) has been approved`,
        "payment",
        "medium",
        { orderId: order._id, orderNumber: order.orderNumber },
      );
    }

    // Notify user based on status change
    if (oldStatus !== status) {
      let title, message;
      switch (status) {
        case "shipped":
          title = "Order Shipped";
          message = `Great news! Your order #${order.orderNumber} has been shipped and is on its way!`;
          break;
        case "delivered":
          title = "Order Delivered";
          message = `Your order #${order.orderNumber} has been delivered. We hope you love your items!`;
          break;
        case "cancelled":
          title = "Order Cancelled";
          message = `Your order #${order.orderNumber} has been cancelled.`;
          break;
        default:
          title = "Order Updated";
          message = `Your order #${order.orderNumber} status has been updated to ${status}.`;
      }

      if (status !== "processing") {
        await createUserNotification(order.user, title, message, "order", {
          orderId: order._id,
          orderNumber: order.orderNumber,
        });
      }
    }

    order.statusHistory.push({
      status,
      updatedBy: req.user._id,
      notes: notes || null,
      timestamp: new Date(),
    });

    await order.save();
    res.json({ message: "Order status updated.", order });
  } catch (error) {
    next(error);
  }
};

// @GET /api/orders/verify/:reference — verify payment
export const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = await response.json();

    if (data.data.status === "success") {
      // Update order payment status
      const order = await Order.findOneAndUpdate(
        { paymentReference: reference },
        {
          paymentStatus: "paid",
          orderStatus: "processing",
          statusHistory: {
            $push: {
              status: "Payment confirmed",
              updatedBy: req.user?._id,
              timestamp: new Date(),
            },
          },
        },
        { new: true },
      );

      if (order) {
        // Notify user about successful payment
        await createUserNotification(
          order.user,
          "Payment Successful",
          `Your payment for order #${order.orderNumber} has been confirmed. Your order is now being processed.`,
          "payment",
          { orderId: order._id, orderNumber: order.orderNumber },
        );

        // Notify admin about successful payment
        await createAdminNotification(
          "Payment Received",
          `Payment of ${formatPrice(order.total)} received for order #${order.orderNumber}`,
          "payment",
          "high",
          { orderId: order._id, orderNumber: order.orderNumber },
        );
      }
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @GET /api/orders/stats — admin dashboard stats
export const getOrderStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const stats = {
      total: await Order.countDocuments(),
      pending: await Order.countDocuments({ orderStatus: "processing" }),
      shipped: await Order.countDocuments({ orderStatus: "shipped" }),
      delivered: await Order.countDocuments({ orderStatus: "delivered" }),
      cancelled: await Order.countDocuments({ orderStatus: "cancelled" }),
      today: await Order.countDocuments({ createdAt: { $gte: today } }),
      thisWeek: await Order.countDocuments({
        createdAt: { $gte: startOfWeek },
      }),
      thisMonth: await Order.countDocuments({
        createdAt: { $gte: startOfMonth },
      }),
      revenue: {
        total: await Order.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]).then((result) => result[0]?.total || 0),
        today: await Order.aggregate([
          { $match: { paymentStatus: "paid", createdAt: { $gte: today } } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]).then((result) => result[0]?.total || 0),
      },
    };

    res.json({ stats });
  } catch (error) {
    next(error);
  }
};
