import { Phone } from '@/data/phonesData';
import PhoneCard from './PhoneCard';

export default function PhoneGrid({ phones, title, cols = 4 }: { phones: Phone[]; title?: string; cols?: number }) {
  const gridCols = cols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
    cols === 5 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' :
    'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <section>
      {title && <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">{title}</h2>}
      {phones.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No phones found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className={`grid ${gridCols} gap-4`}>
          {phones.map(p => <PhoneCard key={p.id} phone={p} />)}
        </div>
      )}
    </section>
  );
}
