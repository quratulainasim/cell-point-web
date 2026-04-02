import { Link } from 'react-router-dom';
import { Brand } from '@/data/brandsData';

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      to={`/brand/${brand.name}`}
      className="bg-[#040f26] border border-border/50 rounded-xl p-4 flex flex-col items-center gap-2 phone-card-hover text-center"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 bg-secondary/30"
      >
        <img
          src={brand.logo}
          alt={brand.name}
          className="w-10 h-10 object-contain"
          loading="lazy"
        />
      </div>
      <h3 className="font-semibold text-sm text-foreground">{brand.name}</h3>
      <p className="text-xs text-muted-foreground">{brand.phoneCount} phones</p>
    </Link>
  );
}
