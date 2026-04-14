import AdminNotification from '../models/AdminNotification.js';

// @GET /api/admin/notifications
export const getAdminNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, unread } = req.query;
    
    let query = {};
    
    if (type && type !== 'All') {
      if (type === 'Orders') query.type = 'order';
      else if (type === 'Payments') query.type = 'payment';
      else if (type === 'Users') query.type = 'user';
      else if (type === 'Alerts') query.type = 'alert';
      else if (type === 'Messages') query.type = 'message';
      else if (type === 'System') query.type = 'system';
      else query.type = type;
    }
    
    if (unread === 'true') query.unread = true;
    
    const notifications = await AdminNotification.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    
    const total = await AdminNotification.countDocuments(query);
    const unreadCount = await AdminNotification.countDocuments({ unread: true });
    
    // Get stats
    const stats = {
      total: await AdminNotification.countDocuments(),
      unread: unreadCount,
      alerts: await AdminNotification.countDocuments({ type: 'alert' }),
      orders: await AdminNotification.countDocuments({ type: 'order' }),
      payments: await AdminNotification.countDocuments({ type: 'payment' }),
      users: await AdminNotification.countDocuments({ type: 'user' }),
      messages: await AdminNotification.countDocuments({ type: 'message' }),
      system: await AdminNotification.countDocuments({ type: 'system' }),
    };
    
    res.json({
      notifications,
      stats,
      unreadCount,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @GET /api/admin/notifications/unread/count
export const getAdminUnreadCount = async (req, res, next) => {
  try {
    const count = await AdminNotification.countDocuments({ unread: true });
    res.json({ count });
  } catch (error) {
    next(error);
  }
};

// @POST /api/admin/notifications
export const createAdminNotification = async (req, res, next) => {
  try {
    const { title, text, type, priority, metadata } = req.body;
    
    if (!title || !text) {
      return res.status(400).json({ message: 'Title and text are required.' });
    }
    
    const notification = await AdminNotification.create({
      title,
      text,
      type: type || 'system',
      priority: priority || 'medium',
      metadata: metadata || {},
    });
    
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

// @PATCH /api/admin/notifications/:id/read
export const markAdminNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await AdminNotification.findByIdAndUpdate(
      req.params.id,
      { unread: false },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    
    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// @PATCH /api/admin/notifications/read-all
export const markAllAdminNotificationsAsRead = async (req, res, next) => {
  try {
    await AdminNotification.updateMany(
      { unread: true },
      { unread: false }
    );
    
    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/admin/notifications/:id
export const deleteAdminNotification = async (req, res, next) => {
  try {
    const notification = await AdminNotification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    
    res.json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/admin/notifications/delete-all
export const deleteAllAdminNotifications = async (req, res, next) => {
  try {
    await AdminNotification.deleteMany({});
    res.json({ message: 'All notifications deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @POST /api/admin/notifications/system/create
export const createSystemNotification = async (req, res, next) => {
  try {
    const { title, text, type, priority } = req.body;
    
    const notification = await AdminNotification.create({
      title,
      text,
      type: type || 'system',
      priority: priority || 'medium',
    });
    
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};