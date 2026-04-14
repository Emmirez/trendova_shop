import { useState } from "react";

const categories = ["Tracksuits", "Couture", "Footwear"];

const sizeData = {
  Tracksuits: {
    headers: ["Size", "Chest (in)", "Waist (in)", "Hips (in)", "Length (in)"],
    rows: [
      ["XS", "32–34", "26–28", "34–36", "27"],
      ["S", "34–36", "28–30", "36–38", "28"],
      ["M", "36–38", "30–32", "38–40", "29"],
      ["L", "38–40", "32–34", "40–42", "30"],
      ["XL", "40–42", "34–36", "42–44", "31"],
      ["XXL", "42–44", "36–38", "44–46", "32"],
    ],
  },
  Couture: {
    headers: ["Size", "Chest (in)", "Waist (in)", "Hips (in)", "Shoulder (in)"],
    rows: [
      ["XS", "32–34", "24–26", "34–36", "14"],
      ["S", "34–36", "26–28", "36–38", "14.5"],
      ["M", "36–38", "28–30", "38–40", "15"],
      ["L", "38–40", "30–32", "40–42", "15.5"],
      ["XL", "40–42", "32–34", "42–44", "16"],
    ],
  },
  Footwear: {
    headers: ["EU", "UK", "US (M)", "US (W)", "CM"],
    rows: [
      ["37", "4", "5", "6.5", "23.5"],
      ["38", "5", "6", "7.5", "24"],
      ["39", "6", "7", "8.5", "25"],
      ["40", "6.5", "7.5", "9", "25.5"],
      ["41", "7", "8", "9.5", "26"],
      ["42", "8", "9", "10.5", "27"],
      ["43", "9", "10", "11.5", "28"],
      ["44", "9.5", "10.5", "12", "28.5"],
      ["45", "10.5", "11.5", "13", "29.5"],
    ],
  },
};

const SizeGuide = () => {
  const [active, setActive] = useState("Tracksuits");
  const data = sizeData[active];

  return (
    <section id="size-guide" className="py-24 px-6 bg-white border-t border-obsidian/5">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
            Fit Guide
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2
            className="font-display font-black text-obsidian leading-tight"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            Size
            <span className="block italic gold-text">Guide</span>
          </h2>
          <p className="font-body text-obsidian/40 text-sm max-w-xs leading-relaxed">
            All measurements are in inches unless stated. When between sizes, size up for a relaxed fit.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-8 ">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${
                active === cat
                  ? "bg-obsidian text-cream rounded-lg"
                  : "border border-obsidian/15 text-obsidian/50 hover:border-obsidian/40 hover:text-obsidian rounded-lg"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-obsidian/10">
                {data.headers.map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-left font-mono text-[10px] tracking-[0.2em] text-obsidian/40 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-obsidian/5 transition-colors hover:bg-gold/3 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#fafaf9]"
                  }`}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`py-3 px-4 font-body text-sm ${
                        j === 0
                          ? "font-mono font-bold text-obsidian tracking-wider"
                          : "text-obsidian/60"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip */}
        <div className="mt-8 p-5 bg-gold/5 border border-gold/15">
          <p className="font-mono text-[10px] tracking-[0.2em] text-gold/70 uppercase mb-1">
            Pro Tip
          </p>
          <p className="font-body text-obsidian/50 text-sm">
            Not sure about your size? Email us at{" "}
            <a href="mailto:fit@trendova.com" className="text-gold hover:underline">
              fit@trendova.com
            </a>{" "}
            with your measurements and we'll recommend the perfect fit.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SizeGuide;