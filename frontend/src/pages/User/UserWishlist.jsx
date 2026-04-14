import { useState, useEffect } from "react";
import { Heart, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { userService } from "../../services/apiService";
import { toast } from "react-hot-toast";

const UserWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  // Fetch wishlist items
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await userService.getWishlist();
      const wishlistData = response.wishlist || [];
      setWishlistItems(wishlistData);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      toast.error(err.message || "Failed to fetch wishlist");
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    setRemovingId(productId);
    try {
      await userService.removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      toast.error(err.message || "Failed to remove from wishlist");
    } finally {
      setRemovingId(null);
    }
  };

  // Add to cart
  const handleAddToCart = (product) => {
    setAddingToCart(product._id);
    try {
      const event = new CustomEvent('addToCart', { 
        detail: { product, quantity: 1, size: product.sizes?.[0] || 'One Size' } 
      });
      window.dispatchEvent(event);
      toast.success("Added to cart successfully");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error(err.message || "Failed to add to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get image URL - try multiple possible fields
  const getProductImage = (product) => {
    
    if (product.image) return product.image;
    if (product.hoverImage) return product.hoverImage;
    if (product.images && product.images.length > 0) return product.images[0];
    return "";
  };

  if (loading) {
    return (
      <div
        className="border theme-border rounded-lg"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="px-6 py-4 border-b theme-border">
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">
            Saved Items
          </h3>
        </div>
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-gold" />
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div
        className="border theme-border rounded-lg"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="px-6 py-4 border-b theme-border">
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">
            Saved Items
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Heart size={40} className="theme-text-muted opacity-20" />
          <p className="font-body theme-text-muted">Your wishlist is empty</p>
          <Link
            to="/#collections"
            className="px-6 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border theme-border rounded-lg"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      <div className="px-6 py-4 border-b theme-border">
        <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">
          Saved Items ({wishlistItems.length})
        </h3>
      </div>

      <div className="divide-y theme-border">
        {wishlistItems.map((item) => {
          const imageUrl = getProductImage(item);
          return (
            <div key={item._id} className="flex gap-4 px-6 py-5">
              {/* Product Image */}
              <Link to={`/product/${item._id}`} className="flex-shrink-0">
                <div className="w-24 h-24 bg-obsidian/20 border theme-border overflow-hidden rounded-lg">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", imageUrl);
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 theme-text-muted opacity-30" ...></svg></div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart size={24} className="theme-text-muted opacity-30" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item._id}`}>
                  <h4 className="font-display font-semibold theme-text text-base hover:text-gold transition-colors">
                    {item.name}
                  </h4>
                </Link>
                <p className="font-mono text-[9px] tracking-[0.15em] theme-text-muted uppercase mt-0.5">
                  {item.category}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-display font-bold text-gold text-lg">
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span className="font-body text-sm line-through theme-text-muted">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Badge if exists */}
                {item.badge && item.badge !== "null" && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gold/10 text-gold font-mono text-[9px] tracking-[0.15em] uppercase border border-gold/20 rounded-lg">
                    {item.badge}
                  </span>
                )}

                {/* Stock Status */}
                {item.stock !== undefined && item.stock <= 0 && (
                  <p className="font-mono text-[9px] tracking-[0.15em] text-red-500 uppercase mt-1">
                    Out of Stock
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={addingToCart === item._id || (item.stock !== undefined && item.stock <= 0)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gold text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  {addingToCart === item._id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <ShoppingBag size={12} />
                  )}
                  Add to Cart
                </button>

                <button
                  onClick={() => handleRemoveFromWishlist(item._id)}
                  disabled={removingId === item._id}
                  className="flex items-center justify-center gap-2 px-4 py-2 border theme-border theme-text-muted hover:border-red-400/40 hover:text-red-400 font-mono text-[10px] tracking-[0.2em] uppercase transition-all disabled:opacity-50 rounded-lg"
                >
                  {removingId === item._id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserWishlist;