import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Phone } from '@/data/phonesData';
import { formatPrice, getDiscount } from '@/lib/format';
import { useCart } from '@/context/CartContext';
import { useInventory } from '@/context/InventoryContext';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PhoneCard({ phone }: { phone: Phone }) {
  const { addToCart } = useCart();
  const { isInStock, getStockCount } = useInventory();
  const [wishlisted, setWishlisted] = useState(false);
  const discount = getDiscount(phone.originalPrice, phone.price);
  const stockCount = getStockCount(phone.id);
  const inStock = isInStock(phone.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(phone);
    toast.success(`${phone.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Link to={`/phone/${phone.id}`} className="group glass-card phone-card-hover overflow-hidden block">
      <div className="relative">
        <div className="aspect-[3/4] bg-secondary/30 flex items-center justify-center overflow-hidden">
          <img
            src={phone.image}
            alt={phone.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Badge */}
        {phone.badge && (
          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-semibold ${
            phone.badge === 'New' ? 'bg-primary text-primary-foreground' :
            phone.badge === 'Sale' ? 'bg-accent text-accent-foreground' :
            phone.badge === 'Best Seller' ? 'bg-primary text-primary-foreground' :
            'bg-secondary text-secondary-foreground'
          }`}>
            {phone.badge}
          </span>
        )}

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-xs font-bold bg-accent text-accent-foreground">
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute bottom-2 right-2 p-1.5 rounded-full bg-background/70 backdrop-blur-sm transition-colors hover:bg-background"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
        </button>

        {/* Quick Add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-2">
          <button
            onClick={handleAddToCart}
            className="w-full py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Quick Add
          </button>
        </div>
      </div>

      <div className="p-3">
        <p className="text-[10px] uppercase tracking-wider text-primary font-medium">{phone.brand}</p>
        <h3 className="font-semibold text-sm text-foreground mt-0.5 line-clamp-1">{phone.name}</h3>

        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-xs text-foreground font-medium">{phone.rating}</span>
          <span className="text-xs text-muted-foreground">({phone.reviewCount.toLocaleString()})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-base font-bold text-foreground">{formatPrice(phone.price)}</span>
          {discount > 0 && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(phone.originalPrice)}</span>
          )}
        </div>

        {stockCount <= 5 && inStock && (
          <p className="text-[10px] text-accent font-medium mt-1">Only {stockCount} left!</p>
        )}
      </div>
    </Link>
  );
}
