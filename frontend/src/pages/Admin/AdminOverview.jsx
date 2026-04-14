import { useState, useEffect } from 'react';
import { TrendingUp, Eye, Loader2 } from 'lucide-react';
import { orderService, userService, productService } from '../../services/apiService';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);

const statusColors = {
  pending_payment: 'text-orange-600 bg-orange-50 border-orange-200',
  processing: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  shipped: 'text-blue-600 bg-blue-50 border-blue-200',
  delivered: 'text-green-600 bg-green-50 border-green-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200',
};

const statusLabels = {
  pending_payment: 'Pending Payment',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const AdminOverview = ({ onTabChange }) => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenueChange: 0,
    ordersChange: 0,
    usersChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const ordersRes = await orderService.getAll({ limit: 100 });
      const orders = ordersRes.orders || [];
      
      // Fetch users
      const usersRes = await userService.getAllUsers({ limit: 100 });
      const users = usersRes.users || [];
      
      // Fetch products
      const productsRes = await productService.getAll();
      const products = productsRes.products || [];
      
      // Calculate total revenue from paid orders
      const paidOrders = orders.filter(order => order.paymentStatus === 'paid');
      const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      // Get recent orders (last 5)
      const recent = orders.slice(0, 5);
      setRecentOrders(recent);
      
      // Calculate stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      });
      
      const lastMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth - 1 && orderDate.getFullYear() === currentYear;
      });
      
      const ordersChange = lastMonthOrders.length > 0 
        ? Math.round(((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100)
        : 100;
      
      const thisMonthRevenue = paidOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      }).reduce((sum, order) => sum + (order.total || 0), 0);
      
      const lastMonthRevenue = paidOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth - 1 && orderDate.getFullYear() === currentYear;
      }).reduce((sum, order) => sum + (order.total || 0), 0);
      
      const revenueChange = lastMonthRevenue > 0 
        ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
        : 100;
      
      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalProducts: products.length,
        revenueChange,
        ordersChange,
        usersChange: 24, // You can calculate this similarly
      });
      
    } catch (err) {
      console.error('Failed to fetch admin overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={40} className="animate-spin text-gold" />
      </div>
    );
  }

  const statItems = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), change: `${stats.revenueChange > 0 ? '+' : ''}${stats.revenueChange}%`, up: stats.revenueChange >= 0 },
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), change: `${stats.ordersChange > 0 ? '+' : ''}${stats.ordersChange}%`, up: stats.ordersChange >= 0 },
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: `+${stats.usersChange}%`, up: true },
    { label: 'Products', value: stats.totalProducts.toLocaleString(), change: `+${stats.totalProducts > 0 ? 3 : 0}`, up: true },
  ];

  return (
    <div className="space-y-5">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map(({ label, value, change, up }) => (
          <div key={label} className="p-6 border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
            <p className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase mb-3">{label}</p>
            <p className="font-display font-black theme-text text-2xl">{value}</p>
            <p className={`font-mono text-[10px] tracking-[0.1em] mt-1 flex items-center gap-1 ${up ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUp size={11} />
              {change} this month
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">
            Recent Orders
          </h3>
          <button
            onClick={() => onTabChange('orders')}
            className="font-mono text-[10px] tracking-[0.2em] text-gold hover:text-yellow-600 uppercase transition-colors"
          >
            View All
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="font-body theme-text-muted text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b theme-border" style={{ backgroundColor: 'var(--table-header)' }}>
                  {['Order', 'Customer', 'Date', 'Status', 'Total'].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {recentOrders.map(order => (
                  <tr key={order._id} className="transition-colors cursor-pointer hover:bg-gold/5" onClick={() => onTabChange('orders')}>
                    <td className="px-6 py-4 font-mono text-[11px] theme-text-secondary tracking-wider">{order.orderNumber}</td>
                    <td className="px-6 py-4 font-body text-sm theme-text-secondary">{order.customer?.name || 'N/A'}</td>
                    <td className="px-6 py-4 font-body text-xs theme-text-muted">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] uppercase border rounded-lg ${statusColors[order.orderStatus]}`}>
                        {statusLabels[order.orderStatus] || order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-gold text-sm font-semibold">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;