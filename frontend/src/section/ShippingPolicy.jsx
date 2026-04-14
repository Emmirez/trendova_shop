import { Link } from "react-router-dom";
import { Truck, Clock, Globe, Package, AlertCircle, RefreshCw } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const zones = [
  {
    zone: "Lagos (Same Day)",
    time: "Same day delivery",
    fee: "₦2,500",
    condition: "Orders placed before 2PM",
  },
  {
    zone: "Lagos (Next Day)",
    time: "1 business day",
    fee: "₦1,500",
    condition: "Orders placed after 2PM",
  },
  {
    zone: "Southwest Nigeria",
    time: "2–3 business days",
    fee: "₦3,000",
    condition: "Ogun, Oyo, Osun, Ondo, Ekiti",
  },
  {
    zone: "Other Nigerian States",
    time: "3–5 business days",
    fee: "₦4,000",
    condition: "All other states",
  },
  {
    zone: "West Africa",
    time: "5–7 business days",
    fee: "₦15,000",
    condition: "Ghana, Senegal, Côte d'Ivoire etc.",
  },
  {
    zone: "International",
    time: "7–14 business days",
    fee: "From ₦25,000",
    condition: "USA, UK, UAE, Europe and more",
  },
];

const highlights = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Free delivery on all Nigerian orders above ₦200,000.",
  },
  {
    icon: Clock,
    title: "Same Day Dispatch",
    desc: "Orders placed before 2PM WAT are dispatched the same business day.",
  },
  {
    icon: Globe,
    title: "28 Countries",
    desc: "We ship to 28 countries worldwide with full tracking.",
  },
  {
    icon: Package,
    title: "Luxury Packaging",
    desc: "Every order arrives in signature Trendova packaging, gift-ready.",
  },
];

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-6 border-b border-white/5">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(ellipse at 70% 40%, rgba(201,168,76,0.06) 0%, transparent 60%)`,
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
              Delivery
            </span>
          </div>
          <h1
            className="font-display font-black text-cream leading-tight mb-4"
            style={{ fontSize: "clamp(40px, 7vw, 80px)" }}
          >
            Shipping
            <span className="block italic gold-text">Policy</span>
          </h1>
          <p className="font-body text-cream/40 text-base max-w-xl leading-relaxed">
            We deliver luxury to your door. Here's everything you need to know
            about our shipping options, timelines, and fees.
          </p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cream/20 uppercase mt-4">
            Last updated: March 2026
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 border border-white/5 bg-charcoal/30 flex flex-col gap-3">
                <div className="w-9 h-9 border border-gold/20 flex items-center justify-center text-gold">
                  <Icon size={16} />
                </div>
                <h3 className="font-display font-semibold text-cream text-sm">{title}</h3>
                <p className="font-body text-cream/35 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Shipping zones table */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold" />
              <h2 className="font-display font-bold text-cream text-2xl">
                Shipping Zones & Rates
              </h2>
            </div>
            <div className="border border-white/5 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-charcoal/50">
                    {["Zone", "Delivery Time", "Fee", "Coverage"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left font-mono text-[9px] tracking-[0.25em] text-cream/30 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {zones.map((z, i) => (
                    <tr
                      key={z.zone}
                      className={`transition-colors hover:bg-white/2 ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}
                    >
                      <td className="px-5 py-4 font-display font-semibold text-cream text-sm">
                        {z.zone}
                      </td>
                      <td className="px-5 py-4 font-body text-cream/60 text-sm">
                        {z.time}
                      </td>
                      <td className="px-5 py-4 font-body text-gold text-sm font-semibold">
                        {z.fee}
                      </td>
                      <td className="px-5 py-4 font-body text-cream/30 text-xs">
                        {z.condition}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-mono text-[9px] tracking-[0.2em] text-cream/20 uppercase mt-3">
              * Free shipping on Nigerian orders above ₦200,000
            </p>
          </div>

          {/* Sections */}
          {[
            {
              title: "Order Processing",
              icon: Package,
              items: [
                "Orders are processed Monday through Saturday, excluding public holidays.",
                "Orders placed before 2PM WAT on business days are dispatched same day.",
                "Orders placed after 2PM or on weekends are dispatched the next business day.",
                "You will receive a dispatch confirmation email with tracking details once your order ships.",
                "During peak periods (new drops, sales), processing may take up to 2 business days.",
              ],
            },
            {
              title: "Tracking Your Order",
              icon: Truck,
              items: [
                "All orders come with a tracking number sent via email upon dispatch.",
                "You can also track your order on our website using your order number.",
                "International tracking is available for all countries we ship to.",
                "If your tracking shows no movement for more than 5 days, contact us immediately.",
              ],
            },
            {
              title: "International Shipping",
              icon: Globe,
              items: [
                "We currently ship to 28 countries. Contact us if your country is not listed.",
                "International orders may be subject to customs duties and import taxes.",
                "These charges are the responsibility of the recipient and are not included in our shipping fees.",
                "Customs clearance may cause delays beyond our estimated delivery times.",
                "We declare the full value on all customs forms. We do not undervalue packages.",
              ],
            },
            {
              title: "Damaged or Lost Packages",
              icon: AlertCircle,
              items: [
                "If your package arrives damaged, photograph the damage and contact us within 48 hours.",
                "For lost packages, contact us after 10 business days (domestic) or 21 days (international).",
                "We will work with our courier partners to investigate and resolve all claims.",
                "Replacement or refund will be issued upon confirmation of loss or damage.",
              ],
            },
            {
              title: "Returns Shipping",
              icon: RefreshCw,
              items: [
                "Return shipping is free for orders returned due to our error or product defects.",
                "For change-of-mind returns, the customer is responsible for return shipping costs.",
                "Please use a tracked shipping service for all returns. We are not responsible for lost returns.",
                "Returns must be initiated within 30 days of delivery.",
              ],
            },
          ].map(({ title, icon: Icon, items }) => (
            <div key={title}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 border border-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                  <Icon size={15} />
                </div>
                <h2 className="font-display font-bold text-cream text-xl">{title}</h2>
              </div>
              <ul className="space-y-3 pl-11">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1 h-1 bg-gold/40 rounded-full flex-shrink-0 mt-2" />
                    <p className="font-body text-cream/50 text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA */}
          <div className="p-8 border border-white/5 bg-charcoal/30 text-center">
            <h3 className="font-display font-bold text-cream text-xl mb-3">
              Questions about your delivery?
            </h3>
            <p className="font-body text-cream/40 text-sm mb-6">
              Our support team is available 7 days a week.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="mailto:shipping@trendova.com"
                className="px-8 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors"
              >
                Email Support
              </a>
              <Link
                to="/#track-order"
                className="px-8 py-3 border border-white/10 text-cream/50 font-mono text-[11px] tracking-[0.3em] uppercase hover:border-gold/30 hover:text-gold transition-all"
              >
                Track Order
              </Link>
            </div>
          </div>

          {/* Related */}
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms of Service", to: "/terms" },
              { label: "Contact Us", to: "/contact" },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="font-mono text-[10px] tracking-[0.3em] text-cream/30 uppercase hover:text-gold transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShippingPolicy;