const CATEGORIES = [
  { id: 'battery', label: '🔋 Battery Beast' },
  { id: 'budget', label: '💰 Budget' },
  { id: 'hot', label: '🔥 Hot' },
  { id: 'recommended', label: '⭐ Recommended' },
  { id: 'under10k', label: '🏷️ Under ₹10K' },
  { id: 'under20k', label: '🏷️ Under ₹20K' },
  { id: 'under30k', label: '🏷️ Under ₹30K' },
];

export default function FilterPills({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => onToggle(cat.id)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shrink-0 ${
            selected.includes(cat.id)
              ? 'bg-primary text-primary-foreground glow-cyan-sm'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export { CATEGORIES };
