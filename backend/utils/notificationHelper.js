import Notification from '../models/Notification.js';
import AdminNotification from '../models/AdminNotification.js';

// Create user notification
export const createUserNotification = async (userId, title, text, type = 'system', metadata = {}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      text,
      type,
      metadata,
      unread: true,
    });
    return notification;
  } catch (error) {
    console.error('Failed to create user notification:', error);
    return null;
  }
};

// Create admin notification
export const createAdminNotification = async (title, text, type = 'system', priority = 'medium', metadata = {}) => {
  try {
    const notification = await AdminNotification.create({
      title,
      text,
      type,
      priority,
      metadata,
      unread: true,
    });
    return notification;
  } catch (error) {
    console.error('Failed to create admin notification:', error);
    return null;
  }
};