import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Clock, Zap } from 'lucide-react';
import { phones } from '@/data/phonesData';
import { brands } from '@/data/brandsData';
import PhoneCard from '@/components/phones/PhoneCard';
import BrandCard from '@/components/brands/BrandCard';
import FilterPills from '@/components/search/FilterPills';
import { formatPrice } from '@/lib/format';
import { useInventory } from '@/context/InventoryContext';

export default function HomePage() {
  const { isInStock } = useInventory();
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(86400);

  useEffect(() => {
    const t = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 86400)), 1000);
    return () => clearInterval(t);
  }, []);

  const hrs = Math.floor(countdown / 3600);
  const mins = Math.floor((countdown % 3600) / 60);
  const secs = countdown % 60;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`);
  };

  const availablePhones = useMemo(() => phones.filter(p => isInStock(p.id)), [isInStock]);
  const flashDeals = useMemo(() => availablePhones.filter(p => p.originalPrice > p.price).sort((a, b) => ((b.originalPrice - b.price) / b.originalPrice) - ((a.originalPrice - a.price) / a.originalPrice)).slice(0, 6), [availablePhones]);
  const hotPhones = useMemo(() => availablePhones.filter(p => p.categories.includes('hot')).slice(0, 10), [availablePhones]);
  const filteredFeatured = useMemo(() => {
    let r = availablePhones;
    if (selectedCats.length) r = r.filter(p => selectedCats.some(c => p.categories.includes(c)));
    return r.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, selectedCats.length ? 24 : 12);
  }, [selectedCats, availablePhones]);

  return (
    <div className="animate-fade-slide-up">
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
           
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold mb-4">
            <span className="text-black">Find Your Next Phone</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Browse 450+ phones from 15 top brands. Compare specs, read reviews, and get the best deals.
          </p>
          <form onSubmit={handleSearch} className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search for phones, brands, or specs..."
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary border border-border/50 text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 glow-cyan-sm"
            />
          </form>
        </div>
      </section>

      <div className="container space-y-12 pb-12">
        {/* Category Pills */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-2 text-foreground">Shop By Category</h2>
          <FilterPills selected={selectedCats} onToggle={c => {
            setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
          }} />
        </section>

        {/* Filtered results when categories selected */}
        {selectedCats.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {filteredFeatured.length} Phones Found
              </h2>
              <button onClick={() => setSelectedCats([])} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors px-3 py-1.5 rounded-lg text-sm font-semibold">
                Clear Filters
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFeatured.map(p => <PhoneCard key={p.id} phone={p} />)}
            </div>
          </section>
        )}

        {/* Flash Deals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
              <Zap className="h-6 w-6 text-accent" /> Flash Deals
            </h2>
            <div className="flex items-center gap-1 text-accent font-mono text-sm">
              <Clock className="h-4 w-4" />
              <span className="bg-accent/10 px-2 py-0.5 rounded">{String(hrs).padStart(2, '0')}</span>:
              <span className="bg-accent/10 px-2 py-0.5 rounded">{String(mins).padStart(2, '0')}</span>:
              <span className="bg-accent/10 px-2 py-0.5 rounded">{String(secs).padStart(2, '0')}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {flashDeals.map(p => <PhoneCard key={p.id} phone={p} />)}
          </div>
        </section>

        {/* Brands */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">Browse By Brand</h2>
            <Link to="/brands" className="text-primary text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-3">
            {brands.map(b => <BrandCard key={b.id} brand={b} />)}
          </div>
        </section>

        {/* Featured */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">Featured Phones</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFeatured.map(p => <PhoneCard key={p.id} phone={p} />)}
          </div>
        </section>

        {/* Trending horizontal scroll */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">🔥 Trending Now</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {hotPhones.map(p => (
              <div key={p.id} className="shrink-0 w-48">
                <PhoneCard phone={p} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
