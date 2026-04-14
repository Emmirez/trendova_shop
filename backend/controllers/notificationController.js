import Notification from "../models/Notification.js";

// @GET /api/notifications
export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, unread } = req.query;

    let query = { user: req.user._id };

    if (type && type !== "All") {
      if (type === "Orders") query.type = "order";
      else if (type === "Promos") query.type = "promo";
      else if (type === "System") query.type = "system";
      else query.type = type;
    }

    if (unread === "true") query.unread = true;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      unread: true,
    });

    res.json({
      notifications,
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

// @GET /api/notifications/unread/count
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      unread: true,
    });
    res.json({ count });
  } catch (error) {
    next(error);
  }
};

// @POST /api/notifications
export const createNotification = async (req, res, next) => {
  try {
    const { userId, title, text, type, metadata } = req.body;

    const notification = await Notification.create({
      user: userId,
      title,
      text,
      type: type || "system",
      metadata: metadata || {},
    });

    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

// @PATCH /api/notifications/:id/read
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { unread: false },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// @PATCH /api/notifications/read-all
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, unread: true },
      { unread: false },
    );

    res.json({ message: "All notifications marked as read." });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/notifications/:id
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json({ message: "Notification deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/notifications/delete-all
export const deleteAllNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ message: "All notifications deleted successfully." });
  } catch (error) {
    next(error);
  }
};
