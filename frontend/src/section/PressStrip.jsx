const publications = [
  { name: "VOGUE", style: "font-display font-black tracking-widest text-2xl" },
  { name: "GQ", style: "font-display font-black tracking-widest text-3xl" },
  { name: "HYPEBEAST", style: "font-mono font-bold tracking-[0.2em] text-lg" },
  { name: "COMPLEX", style: "font-display font-black tracking-wider text-2xl" },
  { name: "ESSENCE", style: "font-display italic font-bold text-2xl" },
  { name: "HIGHSNOBIETY", style: "font-mono font-bold tracking-[0.15em] text-sm" },
];

const PressStrip = () => {
  return (
    <section className="py-16 px-6 bg-[#fafaf9] border-t border-obsidian/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-px bg-obsidian/10" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-obsidian/30 uppercase">
            As Featured In
          </span>
          <div className="w-12 h-px bg-obsidian/10" />
        </div>

        {/* Logos */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
          {publications.map((pub) => (
            <div
              key={pub.name}
              className="flex items-center justify-center opacity-20 hover:opacity-60 transition-opacity duration-300 cursor-default"
            >
              <span className={`${pub.style} text-obsidian`}>{pub.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PressStrip;