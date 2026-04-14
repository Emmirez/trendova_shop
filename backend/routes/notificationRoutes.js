import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/roles.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/', getNotifications);
router.get('/unread/count', getUnreadCount);
router.patch('/read-all', markAllAsRead);
router.delete('/delete-all', deleteAllNotifications);

// Admin only - create notifications for users
router.post('/', restrictTo('admin', 'superadmin'), createNotification);

// Individual notification routes
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;