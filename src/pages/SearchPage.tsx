import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useSearch } from '@/context/SearchContext';
import PhoneGrid from '@/components/phones/PhoneGrid';
import FilterPills from '@/components/search/FilterPills';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
];

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { setQuery, filteredPhones, selectedCategories, toggleCategory, sortBy, setSortBy, addRecentSearch } = useSearch();

  useEffect(() => {
    setQuery(q);
    if (q) addRecentSearch(q);
  }, [q, setQuery, addRecentSearch]);

  return (
    <div className="container py-6 animate-fade-slide-up">
      <p className="text-muted-foreground mb-2">
        {q ? `Showing ${filteredPhones.length} results for "${q}"` : `${filteredPhones.length} phones`}
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <FilterPills selected={selectedCategories} onToggle={toggleCategory} />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="h-10 px-3 rounded-lg bg-secondary border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <PhoneGrid phones={filteredPhones} />
    </div>
  );
}
