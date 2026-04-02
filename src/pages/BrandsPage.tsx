import { brands } from '@/data/brandsData';
import BrandCard from '@/components/brands/BrandCard';

export default function BrandsPage() {
  return (
    <div className="container py-6 animate-fade-slide-up">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-6">All Brands</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {brands.map(b => <BrandCard key={b.id} brand={b} />)}
      </div>
    </div>
  );
}
