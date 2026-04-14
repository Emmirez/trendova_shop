/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, ArrowLeft, Check, Star, Shield, Truck, RotateCcw, Loader2 } from 'lucide-react';
import { productService } from '../services/apiService';
import { userService } from '../services/apiService';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

const badgeColors = {
  Bestseller: 'bg-gold text-obsidian',
  New: 'bg-cream text-obsidian',
  Sale: 'bg-red-900/80 text-red-200',
  Exclusive: 'bg-purple-900/60 text-purple-200',
  Limited: 'bg-smoke border border-gold/30 text-gold',
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

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeImage, setActiveImage] = useState('main');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Check if product is in wishlist
  const checkWishlistStatus = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await userService.getWishlist();
      const wishlistItems = response.wishlist || [];
      const found = wishlistItems.some(item => item._id === id);
      setIsInWishlist(found);
    } catch (err) {
      console.error("Failed to check wishlist status:", err);
    }
  }, [isAuthenticated, id]);

  // Fetch product by ID
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productService.getById(id);
      const fetchedProduct = response.product;
      setProduct(fetchedProduct);
      
      // Fetch related products (same category, exclude current)
      if (fetchedProduct) {
        const allProducts = await productService.getAll();
        const related = allProducts.products
          .filter(p => p.category === fetchedProduct.category && p._id !== fetchedProduct._id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      
      // Check wishlist status after product is loaded
      await checkWishlistStatus();
    } catch (err) {
      console.error('Failed to fetch product:', err);
      toast.error(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize && product?.sizes?.length > 0) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart(product, selectedSize || 'One Size');
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to wishlist");
      return;
    }
    
    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await userService.removeFromWishlist(id);
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await userService.addToWishlist(id);
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Failed to update wishlist:", err);
      toast.error(err.message || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg overflow-x-hidden">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin w-12 h-12 border-2 border-gold border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen theme-bg overflow-x-hidden">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <h1 className="font-display font-black theme-text text-4xl">Product Not Found</h1>
          <Link
            to="/#collections"
            className="px-8 py-4 bg-gold text-obsidian font-mono text-[12px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors rounded-lg"
          >
            Back to Collections
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg overflow-x-hidden">
      <Header />

      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 pt-8 mb-10">
          <Link
            to="/"
            className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase hover:text-gold transition-colors"
          >
            Home
          </Link>
          <span className="theme-text-muted">/</span>
          <Link
            to="/#collections"
            className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase hover:text-gold transition-colors"
          >
            Collections
          </Link>
          <span className="theme-text-muted">/</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-gold uppercase">
            {product.name}
          </span>
        </div>

        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

          {/* Left — Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-lg"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              {product.badge && product.badge !== "null" && (
                <div className={`absolute top-4 left-4 z-10 px-3 py-1 font-mono text-[10px] tracking-[0.2em] uppercase font-bold rounded-lg ${badgeColors[product.badge] || 'bg-obsidian text-cream'}`}>
                  {product.badge}
                </div>
              )}
              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-obsidian/60 backdrop-blur-sm hover:bg-gold/20 transition-colors rounded-lg disabled:opacity-50"
              >
                {wishlistLoading ? (
                  <Loader2 size={16} className="animate-spin text-gold" />
                ) : (
                  <Heart
                    size={16}
                    className={isInWishlist ? 'fill-gold stroke-gold' : 'stroke-cream/70'}
                  />
                )}
              </button>
              <img
                src={activeImage === 'hover' && product.hoverImage ? product.hoverImage : product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>

            {/* Thumbnail images */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveImage('main')}
                className={`aspect-[4/3] overflow-hidden border-2 transition-all duration-200 rounded-lg ${
                  activeImage === 'main' ? 'border-gold' : 'border-transparent'
                }`}
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </button>
              {product.hoverImage && (
                <button
                  onClick={() => setActiveImage('hover')}
                  className={`aspect-[4/3] overflow-hidden border-2 transition-all duration-200 rounded-lg ${
                    activeImage === 'hover' ? 'border-gold' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: 'var(--bg-card)' }}
                >
                  <img src={product.hoverImage} alt={product.name} className="w-full h-full object-cover" />
                </button>
              )}
            </div>
          </div>

          {/* Right — Product info */}
          <div className="flex flex-col">
            {/* Category & name */}
            <div className="mb-6">
              <p className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase mb-2">
                {product.category}
              </p>
              <h1 className="font-display font-black theme-text leading-tight mb-4"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={13} className="fill-gold stroke-gold" />
                  ))}
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] theme-text-muted">
                  4.9 (128 reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="font-display font-black text-gold text-3xl">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="font-body theme-text-muted text-lg line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="font-mono text-[10px] tracking-[0.2em] text-green-500 uppercase">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                  </span>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px theme-border mb-6" />

            {/* Description */}
            <p className="font-body theme-text-secondary text-base leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-3">
                  Color
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color, i) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(i)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === i ? 'border-gold scale-110' : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: color, outline: '2px solid var(--border-color)', outlineOffset: '2px' }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase">
                    Size
                  </p>
                  <button className="font-mono text-[10px] tracking-[0.2em] text-gold uppercase hover:text-yellow-600 transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`px-4 py-2 font-mono text-[11px] tracking-[0.2em] uppercase border transition-all duration-200 rounded-lg ${
                        selectedSize === size
                          ? 'bg-gold text-obsidian border-gold'
                          : sizeError
                          ? 'border-red-500/50 theme-text-secondary hover:border-gold hover:text-gold'
                          : 'theme-border theme-text-secondary hover:border-gold hover:text-gold'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="font-mono text-[10px] tracking-[0.2em] text-red-500 uppercase mt-2">
                    Please select a size
                  </p>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-3 py-4 font-mono text-[12px] tracking-[0.3em] uppercase font-bold transition-all duration-300 rounded-lg ${
                  addedFeedback
                    ? 'bg-green-600 text-white'
                    : 'bg-gold text-obsidian hover:bg-yellow-400'
                }`}
              >
                {addedFeedback ? <Check size={16} /> : <ShoppingBag size={16} />}
                {addedFeedback ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className={`flex items-center justify-center gap-2 px-6 py-4 border font-mono text-[11px] tracking-[0.2em] uppercase transition-all duration-200 rounded-lg ${
                  isInWishlist
                    ? 'border-gold text-gold bg-gold/10'
                    : 'theme-border theme-text-secondary hover:border-gold hover:text-gold'
                } disabled:opacity-50`}
              >
                {wishlistLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Heart size={15} className={isInWishlist ? 'fill-gold stroke-gold' : ''} />
                )}
                {isInWishlist ? 'Saved' : 'Wishlist'}
              </button>
            </div>

            {/* Trust signals */}
            <div
              className="border theme-border p-5 space-y-3 rounded-lg"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              {[
                { icon: Shield, text: 'Certificate of Authenticity included' },
                { icon: Truck, text: 'Free shipping on orders over ₦200,000' },
                { icon: RotateCcw, text: '30-day hassle-free returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={15} className="text-gold flex-shrink-0" />
                  <span className="font-body theme-text-secondary text-sm">{text}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex gap-2 mt-6 flex-wrap">
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] tracking-[0.2em] uppercase px-3 py-1 border theme-border theme-text-muted rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-gold" />
              <h2 className="font-display font-black theme-text text-2xl">
                You May Also Like
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  className="group"
                >
                  <div
                    className="aspect-[3/4] overflow-hidden mb-3 relative rounded-lg"
                    style={{ backgroundColor: 'var(--bg-card)' }}
                  >
                    {p.badge && p.badge !== "null" && (
                      <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] uppercase font-bold rounded ${badgeColors[p.badge] || 'bg-obsidian text-cream'}`}>
                        {p.badge}
                      </div>
                    )}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="font-mono text-[9px] tracking-[0.2em] text-gold/60 uppercase mb-1">
                    {p.category}
                  </p>
                  <p className="font-display font-semibold theme-text text-sm leading-tight mb-1">
                    {p.name}
                  </p>
                  <p className="font-body text-gold text-sm font-semibold">
                    {formatPrice(p.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;