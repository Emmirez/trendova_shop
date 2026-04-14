import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("trendova_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (e) {
        console.error("Failed to parse saved cart:", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("trendova_cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("trendova_cart");
    }
  }, [cart]);

  const addToCart = useCallback((product, size = "M", quantity = 1) => {
    setCart((prev) => {
      const productId = product._id || product.id;
      const existing = prev.find(
        (item) => item.id === productId && item.size === size,
      );
      if (existing) {
        return prev.map((item) =>
          item.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: productId,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          size,
          quantity,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((id, size) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === id && item.size === size)),
    );
  }, []);

  const updateQuantity = useCallback(
    (id, size, quantity) => {
      if (quantity <= 0) {
        removeFromCart(id, size);
        return;
      }
      setCart((prev) =>
        prev.map((item) =>
          item.id === id && item.size === size ? { ...item, quantity } : item,
        ),
      );
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("trendova_cart");
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
