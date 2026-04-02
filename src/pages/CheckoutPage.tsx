import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Building, Wallet, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useOrders, OrderAddress } from '@/context/OrderContext';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, tax, shippingFee, discountAmount, finalPrice, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<OrderAddress>({
    fullName: '', phone: '', email: '', line1: '', line2: '', city: '', state: '', pinCode: '', type: 'home',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = () => {
    const orderId = placeOrder(items, address, paymentMethod, {
      subtotal: totalPrice, tax, shipping: shippingFee, discount: discountAmount, total: finalPrice,
    });
    clearCart();
    toast.success('Order placed successfully!');
    navigate(`/order-confirmation/${orderId}`);
  };

  const canProceedStep1 = address.fullName && address.phone && address.email && address.line1 && address.city && address.state && address.pinCode;

  return (
    <div className="container py-6 max-w-3xl animate-fade-slide-up">
      <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/cart')} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {['Address', 'Payment', 'Review'].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              i + 1 <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>{i + 1 < step ? <Check className="h-4 w-4" /> : i + 1}</div>
            <span className={`text-sm hidden sm:block ${i + 1 <= step ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
            {i < 2 && <div className={`flex-1 h-0.5 ${i + 1 < step ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Address */}
      {step === 1 && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-heading text-xl font-bold text-foreground">Delivery Address</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { key: 'fullName', label: 'Full Name', span: false },
              { key: 'phone', label: 'Phone Number', span: false },
              { key: 'email', label: 'Email', span: true },
              { key: 'line1', label: 'Address Line 1', span: true },
              { key: 'line2', label: 'Address Line 2 (optional)', span: true },
              { key: 'city', label: 'City', span: false },
              { key: 'state', label: 'State', span: false },
              { key: 'pinCode', label: 'PIN Code', span: false },
            ].map(f => (
              <div key={f.key} className={f.span ? 'sm:col-span-2' : ''}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                <input
                  value={(address as any)[f.key]}
                  onChange={e => setAddress({ ...address, [f.key]: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-secondary border border-border/50 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {(['home', 'work', 'other'] as const).map(t => (
              <button key={t} onClick={() => setAddress({ ...address, type: t })} className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize ${address.type === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} disabled={!canProceedStep1} className="w-full py-3 rounded-lg btn-glow text-sm font-semibold disabled:opacity-40 disabled:pointer-events-none">
            Continue to Payment
          </button>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-heading text-xl font-bold text-foreground">Payment Method</h2>
          {[
            { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
            { id: 'upi', label: 'UPI', icon: Smartphone },
            { id: 'netbanking', label: 'Net Banking', icon: Building },
            { id: 'cod', label: 'Cash on Delivery', icon: Wallet },
          ].map(pm => (
            <button
              key={pm.id}
              onClick={() => setPaymentMethod(pm.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                paymentMethod === pm.id ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'
              }`}
            >
              <pm.icon className={`h-5 w-5 ${paymentMethod === pm.id ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium text-foreground">{pm.label}</span>
            </button>
          ))}
          <button onClick={() => setStep(3)} className="w-full py-3 rounded-lg btn-glow text-sm font-semibold">
            Review Order
          </button>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">Review Your Order</h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.phone.id} className="flex gap-3 text-sm">
                  <img src={item.phone.image} alt={item.phone.name} className="w-12 h-16 object-cover rounded bg-secondary/30" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.phone.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} · {item.selectedColor}</p>
                  </div>
                  <p className="font-semibold text-foreground">{formatPrice(item.phone.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4 text-sm">
            <h3 className="font-semibold text-foreground mb-1">Delivery Address</h3>
            <p className="text-muted-foreground">{address.fullName}, {address.line1}, {address.city}, {address.state} - {address.pinCode}</p>
          </div>

          <div className="glass-card p-4 text-sm">
            <h3 className="font-semibold text-foreground mb-1">Payment</h3>
            <p className="text-muted-foreground capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</p>
          </div>

          <div className="glass-card p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(totalPrice, true)}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-{formatPrice(discountAmount, true)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee, true)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (18% GST)</span><span>{formatPrice(tax, true)}</span></div>
            <div className="border-t border-border/50 pt-2 flex justify-between font-bold text-lg">
              <span>Total</span><span className="text-gradient">{formatPrice(finalPrice, true)}</span>
            </div>
          </div>

          <button onClick={handlePlaceOrder} className="w-full py-3 rounded-lg btn-coral text-sm font-semibold">
            Place Order — {formatPrice(finalPrice, true)}
          </button>
        </div>
      )}
    </div>
  );
}
