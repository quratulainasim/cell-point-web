import { brands } from '@/data/brandsData';
import BrandCard from './BrandCard';

export default function BrandGrid() {
  return (
    <section>
      <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">Browse By Brand</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {brands.map(b => <BrandCard key={b.id} brand={b} />)}
      </div>
    </section>
  );
}
