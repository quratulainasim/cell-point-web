import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useOrders } from '@/context/OrderContext';
import { formatPrice } from '@/lib/format';
import TrackingTimeline from '@/components/shipment/TrackingTimeline';
import { ArrowLeft, Phone, Package, MapPin } from 'lucide-react';

export default function TrackOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder, advanceShipment } = useOrders();
  const order = getOrder(orderId || '');

  // Auto-advance demo
  useEffect(() => {
    if (!order || !orderId) return;
    const interval = setInterval(() => advanceShipment(orderId), 8000);
    return () => clearInterval(interval);
  }, [orderId, advanceShipment, order]);

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Order not found</h2>
        <p className="text-muted-foreground mb-4">Enter a valid order ID to track your shipment</p>
        <Link to="/" className="btn-glow px-6 py-3 inline-block rounded-lg">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-2xl animate-fade-slide-up">
      <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Track Your Order</h1>
      <p className="text-primary font-mono text-sm mb-6">{order.id}</p>

      {/* Courier info */}
      <div className="glass-card p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Courier Partner</p>
          <p className="text-sm font-semibold text-foreground">BlueDart Express</p>
          <p className="text-xs text-muted-foreground mt-0.5">Tracking ID: BD{orderId?.replace(/\D/g, '').slice(0, 10)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Estimated Delivery</p>
          <p className="text-sm font-semibold text-foreground">{order.estimatedDelivery}</p>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="glass-card p-6 mb-6 relative overflow-hidden h-32 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
        <div className="absolute left-[20%] top-1/2 w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        <div className="absolute left-[20%] right-[20%] top-1/2 h-0.5 bg-gradient-to-r from-green-400 via-primary to-muted" />
        <div className="absolute right-[20%] top-1/2 w-3 h-3 rounded-full bg-muted" />
        <MapPin className="absolute left-[18%] top-[30%] h-5 w-5 text-green-400" />
        <MapPin className="absolute right-[18%] top-[30%] h-5 w-5 text-muted-foreground" />
        <div className="absolute left-[45%] top-[40%] w-4 h-4 rounded-full bg-primary animate-bounce">
          <Package className="h-3 w-3 text-primary-foreground m-0.5" />
        </div>
      </div>

      {/* Timeline */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Shipment Status</h3>
        <TrackingTimeline steps={order.shipmentSteps} />
      </div>

      {/* Items */}
      <div className="glass-card p-4 mt-6">
        <h3 className="font-heading font-semibold text-foreground mb-3">Order Items</h3>
        {order.items.map(item => (
          <div key={item.phone.id} className="flex items-center gap-3 py-2">
            <img src={item.phone.image} alt={item.phone.name} className="w-10 h-14 object-cover rounded bg-secondary/30" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{item.phone.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-foreground">{formatPrice(item.phone.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      {/* Support */}
      <div className="glass-card p-4 mt-6 flex items-center gap-3">
        <Phone className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">Need help?</p>
          <p className="text-xs text-muted-foreground">Call 1800-123-4567 (Mon-Sat 9am-9pm)</p>
        </div>
      </div>
    </div>
  );
}
