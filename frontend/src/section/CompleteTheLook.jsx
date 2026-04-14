import { useState, useEffect } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { lookService } from "../services/apiService";
import { toast } from "react-hot-toast";

const formatPrice = (price) => {
  if (!price) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const CompleteTheLook = () => {
  const [looks, setLooks] = useState([]);
  const [activeLook, setActiveLook] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingAll, setAddingAll] = useState(false);
  const { addToCart } = useCart();

  const fetchLooks = async () => {
    setLoading(true);
    try {
      const response = await lookService.getLooks();
      setLooks(response.looks || []);
    } catch (err) {
      console.error("Failed to fetch looks:", err);
      toast.error("Failed to load outfit builder");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLooks();
  }, []);

  const handleAddToCart = (item, e) => {
    e?.stopPropagation();
    addToCart(item, item.sizes?.[0] || "M");
    toast.success(`Added ${item.name} to cart`);
  };

  const handleAddAll = async () => {
    const look = looks[activeLook];
    if (!look?.products?.length) return;
    
    setAddingAll(true);
    try {
      look.products.forEach((item) => {
        addToCart(item, item.sizes?.[0] || "M");
      });
      toast.success(`Added all items from "${look.title}" to cart`);
    } catch (err) {
      console.error("Failed to add all items:", err);
      toast.error("Failed to add all items to cart");
    } finally {
      setAddingAll(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 px-6 border-t border-obsidian/5" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <Loader2 size={40} className="animate-spin text-gold" />
          </div>
        </div>
      </section>
    );
  }

  if (looks.length === 0) {
    return null;
  }

  const look = looks[activeLook];
  const total = look?.products?.reduce((sum, item) => sum + (item.price || 0), 0) || 0;

  return (
    <section className="py-24 px-6 border-t border-obsidian/5" style={{ backgroundColor: 'var(--bg-card)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
            Outfit Builder
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="font-display font-black theme-text leading-tight" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            Complete
            <span className="block italic gold-text">the Look</span>
          </h2>

          {/* Look switcher */}
          <div className="flex flex-wrap gap-2">
            {looks.map((l, i) => (
              <button
                key={l._id}
                onClick={() => setActiveLook(i)}
                className={`px-5 py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-all duration-300 rounded-lg ${
                  activeLook === i
                    ? "bg-gold text-obsidian"
                    : "border theme-border theme-text-secondary hover:border-gold/40 hover:text-gold"
                }`}
              >
                {l.title}
              </button>
            ))}
          </div>
        </div>

        {/* Look description */}
        <p className="font-body theme-text-secondary text-sm mb-10">{look.description}</p>

        {/* Items grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {look.products?.map((item) => (
            <div key={item._id} className="group">
              <div className="aspect-square overflow-hidden rounded-lg relative" style={{ backgroundColor: 'var(--bg-card)' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={(e) => handleAddToCart(item, e)}
                  className="absolute bottom-3 left-3 right-3 py-2 bg-obsidian/80 text-cream font-mono text-[10px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 rounded-lg"
                >
                  <ShoppingBag size={11} />
                  Add
                </button>
              </div>
              <p className="font-mono text-[9px] tracking-[0.2em] text-gold/60 uppercase mb-1">
                {item.category}
              </p>
              <p className="font-display font-semibold theme-text text-sm leading-tight">
                {item.name}
              </p>
              <p className="font-body text-gold text-sm font-semibold mt-1">
                {formatPrice(item.price)}
              </p>
            </div>
          ))}
        </div>

        {/* Add all CTA */}
        {look.products?.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase mb-1">
                Complete Look Total
              </p>
              <p className="font-display font-black theme-text text-2xl gold-text">
                {formatPrice(total)}
              </p>
            </div>
            <button
              onClick={handleAddAll}
              disabled={addingAll}
              className="flex items-center gap-3 px-10 py-4 bg-gold text-obsidian font-mono text-[12px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors duration-300 disabled:opacity-50 rounded-lg"
            >
              {addingAll ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ShoppingBag size={16} />
              )}
              Add All to Cart
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompleteTheLook;