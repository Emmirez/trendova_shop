import { useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alexandra V.",
    location: "New York, USA",
    rating: 5,
    text: "The quality of the velvet tracksuit is beyond my expectations. It feels like a second skin. Truly luxurious.",
    product: "Onyx Velour Tracksuit",
  },
  {
    id: 2,
    name: "James L.",
    location: "London, UK",
    rating: 5,
    text: "Trendova has redefined my wardrobe. The attention to detail in their blazers is impeccable. Worth every penny.",
    product: "Noir Utility Jacket",
  },
  {
    id: 3,
    name: "Amara D.",
    location: "Lagos, Nigeria",
    rating: 5,
    text: "I wore the Gold Crest Bomber to an event and I couldn't stop getting compliments. The craftsmanship is on another level.",
    product: "Gold Crest Bomber",
  },
  {
    id: 4,
    name: "Khalid M.",
    location: "Dubai, UAE",
    rating: 5,
    text: "The Sovereign Coat arrived perfectly packaged. The wool blend is rich, structured, and incredibly warm. A masterpiece.",
    product: "Sovereign Coat",
  },
  {
    id: 5,
    name: "Sofia R.",
    location: "Milan, Italy",
    rating: 5,
    text: "As someone who works in fashion, I have high standards. Trendova exceeds them. The finishing on every piece is flawless.",
    product: "Velvet Blazer",
  },
  {
    id: 6,
    name: "Denzel O.",
    location: "Toronto, Canada",
    rating: 5,
    text: "Ordered the Chrome Tech Set and it arrived in two days. Fits perfectly, looks incredible. Already ordered two more pieces.",
    product: "Chrome Tech Set",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-6 bg-white border-t border-obsidian/5">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
            Customer Reviews
          </span>
        </div>
        <h2
          className="font-display font-black text-obsidian leading-tight mb-16"
          style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
        >
          Voices of
          <span className="block italic gold-text">Elegance</span>
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col p-8 bg-[#fafaf9] border border-obsidian/5 hover:border-gold/20 hover:shadow-sm transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array(t.rating).fill(0).map((_, i) => (
                  <Star key={i} size={14} className="fill-gold stroke-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-display italic text-obsidian/70 text-base leading-relaxed flex-1 mb-8">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="border-t border-obsidian/5 pt-5">
                <p className="font-mono text-[11px] tracking-[0.3em] text-obsidian font-bold uppercase">
                  — {t.name}
                </p>
                <p className="font-mono text-[10px] tracking-[0.2em] text-gold/60 uppercase mt-1">
                  {t.location}
                </p>
                <p className="font-body text-[11px] text-obsidian/30 mt-1">
                  {t.product}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Average rating strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16 py-8 border-t border-obsidian/5">
          <div className="flex gap-1">
            {Array(5).fill(0).map((_, i) => (
              <Star key={i} size={18} className="fill-gold stroke-gold" />
            ))}
          </div>
          <p className="font-mono text-[11px] tracking-[0.3em] text-obsidian/50 uppercase">
            5.0 Average — Based on 2,400+ Reviews
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;