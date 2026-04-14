import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import Header from "../../components/Header";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // await authService.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex overflow-x-hidden">
      <Header />
      <div className="pt-20 lg:pt-32 w-full flex">
        {/* Left — decorative */}
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
            className="absolute top-1/2 -translate-y-1/2 font-display font-black select-none overflow-hidden pointer-events-none"
            style={{
              fontSize: "clamp(300px, 35vw, 500px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(201,168,76,0.06)",
              lineHeight: 1,
              right: "-5%",
            }}
          >
            F
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
              Reset your
              <span className="block italic gold-text">Password.</span>
            </h2>
            <p className="font-body text-cream/40 text-base leading-relaxed max-w-sm">
              Enter your email address and we'll send you a secure link to reset
              your password within minutes.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <div className="w-12 h-px bg-gold/40" />
              <span className="font-mono text-[9px] tracking-[0.4em] text-gold/50 uppercase">
                Trendova
              </span>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Back link */}
            <Link
              to="/login"
              className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-cream/30 uppercase hover:text-gold transition-colors mb-10"
            >
              <ArrowLeft size={12} />
              Back to Login
            </Link>

            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-gold" />
                <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
                  Account Recovery
                </span>
              </div>
              <h1 className="font-display font-black text-cream text-4xl leading-tight">
                Forgot Password
              </h1>
              <p className="font-body text-cream/40 text-sm mt-2">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Success state */}
            {sent ? (
              <div className="flex flex-col items-center text-center gap-6 py-8">
                <div className="w-20 h-20 border border-gold/30 bg-gold/5 flex items-center justify-center">
                  <Mail size={32} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-cream text-2xl mb-3">
                    Check your inbox
                  </h3>
                  <p className="font-body text-cream/40 text-sm leading-relaxed mb-2">
                    We sent a password reset link to
                  </p>
                  <p className="font-mono text-[12px] tracking-[0.1em] text-gold">
                    {email}
                  </p>
                  <p className="font-body text-cream/25 text-xs mt-3">
                    Check your spam folder if you don't see it within a few
                    minutes.
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/5" />

                <div className="flex flex-col items-center gap-3 w-full">
                  <button
                    onClick={() => {
                      setSent(false);
                      setEmail("");
                    }}
                    className="font-mono text-[10px] tracking-[0.3em] text-cream/30 uppercase hover:text-gold transition-colors"
                  >
                    Try a different email
                  </button>
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center py-4 border border-white/10 text-cream/50 font-mono text-[11px] tracking-[0.3em] uppercase hover:border-gold/30 hover:text-gold transition-all duration-300"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Error */}
                {error && (
                  <div className="mb-6 p-4 border border-red-500/20 bg-red-500/5">
                    <p className="font-mono text-[11px] tracking-[0.2em] text-red-400 uppercase">
                      {error}
                    </p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="reset-email"
                      name="reset-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 px-4 py-4 text-cream placeholder-cream/20 font-body text-sm focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                    />
                    <p className="font-body text-cream/25 text-xs mt-2">
                      Enter the email address associated with your Trendova
                      account.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gold text-obsidian font-mono text-[12px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                    ) : (
                      <Mail size={15} />
                    )}
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-cream/20 uppercase">
                    or
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                <Link
                  to="/register"
                  className="w-full flex items-center justify-center py-4 border border-white/10 text-cream/50 font-mono text-[11px] tracking-[0.3em] uppercase hover:border-gold/30 hover:text-gold transition-all duration-300 rounded-lg"
                >
                  Create New Account
                </Link>

                {/* Trademark footer */}
                <div className="mt-12 pt-6 border-t border-white/5">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-px bg-gold/30" />
                      <span className="font-display font-bold text-cream/20 text-xs tracking-widest">
                        TRENDOVA™
                      </span>
                      <div className="w-4 h-px bg-gold/30" />
                    </div>
                    <p className="font-mono text-[9px] tracking-[0.2em] text-cream/15 uppercase text-center">
                      © {new Date().getFullYear()} Trendova Shop. All rights
                      reserved.
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <Link
                        to="/privacy"
                        className="font-mono text-[9px] tracking-[0.15em] text-cream/15 uppercase hover:text-gold/40 transition-colors"
                      >
                        Privacy
                      </Link>
                      <span className="text-cream/10">·</span>
                      <Link
                        to="/terms"
                        className="font-mono text-[9px] tracking-[0.15em] text-cream/15 uppercase hover:text-gold/40 transition-colors"
                      >
                        Terms
                      </Link>
                      <span className="text-cream/10">·</span>
                      <Link
                        to="/contact"
                        className="font-mono text-[9px] tracking-[0.15em] text-cream/15 uppercase hover:text-gold/40 transition-colors"
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
