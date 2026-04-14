import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How do I find my size?",
    a: "Each product page includes a detailed size guide. We recommend measuring your chest, waist, and hips and comparing with our size chart. If you're between sizes, we suggest sizing up for a relaxed fit or sizing down for a more tailored look.",
  },
  {
    q: "What is your return policy?",
    a: "We offer 30-day hassle-free returns on all items. Products must be unworn, unwashed, and in original packaging with tags attached. Simply contact our support team and we'll arrange a pickup at no extra cost.",
  },
  {
    q: "How long does delivery take?",
    a: "Same-day dispatch for orders placed before 2PM. Domestic delivery takes 2-3 business days. International orders arrive within 5-10 business days depending on location. Express options are available at checkout.",
  },
  {
    q: "Are your products authentic and certified?",
    a: "Every Trendova piece comes with a certificate of authenticity. We source all materials from certified suppliers and every item is inspected by hand before it leaves our studio. You'll always know it's real.",
  },
  {
    q: "Do you offer custom or bespoke pieces?",
    a: "Yes — our Trendova Premium tier offers bespoke pieces made to your exact measurements and specifications. This service is by appointment only. Contact us at hello@trendova.com to get started.",
  },
  {
    q: "How do I care for my Trendova pieces?",
    a: "Care instructions are included with every item. Most pieces require cold wash or dry clean only. Velour and velvet items should be stored hanging to preserve the fabric texture. Avoid direct sunlight for extended periods.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship to 28 countries worldwide. International shipping rates and delivery times are calculated at checkout based on your location. All international orders are fully tracked.",
  },
  {
    q: "Can I track my order?",
    a: "Absolutely. Once your order is dispatched you'll receive a tracking number via email. You can use this to monitor your delivery in real time through our courier partner's portal.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="py-24 px-6 bg-white border-t border-obsidian/5 overflow-hidden w-full">
      <div className="max-w-3xl mx-auto w-full">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-gold flex-shrink-0" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase whitespace-nowrap">
            Got Questions
          </span>
        </div>
        <h2
          className="font-display font-black text-obsidian leading-tight mb-16 break-words"
          style={{ fontSize: "clamp(32px, 8vw, 64px)" }}
        >
          Frequently
          <span className="block italic gold-text">Asked</span>
        </h2>

        {/* Accordion */}
        <div className="space-y-0 divide-y divide-obsidian/5">
          {faqs.map((faq, i) => (
            <div key={i} className="py-1">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 sm:gap-6 py-5 text-left group"
              >
                <span className="font-display font-semibold text-obsidian text-sm sm:text-base group-hover:text-gold transition-colors duration-200 flex-1 pr-2">
                  {faq.q}
                </span>
                <span className="flex-shrink-0 w-7 h-7 border border-obsidian/10 flex items-center justify-center text-obsidian/40 group-hover:border-gold/40 group-hover:text-gold transition-all duration-200">
                  {open === i ? <Minus size={13} /> : <Plus size={13} />}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  open === i ? "max-h-64 pb-5" : "max-h-0"
                }`}
              >
                <p className="font-body text-obsidian/50 text-xs sm:text-sm leading-relaxed pr-4">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-6 sm:p-8 bg-[#fafaf9] border border-obsidian/5 text-center">
          <p className="font-display font-semibold text-obsidian text-base sm:text-lg mb-2">
            Still have questions?
          </p>
          <p className="font-body text-obsidian/40 text-xs sm:text-sm mb-6">
            Our team is available 7 days a week to help.
          </p>
          
          <a
            href="mailto:hello@trendova.com"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-gold text-obsidian font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors duration-300 whitespace-nowrap rounded-lg"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;