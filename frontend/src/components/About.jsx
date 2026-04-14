import { useEffect, useRef } from 'react';
import { Award, Users, Globe, Gem, Heart, Zap, Shield, Leaf } from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';

const team = [
  {
    name: 'Damian Okafor',
    role: 'Founder & Creative Director',
    bio: 'Former lead designer at two Paris houses. Left to build something that felt real.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    name: 'Zara Mensah',
    role: 'Head of Couture',
    bio: 'Trained in Milan. Obsessed with construction, proportion, and the perfect seam.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
  },
  {
    name: 'Kole Adeyemi',
    role: 'Brand & Culture',
    bio: 'Bridges the gap between luxury fashion and street culture. No one does it better.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  },
  {
    name: 'Amara Diallo',
    role: 'Head of Operations',
    bio: 'Makes sure every piece arrives perfect. Every time. No excuses.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
];

const values = [
  { icon: Gem, title: 'Uncompromising Quality', desc: 'Every material is sourced from certified suppliers. Every piece is inspected by hand before it leaves our studio.' },
  { icon: Heart, title: 'Made with Intent', desc: "We don't make things because trends demand it. We make things because we believe in them." },
  { icon: Shield, title: 'Authenticity First', desc: "Every Trendova piece comes with a certificate of authenticity. You'll always know it's real." },
  { icon: Zap, title: 'Culture-Driven', desc: 'We move at the speed of culture — not the fashion calendar. Drops happen when they\'re ready.' },
  { icon: Globe, title: 'Global Reach', desc: 'From Lagos to London, Dubai to New York — Trendova ships to 28 countries worldwide.' },
  { icon: Leaf, title: 'Responsible Luxury', desc: "Sustainable sourcing, ethical manufacturing, minimal waste. Luxury shouldn't cost the earth." },
];

const timeline = [
  { year: '2019', title: 'The Beginning', desc: 'Trendova launched with a single tracksuit and a vision. Sold out in 48 hours.' },
  { year: '2020', title: 'First Couture Drop', desc: 'Introduced the first couture line. 12 pieces. Handmade. Gone in a day.' },
  { year: '2021', title: 'Going Global', desc: 'Expanded shipping to 15 countries. The world was ready.' },
  { year: '2022', title: 'The Flagship Store', desc: 'Opened our first physical space in Lagos. A studio, a showroom, a community.' },
  { year: '2023', title: 'Sovereign Series', desc: 'Our most limited, most coveted collection to date. 50 pieces. 50 stories.' },
  { year: '2024', title: 'Footwear Launch', desc: 'Stepped into footwear with the Onyx Leather Sneaker. Sold out in 6 hours.' },
  { year: '2025', title: 'Trendova Premium', desc: 'Launched our ultra-luxury tier. Bespoke pieces. By appointment only.' },
];

const About = () => {
  const heroRef = useRef(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    setTimeout(() => {
      el.style.transition = 'opacity 1s ease, transform 1s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);

    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
        }
      }),
      { threshold: 0.1 }
    );
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      {/* ── HERO — dark ─────────────────────────────────────── */}
      <section className="relative py-36 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.07) 0%, transparent 60%),
              radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.04) 0%, transparent 50%)
            `
          }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 font-display font-black select-none overflow-hidden"
            style={{
              fontSize: 'clamp(200px, 30vw, 500px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(201,168,76,0.04)',
              lineHeight: 1,
              right: '-3%',
            }}
          >
            A
          </div>
        </div>

        <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">About Trendova</span>
          </div>
          <h1 className="font-display font-black text-cream leading-tight mb-8"
            style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>
            We Don't Follow
            <span className="block italic gold-text">Trends. We Set Them.</span>
          </h1>
          <p className="font-body text-cream/50 text-lg max-w-2xl leading-relaxed">
            Trendova is a premium fashion house built at the intersection of luxury craftsmanship
            and street culture. Every piece we create is a statement — not a suggestion.
          </p>
        </div>
      </section>

      {/* ── STORY — white ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-b border-obsidian/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="reveal flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-gold" />
              <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">The Story</span>
            </div>
            <h2 className="reveal font-display font-black text-obsidian text-4xl md:text-5xl leading-tight mb-8">
              Born from Obsession,
              <span className="block italic gold-text">Built on Excellence</span>
            </h2>
            <div className="space-y-5">
              <p className="reveal font-body text-obsidian/60 leading-relaxed">
                It started in a small Lagos studio in 2019. No investors, no press coverage — just
                a founder with a sketchbook, a relentless standard, and a belief that African luxury
                fashion deserved a global stage.
              </p>
              <p className="reveal font-body text-obsidian/60 leading-relaxed">
                The first tracksuit sold out in 48 hours. The second collection doubled the waitlist.
                By 2021, Trendova was shipping to 15 countries. Not because of a marketing budget —
                because the product spoke for itself.
              </p>
              <p className="reveal font-body text-obsidian/60 leading-relaxed">
                Today we operate across fashion, footwear, and accessories. The studio is bigger.
                The team is stronger. But the obsession hasn't changed — every piece still has to
                earn its place in your wardrobe.
              </p>
            </div>
          </div>

          <div className="reveal relative">
            <div className="aspect-square bg-[#f5f0e8] overflow-hidden relative">
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `radial-gradient(ellipse at 40% 40%, rgba(201,168,76,0.12) 0%, transparent 70%)`,
                backgroundColor: '#f5f0e8',
              }} />
              <div
                className="absolute inset-0 flex items-center justify-center font-display font-black select-none overflow-hidden"
                style={{
                  fontSize: '320px',
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(201,168,76,0.12)',
                  lineHeight: 1,
                }}
              >
                T
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white/90 to-transparent">
                <p className="font-display italic text-obsidian/60 text-xl">"Excellence isn't a finish line. It's the only way we work."</p>
                <p className="font-mono text-[10px] tracking-[0.3em] text-gold/60 uppercase mt-3">— Damian Okafor, Founder</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 border-t-2 border-r-2 border-gold/25" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-b-2 border-l-2 border-gold/25" />
          </div>
        </div>
      </section>

      {/* ── VALUES — dark ───────────────────────────────────── */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="reveal flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">What We Stand For</span>
          </div>
          <h2 className="reveal font-display font-black text-cream text-4xl md:text-5xl leading-tight mb-16">
            Our <span className="italic gold-text">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="reveal group p-8 border border-white/5 bg-charcoal/30 hover:border-gold/20 hover:bg-charcoal/60 transition-all duration-300">
                <div className="w-10 h-10 border border-gold/20 flex items-center justify-center text-gold mb-6 group-hover:border-gold/40 transition-colors">
                  <Icon size={18} />
                </div>
                <h3 className="font-display font-semibold text-cream text-lg mb-3">{title}</h3>
                <p className="font-body text-cream/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE — white ────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-b border-obsidian/5">
        <div className="max-w-7xl mx-auto">
          <div className="reveal flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">The Journey</span>
          </div>
          <h2 className="reveal font-display font-black text-obsidian text-4xl md:text-5xl leading-tight mb-16">
            From Studio to <span className="italic gold-text">Global Stage</span>
          </h2>

          <div className="relative">
            <div className="absolute left-[11px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-gold/10 to-transparent" />
            <div className="space-y-12">
              {timeline.map(({ year, title, desc }, i) => (
                <div
                  key={year}
                  className={`reveal relative flex gap-8 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="absolute left-0 md:left-1/2 top-1.5 w-6 h-6 -translate-x-[2px] md:-translate-x-3 border-2 border-gold/40 bg-white flex items-center justify-center z-10">
                    <div className="w-2 h-2 bg-gold rounded-full" />
                  </div>
                  <div className={`pl-12 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <span className="font-mono text-[11px] tracking-[0.3em] text-gold/60 uppercase">{year}</span>
                    <h3 className="font-display font-bold text-obsidian text-xl mt-1 mb-2">{title}</h3>
                    <p className="font-body text-obsidian/40 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM — white ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-b border-obsidian/5">
        <div className="max-w-7xl mx-auto">
          <div className="reveal flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">The People</span>
          </div>
          <h2 className="reveal font-display font-black text-obsidian text-4xl md:text-5xl leading-tight mb-16">
            Meet the <span className="italic gold-text">Team</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, bio, image }) => (
              <div key={name} className="reveal group">
                <div className="aspect-square overflow-hidden mb-5 relative border border-obsidian/5 group-hover:border-gold/20 transition-colors duration-300">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-display font-semibold text-obsidian text-lg">{name}</h3>
                <p className="font-mono text-[10px] tracking-[0.2em] text-gold/60 uppercase mt-1 mb-3">{role}</p>
                <p className="font-body text-obsidian/40 text-sm leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA dark  */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="reveal flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-gold/30" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold/50 uppercase">Join the Movement</span>
            <div className="w-12 h-px bg-gold/30" />
          </div>
          <h2 className="reveal font-display font-black text-cream text-4xl md:text-5xl leading-tight mb-6">
            Ready to Wear
            <span className="block italic gold-text">Trendova?</span>
          </h2>
          <p className="reveal font-body text-cream/40 mb-10 leading-relaxed">
            Explore the full collection and find your next statement piece.
          </p>
          <div className="reveal flex flex-wrap gap-4 justify-center">
            <a href="/#collections" className="px-10 py-4 bg-gold text-obsidian font-mono text-[12px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors duration-300 rounded-lg">
              Shop Now
            </a>
            <a href="mailto:hello@trendova.com" className="px-10 py-4 border border-white/10 text-cream/60 font-mono text-[12px] tracking-[0.3em] uppercase hover:border-gold/30 hover:text-gold transition-all duration-300 rounded-lg">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default About;