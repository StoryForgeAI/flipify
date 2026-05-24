"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { InventoryItem, starterInventory } from "@/lib/data";

type InventoryContextValue = {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(starterInventory);

  useEffect(() => {
    const stored = window.localStorage.getItem("flipify-inventory");
    if (stored) {
      const parsed = JSON.parse(stored) as InventoryItem[];
      setItems(parsed.filter((item) => !["inv-1", "inv-2", "inv-3"].includes(item.id)));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("flipify-inventory", JSON.stringify(items));
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem: (item: InventoryItem) => {
        setItems((current) => {
          if (current.some((existing) => existing.id === item.id)) {
            return current;
          }
          return [item, ...current];
        });
      }
    }),
    [items]
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used inside InventoryProvider");
  }
  return context;
}
