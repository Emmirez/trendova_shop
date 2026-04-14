import { useEffect, useRef } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

const Hero = () => {
  const headingRef = useRef(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    setTimeout(() => {
      el.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] flex items-end pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Gradient overlay to simulate the dark animal image */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/30 via-transparent to-obsidian/90 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/60 via-transparent to-obsidian/40 z-10" />
        {/* Textured dark background */}
        <div className="w-full h-full bg-[#0D0A07]" style={{
          backgroundImage: `
            radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.04) 0%, transparent 50%)
          `
        }}>
          {/* Decorative lines */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 40px,
                rgba(201,168,76,0.3) 40px,
                rgba(201,168,76,0.3) 41px
              )`
            }}
          />
        </div>

        {/* Large decorative T letter */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 font-display font-black select-none pointer-events-none"
          style={{
            fontSize: 'clamp(300px, 40vw, 600px)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(201,168,76,0.06)',
            lineHeight: 1,
            right: '-5%',
          }}>
          T
        </div>
      </div>

      {/* Ticker bar */}
      <div className="absolute top-[80px] left-0 right-0 z-20 border-y border-gold/10 bg-gold/[0.03] overflow-hidden py-2">
        <div className="flex gap-0 animate-ticker whitespace-nowrap" style={{ width: 'max-content' }}>
          {Array(8).fill(['NEW COLLECTION', '✦', 'TRACKSUITS', '✦', 'COUTURE', '✦', 'FREE SHIPPING OVER ₦100K', '✦']).flat().map((item, i) => (
            <span key={i} className="text-gold/50 font-mono text-[10px] tracking-[0.3em] uppercase px-4">{item}</span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
        <div ref={headingRef} className="max-w-4xl">
          {/* Tag */}
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={12} className="text-gold" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold uppercase">
              New Season 2026
            </span>
            <div className="flex-1 max-w-[80px] h-px bg-gradient-to-r from-gold/50 to-transparent" />
          </div>

          {/* Headline */}
          <h1 className="font-display font-black leading-[0.92] mb-6"
           style={{ fontSize: 'clamp(40px, 6vw, 100px)' }}>
            <span className="block text-cream">Where</span>
            <span className="block italic gold-text">Elegance</span>
            <span className="block text-cream">Meets Luxury</span>
          </h1>

          {/* Sub */}
          <p className="font-body text-cream/60 text-base md:text-lg max-w-md mb-10 leading-relaxed font-light">
            Premium tracksuits and couture pieces crafted for those who demand excellence. 
            Experience fashion at its finest.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="#collections"
              className="group relative px-8 py-4 bg-gold text-obsidian font-body font-semibold text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] rounded-lg"
            >
              <span className="relative z-10 ">Shop Now</span>
              <div className="absolute inset-0 bg-gold-light scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
            <a
              href="#collections"
              className="group px-8 py-4 border border-cream/20 text-cream/80 font-body font-medium text-sm tracking-[0.2em] uppercase hover:border-gold/50 hover:text-gold transition-all duration-300 rounded-lg"
            >
              Explore Collection
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-14 pt-10 border-t border-white/5">
            {[
              { num: '2K+', label: 'Happy Clients' },
              { num: '150+', label: 'Premium Pieces' },
              { num: '100%', label: 'Authentic' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-display font-bold text-2xl gold-text">{num}</div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-cream/40 uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-2">
        <span className="font-mono text-[9px] tracking-[0.3em] text-cream/30 uppercase rotate-90 origin-center translate-y-4">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold/30 to-transparent animate-pulse" />
        <ArrowDown size={12} className="text-gold/40" />
      </div>
    </section>
  );
};

export default Hero;
