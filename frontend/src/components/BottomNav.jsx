/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Grid3X3,
  ShoppingBag,
  Heart,
  MessageCircle,
  X,
  Instagram,
  Phone,
  Mail,
  Send,
  Loader2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import { userService } from "../services/apiService";
import { toast } from "react-hot-toast";

const BottomNav = ({ onCartOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    
    setWishlistLoading(true);
    try {
      const response = await userService.getWishlist();
      const wishlistData = response.wishlist || [];
      setWishlistItems(wishlistData);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setWishlistItems([]);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Fetch wishlist when modal opens
  useEffect(() => {
    if (wishlistOpen && isAuthenticated) {
      fetchWishlist();
    }
  }, [wishlistOpen, isAuthenticated]);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  const dashboardLink =
    user?.role === "user" ? "/dashboard" : "/admin/dashboard";

  // Format price
  const formatPrice = (price) => {
    if (!price) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      type: "route",
      href: "/",
    },
    {
      id: "categories",
      label: "Categories",
      icon: Grid3X3,
      href: "/#collections",
      type: "anchor",
    },
    { id: "cart", label: "Cart", icon: ShoppingBag, type: "button" },
    { id: "wishlist", label: "Wishlist", icon: Heart, type: "modal" },
    { id: "inbox", label: "Inbox", icon: MessageCircle, type: "modal" },
  ];

  const isActive = (href) => {
    if (!href) return false;
    if (href === "/") return location.pathname === "/";
    return location.pathname === href;
  };

  return (
    <>
      {/* Bottom Nav */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t theme-border"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ id, label, icon: Icon, href, type }) => {
            const active = isActive(href);

            if (type === "button") {
              return (
                <button
                  key={id}
                  onClick={onCartOpen}
                  className="flex flex-col items-center gap-1 px-3 py-2 relative"
                >
                  <div className="relative">
                    <Icon
                      size={22}
                      className={`transition-colors duration-200 ${cartCount > 0 ? "text-gold" : "theme-text-muted"}`}
                    />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-obsidian text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-mono text-[9px] tracking-[0.1em] uppercase ${cartCount > 0 ? "text-gold" : "theme-text-muted"}`}
                  >
                    {label}
                  </span>
                </button>
              );
            }

            if (type === "modal") {
              const isWishlist = id === "wishlist";
              return (
                <button
                  key={id}
                  onClick={() =>
                    isWishlist ? setWishlistOpen(true) : setInboxOpen(true)
                  }
                  className="flex flex-col items-center gap-1 px-3 py-2"
                >
                  <Icon
                    size={22}
                    className="theme-text-muted transition-colors duration-200 hover:text-gold"
                  />
                  <span className="font-mono text-[9px] tracking-[0.1em] uppercase theme-text-muted">
                    {label}
                  </span>
                </button>
              );
            }

            if (type === "anchor") {
              return (
                <a
                  key={id}
                  href={href}
                  className="flex flex-col items-center gap-1 px-3 py-2"
                >
                  <Icon
                    size={22}
                    className={`transition-colors duration-200 ${active ? "text-gold" : "theme-text-muted"}`}
                  />
                  <span
                    className={`font-mono text-[9px] tracking-[0.1em] uppercase ${active ? "text-gold" : "theme-text-muted"}`}
                  >
                    {label}
                  </span>
                </a>
              );
            }

            return (
              <Link
                key={id}
                to={href}
                className="flex flex-col items-center gap-1 px-3 py-2"
              >
                <Icon
                  size={22}
                  className={`transition-colors duration-200 ${active ? "text-gold" : "theme-text-muted"}`}
                />
                <span
                  className={`font-mono text-[9px] tracking-[0.1em] uppercase ${active ? "text-gold" : "theme-text-muted"}`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Wishlist Modal */}
      {wishlistOpen && (
        <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center">
          <div
            className="w-full max-w-md border-t md:border theme-border rounded-t-2xl md:rounded-lg"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
              <div>
                <h3 className="font-display font-bold theme-text text-lg">
                  Wishlist
                </h3>
                <p className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase mt-0.5">
                  {wishlistItems.length} saved items
                </p>
              </div>
              <button
                onClick={() => setWishlistOpen(false)}
                className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
              >
                <X size={14} />
              </button>
            </div>

            {/* Items */}
            <div className="divide-y theme-border max-h-80 overflow-y-auto">
              {!isAuthenticated ? (
                <div className="flex flex-col items-center py-12 gap-3">
                  <Heart size={32} className="theme-text-muted opacity-20" />
                  <p className="font-body theme-text-muted text-sm">
                    Sign in to view your wishlist
                  </p>
                  <Link
                    to="/login"
                    onClick={() => setWishlistOpen(false)}
                    className="px-6 py-2 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
                  >
                    Sign In
                  </Link>
                </div>
              ) : wishlistLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 size={24} className="animate-spin text-gold" />
                </div>
              ) : wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center py-12 gap-3">
                  <Heart size={32} className="theme-text-muted opacity-20" />
                  <p className="font-body theme-text-muted text-sm">
                    No saved items yet
                  </p>
                  <Link
                    to="/#collections"
                    onClick={() => setWishlistOpen(false)}
                    className="px-6 py-2 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
                  >
                    Browse Collections
                  </Link>
                </div>
              ) : (
                wishlistItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div
                      className="w-14 h-16 overflow-hidden flex-shrink-0 rounded-lg"
                      style={{ backgroundColor: "var(--bg-card)" }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[9px] tracking-[0.2em] text-gold/60 uppercase">
                        {item.category}
                      </p>
                      <p className="font-display font-semibold theme-text text-sm leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="font-body text-gold text-sm font-semibold mt-0.5">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <Link
                      to={`/product/${item._id}`}
                      onClick={() => setWishlistOpen(false)}
                      className="px-3 py-2 bg-gold text-obsidian font-mono text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors flex-shrink-0 rounded-lg"
                    >
                      View
                    </Link>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {isAuthenticated && wishlistItems.length > 0 && (
              <div className="px-6 py-4 border-t theme-border">
                <Link
                  to="/dashboard"
                  onClick={() => setWishlistOpen(false)}
                  className="w-full flex items-center justify-center py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
                >
                  View All in Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inbox Modal */}
      {inboxOpen && (
        <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center">
          <div
            className="w-full max-w-md border-t md:border theme-border rounded-t-2xl md:rounded-lg"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
              <div>
                <h3 className="font-display font-bold theme-text text-lg">
                  Contact Us
                </h3>
                <p className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase mt-0.5">
                  We reply within 24 hours
                </p>
              </div>
              <button
                onClick={() => setInboxOpen(false)}
                className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Quick links */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://wa.me/2348000000000?text=Hi%20Trendova%2C%20I%20need%20help%20with..."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 border theme-border hover:border-green-500/40 hover:bg-green-500/5 transition-all group rounded-lg"
                >
                  <div className="w-9 h-9 bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 rounded-lg">
                    <Phone size={16} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-display font-semibold theme-text text-sm">
                      WhatsApp
                    </p>
                    <p className="font-mono text-[9px] theme-text-muted">
                      Chat now
                    </p>
                  </div>
                </a>
                <a
                  href="https://instagram.com/trendova_shop"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 border theme-border hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group rounded-lg"
                >
                  <div className="w-9 h-9 bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 rounded-lg">
                    <Instagram size={16} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="font-display font-semibold theme-text text-sm">
                      Instagram
                    </p>
                    <p className="font-mono text-[9px] theme-text-muted">
                      DM us
                    </p>
                  </div>
                </a>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "var(--border-color)" }}
                />
                <span className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">
                  or send a message
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "var(--border-color)" }}
                />
              </div>

              {/* Message form */}
              {sent ? (
                <div className="flex flex-col items-center py-6 gap-3">
                  <div className="w-12 h-12 bg-gold/10 border border-gold/20 flex items-center justify-center rounded-lg">
                    <Send size={20} className="text-gold" />
                  </div>
                  <p className="font-display font-semibold theme-text">
                    Message Sent!
                  </p>
                  <p className="font-body theme-text-muted text-sm text-center">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {!isAuthenticated && (
                    <div>
                      <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                        style={{ backgroundColor: "var(--input-bg)" }}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors resize-none rounded-lg"
                      style={{ backgroundColor: "var(--input-bg)" }}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 rounded-lg"
                  >
                    <Send size={13} />
                    Send Message
                  </button>
                </div>
              )}

              {/* Email link */}
              <a
                href="mailto:support@trendova.com"
                className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase hover:text-gold transition-colors"
              >
                <Mail size={12} />
                support@trendova.com
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav;