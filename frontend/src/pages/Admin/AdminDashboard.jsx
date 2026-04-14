import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
  CreditCard,
  Bell,
  MessageCircle,
  Grid3X3,
  Instagram
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import usePermission from "../../hooks/usePermission";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AdminOverview from "./AdminOverview";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";
import AdminAnalytics from "./AdminAnalytics";
import AdminUsers from "./AdminUsers";
import AdminSettings from "./AdminSettings";
import AdminPayments from "./AdminPayments";
import AdminNotifications from "./AdminNotifications";
import AdminMessages from "./AdminMessages";
import AdminLooks from "./AdminLooks";
import AdminInstagram from "./AdminInstagram";

const roleColors = {
  superadmin: "text-purple-600 bg-purple-50 border-purple-200",
  admin: "text-yellow-700 bg-yellow-50 border-yellow-200",
  user: "text-obsidian/50 bg-obsidian/5 border-obsidian/10",
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const contentRef = useRef(null);
  const { user, logout } = useAuth();
  const { isSuperAdmin, canManageUsers } = usePermission();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  const [tabTrigger, setTabTrigger] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      setActiveTab(e.detail);
      setTabTrigger((prev) => prev + 1);
    };
    window.addEventListener("adminTabChange", handler);
    return () => window.removeEventListener("adminTabChange", handler);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeTab, tabTrigger]);

  useEffect(() => {
    const handler = (e) => setActiveTab(e.detail);
    window.addEventListener("adminTabChange", handler);
    return () => window.removeEventListener("adminTabChange", handler);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeTab]);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "products", label: "Products", icon: Package },
    { id: "looks", label: "Looks", icon: Grid3X3 },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "payments", label: "Payments", icon: CreditCard },
    ...(canManageUsers
      ? [{ id: "users", label: "Manage Users", icon: Users }]
      : []),
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "instagram", label: "Instagram Feed", icon: Instagram },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen theme-bg overflow-x-hidden">
      <Header />

      {/* Page header — always dark */}
      <div className="bg-obsidian pt-24 pb-10 px-6 rounded-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-gold" />
              <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
                {isSuperAdmin ? "Super Admin" : "Admin"} Panel
              </span>
            </div>
            <h1 className="font-display font-black text-cream text-4xl md:text-5xl leading-tight">
              {isSuperAdmin ? "Super Admin" : "Admin"}
              <span className="block italic gold-text">Dashboard</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 border border-white/10 text-cream/50 font-mono text-[11px] tracking-[0.2em] uppercase hover:border-red-500/30 hover:text-red-400 transition-all duration-300 self-start rounded-lg"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pb-16 px-6 max-w-7xl mx-auto mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Profile card */}
            <div className="bg-obsidian p-6 mb-3 rounded-lg">
              <div className="w-16 h-16 bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 rounded-lg">
                <span className="font-display font-black text-gold text-2xl">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <p className="font-display font-semibold text-cream text-lg leading-tight">
                {user?.name}
              </p>
              <p className="font-body text-cream/40 text-sm mt-1">
                {user?.email}
              </p>
              <div
                className={`mt-3 inline-flex items-center px-2 py-1 border font-mono text-[9px] tracking-[0.2em] uppercase rounded-lg ${roleColors[user?.role]}`}
              >
                {user?.role}
              </div>
            </div>

            {/* Nav */}
            <nav
              className="border theme-border overflow-hidden rounded-lg"
              style={{ backgroundColor: "var(--bg-card)" }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 transition-all duration-200 border-b theme-border last:border-0 ${
                    activeTab === tab.id
                      ? "bg-gold/10 text-gold border-l-4 border-l-gold"
                      : "theme-text-secondary hover:bg-gold/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon size={15} />
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase">
                      {tab.label}
                    </span>
                  </div>
                  <ChevronRight size={13} className="opacity-40" />
                </button>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0" ref={contentRef}>
            {activeTab === "overview" && (
              <AdminOverview onTabChange={setActiveTab} />
            )}
            {activeTab === "orders" && <AdminOrders />}
            {activeTab === "products" && <AdminProducts />}
            {activeTab === "looks" && <AdminLooks />}
            {activeTab === "analytics" && <AdminAnalytics />}
            {activeTab === "payments" && <AdminPayments />}
            {activeTab === "users" && canManageUsers && <AdminUsers />}
            {activeTab === "notifications" && <AdminNotifications />}
            {activeTab === "instagram" && <AdminInstagram />}
            {activeTab === "messages" && <AdminMessages />}
            {activeTab === "settings" && <AdminSettings />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;