import { useState } from "react";
import { MapPin, Clock, ChevronDown, ChevronUp, Send } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const openings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    type: "Full-time",
    location: "Lagos, Nigeria",
    description:
      "We're looking for a passionate frontend engineer to help build and evolve the Trendova shopping experience. You'll work closely with design and backend teams to ship polished, high-performance features.",
    requirements: [
      "3+ years of experience with React and modern JavaScript",
      "Strong understanding of CSS, Tailwind, and responsive design",
      "Experience with REST APIs and state management",
      "Eye for design and pixel-perfect implementation",
      "Familiarity with performance optimisation and accessibility",
    ],
    nice: [
      "Experience with Node.js or Express",
      "Knowledge of e-commerce platforms",
      "Prior startup or fashion-tech experience",
    ],
  },
  {
    id: 2,
    title: "Brand & Marketing Manager",
    department: "Marketing",
    type: "Full-time",
    location: "Lagos, Nigeria",
    description:
      "Own the Trendova brand voice across all channels. You'll lead campaigns, manage social presence, and work with creatives to ensure every touchpoint feels unmistakably Trendova.",
    requirements: [
      "4+ years in brand management or marketing",
      "Deep understanding of luxury fashion and streetwear culture",
      "Experience running paid social and email campaigns",
      "Strong copywriting and storytelling skills",
      "Data-driven approach to marketing decisions",
    ],
    nice: [
      "Experience with influencer marketing",
      "Photography or content creation skills",
      "Network in the Lagos fashion scene",
    ],
  },
  {
    id: 3,
    title: "Logistics & Operations Coordinator",
    department: "Operations",
    type: "Full-time",
    location: "Lagos, Nigeria",
    description:
      "Keep the Trendova fulfilment engine running. You'll manage courier relationships, oversee order processing, and ensure every customer receives their order perfectly and on time.",
    requirements: [
      "2+ years in logistics or supply chain management",
      "Experience working with courier APIs and tracking systems",
      "Strong organisational and problem-solving skills",
      "Ability to manage multiple priorities under pressure",
      "Proficiency in Excel or Google Sheets",
    ],
    nice: [
      "Experience with e-commerce order management systems",
      "Knowledge of import/export regulations",
    ],
  },
  {
    id: 4,
    title: "Customer Experience Specialist",
    department: "Support",
    type: "Full-time",
    location: "Remote (Nigeria)",
    description:
      "Be the voice of Trendova to our customers. You'll handle inquiries, resolve issues, and ensure every customer interaction leaves them feeling valued and heard.",
    requirements: [
      "2+ years in customer service or client relations",
      "Excellent written and verbal communication",
      "Patience, empathy, and a genuine desire to help",
      "Ability to work independently and manage time effectively",
      "Familiarity with e-commerce and order management",
    ],
    nice: [
      "Experience with Zendesk or similar support tools",
      "Knowledge of fashion or luxury goods",
    ],
  },
  {
    id: 5,
    title: "Fashion Photographer",
    department: "Creative",
    type: "Freelance",
    location: "Lagos, Nigeria",
    description:
      "Shoot the pieces that define the season. We're looking for a photographer with a distinctive eye and experience shooting luxury fashion in editorial and e-commerce contexts.",
    requirements: [
      "Portfolio demonstrating fashion photography experience",
      "Proficiency with professional lighting setups",
      "Experience shooting both studio and location",
      "Own professional camera equipment",
      "Strong post-production and retouching skills",
    ],
    nice: [
      "Video production capabilities",
      "Experience with luxury brands",
      "Social media content creation",
    ],
  },
];

const values = [
  { title: "Excellence First", desc: "We hold ourselves to the same standard as our products — uncompromising." },
  { title: "Culture Matters", desc: "Fashion moves at the speed of culture. So do we." },
  { title: "Ownership", desc: "We give people responsibility and trust them to run with it." },
  { title: "Growth", desc: "Everyone here is learning. We invest in our people the way we invest in our pieces." },
];

