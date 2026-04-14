import { useEffect, useRef } from "react";
import { Award, Users, Globe, Gem } from "lucide-react";

const stats = [
  { icon: Users, value: "12K+", label: "Global Clients" },
  { icon: Globe, value: "28", label: "Countries Reached" },
  { icon: Award, value: "6", label: "Years of Excellence" },
  { icon: Gem, value: "500+", label: "Premium Pieces" },
];

const AboutSection = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((child, i) => {
            setTimeout(() => child.classList.add("visible"), i * 120);
          });
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      className="py-28 px-6 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top label */}
        <div className="reveal flex items-center gap-3 mb-16">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
            Our Story
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <h2
              className="reveal font-display font-black text-cream leading-tight mb-8"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              Crafted for Those
              <span className="block italic gold-text">Who Demand More</span>
            </h2>

            <p className="reveal font-body text-cream/50 text-base leading-relaxed mb-6">
              Trendova was born from a singular obsession — the belief that
              luxury and streetwear don't have to be opposites. Founded in 2019,
              we set out to build pieces that live at the intersection of
              couture craftsmanship and modern culture.
            </p>

            <p className="reveal font-body text-cream/50 text-base leading-relaxed mb-10">
              Every tracksuit, every coat, every pair of shoes we produce is
              reviewed by hand before it reaches you. No shortcuts. No
              compromises. Just fashion made with intent, for people who wear it
              the same way.
            </p>

            <a
              href="/about"
              className="reveal group inline-flex items-center gap-3 px-8 py-4 border border-white/10 text-cream/70 font-mono text-[11px] tracking-[0.3em] uppercase hover:border-gold/40 hover:text-gold transition-all duration-300 rounded-lg"
            >
              Read Full Story
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </a>
          </div>

          {/* Right — visual + stats */}
          <div className="reveal">
            {/* Decorative box */}
            <div className="relative mb-10">
              <div className="aspect-[4/3] bg-smoke overflow-hidden">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `
                      radial-gradient(ellipse at 30% 60%, rgba(201,168,76,0.12) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.06) 0%, transparent 50%)
                    `,
                    backgroundColor: "#141414",
                  }}
                >
                  {/* Big decorative letter */}
                  <div
                    className="absolute inset-0 flex items-center justify-center font-display font-black select-none pointer-events-none"
                    style={{
                      fontSize: "clamp(180px, 25vw, 320px)",
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(201,168,76,0.07)",
                      lineHeight: 1,
                    }}
                  >
                    T
                  </div>

                  {/* Quote overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-obsidian/80 to-transparent">
                    <p className="font-display italic text-cream/60 text-lg leading-snug">
                      "Fashion is not just clothing.
                      <br />
                      It's the language you speak before you open your mouth."
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.3em] text-gold/50 uppercase mt-3">
                      — Trendova Founder
                    </p>
                  </div>
                </div>
              </div>

              {/* Gold corner accent */}
              <div className="absolute -top-3 -right-3 w-16 h-16 border-t-2 border-r-2 border-gold/30" />
              <div className="absolute -bottom-3 -left-3 w-16 h-16 border-b-2 border-l-2 border-gold/30" />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 border border-white/5 bg-charcoal/50"
                >
                  <div className="w-9 h-9 border border-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="font-display font-bold text-xl gold-text">
                      {value}
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.2em] text-cream/30 uppercase">
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
