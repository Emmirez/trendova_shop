import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-24 px-6 bg-obsidian">
      <div className="max-w-3xl mx-auto text-center">
        {/* Tag */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-px bg-gold/30" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold/60 uppercase">
            Inner Circle
          </span>
          <div className="w-12 h-px bg-gold/30" />
        </div>

        <h2
          className="font-display font-black text-cream leading-tight mb-4"
          style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
        >
          Be First.
          <span className="block italic gold-text">Always.</span>
        </h2>

        <p className="font-body text-cream/40 text-base mb-12 max-w-md mx-auto leading-relaxed">
          Exclusive drops, private sales, and style edits delivered straight to
          your inbox. No spam. Just fashion worth your attention.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border border-gold/30 flex items-center justify-center text-gold text-xl">
              ✓
            </div>
            <p className="font-mono text-[11px] tracking-[0.3em] text-gold/70 uppercase">
              You're in. Welcome to the circle.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              id="newsletter-email"
              name="newsletter-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-cream placeholder-cream/20 font-body text-sm focus:outline-none focus:border-gold/30 transition-colors rounded-lg"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors duration-300 whitespace-nowrap rounded-lg"
            >
              Join Now
            </button>
          </form>
        )}

        <p className="font-mono text-[9px] tracking-[0.2em] text-cream/15 uppercase mt-6">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;