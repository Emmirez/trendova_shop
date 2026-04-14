/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react';
import {
  Bell, ShoppingBag, AlertTriangle, Users,
  CreditCard, MessageCircle, Settings,
  Check, CheckCheck, Trash2, Eye, X
} from 'lucide-react';
import { adminNotificationService } from '../../services/apiService';
import { toast } from 'react-hot-toast';

const adminNotifications = [
  { id: 1, title: 'New Order Placed', text: 'Alexandra V. just placed order TRV-001234 worth ₦450,000.', time: '2 mins ago', date: 'Mar 16, 2026', type: 'order', unread: true },
  { id: 2, title: 'Low Stock Alert', text: 'Sovereign Coat is down to 2 units. Consider restocking.', time: '1h ago', date: 'Mar 16, 2026', type: 'alert', unread: true },
  { id: 3, title: 'New User Registered', text: 'Fatima B. just created an account.', time: '2h ago', date: 'Mar 16, 2026', type: 'user', unread: true },
  { id: 4, title: 'Payment Received', text: 'Payment of ₦760,000 confirmed for order TRV-005678.', time: '3h ago', date: 'Mar 16, 2026', type: 'payment', unread: true },
  { id: 5, title: 'Order Delivered', text: 'Order TRV-001234 has been delivered to Alexandra V.', time: '5h ago', date: 'Mar 15, 2026', type: 'order', unread: false },
  { id: 6, title: 'Return Request', text: 'Sofia R. has submitted a return request for order TRV-006789.', time: '1d ago', date: 'Mar 15, 2026', type: 'alert', unread: false },
  { id: 7, title: 'New Message', text: 'James L. sent a message: "When will Chrome Runner be back in stock?"', time: '1d ago', date: 'Mar 15, 2026', type: 'message', unread: false },
  { id: 8, title: 'Payment Failed', text: 'Payment for order TRV-003456 by David O. has failed.', time: '2d ago', date: 'Mar 14, 2026', type: 'payment', unread: false },
  { id: 9, title: 'Flash Sale Started', text: 'Your scheduled flash sale is now live — 30% off selected pieces.', time: '3d ago', date: 'Mar 13, 2026', type: 'system', unread: false },
  { id: 10, title: 'New Admin Added', text: 'Amara D. has been promoted to admin by Super Admin.', time: '5d ago', date: 'Mar 11, 2026', type: 'user', unread: false },
];

export const notifTypeColors = {
  order: 'text-blue-500 bg-blue-50 border-blue-200',
  alert: 'text-red-500 bg-red-50 border-red-200',
  user: 'text-purple-500 bg-purple-50 border-purple-200',
  payment: 'text-green-600 bg-green-50 border-green-200',
  message: 'text-gold bg-gold/10 border-gold/20',
  system: 'text-obsidian/50 bg-obsidian/5 border-obsidian/10',
};

export const notifTypeIcons = {
  order: ShoppingBag,
  alert: AlertTriangle,
  user: Users,
  payment: CreditCard,
  message: MessageCircle,
  system: Settings,
};

