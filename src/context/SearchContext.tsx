import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { phones, Phone } from '@/data/phonesData';
import { useInventory } from '@/context/InventoryContext';

interface SearchContextType {
  query: string;
  setQuery: (q: string) => void;
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
  setSelectedCategories: (cats: string[]) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  selectedBrands: string[];
  toggleBrand: (b: string) => void;
  filteredPhones: Phone[];
  recentSearches: string[];
  addRecentSearch: (s: string) => void;
  clearFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem('pp_recent_searches') || '[]');
  } catch { return []; }
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const { isInStock } = useInventory();
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecent);

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  }, []);

  const toggleBrand = useCallback((b: string) => {
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  }, []);

  const addRecentSearch = useCallback((s: string) => {
    if (!s.trim()) return;
    setRecentSearches(prev => {
      const next = [s, ...prev.filter(x => x !== s)].slice(0, 5);
      localStorage.setItem('pp_recent_searches', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setQuery('');
    setSelectedCategories([]);
    setSortBy('popular');
    setPriceRange([0, 200000]);
    setSelectedBrands([]);
  }, []);

  const filteredPhones = useMemo(() => {
    let result = phones.filter(p => isInStock(p.id));

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.specs.processor.toLowerCase().includes(q) ||
        p.specs.ram.toLowerCase().includes(q) ||
        p.specs.battery.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length) {
      result = result.filter(p => selectedCategories.some(c => p.categories.includes(c)));
    }

    if (selectedBrands.length) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price_asc': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price_desc': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'rating': result = [...result].sort((a, b) => b.rating - a.rating); break;
      case 'newest': result = [...result].sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0)); break;
      default: result = [...result].sort((a, b) => b.reviewCount - a.reviewCount); break;
    }

    return result;
  }, [query, selectedCategories, selectedBrands, priceRange, sortBy, isInStock]);

  return (
    <SearchContext.Provider value={{
      query, setQuery, selectedCategories, toggleCategory, setSelectedCategories,
      sortBy, setSortBy, priceRange, setPriceRange, selectedBrands, toggleBrand,
      filteredPhones, recentSearches, addRecentSearch, clearFilters,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
