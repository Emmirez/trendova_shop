/* eslint-disable no-unused-vars */
import { useLocation, Link } from "react-router-dom";
import { Banknote, Copy, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";  // ADD THIS
import { toast } from "react-hot-toast";  // ADD THIS

const PaymentInstructions = () => {
  const location = useLocation();
  const { order, paymentMethod } = location.state || {};
  const [copied, setCopied] = useState(false);
  const { clearCart } = useCart();  // ADD THIS

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentConfirm = () => {
    // Clear the cart when user confirms payment
    clearCart();
    localStorage.removeItem("trendova_cart");
    toast.success("Payment confirmed! Thank you for your order.");
    window.location.href = '/dashboard?tab=orders';
  };

  if (!order) {
    return (
      <div className="min-h-screen theme-bg">
        <Header />
        <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto text-center">
          <h1 className="font-display font-black theme-text text-4xl mb-4">No order found</h1>
          <Link to="/" className="px-6 py-3 bg-gold text-obsidian rounded-lg">
            Go Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price) => {
    if (!price) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const bankDetails = {
    bankName: "Zenith Bank",
    accountName: "Trendova Luxury Ltd",
    accountNumber: "1234567890",
    sortCode: "057",
  };

  return (
    <div className="min-h-screen theme-bg">
      <Header />
      
      <div className="pt-28 pb-16 px-6 max-w-3xl mx-auto">
        <Link to="/dashboard?tab=orders" className="inline-flex items-center gap-2 text-gold hover:text-yellow-600 mb-6">
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        <div className="border theme-border rounded-lg p-6" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Banknote size={32} className="text-gold" />
            </div>
            <h1 className="font-display font-black theme-text text-2xl">Bank Transfer Instructions</h1>
            <p className="font-body theme-text-muted text-sm mt-1">
              Order #{order.orderNumber}
            </p>
          </div>

          {/* Order Summary */}
          <div className="border-t border-b theme-border py-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-mono text-[10px] theme-text-muted">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-mono text-[10px] theme-text-muted">Shipping</span>
              <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t theme-border">
              <span className="font-display font-semibold theme-text">Total to Pay</span>
              <span className="font-display font-bold text-gold text-xl">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Bank Transfer Instructions */}
          <div className="space-y-4">
            <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
              <h3 className="font-display font-semibold theme-text mb-3">Bank Account Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] theme-text-muted">Bank Name</span>
                  <span className="font-body theme-text">{bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] theme-text-muted">Account Name</span>
                  <span className="font-body theme-text">{bankDetails.accountName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] theme-text-muted">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-body font-mono text-lg tracking-wider">{bankDetails.accountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(bankDetails.accountNumber)}
                      className="p-1 hover:text-gold transition-colors"
                    >
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] theme-text-muted">Sort Code</span>
                  <span>{bankDetails.sortCode}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-mono text-[10px] text-gold uppercase">Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm theme-text-secondary">
                <li>Transfer the exact amount of {formatPrice(order.total)} to the account above</li>
                <li>Use your order number #{order.orderNumber} as payment reference</li>
                <li>Take a screenshot of your payment confirmation</li>
                <li>Click "I've Made Payment" button below to notify us</li>
                <li>Your order will be processed within 24 hours after payment confirmation</li>
              </ol>
            </div>

            <button
              onClick={handlePaymentConfirm}
              className="w-full py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold rounded-lg hover:bg-yellow-400 transition-colors mt-4"
            >
              I've Made Payment
            </button>
          </div>

          <p className="text-center text-xs theme-text-muted mt-6">
            Your order will be processed once payment is confirmed. You will receive an email notification.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentInstructions;