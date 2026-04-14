import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const formatPrice = (price) => {
  if (!price) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

const CartSidebar = () => {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    clearCart 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-obsidian/70 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col transition-transform duration-500 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div>
            <h2 className="font-display font-bold theme-text text-xl">
              Your Cart
            </h2>
            <p className="font-mono text-[10px] tracking-[0.2em] text-gold/60 uppercase mt-1">
              {cart.length} {cart.length === 1 ? "Item" : "Items"}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all duration-200 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <ShoppingBag size={48} className="theme-text-muted opacity-20" />
              <p className="font-display font-light theme-text-secondary text-lg">
                Your cart is empty
              </p>
              <p className="font-body theme-text-muted text-sm">
                Explore our collection and find something you love
              </p>
              <Link
                to="/#collections"
                onClick={closeCart}
                className="mt-4 px-8 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="px-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 py-4 border-b"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div
                    className="w-20 h-24 overflow-hidden flex-shrink-0 rounded-lg"
                    style={{ backgroundColor: "var(--bg-card)" }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[9px] tracking-[0.2em] text-gold/60 uppercase mb-1">
                      {item.category}
                    </p>
                    <h4 className="font-display font-semibold theme-text text-sm leading-tight mb-1">
                      {item.name}
                    </h4>
                    <p className="font-mono text-[10px] theme-text-muted">
                      Size: {item.size}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div
                        className="flex items-center gap-2 border rounded-lg"
                        style={{ borderColor: "var(--border-color)" }}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity - 1,
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center theme-text-secondary hover:text-gold hover:bg-gold/10 transition-colors rounded-l-lg"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="font-mono text-xs theme-text w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.quantity + 1,
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center theme-text-secondary hover:text-gold hover:bg-gold/10 transition-colors rounded-r-lg"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-body font-semibold text-gold text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="theme-text-muted hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div
            className="p-6 border-t space-y-4"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-[11px] tracking-[0.2em] theme-text-muted uppercase">
                Subtotal
              </span>
              <span className="font-display font-bold text-lg gold-text">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <p className="font-mono text-[9px] theme-text-muted tracking-wider">
              Shipping calculated at checkout
            </p>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="w-full py-4 bg-gold text-obsidian font-mono text-[12px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors duration-300 rounded-lg flex items-center justify-center"
            >
              Checkout
            </Link>
            <button
              onClick={clearCart}
              className="w-full py-3 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase hover:border-red-400/50 hover:text-red-400 transition-all duration-200 rounded-lg"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;