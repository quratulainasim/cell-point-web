import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, shippingFee, tax, discountAmount, finalPrice, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    if (applyCoupon(couponCode)) {
      toast.success('Coupon applied!');
      setCouponCode('');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center animate-fade-slide-up">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some phones to get started!</p>
        <Link to="/" className="btn-glow px-6 py-3 inline-block rounded-lg">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container py-6 animate-fade-slide-up">
      <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 text-sm">
        <ArrowLeft className="h-4 w-4" /> Continue Shopping
      </Link>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Shopping Cart ({items.length})</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.phone.id} className="glass-card p-4 flex gap-4">
              <img src={item.phone.image} alt={item.phone.name} className="w-20 h-28 object-cover rounded-lg bg-secondary/30" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-primary font-medium">{item.phone.brand}</p>
                <h3 className="font-semibold text-foreground text-sm truncate">{item.phone.name}</h3>
                <p className="text-xs text-muted-foreground">{item.selectedColor} · {item.selectedStorage}</p>
                <p className="text-lg font-bold text-foreground mt-1">{formatPrice(item.phone.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQuantity(item.phone.id, item.quantity - 1)} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center hover:bg-secondary/80">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.phone.id, item.quantity + 1)} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center hover:bg-secondary/80">
                    <Plus className="h-3 w-3" />
                  </button>
                  <button onClick={() => removeFromCart(item.phone.id)} className="ml-auto p-1.5 text-muted-foreground hover:text-accent transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="glass-card p-6 h-fit space-y-4 sticky top-20">
          <h3 className="font-heading font-semibold text-foreground">Order Summary</h3>

          {/* Coupon */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-secondary border border-border/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <button onClick={handleApplyCoupon} className="px-4 h-9 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">Apply</button>
          </div>
          {appliedCoupon && (
            <div className="flex items-center justify-between text-xs text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg">
              <span>Coupon {appliedCoupon.code} applied</span>
              <button onClick={removeCoupon} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">{formatPrice(totalPrice, true)}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-{formatPrice(discountAmount, true)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-foreground">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee, true)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (18% GST)</span><span className="text-foreground">{formatPrice(tax, true)}</span></div>
            <div className="border-t border-border/50 pt-2 flex justify-between font-bold text-lg">
              <span className="text-foreground">Total</span>
              <span className="text-gradient">{formatPrice(finalPrice, true)}</span>
            </div>
          </div>

          <Link to="/checkout" className="block w-full py-3 rounded-lg btn-glow text-center text-sm font-semibold">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
