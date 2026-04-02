import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem } from './CartContext';

export interface ShipmentStep {
  label: string;
  description: string;
  date: string;
  status: 'completed' | 'active' | 'pending';
}

export interface Order {
  id: string;
  items: CartItem[];
  address: OrderAddress;
  payment: string;
  total: number;
  tax: number;
  shipping: number;
  discount: number;
  subtotal: number;
  createdAt: string;
  estimatedDelivery: string;
  shipmentSteps: ShipmentStep[];
  currentStep: number;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pinCode: string;
  type: 'home' | 'work' | 'other';
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  placeOrder: (items: CartItem[], address: OrderAddress, payment: string, totals: { subtotal: number; tax: number; shipping: number; discount: number; total: number }) => string;
  getOrder: (orderId: string) => Order | undefined;
  advanceShipment: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

function generateOrderId() {
  return `PP-2024-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;
}

function generateShipmentSteps(orderDate: Date): ShipmentStep[] {
  const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const d1 = new Date(orderDate);
  const d2 = new Date(d1.getTime() + 600000);
  const d3 = new Date(d1.getTime() + 3600000);
  const d4 = new Date(d1.getTime() + 86400000);
  const d5 = new Date(d1.getTime() + 86400000 * 2);
  const d6 = new Date(d1.getTime() + 86400000 * 3);

  return [
    { label: 'Order Placed', description: 'Your order has been placed successfully', date: fmt(d1), status: 'completed' },
    { label: 'Payment Confirmed', description: 'Payment has been verified and confirmed', date: fmt(d2), status: 'completed' },
    { label: 'Order Processed', description: 'Your order is being prepared for shipment', date: fmt(d3), status: 'completed' },
    { label: 'Packed & Dispatched', description: 'Your package has been handed to BlueDart Express', date: fmt(d4), status: 'active' },
    { label: 'Out for Delivery', description: 'Your package is out for delivery', date: `Expected ${fmt(d5)}`, status: 'pending' },
    { label: 'Delivered', description: 'Package delivered successfully', date: `Expected ${fmt(d6)}`, status: 'pending' },
  ];
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const placeOrder = useCallback((items: CartItem[], address: OrderAddress, payment: string, totals: { subtotal: number; tax: number; shipping: number; discount: number; total: number }) => {
    const now = new Date();
    const orderId = generateOrderId();
    const order: Order = {
      id: orderId,
      items,
      address,
      payment,
      total: totals.total,
      tax: totals.tax,
      shipping: totals.shipping,
      discount: totals.discount,
      subtotal: totals.subtotal,
      createdAt: now.toISOString(),
      estimatedDelivery: new Date(now.getTime() + 86400000 * 3).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      shipmentSteps: generateShipmentSteps(now),
      currentStep: 3,
    };
    setOrders(prev => [...prev, order]);
    setCurrentOrder(order);
    return orderId;
  }, []);

  const getOrder = useCallback((orderId: string) => orders.find(o => o.id === orderId), [orders]);

  const advanceShipment = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const next = Math.min(o.currentStep + 1, 5);
      const steps = o.shipmentSteps.map((s, i) => ({
        ...s,
        status: i < next ? 'completed' as const : i === next ? 'active' as const : 'pending' as const,
      }));
      return { ...o, currentStep: next, shipmentSteps: steps };
    }));
  }, []);

  return (
    <OrderContext.Provider value={{ orders, currentOrder, placeOrder, getOrder, advanceShipment }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}
