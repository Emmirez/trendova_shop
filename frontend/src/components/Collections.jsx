import { useState, useEffect } from 'react';
import { productService } from '../services/apiService';
import ProductCard from './ProductCard';

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAll();
      const fetchedProducts = response.products || [];
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Get unique categories from fetched products
  const categories = [...new Set(products.map(p => p.category))].sort();
  const filters = ['All', ...categories];
  const countFor = (filter) =>
    filter === 'All' ? products.length : products.filter(p => p.category === filter).length;

  const filtered = activeFilter === 'All'
    ? products
    : products.filter(p => p.category === activeFilter);

  if (loading) {
    return (
      <section id="collections" className="py-24 px-6 theme-bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-12 h-12 border-2 border-gold border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="collections" className="py-24 px-6 theme-bg-card">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-gold" />
              <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
                Our Collections
              </span>
            </div>
            <h2
              className="font-display font-black theme-text leading-tight"
              style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
            >
              Featured
              <span className="block italic gold-text">Pieces</span>
            </h2>
          </div>

          {/* Filters */}
          {products.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`group flex items-center gap-2 px-5 py-2 text-[11px] font-mono tracking-[0.2em] uppercase transition-all duration-300 rounded-lg ${
                    activeFilter === filter
                      ? 'bg-gold text-obsidian'
                      : 'border theme-border theme-text-secondary hover:border-gold/40 hover:text-gold'
                  }`}
                >
                  {filter}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-obsidian/20 text-obsidian'
                      : 'theme-text-muted group-hover:bg-gold/10 group-hover:text-gold/60'
                  }`}>
                    {countFor(filter)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid - NO ANIMATIONS, JUST DISPLAY */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Count indicator */}
        {products.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-16">
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-obsidian/10" />
            <span className="font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase">
              Showing {filtered.length} of {products.length} pieces
            </span>
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-obsidian/10" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Collections;