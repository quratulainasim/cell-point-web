import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Smartphone, User, LogOut, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useState } from 'react';

export default function Header() {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setSearchOpen(false);
      setQ('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Smartphone className="h-8 w-8 text-white" />
          <span className="font-heading text-2xl font-extrabold text-white">Cell Point</span>
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search phones, brands, specs..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          {/* Mobile search toggle */}
          <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors">
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>

          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <User className="h-5 w-5 text-primary" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 glass-card p-2 z-50 rounded-lg border border-border/50">
                    <p className="px-3 py-2 text-xs text-muted-foreground truncate">{user.email}</p>
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-md transition-colors"
                    >
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-secondary rounded-md transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-accent hover:bg-secondary rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/auth" className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-xs font-semibold">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <form onSubmit={handleSearch} className="md:hidden px-4 pb-3 animate-fade-slide-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search phones..."
              autoFocus
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </form>
      )}
    </header>
  );
}
