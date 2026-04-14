/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  User,
  MessageCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import UserOverview from "./UserOverview";
import UserOrders from "./UserOrders";
import UserWishlist from "./UserWishlist";
import UserAddresses from "./UserAddresses";
import UserSettings from "./UserSettings";
import UserMessages from "./UserMessages";

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "messages", label: "Messages", icon: MessageCircle },
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [tabTrigger, setTabTrigger] = useState(0);

useEffect(() => {
  const handler = (e) => {
    setActiveTab(e.detail);
    setTabTrigger(prev => prev + 1);
  };
  window.addEventListener('userTabChange', handler);
  return () => window.removeEventListener('userTabChange', handler);
}, []);

useEffect(() => {
  if (contentRef.current) {
    contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}, [activeTab, tabTrigger]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeTab]);

  useEffect(() => {
    const handler = (e) => setActiveTab(e.detail);
    window.addEventListener("userTabChange", handler);
    return () => window.removeEventListener("userTabChange", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

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
                Member Account
              </span>
            </div>
            <h1 className="font-display font-black text-cream text-4xl md:text-5xl leading-tight">
              Welcome back,
              <span className="block italic gold-text">
                {user?.name?.split(" ")[0]}.
              </span>
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
            {/* Profile card — always dark */}
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
              <div className="mt-3 inline-flex items-center px-2 py-1 bg-gold/10 border border-gold/20 rounded-lg">
                <span className="font-mono text-[9px] tracking-[0.2em] text-gold uppercase">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Nav — theme aware */}
            <nav
              className="border theme-border overflow-hidden rounded-lg"
              style={{ backgroundColor: "var(--bg-card)" }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 transition-all duration-200 border-b theme-border last:border-0 rounded-lg ${
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
              <UserOverview onTabChange={setActiveTab} />
            )}
            {activeTab === "orders" && <UserOrders />}
            {activeTab === "wishlist" && <UserWishlist />}
            {activeTab === "addresses" && <UserAddresses />}
            {activeTab === "settings" && <UserSettings />}
            {activeTab === "messages" && <UserMessages />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
