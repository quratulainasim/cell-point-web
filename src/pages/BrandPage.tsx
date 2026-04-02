import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { phones } from '@/data/phonesData';
import { brands } from '@/data/brandsData';
import PhoneGrid from '@/components/phones/PhoneGrid';
import FilterPills from '@/components/search/FilterPills';
import { useInventory } from '@/context/InventoryContext';

export default function BrandPage() {
  const { name } = useParams<{ name: string }>();
  const { isInStock } = useInventory();
  const brand = brands.find(b => b.name.toLowerCase() === name?.toLowerCase());
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');

  const filtered = useMemo(() => {
    let r = phones.filter(p => p.brand.toLowerCase() === name?.toLowerCase() && isInStock(p.id));
    if (selectedCats.length) r = r.filter(p => selectedCats.some(c => p.categories.includes(c)));
    switch (sortBy) {
      case 'price_asc': return [...r].sort((a, b) => a.price - b.price);
      case 'price_desc': return [...r].sort((a, b) => b.price - a.price);
      case 'rating': return [...r].sort((a, b) => b.rating - a.rating);
      default: return [...r].sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [name, selectedCats, sortBy, isInStock]);

  return (
    <div className="container py-6 animate-fade-slide-up">
      <div className="glass-card p-6 mb-6 flex items-center gap-4">
        {brand && (
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-heading font-bold" style={{ backgroundColor: brand.color + '22', color: brand.color }}>
            {brand.name[0]}
          </div>
        )}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">{brand?.name || name}</h1>
          <p className="text-muted-foreground">{brand?.tagline} · {filtered.length} phones</p>
        </div>
      </div>

      <FilterPills selected={selectedCats} onToggle={c => setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} />

      <div className="flex items-center justify-end my-4">
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="h-10 px-3 rounded-lg bg-secondary border border-border/50 text-foreground text-sm">
          <option value="popular">Most Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <PhoneGrid phones={filtered} />
    </div>
  );
}
