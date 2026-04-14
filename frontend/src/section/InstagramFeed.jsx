import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { instagramService } from "../services/apiService";

const InstagramFeed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const response = await instagramService.getFeed();
      setFeed(response.feed || []);
    } catch (err) {
      console.error("Failed to fetch Instagram feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

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

  return (
    <section className="py-24 px-6 border-t border-obsidian/5" style={{ backgroundColor: 'var(--bg-card)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-gold" />
              <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
                Instagram
              </span>
            </div>
            <h2
              className="font-display font-black theme-text leading-tight"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              Follow the
              <span className="block italic gold-text">Movement</span>
            </h2>
          </div>
          <a
            href="https://instagram.com/trendova_shop"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 border theme-border theme-text-secondary font-mono text-[11px] tracking-[0.3em] uppercase hover:border-gold/40 hover:text-gold transition-all duration-300 self-start rounded-lg"
          >
            @trendova_shop
            <span className="group-hover:translate-x-1 transition-transform duration-300">{'→'}</span>
          </a>
        </div>

        {/* Grid */}
        {feed.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body theme-text-muted">No Instagram posts to display</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {feed.map((item) => (
              <a
                key={item._id}
                href="https://instagram.com/trendova_shop"
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden bg-obsidian cursor-pointer rounded-lg"
              >
                <img
                  src={item.product?.image}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-mono text-[11px] text-cream font-bold">
                    ♥ {item.likes}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Stats strip - static for now */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-obsidian/5">
          {[
            { value: "48.2K", label: "Followers" },
            { value: "320+", label: "Posts" },
            { value: "12K+", label: "Tagged" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display font-bold text-2xl gold-text">{value}</div>
              <div className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;