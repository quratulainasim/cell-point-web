import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { phones } from '@/data/phonesData';
import PhoneGrid from '@/components/phones/PhoneGrid';
import FilterPills, { CATEGORIES } from '@/components/search/FilterPills';
import { useInventory } from '@/context/InventoryContext';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isInStock } = useInventory();
  const [sortBy, setSortBy] = useState('popular');

  const category = CATEGORIES.find(c => c.id === slug);
  const filtered = useMemo(() => {
    let r = phones.filter(p => p.categories.includes(slug || '') && isInStock(p.id));
    switch (sortBy) {
      case 'price_asc': return [...r].sort((a, b) => a.price - b.price);
      case 'price_desc': return [...r].sort((a, b) => b.price - a.price);
      case 'rating': return [...r].sort((a, b) => b.rating - a.rating);
      default: return [...r].sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [slug, sortBy]);

  return (
    <div className="container py-6 animate-fade-slide-up">
      <div className="glass-card p-6 mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">{category?.label || slug}</h1>
        <p className="text-muted-foreground mt-1">{filtered.length} phones in this category</p>
      </div>

      <div className="flex items-center justify-end mb-4">
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
