import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productService } from "../services/apiService";
import { Loader2 } from "lucide-react";

const categoryConfig = [
  {
    name: "Tracksuits",
    description: "Street luxury, head to toe",
    bg: "#0A0A0A",
    letter: "T",
  },
  {
    name: "Couture",
    description: "Handcrafted statement pieces",
    bg: "#1a1208",
    letter: "C",
  },
  {
    name: "Footwear",
    description: "Walk in confidence",
    bg: "#0a0a0a",
    letter: "F",
  },
  {
    name: "Accessories",
    description: "The details that define you",
    bg: "#120a08",
    letter: "A",
  },
  {
    name: "Gadgets",
    description: "Tech meets luxury",
    bg: "#080a12",
    letter: "G",
  },
];

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategoryCounts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAll();
      const products = response.products || [];

      const counts = {};
      products.forEach((product) => {
        if (product.category) {
          counts[product.category] = (counts[product.category] || 0) + 1;
        }
      });

      const updatedCategories = categoryConfig.map((cat) => ({
        ...cat,
        count: counts[cat.name] || 0,
      }));

      setCategories(updatedCategories);
    } catch (err) {
      console.error("Failed to fetch category counts:", err);
      const fallbackCategories = categoryConfig.map((cat) => ({
        ...cat,
        count: 0,
      }));
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  const scrollToCollections = (category = null) => {
    navigate("/");
    setTimeout(() => {
      const collectionsSection = document.getElementById("collections");
      if (collectionsSection) {
        collectionsSection.scrollIntoView({ behavior: "smooth" });
        if (category) {
          // Dispatch event to set category filter
          window.dispatchEvent(
            new CustomEvent("setCategoryFilter", { detail: category }),
          );
        }
      }
    }, 100);
  };

  if (loading) {
    return (
      <section
        className="py-24 px-6"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <Loader2 size={40} className="animate-spin text-gold" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-24 px-6 border-t border-obsidian/5"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
            Browse
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2
            className="font-display font-black theme-text leading-tight"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            Shop by
            <span className="block italic gold-text">Category</span>
          </h2>
          <button
            onClick={() => scrollToCollections()}
            className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase hover:text-gold transition-colors duration-300 cursor-pointer"
          >
            View All {"→"}
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              onClick={() => scrollToCollections(cat.name)}
              key={cat.name}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg text-left w-full cursor-pointer"
              style={{ backgroundColor: cat.bg }}
            >
              {/* Decorative letter */}
              <div
                className="absolute inset-0 flex items-center justify-center font-display font-black select-none pointer-events-none"
                style={{
                  fontSize: "clamp(120px, 15vw, 200px)",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(201,168,76,0.08)",
                  lineHeight: 1,
                }}
              >
                {cat.letter}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-all duration-500" />

              {/* Gold corner */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-gold/20 group-hover:border-gold/50 transition-colors duration-300" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-gold/20 group-hover:border-gold/50 transition-colors duration-300" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-obsidian/80 to-transparent rounded-b-lg">
                <p className="font-mono text-[9px] tracking-[0.3em] text-gold/60 uppercase mb-1">
                  {cat.count} {cat.count === 1 ? "piece" : "pieces"}
                </p>
                <h3 className="font-display font-bold text-cream text-xl mb-1">
                  {cat.name}
                </h3>
                <p className="font-body text-cream/40 text-xs">
                  {cat.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
