import { order } from "@/lib/schema";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OrdersStore {
  orders: order[];
  addOrder: (order: order) => void;
  removeOrder: (id: number) => void;
  removeAll: () => void;
}

const useOrderHistory = create(
  persist<OrdersStore>(
    (set, get) => ({
      orders: [],
      addOrder: (item) => {
        const currentItems = get().orders;
        set({
          orders: [...currentItems, item],
        });
      },
      removeOrder: (id: number) => {
        set({
          orders: [...get().orders.filter((order) => order.id !== id)],
        });
      },
      removeAll: () => {
        set({ orders: [] });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useOrderHistory;
