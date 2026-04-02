import { useParams, Link } from 'react-router-dom';
import { useOrders } from '@/context/OrderContext';
import { formatPrice } from '@/lib/format';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useOrders();
  const order = getOrder(orderId || '');

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Order not found</p>
        <Link to="/" className="btn-glow px-6 py-3 inline-block rounded-lg mt-4">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-lg text-center animate-fade-slide-up">
      <div className="animate-checkmark inline-block">
        <CheckCircle className="h-20 w-20 text-green-400 mx-auto" />
      </div>

      <h1 className="font-heading text-3xl font-bold text-foreground mt-6">Order Confirmed!</h1>
      <p className="text-muted-foreground mt-2">Thank you for your purchase</p>

      <div className="glass-card p-6 mt-8 text-left space-y-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Order ID</p>
          <p className="font-heading text-xl font-bold text-primary">{order.id}</p>
        </div>

        <div className="border-t border-border/30 pt-4">
          <p className="text-xs text-muted-foreground mb-2">Items Ordered</p>
          {order.items.map(item => (
            <div key={item.phone.id} className="flex justify-between text-sm py-1">
              <span className="text-foreground">{item.phone.name} × {item.quantity}</span>
              <span className="text-foreground font-medium">{formatPrice(item.phone.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border/30 pt-4">
          <p className="text-xs text-muted-foreground mb-1">Delivery Address</p>
          <p className="text-sm text-foreground">{order.address.fullName}</p>
          <p className="text-xs text-muted-foreground">{order.address.line1}, {order.address.city} - {order.address.pinCode}</p>
        </div>

        <div className="border-t border-border/30 pt-4 flex justify-between">
          <span className="text-muted-foreground text-sm">Estimated Delivery</span>
          <span className="text-foreground font-medium text-sm">{order.estimatedDelivery}</span>
        </div>

        <div className="border-t border-border/30 pt-4 flex justify-between text-lg font-bold">
          <span className="text-foreground">Total</span>
          <span className="text-gradient">{formatPrice(order.total, true)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link to={`/track-order/${order.id}`} className="flex-1 py-3 rounded-lg btn-glow text-center text-sm font-semibold flex items-center justify-center gap-2">
          <Package className="h-4 w-4" /> Track Your Order
        </Link>
        <Link to="/" className="flex-1 py-3 rounded-lg bg-secondary text-secondary-foreground text-center text-sm font-semibold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
          <ShoppingBag className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
