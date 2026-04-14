/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Award, Users, Globe, Gem } from "lucide-react";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import Collections from "../../components/Collections";
import CartSidebar from "../../components/CartSidebar";
import Footer from "../../components/Footer";
import Testimonials from "../../section/Testimonials";
import FAQ from "../../section/FAQ";
import ShopByCategory from "../../section/ShopByCategory";
import PressStrip from "../../section/PressStrip";
import Newsletter from "../../section/Newsletter";
import Lookbook from "../../section/Lookbook";
import CountdownTimer from "../../section/CountdownTimer";
import TrackOrder from "../../section/TrackOrder";
import SizeGuide from "../../section/SizeGuide";
import InstagramFeed from "../../section/InstagramFeed";
import CompleteTheLook from "../../section/CompleteTheLook";

const stats = [
  { icon: Users, value: "12K+", label: "Global Clients" },
  { icon: Globe, value: "28", label: "Countries Reached" },
  { icon: Award, value: "6", label: "Years of Excellence" },
  { icon: Gem, value: "500+", label: "Premium Pieces" },
];

const Landing = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden theme-bg">
      <Navbar />
      <Hero />
      <Features />
      <Collections />
      <ShopByCategory />
      <CompleteTheLook />
      <SizeGuide />
      <InstagramFeed />
      <TrackOrder />
      <PressStrip />
      <Lookbook />

      {/* About Section */}
      <section
        id="about"
        className="py-28 px-6 bg-white border-t border-obsidian/5 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-8 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
              Our Story
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — text */}
            <div className="w-full">
              <h2
                className="font-display font-black text-obsidian leading-tight mb-8"
                style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
              >
                Crafted for Those
                <span className="block italic gold-text">Who Demand More</span>
              </h2>

              <p className="font-body text-obsidian/60 text-base leading-relaxed mb-6">
                Trendova was born from a singular obsession — the belief that
                luxury and streetwear don't have to be opposites. Founded in
                2019, we set out to build pieces that live at the intersection
                of couture craftsmanship and modern culture.
              </p>

              <p className="font-body text-obsidian/60 text-base leading-relaxed mb-10">
                Every tracksuit, every coat, every pair of shoes we produce is
                reviewed by hand before it reaches you. No shortcuts. No
                compromises. Just fashion made with intent, for people who wear
                it the same way.
              </p>

              <Link
                to="/about"
                className="group inline-flex items-center gap-3 px-8 py-4 border border-obsidian/15 text-obsidian/70 font-mono text-[11px] tracking-[0.3em] uppercase hover:border-gold/40 hover:text-gold transition-all duration-300 rounded-lg"
              >
                Read Full Story
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  &#8594;
                </span>
              </Link>
            </div>

            {/* Right — visual + stats */}
            <div className="w-full overflow-hidden">
              <div className="relative mb-10">
                <div className="aspect-[4/3] bg-[#f5f0e8] overflow-hidden relative">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `
                      radial-gradient(ellipse at 30% 60%, rgba(201,168,76,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.08) 0%, transparent 50%)
                    `,
                      backgroundColor: "#f5f0e8",
                    }}
                  >
                    <div
                      className="absolute inset-0 flex items-center justify-center font-display font-black select-none pointer-events-none"
                      style={{
                        fontSize: "clamp(120px, 20vw, 320px)",
                        color: "transparent",
                        WebkitTextStroke: "1px rgba(201,168,76,0.15)",
                        lineHeight: 1,
                        maxWidth: "100%",
                        overflow: "hidden",
                      }}
                    >
                      T
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 bg-gradient-to-t from-white/90 to-transparent">
                      <p className="font-display italic text-obsidian/60 text-sm sm:text-lg leading-snug">
                        "Fashion is not just clothing.
                        <br />
                        It's the language you speak before you open your mouth."
                      </p>
                      <p className="font-mono text-[10px] tracking-[0.3em] text-gold/60 uppercase mt-3">
                        — Trendova Founder
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 w-12 h-12 sm:w-16 sm:h-16 border-t-2 border-r-2 border-gold/30" />
                <div className="absolute -bottom-3 -left-3 w-12 h-12 sm:w-16 sm:h-16 border-b-2 border-l-2 border-gold/30" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 ">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-obsidian/8 bg-obsidian/3 w-full"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display font-bold text-lg sm:text-xl gold-text truncate">
                        {value}
                      </div>
                      <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] text-obsidian/40 uppercase truncate">
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

      <Testimonials />
      <FAQ />
      <CountdownTimer />

      {/* Brand strip */}
      <section className="py-16 px-6 border-y theme-border overflow-hidden w-full theme-bg-card">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-px bg-gold/30" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase whitespace-nowrap">
              The Trendova Promise
            </span>
            <div className="w-12 h-px bg-gold/30" />
          </div>
          <div className="relative px-4 overflow-hidden w-full">
            <h2
              className="font-display font-black text-center select-none break-words w-full"
              style={{
                fontSize: "clamp(40px, 15vw, 180px)",
                color: "transparent",
                WebkitTextStroke: "1px rgba(201,168,76,0.12)",
                lineHeight: 1,
                wordBreak: "break-word",
                maxWidth: "100%",
              }}
            >
              EXCELLENCE
            </h2>
            <p className="absolute inset-0 flex items-center justify-center font-body theme-text-secondary text-xs sm:text-sm md:text-base max-w-lg mx-auto text-center px-4 pointer-events-none">
              Every stitch tells a story of craftsmanship, every fabric a
              testament to quality. This is Trendova — where fashion becomes
              art.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 overflow-hidden w-full bg-obsidian">
        <div className="max-w-4xl mx-auto text-center w-full">
          <span className="font-mono text-[10px] tracking-[0.5em] text-gold/60 uppercase whitespace-nowrap">
            Limited Collection
          </span>
          <h2
            className="font-display font-black text-cream mt-4 mb-6 leading-tight break-words"
            style={{ fontSize: "clamp(28px, 8vw, 80px)" }}
          >
            The <span className="italic gold-text">Sovereign</span>
            <br />
            Series is Live
          </h2>
          <p className="font-body text-cream/40 text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed px-4">
            Our most exclusive capsule collection yet. Only 50 pieces of each
            style, hand-numbered and certified. Once they're gone, they're gone.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#collections"
              className="px-6 sm:px-10 py-4 bg-gold text-obsidian font-mono text-[10px] sm:text-[12px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors duration-300 whitespace-nowrap rounded-lg"
            >
              Shop the Drop
            </a>
            <a
              href="#collections"
              className="px-6 sm:px-10 py-4 border border-white/10 text-cream/60 font-mono text-[10px] sm:text-[12px] tracking-[0.3em] uppercase hover:border-gold/30 hover:text-gold transition-all duration-300 whitespace-nowrap rounded-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
      <Newsletter />
      <Footer />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Landing;
