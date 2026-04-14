import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle, decorativeLetter = "T" }) => {
  return (
    <div className="min-h-screen bg-obsidian flex overflow-x-hidden">
      {/* Left — decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.05) 0%, transparent 50%)
            `,
            backgroundColor: "#0D0A07",
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg, transparent, transparent 40px,
              rgba(201,168,76,0.3) 40px, rgba(201,168,76,0.3) 41px
            )`,
          }}
        />
        {/* Decorative letter */}
        <div
          className="absolute top-1/2 -translate-y-1/2 right-0 font-display font-black select-none overflow-hidden pointer-events-none"
          style={{
            fontSize: "clamp(300px, 35vw, 500px)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(201,168,76,0.06)",
            lineHeight: 1,
            right: "-5%",
          }}
        >
          {decorativeLetter}
        </div>

        {/* Logo */}
        <div className="relative z-10 p-12">
          <Link to="/" className="flex flex-col leading-none group">
            <span className="font-display text-2xl font-bold tracking-wider text-cream group-hover:text-gold transition-colors duration-300">
              TRENDOVA
            </span>
            <span className="font-mono text-[9px] tracking-[0.4em] text-gold uppercase">
              Premium Shop
            </span>
          </Link>
        </div>

        {/* Bottom content */}
        <div className="relative z-10 mt-auto p-12">
          <h2
            className="font-display font-black text-cream leading-tight mb-4"
            style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="font-body text-cream/40 text-base leading-relaxed max-w-sm">
              {subtitle}
            </p>
          )}

          {/* Decorative gold line */}
          <div className="flex items-center gap-3 mt-8">
            <div className="w-12 h-px bg-gold/40" />
            <span className="font-mono text-[9px] tracking-[0.4em] text-gold/50 uppercase">
              Trendova
            </span>
          </div>
        </div>
      </div>

      {/* Right — content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex flex-col leading-none mb-10 lg:hidden">
            <span className="font-display text-xl font-bold tracking-wider text-cream">
              TRENDOVA
            </span>
            <span className="font-mono text-[9px] tracking-[0.4em] text-gold uppercase">
              Premium Shop
            </span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;