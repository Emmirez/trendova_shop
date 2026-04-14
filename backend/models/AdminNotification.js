import mongoose from 'mongoose';

const adminNotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['order', 'alert', 'user', 'payment', 'message', 'system'],
    default: 'system',
  },
  unread: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
  },
  time: {
    type: String,
    default: () => {
      const now = new Date();
      const diff = Math.floor((Date.now() - now) / 1000 / 60);
      if (diff < 60) return `${diff} minutes ago`;
      if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
      return `${Math.floor(diff / 1440)} days ago`;
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const AdminNotification = mongoose.model('AdminNotification', adminNotificationSchema);

export default AdminNotification;