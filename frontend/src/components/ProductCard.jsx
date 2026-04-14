/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, Heart, Eye, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { userService } from "../services/apiService";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const badgeColors = {
  Bestseller: "bg-gold text-obsidian",
  New: "bg-cream text-obsidian",
  Sale: "bg-red-900/80 text-red-200",
  Exclusive: "bg-purple-900/60 text-purple-200",
  Limited: "bg-smoke border border-gold/30 text-gold",
};

const formatPrice = (price) => {
  if (!price) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[1] || product.sizes?.[0] || "M"
  );
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  // Check if product is in wishlist when component mounts
  const checkWishlistStatus = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await userService.getWishlist();
      const wishlistItems = response.wishlist || [];
      const found = wishlistItems.some(item => item._id === product._id);
      
      setIsInWishlist(found);
    } catch (err) {
      console.error("Failed to check wishlist status:", err);
    }
  }, [isAuthenticated, product._id, product.name]);

  useEffect(() => {
    checkWishlistStatus();
  }, [checkWishlistStatus]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, selectedSize);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to wishlist");
      return;
    }
    
    setLoadingWishlist(true);
    try {
      
      
      if (isInWishlist) {
        await userService.removeFromWishlist(product._id);
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
        
      } else {
        await userService.addToWishlist(product._id);
        setIsInWishlist(true);
        toast.success("Added to wishlist");
       
      }
    } catch (err) {
      console.error("Failed to update wishlist:", err);
      toast.error(err.message || "Failed to update wishlist");
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <div
      className="product-card group relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(() => setHovered(false), 2000)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-smoke aspect-[3/4] rounded-lg">
        {/* Badge */}
        {product.badge && product.badge !== "null" && (
          <div
            className={`absolute top-3 left-3 z-20 px-2 py-1 text-[10px] font-mono tracking-[0.2em] uppercase font-bold rounded-lg ${badgeColors[product.badge] || "bg-smoke text-cream"}`}
          >
            {product.badge}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          disabled={loadingWishlist}
          className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-obsidian/60 backdrop-blur-sm hover:bg-gold/20 transition-colors duration-200 rounded-lg disabled:opacity-50"
        >
          {loadingWishlist ? (
            <Loader2 size={14} className="animate-spin text-gold" />
          ) : (
            <Heart
              size={14}
              className={`transition-colors duration-200 ${isInWishlist ? "fill-gold stroke-gold" : "stroke-cream/70"}`}
            />
          )}
        </button>

        {/* Image */}
        <img
          src={hovered && product.hoverImage ? product.hoverImage : product.image}
          alt={product.name}
          crossOrigin="anonymous"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay */}
        <div
          className={`product-overlay absolute inset-0 bg-obsidian/60 flex flex-col items-center justify-end pb-6 gap-3 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`w-7 h-7 text-[10px] font-mono font-bold border transition-all duration-200 rounded-lg ${
                    selectedSize === size
                      ? "bg-gold text-obsidian border-gold"
                      : "border-cream/30 text-cream/70 hover:border-gold hover:text-gold"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-2 px-6 py-3 text-[11px] font-mono tracking-[0.2em] uppercase font-bold transition-all duration-300 rounded-lg ${
              addedFeedback
                ? "bg-green-700 text-white"
                : "bg-gold text-obsidian hover:bg-yellow-400"
            }`}
          >
            <ShoppingBag size={13} />
            {addedFeedback ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] text-gold/60 uppercase mb-1">
              {product.category}
            </p>
            <Link to={`/product/${product._id}`}>
              <h3 className="font-display font-semibold theme-text text-base leading-tight hover-line cursor-pointer">
                {product.name}
              </h3>
            </Link>
          </div>
          <Link to={`/product/${product._id}`}>
            <Eye
              size={14}
              className="text-cream/20 mt-1 flex-shrink-0 group-hover:text-gold/40 transition-colors"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className="font-body font-semibold text-gold text-sm">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="font-body theme-text-muted text-xs line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5 mt-3">
            {product.colors.map((color) => (
              <div
                key={color}
                className="w-3 h-3 rounded-full border border-white/10 cursor-pointer hover:scale-125 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;