/* eslint-disable no-unused-vars */
import { useEffect, useRef } from 'react';
import { Shield, Truck, RotateCcw, Star } from 'lucide-react';

const features = [
  { Icon: Shield, title: 'Premium Quality', desc: 'Every piece is crafted from the finest materials, ensuring longevity and luxury.' },
  { Icon: Truck, title: 'Fast Delivery', desc: 'Same-day dispatch for Lagos. 2-3 days nationwide delivery across Nigeria.' },
  { Icon: RotateCcw, title: 'Easy Returns', desc: '30-day hassle-free returns. No questions asked.' },
  { Icon: Star, title: 'Exclusive Access', desc: 'Join our inner circle for early drops, private sales, and exclusive collections.' },
];

const Features = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.reveal').forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 100);
          });
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 px-6 bg-white border-y border-obsidian/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map(({ Icon, title, desc }, i) => (
          <div key={title} className="reveal flex flex-col items-start gap-4">
            <div className="w-10 h-10 border border-gold/40 flex items-center justify-center text-gold">
              <Icon size={18} />
            </div>
            <div>
              <h4 className="font-display font-semibold text-obsidian text-sm mb-2">{title}</h4>
              <p className="font-body text-obsidian/40 text-xs leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;