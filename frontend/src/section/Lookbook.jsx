import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { lookService } from "../services/apiService";
import { Loader2 } from "lucide-react";

const Lookbook = () => {
  const [looks, setLooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLooks = async () => {
    setLoading(true);
    try {
      const response = await lookService.getLooks();
      // Get first 3 looks for the lookbook
      const allLooks = response.looks || [];
      setLooks(allLooks.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch looks:", err);
      // Fallback to default looks if API fails
      setLooks([
        {
          _id: "1",
          title: "The Night Out",
          description: "Head to toe luxury for when the occasion demands it.",
          products: [],
        },
        {
          _id: "2",
          title: "The Street Edit",
          description: "Casual luxury. Effortless from morning to night.",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLooks();
  }, []);

  // Get the first product image from each look for the cover
  const getCoverImage = (look) => {
    if (look.products && look.products.length > 0 && look.products[0].image) {
      return look.products[0].image;
    }
    // Fallback images based on look title
    if (look.title === "The Night Out") {
      return "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80";
    }
    if (look.title === "The Street Edit") {
      return "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80";
    }
    return "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&q=80";
  };

  // Get tag based on first product category
  const getLookTag = (look) => {
    if (look.products && look.products.length > 0 && look.products[0].category) {
      return look.products[0].category;
    }
    // Fallback tags
    if (look.title === "The Night Out") return "Couture";
    if (look.title === "The Street Edit") return "Tracksuits";
    return "Accessories";
  };

  if (loading) {
    return (
      <section className="py-24 px-6" style={{ backgroundColor: 'var(--bg-card)' }}>
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

  // Create display looks with images
  const displayLooks = looks.map((look, index) => ({
    id: look._id,
    title: look.title,
    tag: getLookTag(look),
    image: getCoverImage(look),
    size: index === 0 ? "large" : "small",
  }));

  // Ensure we have 3 looks (repeat first if needed)
  while (displayLooks.length < 3) {
    displayLooks.push(displayLooks[0]);
  }

  return (
    <section className="py-24 px-6 border-t border-obsidian/5" style={{ backgroundColor: 'var(--bg-card)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
            Editorial
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2
            className="font-display font-black theme-text leading-tight"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            The
            <span className="block italic gold-text">Lookbook</span>
          </h2>
          <p className="font-body theme-text-secondary text-sm max-w-xs leading-relaxed">
            Season 2026. Shot in Lagos, London, and Dubai. Styled for those who need no introduction.
          </p>
        </div>

        {/* Collage grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[600px]">
          {/* Large left - first look */}
          <div className="col-span-2 md:col-span-1 row-span-2 relative overflow-hidden group rounded-lg">
            <img
              src={displayLooks[0].image}
              alt={displayLooks[0].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="font-mono text-[9px] tracking-[0.3em] text-gold/70 uppercase mb-1">{displayLooks[0].tag}</p>
              <h3 className="font-display font-bold text-cream text-xl">{displayLooks[0].title}</h3>
            </div>
          </div>

          {/* Top right - second look */}
          <div className="relative overflow-hidden group rounded-lg">
            <img
              src={displayLooks[1].image}
              alt={displayLooks[1].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="font-mono text-[9px] tracking-[0.3em] text-gold/70 uppercase mb-1">{displayLooks[1].tag}</p>
              <h3 className="font-display font-bold text-cream text-base">{displayLooks[1].title}</h3>
            </div>
          </div>

          {/* Bottom right - third look */}
          <div className="relative overflow-hidden group rounded-lg">
            <img
              src={displayLooks[2].image}
              alt={displayLooks[2].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="font-mono text-[9px] tracking-[0.3em] text-gold/70 uppercase mb-1">{displayLooks[2].tag}</p>
              <h3 className="font-display font-bold text-cream text-base">{displayLooks[2].title}</h3>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            to="/#collections"
            className="group inline-flex items-center gap-3 px-10 py-4 border theme-border theme-text-secondary font-mono text-[11px] tracking-[0.3em] uppercase hover:border-gold/40 hover:text-gold transition-all duration-300 rounded-lg"
          >
            Shop the Looks
            <span className="group-hover:translate-x-1 transition-transform duration-300">{'→'}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Lookbook;