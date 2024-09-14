import { order } from "@/lib/schema";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OrdersStore {
  orders: number[];
  addOrder: (orderId: number) => void;
  removeOrder: (id: number) => void;
  removeAll: () => void;
}

const useOrderHistory = create(
  persist<OrdersStore>(
    (set, get) => ({
      orders: [],
      addOrder: (orderId) => {
        const currentItems = get().orders;
        set({
          orders: [...currentItems, orderId],
        });
      },
      removeOrder: (id: number) => {
        set({
          orders: [...get().orders.filter((orderId) => orderId !== id)],
        });
      },
      removeAll: () => {
        set({ orders: [] });
      },
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useOrderHistory;
