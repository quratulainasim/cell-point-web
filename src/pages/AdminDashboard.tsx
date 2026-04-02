import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useInventory } from '@/context/InventoryContext';
import { phones } from '@/data/phonesData';
import { formatPrice } from '@/lib/format';
import { Search, Package, Plus, Trash2, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { isAdmin, loading } = useIsAdmin();
  const navigate = useNavigate();

  const { inventory, toggleStock, updateStockCount } = useInventory();

  const [searchQ, setSearchQ] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'out'>('all');

  const brands = useMemo(() => [...new Set(phones.map(p => p.brand))].sort(), []);

  const filtered = useMemo(() => {
    return phones.filter(p => {
      const inv = inventory[p.id];
      if (searchQ && !p.name.toLowerCase().includes(searchQ.toLowerCase()) && !p.brand.toLowerCase().includes(searchQ.toLowerCase())) return false;
      if (brandFilter !== 'all' && p.brand !== brandFilter) return false;
      if (stockFilter === 'in' && !inv?.inStock) return false;
      if (stockFilter === 'out' && inv?.inStock) return false;
      return true;
    });
  }, [searchQ, brandFilter, stockFilter, inventory]);


  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="text-muted-foreground mt-4">Checking access...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-16 text-center animate-fade-slide-up">
        <ShieldCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Sign In Required</h2>
        <p className="text-muted-foreground mb-6">Please sign in to access the admin dashboard.</p>
        <button onClick={() => navigate('/auth')} className="btn-glow px-6 py-3 rounded-lg">Sign In</button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-16 text-center animate-fade-slide-up">
        <ShieldCheck className="h-16 w-16 text-accent mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6">You don't have admin privileges.</p>
        <button onClick={() => navigate('/')} className="btn-glow px-6 py-3 rounded-lg">Go Home</button>
      </div>
    );
  }

  const totalInStock = Object.values(inventory).filter(i => i.inStock).length;
  const totalOutOfStock = Object.values(inventory).filter(i => !i.inStock).length;
  const totalUnits = Object.values(inventory).reduce((sum, i) => sum + i.stockCount, 0);

  return (
    <div className="container py-6 animate-fade-slide-up">
      <button onClick={() => navigate('/')} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Store
      </button>

      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage inventory & stock levels</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Products', value: phones.length, icon: Package },
          { label: 'In Stock', value: totalInStock, icon: Plus },
          { label: 'Out of Stock', value: totalOutOfStock, icon: Trash2 },
          { label: 'Total Units', value: totalUnits.toLocaleString(), icon: Package },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search products..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
          className="h-10 px-3 rounded-lg bg-secondary border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Brands</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select
          value={stockFilter}
          onChange={e => setStockFilter(e.target.value as any)}
          className="h-10 px-3 rounded-lg bg-secondary border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-3">{filtered.length} products</p>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Product</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden md:table-cell">Brand</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Price</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">Stock</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">Units</th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(phone => {
                const inv = inventory[phone.id];
                return (
                  <tr key={phone.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={phone.image} alt={phone.name} className="w-8 h-10 object-cover rounded bg-secondary/30" />
                        <span className="text-foreground font-medium truncate max-w-[200px]">{phone.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{phone.brand}</td>
                    <td className="px-4 py-3 text-foreground font-medium">{formatPrice(phone.price)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        inv?.inStock
                          ? 'bg-primary/10 text-primary'
                          : 'bg-accent/10 text-accent'
                      }`}>
                        {inv?.inStock ? 'In Stock' : 'Out'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        value={inv?.stockCount ?? 0}
                        onChange={e => updateStockCount(phone.id, parseInt(e.target.value) || 0)}
                        className="w-16 h-8 text-center rounded bg-secondary border border-border/50 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                        min={0}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleStock(phone.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          inv?.inStock
                            ? 'bg-accent/10 text-accent hover:bg-accent/20'
                            : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                      >
                        {inv?.inStock ? 'Remove' : 'Add'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
