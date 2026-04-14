import { ExternalLink, Download } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const coverage = [
  {
    publication: "TechCabal",
    title: "How Trendova is redefining luxury fashion in Africa",
    date: "February 2026",
    type: "Feature",
    url: "#",
  },
  {
    publication: "Business Day",
    title: "Trendova's ₦500M valuation marks a new era for Nigerian fashion",
    date: "January 2026",
    type: "News",
    url: "#",
  },
  {
    publication: "Vanguard",
    title: "The tracksuit that sold out in 48 hours — inside Trendova",
    date: "December 2025",
    type: "Feature",
    url: "#",
  },
  {
    publication: "The Guardian Nigeria",
    title: "Trendova: Where street culture meets couture",
    date: "November 2025",
    type: "Interview",
    url: "#",
  },
  {
    publication: "Forbes Africa",
    title: "30 Under 30: The founders building Africa's luxury brands",
    date: "October 2025",
    type: "Award",
    url: "#",
  },
  {
    publication: "Punch",
    title: "Inside Lagos' most talked-about fashion brand",
    date: "September 2025",
    type: "Feature",
    url: "#",
  },
];

const assets = [
  { name: "Trendova Logo Pack", format: "PNG + SVG", size: "2.4 MB" },
  { name: "Brand Guidelines", format: "PDF", size: "8.1 MB" },
  { name: "Product Photography", format: "ZIP (High-Res)", size: "124 MB" },
  { name: "Founder Headshots", format: "ZIP (High-Res)", size: "18 MB" },
  { name: "Press Release — March 2026", format: "PDF", size: "1.2 MB" },
  { name: "Fact Sheet", format: "PDF", size: "0.8 MB" },
];

const typeColors = {
  Feature: "text-gold/70 border-gold/20 bg-gold/5",
  News: "text-blue-400/70 border-blue-400/20 bg-blue-400/5",
  Interview: "text-purple-400/70 border-purple-400/20 bg-purple-400/5",
  Award: "text-green-400/70 border-green-400/20 bg-green-400/5",
};

const Press = () => {
  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-6 border-b border-white/5 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)`,
          }}
        />
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 font-display font-black select-none overflow-hidden pointer-events-none"
          style={{
            fontSize: "clamp(200px, 30vw, 400px)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(201,168,76,0.04)",
            lineHeight: 1,
            right: "-3%",
          }}
        >
          P
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
              Media
            </span>
          </div>
          <h1
            className="font-display font-black text-cream leading-tight mb-6"
            style={{ fontSize: "clamp(48px, 8vw, 100px)" }}
          >
            Press &
            <span className="block italic gold-text">Media.</span>
          </h1>
          <p className="font-body text-cream/40 text-lg max-w-2xl leading-relaxed">
            For press enquiries, interview requests, or media assets, contact
            our press team at{" "}
            <a
              href="mailto:press@trendova.com"
              className="text-gold hover:underline"
            >
              press@trendova.com
            </a>
            .
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-20">

          {/* Press contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Press Enquiries", value: "press@trendova.com", sub: "Response within 24 hours" },
              { label: "Interview Requests", value: "media@trendova.com", sub: "CEO & Founder availability" },
              { label: "Image Requests", value: "creative@trendova.com", sub: "High-res assets available" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="p-6 border border-white/5 bg-charcoal/30">
                <p className="font-mono text-[9px] tracking-[0.3em] text-gold/50 uppercase mb-2">{label}</p>
                <a
                  href={`mailto:${value}`}
                  className="font-display font-semibold text-cream hover:text-gold transition-colors"
                >
                  {value}
                </a>
                <p className="font-body text-cream/25 text-xs mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {/* Press coverage */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-gold" />
              <h2 className="font-display font-bold text-cream text-2xl">
                Press Coverage
              </h2>
            </div>
            <div className="space-y-3">
              {coverage.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  className="group flex items-center justify-between gap-6 p-5 border border-white/5 bg-charcoal/20 hover:border-gold/15 hover:bg-charcoal/40 transition-all duration-300"
                >
                
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-gold/60 uppercase">
                        {item.publication}
                      </span>
                      <span className={`font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border ${typeColors[item.type]}`}>
                        {item.type}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-cream/80 group-hover:text-cream transition-colors text-base leading-tight truncate">
                      {item.title}
                    </h3>
                    <p className="font-mono text-[9px] tracking-[0.2em] text-cream/20 uppercase mt-1">
                      {item.date}
                    </p>
                  </div>
                  <ExternalLink
                    size={16}
                    className="text-cream/20 group-hover:text-gold transition-colors flex-shrink-0"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Media assets */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-gold" />
              <h2 className="font-display font-bold text-cream text-2xl">
                Media Assets
              </h2>
            </div>
            <p className="font-body text-cream/40 text-sm mb-6 max-w-xl leading-relaxed">
              Download official Trendova brand assets for editorial use. Please
              review our brand guidelines before use. All assets are for press
              and editorial purposes only.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {assets.map((asset) => (
                <button
                  key={asset.name}
                  className="group flex items-center justify-between p-5 border border-white/5 bg-charcoal/20 hover:border-gold/20 hover:bg-charcoal/40 transition-all duration-300 text-left"
                >
                  <div>
                    <p className="font-display font-semibold text-cream/80 group-hover:text-cream text-sm transition-colors">
                      {asset.name}
                    </p>
                    <p className="font-mono text-[9px] tracking-[0.2em] text-cream/25 uppercase mt-1">
                      {asset.format} · {asset.size}
                    </p>
                  </div>
                  <Download
                    size={15}
                    className="text-cream/20 group-hover:text-gold transition-colors flex-shrink-0 ml-4"
                  />
                </button>
              ))}
            </div>
            <p className="font-mono text-[9px] tracking-[0.2em] text-cream/15 uppercase mt-4">
              For access to full asset library, contact creative@trendova.com
            </p>
          </div>

          {/* Brand facts */}
          <div className="p-10 border border-white/5 bg-charcoal/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-gold" />
              <h2 className="font-display font-bold text-cream text-xl">
                Quick Facts
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "2019", label: "Founded" },
                { value: "Lagos", label: "Headquarters" },
                { value: "28", label: "Countries Shipped To" },
                { value: "12K+", label: "Customers Worldwide" },
                { value: "45+", label: "Products" },
                { value: "5", label: "Categories" },
                { value: "₦500M+", label: "Est. Valuation" },
                { value: "100%", label: "Authentic" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display font-black gold-text text-2xl mb-1">{value}</p>
                  <p className="font-mono text-[9px] tracking-[0.2em] text-cream/30 uppercase">{label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Press;