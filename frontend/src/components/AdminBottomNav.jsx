/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag,
  BarChart2, CreditCard, Settings, Users
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import usePermission from '../hooks/usePermission';

const AdminBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canManageUsers } = usePermission();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  const handleTab = (tabId) => {
    // dispatch a custom event that AdminDashboard listens to
    window.dispatchEvent(new CustomEvent('adminTabChange', { detail: tabId }));
    if (location.pathname !== '/admin/dashboard') {
      navigate('/admin/dashboard');
    }
  };

  const [activeTab, setActiveTab] = useState('overview');

  const handleClick = (id) => {
    setActiveTab(id);
    handleTab(id);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t theme-border rounded-lg"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className="flex flex-col items-center gap-1 px-3 py-2"
          >
            <Icon
              size={22}
              className={`transition-colors duration-200 ${
                activeTab === id ? 'text-gold' : 'theme-text-muted'
              }`}
            />
            <span className={`font-mono text-[9px] tracking-[0.1em] uppercase transition-colors duration-200 ${
              activeTab === id ? 'text-gold' : 'theme-text-muted'
            }`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminBottomNav;