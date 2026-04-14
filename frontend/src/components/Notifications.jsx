/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Bell, Trash2, Eye, CheckCheck, Check, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { notificationService } from "../services/apiService";
import { toast } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import useAuth from "../hooks/useAuth";

const typeColors = {
  order: "text-blue-500 bg-blue-50 border-blue-200",
  promo: "text-gold bg-gold/10 border-gold/20",
  system: "text-purple-500 bg-purple-50 border-purple-200",
};

const typeDark = {
  order: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  promo: "text-gold bg-gold/10 border-gold/20",
  system: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const filters = ["All", "Unread", "Orders", "Promos", "System"];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async (page = 1, type = "") => {
    setLoading(true);
    try {
      let filterType = type;
      if (type === "Orders") filterType = "order";
      else if (type === "Promos") filterType = "promo";
      else if (type === "System") filterType = "system";
      else if (type === "Unread") filterType = "";

      const response = await notificationService.getNotifications({
        page,
        limit: 20,
        type: filterType,
        unread: type === "Unread",
      });
      setNotifications(response.notifications);
      setPagination(response.pagination);
      setUnreadCount(response.unreadCount);
    } catch (err) {
      console.error("Failed to fetch notifications:", err.message);
      toast.error(err.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, activeFilter);
  }, [activeFilter]);

  const getFilterTypeForApi = (filter) => {
    if (filter === "Orders") return "order";
    if (filter === "Promos") return "promo";
    if (filter === "System") return "system";
    return "";
  };

  const filtered = notifications;

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await fetchNotifications(pagination.page, activeFilter);
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error(err.message || "Failed to mark all as read");
    }
  };

  const markRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, unread: false } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error(err.message || "Failed to mark as read");
    }
  };

  const markUnread = async (id) => {
    // Note: You'd need an endpoint for this, or just toggle
    // For now, we'll just update locally
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, unread: true } : n)),
    );
    setUnreadCount((prev) => prev + 1);
  };

  const deleteNotif = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (selectedNotif?._id === id) setSelectedNotif(null);
      toast.success("Notification deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete notification");
    }
  };

  const deleteAll = async () => {
    try {
      await notificationService.deleteAllNotifications();
      setNotifications([]);
      setSelectedNotif(null);
      setUnreadCount(0);
      toast.success("All notifications deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete notifications");
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen theme-bg overflow-x-hidden">
        <Header />
        <div className="flex justify-center items-center py-40">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg overflow-x-hidden">
      <Header />

      {/* Page header — always dark */}
      <div className="bg-obsidian pt-24 pb-10 px-6">
        <div className="max-w-5xl mx-auto pt-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
              Inbox
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-display font-black text-cream text-4xl md:text-5xl leading-tight">
              My
              <span className="block italic gold-text">Notifications</span>
            </h1>
            <div className="flex items-center gap-2 pb-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-cream/30 uppercase">
                {unreadCount} unread
              </span>
              {unreadCount > 0 && (
                <div className="w-5 h-5 bg-red-500 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="py-10 px-6 max-w-5xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-200 border rounded-lg ${
                  activeFilter === f
                    ? "bg-gold text-obsidian border-gold"
                    : "theme-border theme-text-muted hover:border-gold/40 hover:text-gold"
                }`}
              >
                {f}
                {f === "Unread" && unreadCount > 0 && (
                  <span className="ml-1.5 px-1 py-0.5 bg-red-500 text-white text-[8px] rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-gold uppercase hover:text-yellow-600 transition-colors"
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={deleteAll}
                className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-red-400 uppercase hover:text-red-500 transition-colors"
              >
                <Trash2 size={13} />
                Delete all
              </button>
            )}
          </div>
        </div>

        {/* Count */}
        <p className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase mb-4">
          Showing {filtered.length} of {pagination.total} notifications
        </p>

        {/* List */}
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 gap-4 border theme-border rounded-lg"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <Bell size={40} className="theme-text-muted opacity-20" />
            <p className="font-display font-semibold theme-text-secondary text-lg">
              No notifications
            </p>
            <p className="font-body theme-text-muted text-sm">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div
            className="border theme-border divide-y rounded-lg"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
            }}
          >
            {filtered.map((notif) => (
              <div
                key={notif._id}
                className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                  notif.unread ? "bg-gold/3" : ""
                }`}
                style={{ borderColor: "var(--border-color)" }}
              >
                {/* Unread dot */}
                <div className="flex-shrink-0 mt-2">
                  {notif.unread ? (
                    <div className="w-2 h-2 bg-gold rounded-full" />
                  ) : (
                    <div className="w-2 h-2 rounded-full border theme-border" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`font-display font-semibold text-sm ${notif.unread ? "theme-text" : "theme-text-secondary"}`}
                      >
                        {notif.title}
                      </p>
                      <span
                        className={`font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border rounded-lg ${typeDark[notif.type]}`}
                      >
                        {notif.type}
                      </span>
                    </div>
                    <p className="font-mono text-[9px] tracking-[0.1em] theme-text-muted uppercase flex-shrink-0">
                      {notif.date}
                    </p>
                  </div>
                  <p className="font-body theme-text-secondary text-sm leading-relaxed mb-1">
                    {notif.text}
                  </p>
                  <p className="font-mono text-[9px] theme-text-muted">
                    {notif.time}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                  {/* View details */}
                  <button
                    onClick={() => {
                      setSelectedNotif(notif);
                      if (notif.unread) markRead(notif._id);
                    }}
                    className="w-7 h-7 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
                    title="View details"
                  >
                    <Eye size={12} />
                  </button>

                  {/* Mark read/unread */}
                  <button
                    onClick={() =>
                      notif.unread ? markRead(notif._id) : markUnread(notif._id)
                    }
                    className={`w-7 h-7 flex items-center justify-center border transition-all rounded-lg ${
                      notif.unread
                        ? "border-gold/30 text-gold hover:bg-gold/10"
                        : "theme-border theme-text-muted hover:border-gold/40 hover:text-gold"
                    }`}
                    title={notif.unread ? "Mark as read" : "Mark as unread"}
                  >
                    <Check size={12} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteNotif(notif._id)}
                    className="w-7 h-7 flex items-center justify-center border theme-border theme-text-muted hover:border-red-400/40 hover:text-red-400 transition-all rounded-lg"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() =>
                fetchNotifications(pagination.page - 1, activeFilter)
              }
              disabled={pagination.page === 1}
              className="px-4 py-2 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase disabled:opacity-30 hover:border-gold/40 transition-colors rounded-lg"
            >
              Previous
            </button>
            <span className="px-4 py-2 font-mono text-[11px] theme-text-secondary">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() =>
                fetchNotifications(pagination.page + 1, activeFilter)
              }
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase disabled:opacity-30 hover:border-gold/40 transition-colors rounded-lg"
            >
              Next
            </button>
          </div>
        )}

        {/* Back link */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase hover:text-gold transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>

      {/* Detail modal */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div
            className="w-full max-w-md border theme-border shadow-2xl rounded-lg"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
              <div className="flex items-center gap-3">
                <h3 className="font-display font-bold theme-text text-lg">
                  {selectedNotif.title}
                </h3>
                <span
                  className={`font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border rounded-lg ${typeDark[selectedNotif.type]}`}
                >
                  {selectedNotif.type}
                </span>
              </div>
              <button
                onClick={() => setSelectedNotif(null)}
                className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-6">
              <p className="font-body theme-text-secondary text-sm leading-relaxed mb-4">
                {selectedNotif.text}
              </p>
              <div className="flex items-center justify-between py-3 border-t theme-border">
                <span className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">
                  Date
                </span>
                <span className="font-mono text-[10px] theme-text-secondary">
                  {selectedNotif.date}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-t theme-border">
                <span className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">
                  Time
                </span>
                <span className="font-mono text-[10px] theme-text-secondary">
                  {selectedNotif.time}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-t theme-border">
                <span className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">
                  Status
                </span>
                <span
                  className={`font-mono text-[10px] uppercase ${selectedNotif.unread ? "text-gold" : "text-green-500"}`}
                >
                  {selectedNotif.unread ? "Unread" : "Read"}
                </span>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => {
                  deleteNotif(selectedNotif._id);
                  setSelectedNotif(null);
                }}
                className="flex-1 py-3 border border-red-400/30 text-red-400 font-mono text-[11px] tracking-[0.2em] uppercase hover:bg-red-400/10 transition-colors rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedNotif(null)}
                className="flex-1 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Notifications;
