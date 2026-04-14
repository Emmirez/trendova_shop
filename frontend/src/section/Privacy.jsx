import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Personal identification information (name, email address, phone number) when you register or place an order.",
      "Payment information processed securely through our payment partners. We do not store card details.",
      "Device and usage data including IP address, browser type, pages visited, and time spent on site.",
      "Order history, wishlist items, and preferences to personalise your shopping experience.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "To process and fulfil your orders, send order confirmations and shipping updates.",
      "To create and manage your Trendova account securely.",
      "To send you exclusive offers, new collection announcements, and style updates — only with your consent.",
      "To improve our platform, analyse trends, and enhance the shopping experience.",
      "To detect and prevent fraud, abuse, and unauthorised account access.",
    ],
  },
  {
    title: "Information Sharing",
    content: [
      "We do not sell, trade, or rent your personal information to third parties.",
      "We share data with trusted service providers (payment processors, delivery partners) solely to fulfil your orders.",
      "We may disclose information when required by law or to protect the rights and safety of Trendova and its users.",
      "In the event of a business merger or acquisition, your data may be transferred with full notice provided.",
    ],
  },
  {
    title: "Data Security",
    content: [
      "All data is encrypted in transit using SSL/TLS technology.",
      "Passwords are hashed using bcrypt and are never stored in plain text.",
      "Access to personal data is restricted to authorised personnel only.",
      "We conduct regular security audits and vulnerability assessments.",
      "Despite our best efforts, no transmission over the internet is 100% secure. We encourage strong passwords and account vigilance.",
    ],
  },
  {
    title: "Cookies",
    content: [
      "We use cookies to maintain your session, remember preferences, and analyse site traffic.",
      "Essential cookies are required for the site to function and cannot be disabled.",
      "Analytics cookies help us understand how visitors interact with our platform.",
      "You can control cookie preferences through your browser settings at any time.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "You have the right to access, update, or delete your personal data at any time.",
      "You may opt out of marketing communications by clicking 'unsubscribe' in any email.",
      "You may request a copy of all data we hold on you by contacting privacy@trendova.com.",
      "You have the right to lodge a complaint with your local data protection authority.",
    ],
  },
  {
    title: "Data Retention",
    content: [
      "We retain your account data for as long as your account is active.",
      "Order records are retained for 7 years for legal and accounting purposes.",
      "You may request account deletion at any time. Some data may be retained where required by law.",
    ],
  },
  {
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time.",
      "We will notify you of significant changes via email or a prominent notice on our website.",
      "Continued use of Trendova after changes constitutes acceptance of the updated policy.",
    ],
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-6 border-b border-white/5">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.05) 0%, transparent 60%)`,
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase">
              Legal
            </span>
          </div>
          <h1
            className="font-display font-black text-cream leading-tight mb-4"
            style={{ fontSize: "clamp(40px, 7vw, 80px)" }}
          >
            Privacy
            <span className="block italic gold-text">Policy</span>
          </h1>
          <p className="font-body text-cream/40 text-base max-w-xl leading-relaxed">
            Your privacy matters to us. This policy explains how Trendova
            collects, uses, and protects your personal information.
          </p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-cream/20 uppercase mt-4">
            Last updated: March 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Intro */}
          <div className="p-6 border border-gold/15 bg-gold/3 mb-12">
            <p className="font-body text-cream/60 text-sm leading-relaxed">
              At Trendova, we are committed to protecting your personal
              information and your right to privacy. If you have any questions
              or concerns about this policy, please contact us at{" "}
              <a
                href="mailto:privacy@trendova.com"
                className="text-gold hover:underline"
              >
                privacy@trendova.com
              </a>
              .
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section, i) => (
              <div key={section.title} className="flex gap-8">
                {/* Number */}
                <div className="flex-shrink-0 w-8 pt-1">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-gold/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                {/* Content */}
                <div className="flex-1 border-t border-white/5 pt-6">
                  <h2 className="font-display font-bold text-cream text-xl mb-5">
                    {section.title}
                  </h2>
                  <ul className="space-y-3">
                    {section.content.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-gold/40 rounded-full flex-shrink-0 mt-2" />
                        <p className="font-body text-cream/50 text-sm leading-relaxed">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Contact block */}
          <div className="mt-16 p-8 border border-white/5 bg-charcoal/30 text-center">
            <h3 className="font-display font-bold text-cream text-xl mb-3">
              Questions about your privacy?
            </h3>
            <p className="font-body text-cream/40 text-sm mb-6">
              Our team is here to help with any privacy-related concerns.
            </p>
            <a
              href="mailto:privacy@trendova.com"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors"
            >
              Contact Privacy Team
            </a>
          </div>

          {/* Related links */}
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <Link
              to="/terms"
              className="font-mono text-[10px] tracking-[0.3em] text-cream/30 uppercase hover:text-gold transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-cream/10">·</span>
            <Link
              to="/contact"
              className="font-mono text-[10px] tracking-[0.3em] text-cream/30 uppercase hover:text-gold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;