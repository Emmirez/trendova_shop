import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Check, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Header from "../../components/Header";

const passwordRules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const passwordStrength = passwordRules.filter((r) =>
    r.test(form.password),
  ).length;

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][
    passwordStrength
  ];
  const strengthColor = [
    "",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-500",
  ][passwordStrength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength < 3) {
      setError("Password is too weak. Please follow the requirements.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
            radial-gradient(ellipse at 40% 60%, rgba(201,168,76,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.05) 0%, transparent 50%)
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
            className="absolute top-1/2 -translate-y-1/2 font-display font-black select-none overflow-hidden"
            style={{
              fontSize: "clamp(300px, 35vw, 500px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(201,168,76,0.06)",
              lineHeight: 1,
              left: "-5%",
            }}
          >
            R
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
                Join the
                <span className="block italic gold-text">Circle.</span>
              </h2>
              <p className="font-body text-cream/40 text-base leading-relaxed max-w-sm">
                Create your account and get access to exclusive drops, early
                releases, and member-only benefits.
              </p>
              <div className="flex flex-col gap-3 mt-8">
                {[
                  "Early access to new drops",
                  "Exclusive member pricing",
                  "Order tracking & history",
                  "Personalised style picks",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 border border-gold/30 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-gold" />
                    </div>
                    <span className="font-body text-cream/50 text-sm">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-gold" />
                <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
                  New Member
                </span>
              </div>
              <h1 className="font-display font-black text-cream text-4xl leading-tight">
                Create Account
              </h1>
              <p className="font-body text-cream/40 text-sm mt-2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  Sign in here
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 px-4 py-4 text-cream placeholder-cream/20 font-body text-sm focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                />
              </div>

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

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
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
                    autoComplete="new-password"
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

                {/* Strength bar */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 transition-all duration-300 ${
                            i <= passwordStrength
                              ? strengthColor
                              : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="font-mono text-[9px] tracking-[0.2em] text-cream/30 uppercase">
                      {strengthLabel}
                    </p>
                  </div>
                )}

                {/* Rules */}
                {form.password && (
                  <div className="mt-3 space-y-1">
                    {passwordRules.map((rule) => (
                      <div key={rule.label} className="flex items-center gap-2">
                        {rule.test(form.password) ? (
                          <Check
                            size={11}
                            className="text-green-400 flex-shrink-0"
                          />
                        ) : (
                          <X
                            size={11}
                            className="text-cream/20 flex-shrink-0"
                          />
                        )}
                        <span
                          className={`font-mono text-[9px] tracking-[0.1em] ${
                            rule.test(form.password)
                              ? "text-green-400"
                              : "text-cream/25"
                          }`}
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full bg-white/5 border px-4 py-4 pr-12 text-cream placeholder-cream/20 font-body text-sm focus:outline-none transition-colors rounded-lg ${
                      form.confirmPassword &&
                      form.password !== form.confirmPassword
                        ? "border-red-500/50"
                        : "border-white/10 focus:border-gold/40"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-gold transition-colors"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.confirmPassword &&
                  form.password !== form.confirmPassword && (
                    <p className="font-mono text-[9px] tracking-[0.2em] text-red-400 uppercase mt-1">
                      Passwords do not match
                    </p>
                  )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gold text-obsidian font-mono text-[12px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2 rounded-lg"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                ) : (
                  <UserPlus size={15} />
                )}
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="font-mono text-[9px] tracking-[0.15em] text-cream/15 uppercase text-center mt-6 leading-relaxed">
              By registering you agree to our Terms of Service and Privacy
              Policy
            </p>

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

export default Register;
