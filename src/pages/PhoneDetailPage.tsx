import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Star, ShoppingCart, Heart, Truck, Shield, ArrowLeft } from 'lucide-react';
import { phones } from '@/data/phonesData';
import { formatPrice, getDiscount } from '@/lib/format';
import { useCart } from '@/context/CartContext';
import PhoneCard from '@/components/phones/PhoneCard';
import { toast } from 'sonner';

export default function PhoneDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const phone = phones.find(p => p.id === id);
  const [selectedColor, setSelectedColor] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const similar = useMemo(() => {
    if (!phone) return [];
    return phones.filter(p => p.id !== phone.id && (p.brand === phone.brand || p.categories.some(c => phone.categories.includes(c)))).slice(0, 4);
  }, [phone]);

  if (!phone) return <div className="container py-16 text-center text-muted-foreground">Phone not found</div>;

  const discount = getDiscount(phone.originalPrice, phone.price);

  const handleAddToCart = () => {
    addToCart(phone, phone.specs.colors[selectedColor]);
    toast.success(`${phone.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(phone, phone.specs.colors[selectedColor]);
    navigate('/checkout');
  };

  const mockReviews = [
    { name: 'Rahul S.', rating: 5, text: 'Amazing phone! The camera quality is outstanding.', date: '2 weeks ago' },
    { name: 'Priya M.', rating: 4, text: 'Great value for money. Battery life is excellent.', date: '1 month ago' },
    { name: 'Amit K.', rating: 5, text: 'Best phone in this price range. Highly recommended!', date: '1 month ago' },
    { name: 'Sneha R.', rating: 4, text: 'Smooth performance and beautiful display.', date: '2 months ago' },
    { name: 'Vikram P.', rating: 4, text: 'Good build quality and fast charging is a plus.', date: '2 months ago' },
  ];

  return (
    <div className="container py-6 animate-fade-slide-up">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="glass-card p-4">
          <div className="aspect-[3/4] bg-secondary/30 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={phone.image} alt={phone.name} className="w-full h-full object-cover" />
          </div>
          {/* Color selector */}
          <div className="flex gap-2 mt-4 justify-center">
            {phone.specs.colors.map((color, i) => (
              <button
                key={color}
                onClick={() => setSelectedColor(i)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  i === selectedColor ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-wider text-primary font-medium">{phone.brand}</p>
          <h1 className="font-heading text-3xl font-bold text-foreground">{phone.name}</h1>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-md">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="text-sm font-semibold text-primary">{phone.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">{phone.reviewCount.toLocaleString()} reviews</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">{formatPrice(phone.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(phone.originalPrice)}</span>
                <span className="text-sm font-semibold text-accent">-{discount}% off</span>
              </>
            )}
          </div>

          {/* Stock */}
          {phone.stockCount <= 5 ? (
            <p className="text-sm text-accent font-medium">Only {phone.stockCount} left in stock!</p>
          ) : (
            <p className="text-sm text-green-400">In Stock</p>
          )}

          {/* Category badges */}
          <div className="flex flex-wrap gap-2">
            {phone.categories.map(c => (
              <span key={c} className="px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground capitalize">{c.replace('under', 'Under ₹')}</span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleAddToCart} className="flex-1 py-3 rounded-lg btn-glow flex items-center justify-center gap-2 text-sm font-semibold">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="flex-1 py-3 rounded-lg btn-coral flex items-center justify-center gap-2 text-sm font-semibold">
              Buy Now
            </button>
            <button onClick={() => { setWishlisted(!wishlisted); toast.success(wishlisted ? 'Removed' : 'Added to wishlist'); }} className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
              <Heart className={`h-5 w-5 ${wishlisted ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
            </button>
          </div>

          {/* Delivery */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground glass-card p-3">
            <Truck className="h-4 w-4 text-primary" />
            <span>Estimated delivery: {phone.deliveryDays}-{phone.deliveryDays + 2} business days</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground glass-card p-3">
            <Shield className="h-4 w-4 text-primary" />
            <span>1 Year Manufacturer Warranty</span>
          </div>

          {/* Specs */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="font-heading font-semibold text-foreground">Specifications</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ['Display', phone.specs.display],
                ['Processor', phone.specs.processor],
                ['RAM', phone.specs.ram],
                ['Storage', phone.specs.storage],
                ['Battery', phone.specs.battery],
                ['Charging', phone.specs.charging],
                ['Main Camera', phone.specs.camera.main || 'N/A'],
                ['Front Camera', phone.specs.camera.front],
                ['OS', phone.specs.os],
                ['Connectivity', phone.specs.connectivity],
                ['Weight', phone.specs.weight],
                ['Water Resistance', phone.specs.waterResistance],
              ].map(([label, val]) => (
                <div key={label} className="py-1.5 border-b border-border/30">
                  <p className="text-muted-foreground text-xs">{label}</p>
                  <p className="text-foreground font-medium text-xs">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">Customer Reviews</h2>
        <div className="space-y-3">
          {mockReviews.map((r, i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-foreground">{r.name}</span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <div className="flex gap-0.5 mb-1">
                {Array.from({ length: 5 }, (_, j) => (
                  <Star key={j} className={`h-3 w-3 ${j < r.rating ? 'fill-primary text-primary' : 'text-muted'}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">Similar Phones</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map(p => <PhoneCard key={p.id} phone={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
