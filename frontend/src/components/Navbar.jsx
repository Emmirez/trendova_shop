/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Sun,
  Moon,
  Bell,
  Loader2
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import {
  notificationService,
  adminNotificationService,
} from "../services/apiService";
import { toast } from "react-hot-toast";
import { productService } from "../services/apiService";

const Navbar = ({ onCartOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const hasDarkHero =
    location.pathname === "/" ||
    location.pathname === "/dashboard" ||
    location.pathname === "/admin/dashboard" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/about" ||
    location.pathname === "/notifications";

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  // Asearch function
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await productService.getAll({
        search: query,
        limit: 10,
      });
      setSearchResults(response.products || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  //  debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // State for real notifications from API
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications based on user role - wrapped in useCallback
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      let response;
      if (isAdmin) {
        response = await adminNotificationService.getNotifications({
          page: 1,
          limit: 10,
        });
      } else {
        response = await notificationService.getNotifications({
          page: 1,
          limit: 10,
        });
      }

      const formattedNotifs = response.notifications.map((notif) => ({
        id: notif._id,
        text: notif.text,
        time: notif.time,
        unread: notif.unread,
      }));
      setNotifications(formattedNotifs);
      setUnreadCount(response.unreadCount);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      if (err.message !== "Not authorized. No token provided." && toast) {
        toast.error(err.message || "Failed to fetch notifications");
      }
      // Silent fail for auth errors - use fallback mock data
      const fallbackNotifs = isAdmin
        ? [
            {
              id: 1,
              text: "New order placed — TRV-001234 worth ₦450,000",
              time: "2 mins ago",
              unread: true,
            },
            {
              id: 2,
              text: "Low stock alert — Sovereign Coat has 2 units left",
              time: "1h ago",
              unread: true,
            },
          ]
        : [
            {
              id: 1,
              text: "Your order TRV-005678 has been dispatched",
              time: "2h ago",
              unread: true,
            },
            {
              id: 2,
              text: "New collection drop — Sovereign Series is live",
              time: "1d ago",
              unread: true,
            },
          ];
      setNotifications(fallbackNotifs);
      setUnreadCount(fallbackNotifs.filter((n) => n.unread).length);
    }
  }, [isAuthenticated, isAdmin, user]);

  // Fetch unread count based on user role - wrapped in useCallback
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      let response;
      if (isAdmin) {
        response = await adminNotificationService.getUnreadCount();
      } else {
        response = await notificationService.getUnreadCount();
      }
      setUnreadCount(response.count);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
      if (err.message !== "Not authorized. No token provided." && toast) {
        toast.error(err.message || "Failed to fetch unread count");
      }
    }
  }, [isAuthenticated, isAdmin, user]);

  // Fetch notifications when component mounts and when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();
      fetchUnreadCount();

      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, isAdmin, user, fetchNotifications, fetchUnreadCount]);

  // Handle scroll - no state updates, just DOM manipulation
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("#user-menu-container")) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      if (isAdmin) {
        await adminNotificationService.markAllAsRead();
      } else {
        await notificationService.markAllAsRead();
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
      setUnreadCount(0);
      if (toast) toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
      setUnreadCount(0);
      if (toast) toast.error(err.message || "Failed to mark all as read");
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  // Both admin and superadmin
  const dashboardLink =
    user?.role === "user" ? "/dashboard" : "/admin/dashboard";

  const navLinks = [
    { label: "Home", href: "/", type: "route" },
    { label: "Collections", href: "/#collections", type: "anchor" },
    { label: "Tracksuits", href: "/#collections", type: "anchor" },
    { label: "Couture", href: "/#collections", type: "anchor" },
    { label: "Accessories", href: "/#collections", type: "anchor" },
    { label: "About", href: "/about", type: "route" },
    { label: "Track Order", href: "/#track-order", type: "anchor" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-obsidian/95 backdrop-blur-md border-b border-white/5 scrolled-nav"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none group">
            <span
              className={`font-display text-xl font-bold tracking-wider group-hover:text-gold transition-colors duration-300 ${
                scrolled || menuOpen || !hasDarkHero
                  ? "theme-text"
                  : "text-cream"
              }`}
            >
              TRENDOVA
            </span>

            <span className="font-mono text-[9px] tracking-[0.4em] text-gold uppercase">
              Premium Shop
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.type === "route" ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`font-body text-sm tracking-wider hover-line transition-colors duration-300 ${
                    location.pathname === link.href
                      ? "text-gold"
                      : scrolled || !hasDarkHero
                        ? "theme-text-secondary hover:text-gold"
                        : "text-cream/70 hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className={`font-body text-sm tracking-wider hover-line transition-colors duration-300 ${
                    scrolled || !hasDarkHero
                      ? "theme-text-secondary hover:text-gold"
                      : "text-cream/70 hover:text-gold"
                  }`}
                >
                  {link.label}
                </a>
              ),
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`transition-colors duration-300 hover:text-gold ${
                scrolled || menuOpen || !hasDarkHero
                  ? "theme-text-secondary"
                  : "text-cream/70"
              }`}
            >
              <Search size={18} />
            </button>

            <button
              onClick={toggleTheme}
              className={`transition-colors duration-300 hover:text-gold ${
                scrolled || menuOpen || !hasDarkHero
                  ? "theme-text-secondary"
                  : "text-cream/70"
              }`}
              title={isDark ? "Light Mode" : "Dark Mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User dropdown */}
            <div id="user-menu-container" className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center justify-center w-9 h-9 transition-colors duration-300 hover:text-gold ${
                  isAuthenticated
                    ? "text-gold"
                    : scrolled || menuOpen || !hasDarkHero
                      ? "theme-text-secondary"
                      : "text-cream/70"
                }`}
              >
                <User size={18} />
                {isAuthenticated && unreadCount > 0 && (
                  <span className="absolute -top-0 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-obsidian animate-pulse" />
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-64 theme-bg-card border theme-border shadow-xl z-50 overflow-hidden rounded-xl">
                  {isAuthenticated ? (
                    <>
                      {/* Profile header */}
                      <div className="relative px-5 py-5 border-b theme-border overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
                        <div className="relative flex items-center gap-4">
                          <div className="w-11 h-11 bg-gold/15 border border-gold/25 flex items-center justify-center flex-shrink-0 rounded-lg">
                            <span className="font-display font-black text-gold text-lg">
                              {user?.name?.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-display font-semibold theme-text text-sm truncate">
                              {user?.name}
                            </p>
                            <p className="font-body theme-text-muted text-xs truncate mt-0.5">
                              {user?.email}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                              <span className="font-mono text-[9px] tracking-[0.25em] text-gold/70 uppercase">
                                {user?.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notifications button */}
                      <button
                        onClick={() => {
                          setNotifOpen(true);
                          setUserMenuOpen(false);
                        }}
                        className="group w-full flex items-center justify-between px-5 py-3 transition-all duration-200 hover:bg-white/4 border-b border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 border border-white/8 flex items-center justify-center text-cream/30 group-hover:border-gold/30 group-hover:text-gold transition-all duration-200 theme-text-muted rounded-lg">
                            <Bell size={13} />
                          </div>
                          <p className="font-body text-sm theme-text-secondary group-hover:theme-text transition-colors">
                            Notifications
                          </p>
                        </div>
                        {unreadCount > 0 && (
                          <span className="w-5 h-5 bg-red-500 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {/* Menu items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate(dashboardLink);
                            setTimeout(() => {
                              const event = isAdmin
                                ? "adminTabChange"
                                : "userTabChange";
                              window.dispatchEvent(
                                new CustomEvent(event, { detail: "overview" }),
                              );
                            }, 100);
                          }}
                          className="group w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 hover:bg-gold/5 text-left"
                        >
                          <div className="w-7 h-7 border theme-border flex items-center justify-center theme-text-muted group-hover:border-gold/30 group-hover:text-gold transition-all duration-200 rounded-lg">
                            <LayoutDashboard size={13} />
                          </div>
                          <div>
                            <p className="font-body text-sm theme-text-secondary group-hover:text-gold transition-colors">
                              {user?.role === "user"
                                ? "My Dashboard"
                                : "Admin Dashboard"}
                            </p>
                            <p className="font-mono text-[9px] theme-text-muted tracking-wider">
                              {user?.role === "user"
                                ? "Orders, wishlist & settings"
                                : "Manage store & users"}
                            </p>
                          </div>
                        </button>

                        {user?.role === "user" && (
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate("/dashboard");
                              setTimeout(() => {
                                window.dispatchEvent(
                                  new CustomEvent("userTabChange", {
                                    detail: "orders",
                                  }),
                                );
                              }, 100);
                            }}
                            className="group w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 hover:bg-gold/5 text-left"
                          >
                            <div className="w-7 h-7 border theme-border flex items-center justify-center theme-text-muted group-hover:border-gold/30 group-hover:text-gold transition-all duration-200 rounded-lg">
                              <ShoppingBag size={13} />
                            </div>
                            <div>
                              <p className="font-body text-sm theme-text-secondary group-hover:text-gold transition-colors">
                                My Orders
                              </p>
                              <p className="font-mono text-[9px] theme-text-muted tracking-wider">
                                Track & manage orders
                              </p>
                            </div>
                          </button>
                        )}
                      </div>

                      <div className="h-px theme-border mx-5" />

                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="group w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 hover:bg-red-500/5"
                        >
                          <div className="w-7 h-7 border theme-border flex items-center justify-center theme-text-muted group-hover:border-red-500/30 group-hover:text-red-400 transition-all duration-200 rounded-lg">
                            <LogOut size={13} />
                          </div>
                          <p className="font-body text-sm theme-text-secondary group-hover:text-red-400 transition-colors">
                            Sign Out
                          </p>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Guest header */}
                      <div className="px-5 py-5 border-b theme-border">
                        <p className="font-display font-bold theme-text text-base">
                          Welcome
                        </p>
                        <p className="font-body theme-text-muted text-xs mt-1 leading-relaxed">
                          Sign in to access your orders and exclusive member
                          benefits.
                        </p>
                      </div>

                      {/* Auth buttons */}
                      <div className="p-4 space-y-2">
                        <Link
                          to="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors duration-200 rounded-lg"
                        >
                          <User size={13} />
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-3 border theme-border theme-text-secondary font-mono text-[11px] tracking-[0.3em] uppercase hover:border-gold/30 hover:text-gold transition-all duration-200 rounded-lg"
                        >
                          Create Account
                        </Link>
                      </div>

                      {/* Benefits */}
                      <div className="px-5 pb-5">
                        <div className="h-px theme-border mb-4" />
                        {[
                          "Early access to new drops",
                          "Exclusive member pricing",
                          "Order tracking & history",
                        ].map((benefit) => (
                          <div
                            key={benefit}
                            className="flex items-center gap-2 mb-2"
                          >
                            <div className="w-1 h-1 bg-gold/40 rounded-full flex-shrink-0" />
                            <span className="font-body theme-text-muted text-xs">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={openCart}
              className={`relative transition-colors duration-300 hover:text-gold ${
                scrolled || menuOpen || !hasDarkHero
                  ? "theme-text-secondary"
                  : "text-cream/70"
              }`}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-obsidian text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden transition-colors duration-300 hover:text-gold ${
                scrolled || menuOpen || !hasDarkHero
                  ? "theme-text-secondary"
                  : "text-cream/70"
              }`}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-obsidian transition-transform duration-500 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden flex flex-col items-center justify-center gap-8`}
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {navLinks.map((link, i) =>
          link.type === "route" ? (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-3xl font-light theme-text hover:text-gold transition-colors duration-300"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-3xl font-light theme-text hover:text-gold transition-colors duration-300"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {link.label}
            </a>
          ),
        )}

        {/* Mobile auth links */}
        <div className="flex flex-col items-center gap-4 mt-4 border-t theme-border pt-6 w-full px-8">
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardLink}
                onClick={() => setMenuOpen(false)}
                className="font-mono text-[11px] tracking-[0.3em] text-gold uppercase"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="font-mono text-[11px] tracking-[0.3em] text-red-400 uppercase"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-[11px] tracking-[0.3em] theme-text-secondary uppercase hover:text-gold transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-[11px] tracking-[0.3em] theme-text-secondary uppercase hover:text-gold transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex gap-8 mt-4">
          <button className="theme-text-secondary hover:text-gold transition-colors">
            <Search size={22} />
          </button>
        </div>
      </div>

      {/* Notifications Modal */}
      {notifOpen && (
        <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="w-full max-w-md border theme-border shadow-2xl rounded-lg"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
              <div>
                <h3 className="font-display font-bold theme-text text-lg">
                  {isAdmin ? "Admin Alerts" : "Notifications"}
                </h3>
                <p className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase mt-0.5">
                  {unreadCount} unread
                </p>
              </div>
              <button
                onClick={() => setNotifOpen(false)}
                className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
              >
                <X size={14} />
              </button>
            </div>

            {/* Notifications list */}
            <div className="divide-y theme-border max-h-96 overflow-y-auto ">
              {notifications.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <Bell
                    size={32}
                    className="theme-text-muted opacity-30 mx-auto mb-3"
                  />
                  <p className="font-body theme-text-muted text-sm">
                    No notifications
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-4 px-6 py-4 transition-colors hover:bg-gold/3 cursor-pointer ${
                      notif.unread ? "bg-gold/5" : ""
                    }`}
                  >
                    {/* Dot */}
                    <div className="flex-shrink-0 mt-1.5">
                      {notif.unread ? (
                        <div className="w-2 h-2 bg-gold rounded-full" />
                      ) : (
                        <div
                          className="w-2 h-2 theme-border rounded-full"
                          style={{ border: "1px solid var(--border-color)" }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-body text-sm leading-snug ${notif.unread ? "theme-text" : "theme-text-secondary"}`}
                      >
                        {notif.text}
                      </p>
                      <p className="font-mono text-[9px] tracking-[0.15em] theme-text-muted uppercase mt-1">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t theme-border">
              <button
                onClick={markAllRead}
                className="font-mono text-[10px] tracking-[0.2em] text-gold uppercase hover:text-yellow-600 transition-colors"
              >
                Mark all as read
              </button>
              <button
                onClick={() => {
                  setNotifOpen(false);
                  if (isAdmin) {
                    window.dispatchEvent(
                      new CustomEvent("adminTabChange", {
                        detail: "notifications",
                      }),
                    );
                    navigate("/admin/dashboard");
                  } else {
                    navigate("/notifications");
                  }
                }}
                className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase hover:text-gold transition-colors"
              >
                View All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-obsidian/95 backdrop-blur-md">
          <div className="max-w-2xl mx-auto px-6 pt-24 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-bold text-cream text-2xl">
                Search Products
              </h3>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-lg hover:border-gold/40 hover:text-gold transition-colors text-cream"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-8">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30"
              />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, category..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-cream placeholder-cream/30 rounded-lg focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>

            {/* Results */}
            {searchQuery.length > 0 && (
              <div className="space-y-4">
                {searching ? (
                  <div className="flex justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-gold" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-body text-cream/40">
                      No products found for "{searchQuery}"
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-cream/30 uppercase">
                      Found {searchResults.length} results
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                      {searchResults.map((product) => (
                        <Link
                          key={product._id}
                          to={`/product/${product._id}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex gap-4 p-3 border border-white/5 rounded-lg hover:border-gold/30 hover:bg-white/5 transition-all"
                        >
                          <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-[9px] tracking-[0.2em] text-gold/60 uppercase">
                              {product.category}
                            </p>
                            <p className="font-display font-semibold text-cream text-sm truncate">
                              {product.name}
                            </p>
                            <p className="font-body text-gold text-sm font-semibold mt-1">
                              {new Intl.NumberFormat("en-NG", {
                                style: "currency",
                                currency: "NGN",
                                minimumFractionDigits: 0,
                              }).format(product.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
