import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Grid3X3, ShoppingCart, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/brands', icon: Grid3X3, label: 'Brands' },
  { to: '/cart', icon: ShoppingCart, label: 'Cart' },
  { to: '/orders', icon: Package, label: 'Orders' },
];

export default function MobileNav() {
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors relative ${active ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
              {label === 'Cart' && totalItems > 0 && (
                <span className="absolute -top-0.5 right-0.5 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[9px] flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
