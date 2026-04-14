import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const sections = [
  {
    title: "Acceptance of Terms",
    content: [
      "By accessing or using the Trendova platform, you agree to be bound by these Terms of Service.",
      "If you do not agree to these terms, please discontinue use of our platform immediately.",
      "We reserve the right to update these terms at any time. Continued use constitutes acceptance.",
      "These terms apply to all users including browsers, customers, vendors, and merchants.",
    ],
  },
  {
    title: "Account Registration",
    content: [
      "You must be at least 18 years old to create an account and make purchases on Trendova.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree to provide accurate, current, and complete information during registration.",
      "Trendova reserves the right to suspend or terminate accounts that violate these terms.",
      "You may not create multiple accounts or impersonate another person or entity.",
    ],
  },
  {
    title: "Products and Pricing",
    content: [
      "All prices are displayed in Nigerian Naira (₦) and are subject to change without notice.",
      "We reserve the right to modify or discontinue products at any time.",
      "Product images are for illustrative purposes. Slight variations in colour may occur.",
      "We are not responsible for typographical errors in pricing. We reserve the right to cancel orders placed at incorrect prices.",
      "Limited edition and exclusive items are subject to strict availability.",
    ],
  },
  {
    title: "Orders and Payment",
    content: [
      "Placing an order constitutes an offer to purchase. Orders are confirmed upon receipt of payment.",
      "We accept payments via card, bank transfer, and approved payment gateways.",
      "Payment information is encrypted and processed securely. We do not store card details.",
      "We reserve the right to refuse or cancel any order at our discretion.",
      "Order confirmation emails are automatically generated and do not constitute a binding contract until fulfilled.",
    ],
  },
  {
    title: "Shipping and Delivery",
    content: [
      "Delivery timelines are estimates and not guaranteed. Trendova is not liable for delays caused by third-party couriers.",
      "Risk of loss passes to you upon delivery to the shipping address provided.",
      "We are not responsible for packages delivered to incorrect addresses due to customer error.",
      "International orders may be subject to customs duties and taxes payable by the recipient.",
    ],
  },
  {
    title: "Returns and Refunds",
    content: [
      "Items may be returned within 30 days of delivery, provided they are unworn, unwashed, and in original packaging.",
      "Sale items, underwear, and customised pieces are non-returnable.",
      "Refunds are processed within 5–10 business days upon receipt of the returned item.",
      "Original shipping fees are non-refundable unless the return is due to our error.",
      "We reserve the right to deny returns that do not meet our return criteria.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "All content on this platform including logos, images, text, and designs are the exclusive property of Trendova.",
      "You may not reproduce, distribute, or use our content without prior written consent.",
      "User-generated content submitted to Trendova grants us a non-exclusive licence to use, display, and share it.",
      "Trendova™ is a registered trademark. Unauthorised use is strictly prohibited.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "Trendova is not liable for any indirect, incidental, or consequential damages arising from use of our platform.",
      "Our total liability shall not exceed the amount paid for the specific order in dispute.",
      "We do not warrant that our platform will be uninterrupted, error-free, or free of viruses.",
      "We are not responsible for third-party content, links, or services accessible through our platform.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These terms are governed by the laws of the Federal Republic of Nigeria.",
      "Any disputes shall be resolved through arbitration in Lagos, Nigeria.",
      "If any provision of these terms is found unenforceable, the remaining provisions remain in full effect.",
    ],
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-6 border-b border-white/5">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.05) 0%, transparent 60%)`,
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
            Terms of
            <span className="block italic gold-text">Service</span>
          </h1>
          <p className="font-body text-cream/40 text-base max-w-xl leading-relaxed">
            Please read these terms carefully before using the Trendova
            platform. They govern your use of our services and purchases.
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
              These Terms of Service constitute a legally binding agreement
              between you and Trendova Shop. By using our platform, you confirm
              that you have read, understood, and agree to these terms. For
              questions, contact{" "}
              <a
                href="mailto:legal@trendova.com"
                className="text-gold hover:underline"
              >
                legal@trendova.com
              </a>
              .
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section, i) => (
              <div key={section.title} className="flex gap-8">
                <div className="flex-shrink-0 w-8 pt-1">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-gold/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
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
              Need clarification on our terms?
            </h3>
            <p className="font-body text-cream/40 text-sm mb-6">
              Our legal team is available to address any questions or concerns.
            </p>
            <a
              href="mailto:legal@trendova.com"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors"
            >
              Contact Legal Team
            </a>
          </div>

          {/* Related links */}
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <Link
              to="/privacy"
              className="font-mono text-[10px] tracking-[0.3em] text-cream/30 uppercase hover:text-gold transition-colors"
            >
              Privacy Policy
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

export default Terms;