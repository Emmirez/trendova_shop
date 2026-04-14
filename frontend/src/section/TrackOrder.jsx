import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, Loader2 } from "lucide-react";
import { orderService } from "../services/apiService";
import { toast } from "react-hot-toast";

const statusIcons = {
  "Order Placed": Clock,
  "Pending Payment": Clock,
  "Processing": Package,
  "Shipped": Truck,
  "Delivered": CheckCircle,
};

// Map order status to step index
const getStepIndex = (status) => {
  const statusMap = {
    pending_payment: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
    cancelled: -1,
  };
  return statusMap[status] ?? 0;
};

const steps = ["Order Placed", "Processing", "Shipped", "Delivered"];

const TrackOrder = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    
    const orderNumber = input.toUpperCase().trim();
    if (!orderNumber) {
      toast.error("Please enter an order number");
      return;
    }

    setLoading(true);
    setError(false);
    setResult(null);

    try {
      // Use public track endpoint
      const response = await orderService.trackOrder(orderNumber);
      const order = response;
      
      if (order) {
        const currentStep = getStepIndex(order.status);
        
        // Format estimated delivery date
        let eta = "";
        if (order.status === "delivered") {
          eta = `Delivered ${new Date(order.deliveredAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}`;
        } else if (order.estimatedDeliveryDate) {
          eta = `Expected ${new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}`;
        } else {
          eta = "Awaiting update";
        }
        
        setResult({
          orderNumber: order.orderNumber,
          status: order.status,
          product: order.items?.length > 0 
            ? order.items.map(item => item.name).join(", ")
            : "Order",
          date: new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          eta: eta,
          steps: steps,
          current: currentStep + 1,
          total: order.total,
        });
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Failed to track order:", err);
      if (err.message === "Order not found.") {
        setError(true);
      } else {
        toast.error("Failed to fetch order. Please try again.");
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="track-order"
      className="py-24 px-6 border-t border-obsidian/5"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
            Order Status
          </span>
        </div>
        <h2
          className="font-display font-black theme-text leading-tight mb-4"
          style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
        >
          Track Your
          <span className="block italic gold-text">Order</span>
        </h2>
        <p className="font-body theme-text-muted text-sm mb-12">
          Enter your order number below to track your order status.
        </p>

        {/* Input */}
        <form
          onSubmit={handleTrack}
          className="flex flex-col sm:flex-row gap-3 mb-10"
        >
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted"
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. TRV-001234"
              className="w-full pl-11 pr-4 py-4 border theme-border theme-text placeholder-theme-text-muted font-mono text-sm focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
              style={{ backgroundColor: "var(--input-bg)" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors duration-300 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={15} />}
            Track
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="p-5 border border-red-200 bg-red-50 rounded-lg mb-8">
            <p className="font-mono text-[11px] tracking-[0.2em] text-red-500 uppercase">
              Order not found. Please check your order number and try again.
            </p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="p-8 border theme-border rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
            {/* Order info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-8 border-b theme-border">
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-gold/60 uppercase mb-1">
                  {result.orderNumber}
                </p>
                <p className="font-display font-semibold theme-text text-lg">
                  {result.product}
                </p>
                <p className="font-body theme-text-muted text-sm mt-1">
                  Ordered {result.date}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase mb-1">
                  {result.status === "delivered" ? "Delivered" : "Estimated"}
                </p>
                <p className="font-body theme-text-secondary text-sm">
                  {result.eta}
                </p>
                {result.total && (
                  <p className="font-mono text-[9px] text-gold mt-1">
                    Total: {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(result.total)}
                  </p>
                )}
              </div>
            </div>

            {/* Progress steps */}
            <div className="relative">
              <div className="absolute top-5 left-5 right-5 h-px theme-border hidden sm:block" />
              <div
                className="absolute top-5 left-5 h-px bg-gold hidden sm:block transition-all duration-500"
                style={{
                  width: `${((result.current - 1) / (steps.length - 1)) * 100}%`,
                  maxWidth: "calc(100% - 40px)",
                }}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative">
                {steps.map((step, i) => {
                  const Icon = statusIcons[step] || Package;
                  const done = i + 1 <= result.current;
                  const active = i + 1 === result.current;
                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center text-center gap-3"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          active
                            ? "bg-gold border-gold text-obsidian"
                            : done
                              ? "bg-obsidian border-obsidian text-cream"
                              : "border theme-border theme-text-muted"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <p
                        className={`font-mono text-[9px] tracking-[0.15em] uppercase ${
                          done ? "theme-text" : "theme-text-muted"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrackOrder;