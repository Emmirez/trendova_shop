import { useState, useEffect } from 'react';
import { Eye, X, Loader2, Search, ChevronDown, CheckCircle } from 'lucide-react';
import { orderService } from '../../services/apiService';
import { toast } from 'react-hot-toast';

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

const formatPrice = (price) => {
  if (!price) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getAll();
      setOrders(response.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderService.updateStatus(orderId, newStatus);
      toast.success(`Order status updated to ${statusLabels[newStatus]}`);
      fetchOrders();
      if (selected?._id === orderId) setSelected(null);
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

const handleApprovePayment = async (orderId) => {
  setUpdatingId(orderId);
  try {
    // First update order status to processing
    await orderService.updateStatus(orderId, 'processing');
    
    // Then update payment status to paid
    await orderService.updatePaymentStatus(orderId, 'paid');
    
    toast.success('Payment approved! Order is now processing.');
    fetchOrders();
  } catch (err) {
    console.error('Failed to approve payment:', err);
    toast.error(err.message || 'Failed to approve payment');
  } finally {
    setUpdatingId(null);
  }
};

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.orderStatus !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        order.customer?.name?.toLowerCase().includes(searchLower) ||
        order.customer?.email?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={40} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted" />
          <input
            type="text"
            placeholder="Search by order number, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border theme-border rounded-lg focus:outline-none focus:border-gold/40"
            style={{ backgroundColor: 'var(--input-bg)' }}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border theme-border rounded-lg focus:outline-none focus:border-gold/40"
          style={{ backgroundColor: 'var(--input-bg)' }}
        >
          <option value="all">All Orders</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="border theme-border rounded-lg overflow-x-auto" style={{ backgroundColor: 'var(--bg-card)' }}>
        <table className="w-full">
          <thead className="border-b theme-border" style={{ backgroundColor: 'var(--table-header)' }}>
            <tr>
              <th className="px-4 py-3 text-left font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">Order</th>
              <th className="px-4 py-3 text-left font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">Customer</th>
              <th className="px-4 py-3 text-left font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">Date</th>
              <th className="px-4 py-3 text-left font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">Total</th>
              <th className="px-4 py-3 text-left font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">Status</th>
              <th className="px-4 py-3 text-left font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">Payment</th>
              <th className="px-4 py-3 text-center font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y theme-border">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gold/5 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-mono text-[11px] theme-text font-semibold">{order.orderNumber}</p>
                  <p className="font-mono text-[9px] theme-text-muted">{order.items?.length || 0} items</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-body text-sm theme-text">{order.customer?.name}</p>
                  <p className="font-mono text-[9px] theme-text-muted">{order.customer?.email}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-body text-sm theme-text-secondary">{formatDate(order.createdAt)}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-display font-bold text-gold text-base">{formatPrice(order.total)}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 font-mono text-[9px] tracking-[0.2em] uppercase border rounded-lg ${statusColors[order.orderStatus]}`}>
                    {statusLabels[order.orderStatus]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 font-mono text-[9px] tracking-[0.2em] uppercase border rounded-lg ${
                    order.paymentStatus === 'paid' 
                      ? 'text-green-600 bg-green-50 border-green-200' 
                      : 'text-orange-600 bg-orange-50 border-orange-200'
                  }`}>
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {order.orderStatus === 'pending_payment' && (
                      <button
                        onClick={() => handleApprovePayment(order._id)}
                        disabled={updatingId === order._id}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-mono rounded-lg hover:bg-green-600 disabled:opacity-50"
                        title="Approve Payment"
                      >
                        {updatingId === order._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <CheckCircle size={12} />
                        )}
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => setSelected(order)}
                      className="w-7 h-7 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
                      title="View Details"
                    >
                      <Eye size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-12 overflow-y-auto">
          <div className="w-full max-w-2xl border theme-border shadow-2xl rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-display font-bold theme-text text-lg">{selected.orderNumber}</h3>
                  <span className={`inline-block px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] uppercase border rounded-lg ${statusColors[selected.orderStatus]}`}>
                    {statusLabels[selected.orderStatus]}
                  </span>
                </div>
                <p className="font-mono text-[9px] theme-text-muted">{formatDate(selected.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
              >
                <X size={14} />
              </button>
            </div>

            {/* Customer Info */}
            <div className="px-6 py-4 border-b theme-border">
              <p className="font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-3">Customer Information</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-mono text-[9px] theme-text-muted">Name</p>
                  <p className="font-body theme-text">{selected.customer?.name}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] theme-text-muted">Email</p>
                  <p className="font-body theme-text">{selected.customer?.email}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] theme-text-muted">Phone</p>
                  <p className="font-body theme-text">{selected.customer?.phone}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] theme-text-muted">Payment Method</p>
                  <p className="font-body theme-text">{selected.paymentMethod === 'card' ? 'Card Payment' : 'Bank Transfer'}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="px-6 py-4 border-b theme-border">
              <p className="font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-3">Shipping Address</p>
              <p className="font-body theme-text">
                {selected.shippingAddress?.street}<br />
                {selected.shippingAddress?.city}, {selected.shippingAddress?.state} {selected.shippingAddress?.zipCode}<br />
                {selected.shippingAddress?.country}
              </p>
            </div>

            {/* Items */}
            <div className="px-6 py-4 border-b theme-border">
              <p className="font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-3">Items</p>
              <div className="space-y-3">
                {selected.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-body theme-text text-sm font-semibold">{item.name}</p>
                      <p className="font-mono text-[9px] theme-text-muted">Size: {item.size || 'One Size'} × Qty: {item.quantity}</p>
                    </div>
                    <p className="font-body text-gold text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="px-6 py-4 border-b theme-border">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-mono text-[10px] theme-text-muted">Subtotal</span>
                  <span>{formatPrice(selected.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-[10px] theme-text-muted">Shipping</span>
                  <span>{selected.shippingFee === 0 ? 'FREE' : formatPrice(selected.shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t theme-border">
                  <span className="font-display font-semibold theme-text">Total</span>
                  <span className="font-display font-bold text-gold text-xl">{formatPrice(selected.total)}</span>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="px-6 py-4">
              <p className="font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {['processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(selected._id, status)}
                    disabled={updatingId === selected._id || selected.orderStatus === status}
                    className={`px-3 py-1 text-xs font-mono uppercase rounded-lg transition-colors ${
                      selected.orderStatus === status
                        ? 'bg-gold text-obsidian'
                        : 'border theme-border theme-text-muted hover:border-gold/40 hover:text-gold'
                    } disabled:opacity-50`}
                  >
                    {statusLabels[status]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;