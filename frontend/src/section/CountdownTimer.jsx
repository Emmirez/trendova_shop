import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const getTimeLeft = () => {
    const deadline = new Date();
    deadline.setHours(23, 59, 59, 0);
    const now = new Date();
    const diff = deadline - now;
    return {
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section className="py-16 px-6 bg-obsidian border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 border border-gold/15">

          {/* Left */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 uppercase mb-2">
              Flash Sale — Ends Tonight
            </p>
            <h3 className="font-display font-black text-cream text-2xl md:text-3xl leading-tight">
              Up to 30% Off
              <span className="block italic gold-text">Selected Pieces</span>
            </h3>
            <p className="font-body text-cream/30 text-sm mt-3">
              Sale ends at midnight. No extensions. No exceptions.
            </p>
          </div>

          {/* Right — timer + CTA */}
          <div className="flex flex-col items-center gap-6">
            {/* Timer */}
            <div className="flex items-center gap-3">
              {[
                { value: pad(time.hours), label: "HRS" },
                { value: pad(time.minutes), label: "MIN" },
                { value: pad(time.seconds), label: "SEC" },
              ].map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="font-mono font-bold text-2xl text-cream">
                        {value}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-cream/30 uppercase mt-1">
                      {label}
                    </span>
                  </div>
                  {i < 2 && (
                    <span className="font-mono text-xl text-gold/40 mb-4">:</span>
                  )}
                </div>
              ))}
            </div>
             <a
            
              href="#collections"
              className="px-8 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors duration-300 whitespace-nowrap rounded-lg"
            >
              Shop the Sale
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;