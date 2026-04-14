import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Header from "../../components/Header";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(form);
      const redirect =
        from || (user.role === "user" ? "/dashboard" : "/admin/dashboard");
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex overflow-x-hidden">
      <Header />
      <div className="pt-20 lg:pt-32 w-full flex">
        {/* Left — decorative */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
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
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 font-display font-black select-none overflow-hidden"
            style={{
              fontSize: "clamp(300px, 35vw, 500px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(201,168,76,0.06)",
              lineHeight: 1,
              right: "-5%",
            }}
          >
            T
          </div>
          <div className="relative z-10 flex flex-col justify-end p-16">
            <Link to="/" className="flex flex-col leading-none mb-auto mt-12">
              <span className="font-display text-2xl font-bold tracking-wider text-cream">
                TRENDOVA
              </span>
              <span className="font-mono text-[9px] tracking-[0.4em] text-gold uppercase">
                Premium Shop
              </span>
            </Link>
            <div>
              <h2 className="font-display font-black text-cream text-5xl leading-tight mb-4">
                Welcome
                <span className="block italic gold-text">Back.</span>
              </h2>
              <p className="font-body text-cream/40 text-base leading-relaxed max-w-sm">
                Sign in to access your orders, wishlist, and exclusive member
                benefits.
              </p>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-gold" />
                <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
                  Member Access
                </span>
              </div>
              <h1 className="font-display font-black text-cream text-4xl leading-tight">
                Sign In
              </h1>
              <p className="font-body text-cream/40 text-sm mt-2">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  Register here
                </Link>
              </p>
            </div>

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
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 px-4 py-4 text-cream placeholder-cream/20 font-body text-sm focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 px-4 py-4 pr-12 text-cream placeholder-cream/20 font-body text-sm focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-gold transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link
                    to="/forgot-password"
                    className="font-mono text-[10px] tracking-[0.2em] text-cream/30 hover:text-gold uppercase transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gold text-obsidian font-mono text-[12px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2 rounded-lg"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin " />
                ) : (
                  <LogIn size={15} />
                )}
                {loading ? "Signing In..." : "Sign In"}
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

            {/* Register CTA */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