const benefits = [
  "Competitive salary + performance bonuses",
  "Trendova wardrobe allowance",
  "Flexible working hours",
  "Remote-friendly roles",
  "Annual team retreat",
  "Health & wellness stipend",
  "Learning & development budget",
  "Early access to new collections",
];

const Careers = () => {
  const [expanded, setExpanded] = useState(null);
  const [applying, setApplying] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", linkedin: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 border-b border-white/5 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.07) 0%, transparent 60%),
              radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.04) 0%, transparent 50%)
            `,
          }}
        />
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 font-display font-black select-none overflow-hidden pointer-events-none"
          style={{
            fontSize: "clamp(200px, 30vw, 400px)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(201,168,76,0.04)",
            lineHeight: 1,
            right: "-3%",
          }}
        >
          C
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
              Join the Team
            </span>
          </div>
          <h1
            className="font-display font-black text-cream leading-tight mb-6"
            style={{ fontSize: "clamp(48px, 8vw, 100px)" }}
          >
            Build the Future
            <span className="block italic gold-text">of Fashion.</span>
          </h1>
          <p className="font-body text-cream/40 text-lg max-w-2xl leading-relaxed">
            We're a small, focused team building something genuinely new in
            African luxury fashion. If you're exceptional at what you do and
            care deeply about craft — we want to meet you.
          </p>
          <div className="flex items-center gap-6 mt-10">
            <div>
              <p className="font-display font-bold text-cream text-2xl gold-text">
                {openings.length}
              </p>
              <p className="font-mono text-[9px] tracking-[0.2em] text-cream/30 uppercase">
                Open Roles
              </p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="font-display font-bold text-cream text-2xl gold-text">Lagos</p>
              <p className="font-mono text-[9px] tracking-[0.2em] text-cream/30 uppercase">
                HQ Location
              </p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="font-display font-bold text-cream text-2xl gold-text">Remote+</p>
              <p className="font-mono text-[9px] tracking-[0.2em] text-cream/30 uppercase">
                Work Style
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-px bg-gold" />
            <h2 className="font-display font-bold text-cream text-2xl">
              How We Work
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {values.map(({ title, desc }) => (
              <div key={title} className="p-6 border border-white/5 bg-charcoal/30">
                <h3 className="font-display font-bold text-gold text-base mb-3">{title}</h3>
                <p className="font-body text-cream/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-px bg-gold" />
            <h2 className="font-display font-bold text-cream text-2xl">
              Benefits & Perks
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 p-4 border border-white/5 hover:border-gold/15 transition-colors"
              >
                <div className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                <p className="font-body text-cream/50 text-sm">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-px bg-gold" />
            <h2 className="font-display font-bold text-cream text-2xl">
              Open Positions
            </h2>
          </div>

          <div className="space-y-3">
            {openings.map((job) => (
              <div key={job.id} className="border border-white/5 bg-charcoal/20 overflow-hidden">
                {/* Job header */}
                <button
                  onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/2 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-display font-bold text-cream text-lg">
                        {job.title}
                      </h3>
                      <span className="font-mono text-[9px] tracking-[0.2em] text-gold/60 uppercase px-2 py-0.5 border border-gold/20">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] text-cream/30 uppercase">
                        <MapPin size={11} />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] text-cream/30 uppercase">
                        <Clock size={11} />
                        {job.department}
                      </span>
                    </div>
                  </div>
                  <div className="text-cream/30 ml-4 flex-shrink-0">
                    {expanded === job.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {/* Expanded content */}
                {expanded === job.id && (
                  <div className="px-6 pb-6 border-t border-white/5">
                    <p className="font-body text-cream/50 text-sm leading-relaxed mt-5 mb-6">
                      {job.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="font-mono text-[10px] tracking-[0.3em] text-gold/60 uppercase mb-3">
                          Requirements
                        </p>
                        <ul className="space-y-2">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-gold/40 rounded-full flex-shrink-0 mt-1.5" />
                              <p className="font-body text-cream/45 text-xs leading-relaxed">{req}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] tracking-[0.3em] text-cream/30 uppercase mb-3">
                          Nice to Have
                        </p>
                        <ul className="space-y-2">
                          {job.nice.map((n, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-white/20 rounded-full flex-shrink-0 mt-1.5" />
                              <p className="font-body text-cream/30 text-xs leading-relaxed">{n}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => { setApplying(job); setSubmitted(false); setForm({ name: "", email: "", linkedin: "", message: "" }); }}
                      className="flex items-center gap-2 px-8 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors"
                    >
                      Apply for this Role
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speculative application */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-10 border border-white/5 bg-charcoal/30 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px bg-gold/30" />
              <span className="font-mono text-[10px] tracking-[0.4em] text-gold/50 uppercase">
                Don't See Your Role?
              </span>
              <div className="w-12 h-px bg-gold/30" />
            </div>
            <h3 className="font-display font-black text-cream text-3xl mb-4">
              We're Always Looking for
              <span className="block italic gold-text">Exceptional People.</span>
            </h3>
            <p className="font-body text-cream/40 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              If you're outstanding at what you do and believe in what we're
              building, send us a speculative application.
            </p>
            <a
              href="mailto:careers@trendova.com?subject=Speculative Application"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gold text-obsidian font-mono text-[12px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors"
            >
              <Send size={14} />
              Send Speculative CV
            </a>
          </div>
        </div>
      </section>

      {/* Application modal */}
      {applying && (
        <div className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm z-50 flex items-center justify-center px-6 py-12 overflow-y-auto">
          <div className="bg-charcoal border border-white/10 w-full max-w-lg">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div>
                <p className="font-mono text-[9px] tracking-[0.3em] text-gold/60 uppercase mb-0.5">
                  Applying for
                </p>
                <h3 className="font-display font-bold text-cream text-lg">
                  {applying.title}
                </h3>
              </div>
              <button
                onClick={() => setApplying(null)}
                className="text-cream/30 hover:text-cream transition-colors font-mono text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="flex flex-col items-center text-center gap-5 py-8">
                  <div className="w-16 h-16 border border-gold/30 bg-gold/5 flex items-center justify-center">
                    <Send size={24} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-cream text-xl mb-2">
                      Application Sent
                    </h4>
                    <p className="font-body text-cream/40 text-sm leading-relaxed">
                      Thank you for applying. We review every application carefully and will be in touch within 5–7 business days.
                    </p>
                  </div>
                  <button
                    onClick={() => setApplying(null)}
                    className="px-8 py-3 border border-white/10 text-cream/50 font-mono text-[11px] tracking-[0.3em] uppercase hover:border-gold/30 hover:text-gold transition-all"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label htmlFor="apply-name" className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2">
                      Full Name
                    </label>
                    <input
                      id="apply-name"
                      name="apply-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-cream placeholder-cream/20 font-body text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="apply-email" className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2">
                      Email Address
                    </label>
                    <input
                      id="apply-email"
                      name="apply-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-cream placeholder-cream/20 font-body text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="apply-linkedin" className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2">
                      LinkedIn / Portfolio URL
                    </label>
                    <input
                      id="apply-linkedin"
                      name="apply-linkedin"
                      type="url"
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/yourname"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-cream placeholder-cream/20 font-body text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="apply-message" className="block font-mono text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-2">
                      Why Trendova?
                    </label>
                    <textarea
                      id="apply-message"
                      name="apply-message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us why you want to join and what you'd bring to the team..."
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-cream placeholder-cream/20 font-body text-sm focus:outline-none focus:border-gold/40 transition-colors resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setApplying(null)}
                      className="flex-1 py-3 border border-white/10 text-cream/40 font-mono text-[11px] tracking-[0.2em] uppercase hover:border-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                      ) : (
                        <Send size={13} />
                      )}
                      {loading ? "Sending..." : "Submit"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Careers;