const filters = ['All', 'Unread', 'Orders', 'Payments', 'Users', 'Alerts', 'Messages', 'System'];

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, unread: 0, alerts: 0, orders: 0 });
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  // Fetch notifications from API
  const fetchNotifications = async (page = 1, type = '') => {
    setLoading(true);
    try {
      let filterType = type;
      if (type === 'Orders') filterType = 'order';
      else if (type === 'Payments') filterType = 'payment';
      else if (type === 'Users') filterType = 'user';
      else if (type === 'Alerts') filterType = 'alert';
      else if (type === 'Messages') filterType = 'message';
      else if (type === 'System') filterType = 'system';
      else if (type === 'Unread') filterType = '';
      
      const response = await adminNotificationService.getNotifications({ 
        page, 
        limit: 20, 
        type: filterType,
        unread: type === 'Unread'
      });
      
      // Transform API notifications to match your existing format
      const formattedNotifs = response.notifications.map(notif => ({
        id: notif._id,
        title: notif.title,
        text: notif.text,
        time: notif.time,
        date: notif.date,
        type: notif.type,
        unread: notif.unread,
      }));
      
      setNotifications(formattedNotifs);
      setPagination(response.pagination);
      if (response.stats) {
        setStats(response.stats);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      toast.error(err.message || 'Failed to fetch notifications');
      // Fallback to mock data
      setNotifications(adminNotifications);
      setStats({
        total: adminNotifications.length,
        unread: adminNotifications.filter(n => n.unread).length,
        alerts: adminNotifications.filter(n => n.type === 'alert').length,
        orders: adminNotifications.filter(n => n.type === 'order').length,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, filter);
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications(pagination.page, filter);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [filter]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const filtered = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return n.unread;
    if (filter === 'Orders') return n.type === 'order';
    if (filter === 'Payments') return n.type === 'payment';
    if (filter === 'Users') return n.type === 'user';
    if (filter === 'Alerts') return n.type === 'alert';
    if (filter === 'Messages') return n.type === 'message';
    if (filter === 'System') return n.type === 'system';
    return true;
  });

  const markAllRead = async () => {
    try {
      await adminNotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      toast.error(err.message || 'Failed to mark all as read');
      // Fallback to local update
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    }
  };

  const markRead = async (id) => {
    try {
      await adminNotificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, unread: false } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read:', err);
      // Fallback to local update
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, unread: false } : n
      ));
    }
  };

  const markUnread = (id) => {
    // Note: You'd need a separate endpoint for mark as unread
    // For now, update locally
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, unread: true } : n
    ));
  };

  const deleteNotif = async (id) => {
    try {
      await adminNotificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Notification deleted');
    } catch (err) {
      console.error('Failed to delete notification:', err);
      toast.error(err.message || 'Failed to delete notification');
      // Fallback to local update
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  const deleteAll = async () => {
    try {
      await adminNotificationService.deleteAllNotifications();
      setNotifications([]);
      setSelected(null);
      toast.success('All notifications deleted');
    } catch (err) {
      console.error('Failed to delete all notifications:', err);
      toast.error(err.message || 'Failed to delete all notifications');
      // Fallback to local update
      setNotifications([]);
      setSelected(null);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        {[
          { label: 'Total', value: stats.total || notifications.length, color: 'theme-text' },
          { label: 'Unread', value: unreadCount, color: 'text-gold' },
          { label: 'Alerts', value: stats.alerts || notifications.filter(n => n.type === 'alert').length, color: 'text-red-500' },
          { label: 'Orders', value: stats.orders || notifications.filter(n => n.type === 'order').length, color: 'text-blue-500' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="p-5 border theme-border rounded-lg"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <p className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase mb-2">{label}</p>
            <p className={`font-display font-black text-3xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Main panel */}
      <div
        className="border theme-border rounded-lg"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b theme-border ">
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">
            All Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white font-mono text-[9px] rounded-full ">
                {unreadCount}
              </span>
            )}
          </h3>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 font-mono text-[10px] tracking-[0.2em] text-gold uppercase hover:text-yellow-600 transition-colors"
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={deleteAll}
                className="flex items-center gap-1 font-mono text-[10px] tracking-[0.2em] text-red-400 uppercase hover:text-red-500 transition-colors"
              >
                <Trash2 size={12} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 px-6 py-3 border-b theme-border">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 font-mono text-[9px] tracking-[0.2em] uppercase border transition-all rounded-lg ${
                filter === f
                  ? 'bg-gold text-obsidian border-gold'
                  : 'theme-border theme-text-muted hover:border-gold/40 hover:text-gold'
              }`}
            >
              {f}
              {f === 'Unread' && unreadCount > 0 && (
                <span className="ml-1 px-1 bg-red-500 text-white text-[8px] rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="px-6 py-2 border-b theme-border">
          <p className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">
            Showing {filtered.length} of {pagination.total || notifications.length}
          </p>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-4">
            <Bell size={36} className="theme-text-muted opacity-20" />
            <p className="font-body theme-text-muted text-sm">No notifications</p>
          </div>
        ) : (
          <div className="divide-y theme-border">
            {filtered.map(notif => {
              const TypeIcon = notifTypeIcons[notif.type] || Bell;
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 px-6 py-4 transition-colors ${notif.unread ? 'bg-gold/3' : ''}`}
                >
                  {/* Type icon */}
                  <div className={`w-8 h-8 flex items-center justify-center border flex-shrink-0 mt-0.5 rounded-lg ${notifTypeColors[notif.type]}`}>
                    <TypeIcon size={13} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {notif.unread && (
                          <div className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                        )}
                        <p className={`font-display font-semibold text-sm  ${notif.unread ? 'theme-text' : 'theme-text-secondary'}`}>
                          {notif.title}
                        </p>
                        <span className={`font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border rounded-lg ${notifTypeColors[notif.type]}`}>
                          {notif.type}
                        </span>
                      </div>
                      <p className="font-mono text-[9px] theme-text-muted flex-shrink-0">{notif.date}</p>
                    </div>
                    <p className="font-body theme-text-secondary text-sm leading-snug mb-1">
                      {notif.text}
                    </p>
                    <p className="font-mono text-[9px] theme-text-muted">{notif.time}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setSelected(notif); if (notif.unread) markRead(notif.id); }}
                      className="w-7 h-7 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
                      title="View"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      onClick={() => notif.unread ? markRead(notif.id) : markUnread(notif.id)}
                      className={`w-7 h-7 flex items-center justify-center border transition-all rounded-lg ${
                        notif.unread
                          ? 'border-gold/30 text-gold hover:bg-gold/10'
                          : 'theme-border theme-text-muted hover:border-gold/40 hover:text-gold'
                      }`}
                      title={notif.unread ? 'Mark read' : 'Mark unread'}
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onClick={() => deleteNotif(notif.id)}
                      className="w-7 h-7 flex items-center justify-center border theme-border theme-text-muted hover:border-red-400/40 hover:text-red-400 transition-all rounded-lg"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => fetchNotifications(pagination.page - 1, filter)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase disabled:opacity-30 hover:border-gold/40 transition-colors rounded-lg"
          >
            Previous
          </button>
          <span className="px-4 py-2 font-mono text-[11px] theme-text-secondary">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => fetchNotifications(pagination.page + 1, filter)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase disabled:opacity-30 hover:border-gold/40 transition-colors rounded-lg"
          >
            Next
          </button>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-obsidian/50 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div
            className="w-full max-w-md border theme-border shadow-xl rounded-lg"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b theme-border ">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center border rounded-lg ${notifTypeColors[selected.type]}`}>
                  {(() => { const I = notifTypeIcons[selected.type] || Bell; return <I size={13} />; })()}
                </div>
                <div>
                  <h3 className="font-display font-bold theme-text text-base">{selected.title}</h3>
                  <span className={`font-mono text-[9px] tracking-[0.15em] uppercase ${notifTypeColors[selected.type]}`}>
                    {selected.type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 ">
              <p className="font-body theme-text-secondary text-sm leading-relaxed">
                {selected.text}
              </p>
              <div className="space-y-2 border-t theme-border pt-4">
                {[
                  { label: 'Date', value: selected.date },
                  { label: 'Time', value: selected.time },
                  { label: 'Status', value: selected.unread ? 'Unread' : 'Read' },
                  { label: 'Type', value: selected.type },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b theme-border last:border-0">
                    <span className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">{label}</span>
                    <span className={`font-mono text-[10px] capitalize ${
                      label === 'Status'
                        ? selected.unread ? 'text-gold' : 'text-green-500'
                        : 'theme-text-secondary'
                    }`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => { deleteNotif(selected.id); }}
                className="flex-1 py-3 border border-red-400/30 text-red-400 font-mono text-[11px] tracking-[0.2em] uppercase hover:bg-red-400/10 transition-colors rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;