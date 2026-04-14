/* eslint-disable no-unused-vars */
import { Instagram, Twitter, Youtube } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleAnchorClick = (e, to) => {
    e.preventDefault();
    const [path, hash] = to.split('#');
    const id = hash;

    // If we're already on the home page, just scroll
    if (window.location.pathname === '/' || window.location.pathname === '') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home first, then scroll after render
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  return (
    <footer className="border-t border-white/5 bg-obsidian rounded-lg">

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10 ">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="mb-4">
            <div className="font-display text-2xl font-black text-cream">TRENDOVA</div>
            <div className="font-mono text-[9px] tracking-[0.4em] text-gold">PREMIUM SHOP</div>
          </div>
          <p className="font-body text-cream/30 text-sm leading-relaxed">
            Where elegance meets luxury. Premium fashion for those who demand excellence.
          </p>
          <div className="flex gap-4 mt-6">
            {[
              { Icon: Instagram, href: 'https://instagram.com' },
              { Icon: Twitter, href: 'https://twitter.com' },
              { Icon: Youtube, href: 'https://youtube.com' },
            ].map(({ Icon, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-cream/40 hover:border-gold/40 hover:text-gold transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {[
          {
            title: 'Shop',
            links: [
              { label: 'New Arrivals', to: '/#collections', type: 'anchor' },
              { label: 'Tracksuits', to: '/#collections', type: 'anchor' },
              { label: 'Couture', to: '/#collections', type: 'anchor' },
              { label: 'Accessories', to: '/#collections', type: 'anchor' },
              { label: 'Footwear', to: '/#collections', type: 'anchor' },
              { label: 'Gadgets', to: '/#collections', type: 'anchor' },
            ],
          },
          {
            title: 'Company',
            links: [
              { label: 'About Us', to: '/about', type: 'route' },
              { label: 'Careers', to: '/careers', type: 'route' },
              { label: 'Press', to: '/press', type: 'route' },
              { label: 'Contact', to: '/contact', type: 'route' },
            ],
          },
          {
            title: 'Support',
            links: [
              { label: 'FAQ', to: '/#faq', type: 'anchor' },
              { label: 'Shipping Policy', to: '/shipping-policy', type: 'route' },
              { label: 'Size Guide', to: '/#size-guide', type: 'anchor' },
              { label: 'Track Order', to: '/#track-order', type: 'anchor' },
              { label: 'Returns', to: '/shipping-policy', type: 'route' },
            ],
          },
        ].map(({ title, links }) => (
          <div key={title}>
            <h4 className="font-mono text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-6">
              {title}
            </h4>
            <ul className="space-y-3">
              {links.map(({ label, to, type }) => (
                <li key={label}>
                  {type === 'anchor' ? (
                    <a
                      href={to}
                      onClick={(e) => handleAnchorClick(e, to)}
                      className="font-body text-sm text-cream/35 hover:text-gold hover-line transition-colors duration-200"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      to={to}
                      className="font-body text-sm text-cream/35 hover:text-gold hover-line transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-cream/20 tracking-wider">
            © {new Date().getFullYear()} TRENDOVA SHOP. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            {[
              { label: 'Privacy', to: '/privacy' },
              { label: 'Terms', to: '/terms' },
              { label: 'Shipping', to: '/shipping-policy' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="font-mono text-[10px] text-cream/20 hover:text-gold/60 transition-colors tracking-wider"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;