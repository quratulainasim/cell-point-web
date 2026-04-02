import { Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 pb-20 md:pb-0">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Smartphone className="h-7 w-7 text-white" />
              <span className="font-heading text-xl font-extrabold text-white">Cell Point</span>
            </Link>
            <p className="text-sm text-muted-foreground">Your premium destination for the latest smartphones at the best prices.</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3 text-foreground">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/category/hot" className="hover:text-primary transition-colors">Hot Deals</Link></li>
              <li><Link to="/category/budget" className="hover:text-primary transition-colors">Budget Phones</Link></li>
              <li><Link to="/category/battery" className="hover:text-primary transition-colors">Battery Beasts</Link></li>
              <li><Link to="/category/recommended" className="hover:text-primary transition-colors">Recommended</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3 text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Contact Us</li>
              <li className="hover:text-primary transition-colors cursor-pointer">FAQ</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Shipping Info</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Returns</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3 text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📞 1800-123-4567</li>
              <li>📧 support@cellpoint.in</li>
              <li>🕒 Mon-Sat 9am-9pm</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border/30 text-center text-sm text-muted-foreground">
          © 2026 Cell Point. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
