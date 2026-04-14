/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { orderService, userService } from '../../services/apiService';
import useAuth from '../../hooks/useAuth';

const statusColors = {
  processing: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  shipped: 'text-blue-600 bg-blue-50 border-blue-200',
  delivered: 'text-green-600 bg-green-50 border-green-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200',
  Delivered: 'text-green-600 bg-green-50 border-green-200',
  Dispatched: 'text-blue-600 bg-blue-50 border-blue-200',
  Processing: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  Cancelled: 'text-red-600 bg-red-50 border-red-200',
};

const formatPrice = (price) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);

const UserOverview = ({ onTabChange }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistCount: 0,
    addressesCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const ordersRes = await orderService.getMyOrders();
      const orders = ordersRes.orders || [];
      
      // Fetch wishlist
      const wishlistRes = await userService.getWishlist();
      const wishlist = wishlistRes.wishlist || [];
      
      // Get addresses from user object
      const addresses = user?.addresses || [];
      
      setStats({
        totalOrders: orders.length,
        wishlistCount: wishlist.length,
        addressesCount: addresses.length,
      });
      
      // Get recent orders (last 3)
      setRecentOrders(orders.slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get status display text
  const getStatusDisplay = (status) => {
    const statusMap = {
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, onClick: () => onTabChange('orders') },
          { label: 'Wishlist Items', value: stats.wishlistCount, icon: Heart, onClick: () => onTabChange('wishlist') },
          { label: 'Addresses', value: stats.addressesCount, icon: MapPin, onClick: () => onTabChange('addresses') },
        ].map(({ label, value, icon: Icon, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="p-6 border theme-border rounded-lg text-left transition-all hover:border-gold/40 hover:bg-gold/5"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <Icon size={18} className="text-gold mb-3" />
            <p className="font-display font-bold theme-text text-3xl">{value}</p>
            <p className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase mt-1">{label}</p>
          </button>
        ))}
      </div>

      {/* Recent orders */}
      <div className="border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">Recent Orders</h3>
          <button
            onClick={() => onTabChange('orders')}
            className="font-mono text-[10px] tracking-[0.2em] text-gold hover:text-yellow-600 uppercase transition-colors"
          >
            View All
          </button>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <ShoppingBag size={32} className="theme-text-muted opacity-20" />
            <p className="font-body theme-text-muted text-sm">No orders yet</p>
            <Link
              to="/#collections"
              className="px-4 py-2 bg-gold text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y theme-border">
            {recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-mono text-[11px] theme-text-secondary tracking-wider">{order.orderNumber}</p>
                  <p className="font-body theme-text-muted text-xs mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] uppercase border rounded-lg ${statusColors[order.orderStatus] || statusColors.processing}`}>
                    {getStatusDisplay(order.orderStatus)}
                  </span>
                  <p className="font-body text-gold text-sm font-semibold mt-1">{formatPrice(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOverview;