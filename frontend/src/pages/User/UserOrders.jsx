import { useState, useEffect } from 'react';
import { Package, Clock, Eye, X, Loader2, Trash2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const formatPrice = (price) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price);

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getMyOrders();
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
    return statusLabels[status] || status;
  };

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-body text-sm">Are you sure you want to cancel this order?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmCancelOrder(orderId);
            }}
            className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg"
          >
            Yes, Cancel
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 border border-gold/30 text-gold text-xs rounded-lg"
          >
            No, Go Back
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const confirmCancelOrder = async (orderId) => {
    setCancellingId(orderId);
    try {
      await orderService.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      await fetchOrders();
      setSelected(null);
    } catch (err) {
      console.error('Failed to cancel order:', err);
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  // Delete order (only for cancelled orders)
  const handleDeleteOrder = async (orderId) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-body text-sm">Are you sure you want to permanently delete this order?</p>
        <p className="font-mono text-[10px] text-red-400">This action cannot be undone.</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmDeleteOrder(orderId);
            }}
            className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 border border-gold/30 text-gold text-xs rounded-lg"
          >
            No, Keep
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const confirmDeleteOrder = async (orderId) => {
    setDeletingId(orderId);
    try {
      await orderService.deleteOrder(orderId);
      toast.success('Order deleted successfully');
      await fetchOrders();
      if (selected?._id === orderId) setSelected(null);
    } catch (err) {
      console.error('Failed to delete order:', err);
      toast.error(err.message || 'Failed to delete order');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-gold" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">
            Order History
          </h3>
          <span className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">
            {orders.length} orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Package size={40} className="theme-text-muted opacity-20" />
            <p className="font-body theme-text-muted">No orders yet</p>
            <Link
              to="/#collections"
              className="px-6 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold rounded-lg"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="divide-y theme-border">
            {orders.map(order => (
              <div key={order._id} className="px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <p className="font-mono text-[12px] theme-text tracking-wider font-bold">
                        {order.orderNumber}
                      </p>
                      <span className={`inline-block px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] uppercase border rounded-lg ${statusColors[order.orderStatus]}`}>
                        {getStatusDisplay(order.orderStatus)}
                      </span>
                    </div>
                    <p className="font-body theme-text-muted text-xs flex items-center gap-1">
                      <Clock size={11} />
                      {formatDate(order.createdAt)} · {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-display font-bold text-gold text-lg">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelected(order)}
                      className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all rounded-lg"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-12 overflow-y-auto">
          <div
            className="w-full max-w-lg border theme-border shadow-2xl rounded-lg"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-display font-bold theme-text text-lg">{selected.orderNumber}</h3>
                  <span className={`inline-block px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] uppercase border rounded-lg ${statusColors[selected.orderStatus]}`}>
                    {getStatusDisplay(selected.orderStatus)}
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

            {/* Products */}
            <div className="px-6 py-4 border-b theme-border">
              <p className="font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-3">
                Items
              </p>
              <div className="space-y-3">
                {selected.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-body theme-text text-sm font-semibold truncate">
                        {item.name}
                      </p>
                      <p className="font-mono text-[9px] theme-text-muted mt-0.5">
                        Size: {item.size || 'One Size'} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-body text-gold text-sm font-semibold flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order details */}
            <div className="px-6 py-4 border-b theme-border space-y-3">
              <p className="font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-3">
                Order Details
              </p>
              {[
                { label: 'Order ID', value: selected.orderNumber },
                { label: 'Date', value: formatDate(selected.createdAt) },
                { label: 'Payment Method', value: selected.paymentMethod === 'card' ? 'Card Payment' : 'Bank Transfer' },
                { label: 'Payment Status', value: selected.paymentStatus === 'paid' ? 'Paid' : 'Pending' },
                { label: 'Shipping Address', value: `${selected.shippingAddress?.street}, ${selected.shippingAddress?.city}, ${selected.shippingAddress?.state}, ${selected.shippingAddress?.country}` },
                { label: 'Items', value: `${selected.items?.length || 0} item${selected.items?.length !== 1 ? 's' : ''}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4 py-2 border-b theme-border last:border-0">
                  <span className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase flex-shrink-0">
                    {label}
                  </span>
                  <span className="font-body theme-text-secondary text-sm text-right">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Estimated Delivery Date - Show only for processing, shipped, delivered */}
            {selected.orderStatus !== 'pending_payment' && selected.orderStatus !== 'cancelled' && selected.estimatedDeliveryDate && (
              <div className="px-6 py-4 border-b theme-border">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar size={16} className="text-gold" />
                  <p className="font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase">Estimated Delivery Date</p>
                </div>
                <p className="font-body theme-text font-semibold">
                  {new Date(selected.estimatedDeliveryDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Total */}
            <div className="px-6 py-4 border-b theme-border">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.2em] theme-text-muted uppercase">
                  Total
                </span>
                <span className="font-display font-black text-gold text-2xl">
                  {formatPrice(selected.total)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex gap-3">
              {selected.orderStatus === 'cancelled' && (
                <button
                  onClick={() => handleDeleteOrder(selected._id)}
                  disabled={deletingId === selected._id}
                  className="flex-1 py-3 border border-red-400/30 text-red-400 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-red-400/10 transition-colors rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingId === selected._id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Delete Order
                </button>
              )}
              {(selected.orderStatus === 'pending_payment' || selected.orderStatus === 'processing') && (
                <button
                  onClick={() => handleCancelOrder(selected._id)}
                  disabled={cancellingId === selected._id}
                  className="flex-1 py-3 border border-red-400/30 text-red-400 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-red-400/10 transition-colors rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cancellingId === selected._id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    'Cancel Order'
                  )}
                </button>
              )}
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserOrders;