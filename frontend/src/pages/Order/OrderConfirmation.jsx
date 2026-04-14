/* eslint-disable no-unused-vars */
import { useParams, useLocation, Link } from "react-router-dom";
import { CheckCircle, Package, Truck, Calendar, MapPin } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const formatPrice = (price) => {
  if (!price) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen theme-bg">
        <Header />
        <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto text-center">
          <h1 className="font-display font-black theme-text text-4xl mb-4">
            Order not found
          </h1>
          <Link to="/" className="px-6 py-3 bg-gold text-obsidian rounded-lg">
            Go Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg">
      <Header />

      <div className="pt-28 pb-16 px-6 max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="font-display font-black theme-text text-3xl mb-2">
            Order Confirmed!
          </h1>
          <p className="font-body theme-text-muted">
            Thank you for your purchase. Your order has been received.
          </p>
          <p className="font-mono text-[11px] text-gold mt-2">
            Order #{order.orderNumber}
          </p>
        </div>

        {/* Order Details */}
        <div
          className="border theme-border rounded-lg p-6 mb-6"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <h2 className="font-display font-semibold theme-text text-lg mb-4">
            Order Summary
          </h2>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-3 py-2 border-b theme-border last:border-0"
              >
                <div className="w-16 h-16 bg-obsidian/10 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-display font-semibold theme-text">
                    {item.name}
                  </p>
                  <p className="font-mono text-[9px] theme-text-muted">
                    Size: {item.size} × {item.quantity}
                  </p>
                  <p className="font-body text-gold font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t theme-border mt-4 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-mono text-[10px] theme-text-muted">
                Subtotal
              </span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[10px] theme-text-muted">
                Shipping
              </span>
              <span>
                {order.shippingFee === 0
                  ? "FREE"
                  : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t theme-border">
              <span className="font-display font-semibold theme-text">
                Total
              </span>
              <span className="font-display font-bold text-gold text-xl">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div
          className="border theme-border rounded-lg p-6 mb-6"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <h2 className="font-display font-semibold theme-text text-lg mb-4">
            Delivery Information
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Truck size={18} className="text-gold mt-0.5" />
              <div>
                <p className="font-mono text-[10px] theme-text-muted">
                  Estimated Delivery
                </p>
                <p className="font-body theme-text">
                  {new Date(order.estimatedDeliveryDate).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gold mt-0.5" />
              <div>
                <p className="font-mono text-[10px] theme-text-muted">
                  Shipping Address
                </p>
                <p className="font-body theme-text">
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                  <br />
                  {order.shippingAddress.country}{" "}
                  {order.shippingAddress.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            to="/dashboard?tab=orders"
            className="flex-1 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold text-center rounded-lg hover:bg-yellow-400 transition-colors"
          >
            View My Orders
          </Link>
          <Link
            to="/#collections"
            className="flex-1 py-3 border theme-border theme-text-secondary font-mono text-[11px] tracking-[0.3em] uppercase text-center rounded-lg hover:border-gold/40 hover:text-gold transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
