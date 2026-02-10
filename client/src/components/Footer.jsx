import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[var(--color-neutral-900)] text-[var(--color-neutral-200)] py-12 border-t border-[var(--color-neutral-200)]/10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold font-display text-[var(--color-neutral-50)] mb-4">VibeWear</h2>
          <p className="text-sm opacity-80 leading-relaxed">
            Connecting you with the finest artisanal goods from across Pakistan. Heritage meets modernity.
          </p>
        </div>
        
        <div>
          <h3 className="font-bold text-[var(--color-accent)] mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products?category=apparel" className="hover:text-white transition-colors">Apparel</Link></li>
            <li><Link to="/products?category=home" className="hover:text-white transition-colors">Home Decor</Link></li>
            <li><Link to="/products?category=crafts" className="hover:text-white transition-colors">Handicrafts</Link></li>
          </ul>
        </div>

        <div>
           <h3 className="font-bold text-[var(--color-accent)] mb-4">Support</h3>
           <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
           </ul>
        </div>

        <div>
             <h3 className="font-bold text-[var(--color-accent)] mb-4">Newsletter</h3>
             <p className="text-sm mb-4 opacity-80">Subscribe to receive updates on new collections.</p>
             <div className="flex gap-2">
                 <input 
                    type="email" 
                    placeholder="Your email" 
                    className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
                 />
                 <button className="bg-[var(--color-accent)] text-[var(--color-accent-foreground)] px-4 py-2 rounded text-sm font-bold hover:brightness-110">
                    Join
                 </button>
             </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-xs opacity-50">
        &copy; {new Date().getFullYear()} VibeWear. All rights reserved.
      </div>
    </footer>
  );
}
