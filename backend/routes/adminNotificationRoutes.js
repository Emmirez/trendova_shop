import express from "express";
import {
  getAdminNotifications,
  getAdminUnreadCount,
  createAdminNotification,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
  deleteAdminNotification,
  deleteAllAdminNotifications,
  createSystemNotification,
} from "../controllers/adminNotificationController.js";
import { protect } from "../middleware/auth.js";
import { restrictTo } from "../middleware/roles.js";

const router = express.Router();

// All routes require authentication and admin/superadmin role
router.use(protect);
router.use(restrictTo("admin", "superadmin"));

// Notification routes
router.get("/", getAdminNotifications);
router.get("/unread/count", getAdminUnreadCount);
router.post("/", createAdminNotification);
router.patch("/read-all", markAllAdminNotificationsAsRead);
router.delete("/delete-all", deleteAllAdminNotifications);

// System notification creator
router.post("/system/create", createSystemNotification);

// Individual notification routes
router.patch("/:id/read", markAdminNotificationAsRead);
router.delete("/:id", deleteAdminNotification);

export default router;
