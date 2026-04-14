import express from "express";
import { protect } from "../middleware/auth.js";
import { isAdminOrSuperAdmin } from "../middleware/roles.js";
import {
  getMyOrders,
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  verifyPayment,
  getOrderStats,
  deleteUserOrder,
  updatePaymentStatus,
  trackOrder
} from "../controllers/orderController.js";

const router = express.Router();

router.use(protect);


router.get("/my-orders", getMyOrders);
router.get("/stats", isAdminOrSuperAdmin, getOrderStats);
router.get("/verify/:reference", verifyPayment);
router.get("/", isAdminOrSuperAdmin, getAllOrders);
router.patch("/:id/payment-status", isAdminOrSuperAdmin, updatePaymentStatus);

router.post("/create", createOrder);
router.get("/track/:orderNumber", trackOrder);
router.patch("/:id/cancel", updateOrderStatus);
router.patch("/:id/status", isAdminOrSuperAdmin, updateOrderStatus);
router.delete("/:id/delete", deleteUserOrder);


router.get("/:id", getOrderById);

export default router;
