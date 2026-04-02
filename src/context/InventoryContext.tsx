import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { phones } from '@/data/phonesData';

interface InventoryState {
  inStock: boolean;
  stockCount: number;
}

interface InventoryContextType {
  inventory: Record<string, InventoryState>;
  toggleStock: (id: string) => void;
  updateStockCount: (id: string, count: number) => void;
  isInStock: (id: string) => boolean;
  getStockCount: (id: string) => number;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

function initInventory(): Record<string, InventoryState> {
  const map: Record<string, InventoryState> = {};
  phones.forEach(p => {
    map[p.id] = { inStock: p.inStock, stockCount: p.stockCount };
  });
  return map;
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<Record<string, InventoryState>>(initInventory);

  const toggleStock = useCallback((id: string) => {
    setInventory(prev => ({
      ...prev,
      [id]: { ...prev[id], inStock: !prev[id].inStock },
    }));
  }, []);

  const updateStockCount = useCallback((id: string, count: number) => {
    setInventory(prev => ({
      ...prev,
      [id]: { ...prev[id], stockCount: Math.max(0, count), inStock: count > 0 },
    }));
  }, []);

  const isInStock = useCallback((id: string) => inventory[id]?.inStock ?? true, [inventory]);
  const getStockCount = useCallback((id: string) => inventory[id]?.stockCount ?? 0, [inventory]);

  return (
    <InventoryContext.Provider value={{ inventory, toggleStock, updateStockCount, isInStock, getStockCount }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}
