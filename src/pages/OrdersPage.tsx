import { useOrders } from '@/context/OrderContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/format';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="container py-16 text-center animate-fade-slide-up">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">No orders yet</h2>
        <p className="text-muted-foreground mb-6">Your order history will appear here</p>
        <Link to="/" className="btn-glow px-6 py-3 inline-block rounded-lg">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container py-6 animate-fade-slide-up">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Your Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <Link key={order.id} to={`/track-order/${order.id}`} className="glass-card p-4 block phone-card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-primary font-semibold">{order.id}</span>
              <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{order.items.length} item(s)</span>
              <span>·</span>
              <span className="font-semibold text-foreground">{formatPrice(order.total, true)}</span>
            </div>
            <p className="text-xs text-primary mt-1">Track Order →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
