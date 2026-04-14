import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { orderService, productService } from "../../services/apiService";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [orderStatusCounts, setOrderStatusCounts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch all orders
      const ordersRes = await orderService.getAll({ limit: 500 });
      const orders = ordersRes.orders || [];
      
      // Fetch all products
      const productsRes = await productService.getAll();
      const products = productsRes.products || [];

      // Calculate revenue by category from completed orders
      const categoryMap = new Map();
      let totalRev = 0;

      orders.forEach(order => {
        if (order.paymentStatus === 'paid' && order.items) {
          order.items.forEach(item => {
            // Find product category
            const product = products.find(p => p._id === item.productId || p._id === item.productId?._id);
            const category = product?.category || 'Other';
            const itemTotal = item.price * item.quantity;
            
            categoryMap.set(category, {
              revenue: (categoryMap.get(category)?.revenue || 0) + itemTotal,
              count: (categoryMap.get(category)?.count || 0) + 1,
            });
            totalRev += itemTotal;
          });
        }
      });

      // Convert to array and calculate percentages
      const categoryData = Array.from(categoryMap.entries())
        .map(([label, data]) => ({
          label,
          revenue: data.revenue,
          amount: formatPrice(data.revenue),
          percentage: totalRev > 0 ? Math.round((data.revenue / totalRev) * 100) : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue);
      
      setCategoryRevenue(categoryData);
      setTotalRevenue(totalRev);

      // Order status breakdown
      const statusCounts = {
        pending_payment: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      };

      orders.forEach(order => {
        if (statusCounts.hasOwnProperty(order.orderStatus)) {
          statusCounts[order.orderStatus]++;
        }
      });

      const statusColors = {
        delivered: 'bg-green-500',
        processing: 'bg-yellow-500',
        shipped: 'bg-blue-500',
        pending_payment: 'bg-orange-500',
        cancelled: 'bg-red-500',
      };

      const statusLabels = {
        delivered: 'Delivered',
        processing: 'Processing',
        shipped: 'Shipped',
        pending_payment: 'Pending Payment',
        cancelled: 'Cancelled',
      };

      setOrderStatusCounts(
        Object.entries(statusCounts).map(([status, count]) => ({
          label: statusLabels[status],
          count,
          color: statusColors[status],
        }))
      );

      // Calculate top selling products
      const productSalesMap = new Map();

      orders.forEach(order => {
        if (order.paymentStatus === 'paid' && order.items) {
          order.items.forEach(item => {
            const productId = item.productId?._id || item.productId;
            productSalesMap.set(productId, {
              name: item.name,
              sold: (productSalesMap.get(productId)?.sold || 0) + item.quantity,
              revenue: (productSalesMap.get(productId)?.revenue || 0) + (item.price * item.quantity),
            });
          });
        }
      });

      const topProductsData = Array.from(productSalesMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(product => ({
          name: product.name,
          sold: product.sold,
          revenue: formatPrice(product.revenue),
        }));

      setTopProducts(topProductsData);

    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={40} className="animate-spin text-gold" />
      </div>
    );
  }

  // Calculate max percentage for bar width
  const maxPercentage = categoryRevenue.length > 0 ? Math.max(...categoryRevenue.map(c => c.percentage)) : 100;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Revenue by category */}
        <div className="border theme-border p-6 rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase mb-6">
            Revenue by Category
          </h3>
          {categoryRevenue.length === 0 ? (
            <p className="font-body theme-text-muted text-center py-8">No data available</p>
          ) : (
            <div className="space-y-4">
              {categoryRevenue.map(({ label, amount, percentage }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] tracking-[0.2em] theme-text-secondary uppercase">{label}</span>
                    <span className="font-body text-gold text-sm font-semibold">{amount}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--border-color)' }}>
                    <div 
                      className="h-full bg-gold transition-all duration-700 rounded-full" 
                      style={{ width: `${(percentage / maxPercentage) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 pt-3 border-t theme-border">
            <div className="flex justify-between">
              <span className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">Total Revenue</span>
              <span className="font-display font-bold text-gold text-lg">{formatPrice(totalRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Order status breakdown */}
        <div className="border theme-border p-6 rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase mb-6">
            Order Status Breakdown
          </h3>
          <div className="space-y-4">
            {orderStatusCounts.map(({ label, count, color }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b theme-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="font-mono text-[10px] tracking-[0.2em] theme-text-secondary uppercase">{label}</span>
                </div>
                <span className="font-display font-bold theme-text text-lg">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="border theme-border p-6 rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase mb-6">
          Top Selling Products
        </h3>
        {topProducts.length === 0 ? (
          <p className="font-body theme-text-muted text-center py-8">No data available</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map(({ name, sold, revenue }, i) => (
              <div key={name} className="flex items-center gap-4 py-3 border-b theme-border last:border-0">
                <span className="font-mono text-[10px] theme-text-muted w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-body theme-text-secondary text-sm truncate">{name}</p>
                  <p className="font-mono text-[10px] theme-text-muted">{sold} sold</p>
                </div>
                <span className="font-body text-gold text-sm font-semibold">{revenue}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;