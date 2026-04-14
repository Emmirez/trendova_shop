/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ChevronDown, Loader2 } from "lucide-react";
import { orderService } from "../../services/apiService";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const formatPrice = (price) => {
  if (!price) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

// Custom Select Component
const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg flex items-center justify-between"
        style={{ backgroundColor: "var(--input-bg)" }}
      >
        <span className={!value ? "theme-text-muted" : "theme-text"}>
          {displayLabel}
        </span>
        <ChevronDown
          size={16}
          className={`theme-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute top-full left-0 right-0 mt-1 border theme-border rounded-lg z-20 max-h-48 overflow-y-auto"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 font-body text-sm hover:bg-gold/10 transition-colors ${
                  value === option.value
                    ? "text-gold bg-gold/5"
                    : "theme-text-secondary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    zipCode: "",
    paymentMethod: "card",
  });

  // Calculate shipping based on state
  const calculateShipping = () => {
    if (formData.state?.toLowerCase() === "lagos") {
      return 0;
    }
    return 3000;
  };

  const shippingCost = calculateShipping();
  const grandTotal = cartTotal + shippingCost;

  // Country options
  const countryOptions = [
    { value: "Nigeria", label: "🇳🇬 Nigeria" },
    { value: "Ghana", label: "🇬🇭 Ghana" },
    { value: "Kenya", label: "🇰🇪 Kenya" },
    { value: "South Africa", label: "🇿🇦 South Africa" },
    { value: "Egypt", label: "🇪🇬 Egypt" },
    { value: "Morocco", label: "🇲🇦 Morocco" },
    { value: "Other", label: "🌍 Other" },
  ];

  const paymentOptions = [
    { value: "card", label: "💳 Card Payment (Paystack)" },
    { value: "bank", label: "🏦 Bank Transfer" },
  ];

  // Create order function
  const createOrder = async (
    paymentReference = null,
    isBankTransfer = false,
  ) => {
    const orderData = {
      customer: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
      shippingAddress: {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
      },
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || "M",
        image: item.image,
      })),
      subtotal: cartTotal,
      shippingCost: shippingCost,
      total: grandTotal,
      paymentMethod: isBankTransfer ? "bank" : "card",
      paymentReference: paymentReference,
    };

    const response = await orderService.createOrder(orderData);

    return response;
  };

  // Update the handlePaystackCallback function
  const handlePaystackCallback = async (response) => {
    if (response.status === "success" || response.reference) {
      try {
        if (!cart || cart.length === 0) {
          console.error("Cart is empty at callback time!");
          toast.error(
            "Session issue - payment received. Contact support with ref: " +
              response.reference,
          );
          setLoading(false);
          return;
        }

        const orderData = {
          customer: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
          shippingAddress: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zipCode: formData.zipCode,
          },
          items: cart.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size || "M",
            image: item.image,
          })),
          subtotal: cartTotal,
          shippingCost: shippingCost,
          total: grandTotal,
          paymentMethod: "card",
          paymentReference: response.reference,
        };

        const orderResponse = await orderService.createOrder(orderData);

        if (!orderResponse) {
          toast.error(
            "Session expired during payment. Contact support with ref: " +
              response.reference,
          );
          setLoading(false);
          return;
        }

        const orderId = orderResponse?.order?._id;

        if (!orderId) {
          console.error("9. Missing order ID. Response shape:", orderResponse);
          toast.error("Order may have been created. Check your orders page.");
          navigate("/my-orders");
          return;
        }

        clearCart();
        localStorage.removeItem("trendova_cart");
        toast.success("Payment successful! Order placed.");

        setTimeout(() => {
          navigate(`/order-confirmation/${orderId}`, {
            state: { order: orderResponse.order },
          });
        }, 500);
      } catch (err) {
        console.error("Post-payment error:", err.message);
        toast.error(
          `Failed to create order: ${err.message}. Reference: ${response.reference}`,
        );
        setLoading(false);
      }
    } else {
      toast.error("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const handlePaystackClose = () => {
    toast.error("Payment cancelled");
    setLoading(false);
  };

  // Initialize Paystack payment
  const initializePaystackPayment = () => {
    setLoading(true);

    // Snapshot all values NOW to avoid stale closure
    const currentCart = [...cart];
    const currentFormData = { ...formData };
    const currentCartTotal = cartTotal;
    const currentShippingCost = shippingCost;
    const currentGrandTotal = grandTotal;

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: currentFormData.email,
      amount: currentGrandTotal * 100,
      currency: "NGN",
      ref: `TRV-${new Date().getTime()}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: currentFormData.fullName,
          },
          {
            display_name: "Phone",
            variable_name: "customer_phone",
            value: currentFormData.phone,
          },
        ],
      },

      callback: function (response) {
        (async () => {
          try {
            const orderData = {
              customer: {
                name: currentFormData.fullName,
                email: currentFormData.email,
                phone: currentFormData.phone,
              },
              shippingAddress: {
                street: currentFormData.address,
                city: currentFormData.city,
                state: currentFormData.state,
                country: currentFormData.country,
                zipCode: currentFormData.zipCode,
              },
              items: currentCart.map((item) => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size || "M",
                image: item.image,
              })),
              subtotal: currentCartTotal,
              shippingCost: currentShippingCost,
              total: currentGrandTotal,
              paymentMethod: "card",
              paymentReference: response.reference,
            };

            const orderResponse = await orderService.createOrder(orderData);

            const orderId = orderResponse?.order?._id;
            if (!orderId) {
              toast.error(
                "Order may have been created. Check your orders page.",
              );
              navigate("/my-orders");
              return;
            }

            clearCart();
            localStorage.removeItem("trendova_cart");
            toast.success("Payment successful! Order placed.");

            setTimeout(() => {
              navigate(`/order-confirmation/${orderId}`, {
                state: { order: orderResponse.order },
              });
            }, 500);
          } catch (err) {
            console.error("Post-payment error:", err.message);
            toast.error(
              `Failed to create order: ${err.message}. Ref: ${response.reference}`,
            );
            setLoading(false);
          }
        })();
      },
      onClose: function () {
        toast.error("Payment cancelled");
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  // Load Paystack script
  const loadPaystackScript = () => {
    if (window.PaystackPop) {
      initializePaystackPayment();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => {
      initializePaystackPayment();
    };
    script.onerror = () => {
      toast.error("Failed to load payment gateway. Please try again.");
      setLoading(false);
    };
    document.body.appendChild(script);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.paymentMethod === "card") {
      // Card payment - Paystack
      loadPaystackScript();
    } else {
      // Bank Transfer
      setLoading(true);
      try {
        const response = await createOrder(null, true);

        toast.success("Order placed! Please complete bank transfer.");
        navigate("/payment-instructions", {
          state: {
            order: response.order,
            paymentMethod: "bank",
          },
        });
      } catch (err) {
        console.error("Checkout error:", err);
        toast.error(err.message || "Failed to process order");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen theme-bg">
        <Header />
        <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto text-center">
          <h1 className="font-display font-black theme-text text-4xl mb-4">
            Your cart is empty
          </h1>
          <Link
            to="/#collections"
            className="px-6 py-3 bg-gold text-obsidian rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg">
      <Header />

      <div className="pt-28 pb-16 px-6 max-w-7xl mx-auto">
        <h1 className="font-display font-black theme-text text-3xl md:text-4xl mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div
            className="border theme-border rounded-lg p-6"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <h2 className="font-display font-semibold theme-text text-xl mb-6">
              Shipping Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border theme-border rounded-lg px-4 py-3 focus:outline-none focus:border-gold/40"
                  style={{ backgroundColor: "var(--input-bg)" }}
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border theme-border rounded-lg px-4 py-3 focus:outline-none focus:border-gold/40"
                  style={{ backgroundColor: "var(--input-bg)" }}
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border theme-border rounded-lg px-4 py-3 focus:outline-none focus:border-gold/40"
                  style={{ backgroundColor: "var(--input-bg)" }}
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Luxury Avenue"
                  className="w-full border theme-border rounded-lg px-4 py-3 focus:outline-none focus:border-gold/40"
                  style={{ backgroundColor: "var(--input-bg)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Lagos"
                    className="w-full border theme-border rounded-lg px-4 py-3 focus:outline-none focus:border-gold/40"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Lagos State"
                    className="w-full border theme-border rounded-lg px-4 py-3 focus:outline-none focus:border-gold/40"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Country *
                  </label>
                  <CustomSelect
                    value={formData.country}
                    onChange={(value) =>
                      setFormData({ ...formData, country: value })
                    }
                    options={countryOptions}
                    placeholder="Select country"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="100001"
                    className="w-full border theme-border rounded-lg px-4 py-3 focus:outline-none focus:border-gold/40"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Payment Method *
                </label>
                <CustomSelect
                  value={formData.paymentMethod}
                  onChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                  options={paymentOptions}
                  placeholder="Select payment method"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gold text-obsidian font-mono text-[12px] tracking-[0.3em] uppercase font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin mx-auto" />
                ) : (
                  `Pay ${formatPrice(grandTotal)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div
            className="border theme-border rounded-lg p-6 h-fit"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <h2 className="font-display font-semibold theme-text text-xl mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${index}`}
                  className="flex gap-3"
                >
                  <div className="w-16 h-16 bg-obsidian/10 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-semibold theme-text text-sm">
                      {item.name}
                    </p>
                    <p className="font-mono text-[9px] theme-text-muted">
                      Size: {item.size || "M"} × {item.quantity}
                    </p>
                    <p className="font-body text-gold text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t theme-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-mono text-[10px] theme-text-muted uppercase">
                  Subtotal
                </span>
                <span className="font-body theme-text-secondary">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-[10px] theme-text-muted uppercase">
                  Shipping
                </span>
                <span className="font-body theme-text-secondary">
                  {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                  <span className="text-[10px] text-gold/60 ml-1">
                    (
                    {formData.state?.toLowerCase() === "lagos"
                      ? "Lagos"
                      : "Outside Lagos"}
                    )
                  </span>
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t theme-border">
                <span className="font-display font-semibold theme-text">
                  Total
                </span>
                <span className="font-display font-bold text-gold text-xl">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-4 p-3 bg-gold/5 border border-gold/20 rounded-lg">
              <p className="font-mono text-[9px] text-gold uppercase mb-1">
                Delivery Info
              </p>
              <p className="font-body text-xs theme-text-secondary">
                Free shipping for Lagos addresses. ₦3,000 for other states.
                Estimated delivery: 5-7 business days after payment
                confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
