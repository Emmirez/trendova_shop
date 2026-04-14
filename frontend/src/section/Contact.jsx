/* eslint-disable no-unused-vars */
import { useState } from "react";
import { MapPin, Mail, Phone, Clock, Send, Instagram, Twitter } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@trendova.com",
    sub: "We reply within 24 hours",
    href: "mailto:hello@trendova.com",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+234 800 000 0000",
    sub: "Mon–Fri, 9AM–6PM WAT",
    href: "tel:+2348000000000",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Victoria Island, Lagos",
    sub: "Nigeria",
    href: "#",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon–Sat: 9AM–7PM",
    sub: "Sun: 12PM–5PM WAT",
    href: null,
  },
];

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // await contactService.send(form);
      await new Promise((res) => setTimeout(res, 1000)); // simulate API
      setSent(true);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-6 border-b border-white/5">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.06) 0%, transparent 60%)`,
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
              Get in Touch
            </span>
          </div>
          <h1
            className="font-display font-black text-cream leading-tight mb-4"
            style={{ fontSize: "clamp(40px, 7vw, 80px)" }}
          >
            Contact
            <span className="block italic gold-text">Us</span>
          </h1>
          <p className="font-body text-cream/40 text-base max-w-xl leading-relaxed">
            Have a question, need styling advice, or want to make a bespoke
            enquiry? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left — contact info */}
          <div>
            <h2 className="font-display font-bold text-cream text-2xl mb-8">
              How to reach us
            </h2>

            <div className="space-y-4 mb-12">
              {contactInfo.map(({ icon: Icon, label, value, sub, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 p-5 border border-white/5 bg-charcoal/30 hover:border-gold/15 transition-colors duration-300"
                >
                  <div className="w-10 h-10 border border-gold/20 flex items-center justify-center text-gold flex-shrink-0 rounded-lg">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.25em] text-gold/50 uppercase mb-1">
                      {label}
                    </p>
                    {href && href !== "#" ? (
                      <a
                        href={href}
                        className="font-display font-semibold text-cream text-base hover:text-gold transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-display font-semibold text-cream text-base">
                        {value}
                      </p>
                    )}
                    <p className="font-body text-cream/30 text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-cream/30 uppercase mb-4">
                Follow Us
              </p>
              <div className="flex gap-3 ">
                {[
                  { icon: Instagram, label: "@trendova_shop", href: "#" },
                  { icon: Twitter, label: "@trendova", href: "#" },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-cream/40 hover:border-gold/30 hover:text-gold transition-all duration-300 rounded-lg"
                  >
                    <Icon size={14} />
                    <span className="font-mono text-[10px] tracking-[0.15em]">
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <h2 className="font-display font-bold text-cream text-2xl mb-8">
              Send us a message
            </h2>

            {sent ? (
              <div className="flex flex-col items-center text-center gap-6 py-16 border border-white/5 bg-charcoal/30">
                <div className="w-16 h-16 border border-gold/30 bg-gold/5 flex items-center justify-center">
                  <Send size={24} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-cream text-xl mb-2">
                    Message Sent
                  </h3>
                  <p className="font-body text-cream/40 text-sm leading-relaxed">
                    Thank you for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                </div>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="font-mono text-[10px] tracking-[0.3em] text-cream/30 uppercase hover:text-gold transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 border border-red-500/20 bg-red-500/5">
                    <p className="font-mono text-[11px] tracking-[0.2em] text-red-400 uppercase">
                      {error}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 px-4 py-4 text-cream placeholder-cream/20 font-body text-sm focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 px-4 py-4 text-cream placeholder-cream/20 font-body text-sm focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2"
                  >
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 px-4 py-4 text-cream font-body text-sm focus:outline-none focus:border-gold/40 transition-colors appearance-none rounded-lg"
                  >
                    <option value="" disabled className="bg-obsidian">
                      Select a subject
                    </option>
                    {[
                      "Order Enquiry",
                      "Return / Refund",
                      "Product Question",
                      "Bespoke / Custom Order",
                      "Wholesale / Partnership",
                      "Press & Media",
                      "Other",
                    ].map((opt) => (
                      <option key={opt} value={opt} className="bg-obsidian">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    className="w-full bg-white/5 border border-white/10 px-4 py-4 text-cream placeholder-cream/20 font-body text-sm focus:outline-none focus:border-gold/40 transition-colors resize-none rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gold text-obsidian font-mono text-[12px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;