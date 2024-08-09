import { menuItem, supplement } from "@/lib/schema";
import { cartSupplement, OrderItem } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface CartStore {
  items: OrderItem[];
  addItem: (
    item: menuItem,
    supplements: cartSupplement[],
    quantity: number
  ) => void;
  removeItem: (uuid: string) => void;
  removeAll: () => void;
  increaseQunatity: (uuid: string) => void;
  decreaseQunatity: (uuid: string) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (
        item: menuItem,
        supplements: cartSupplement[],
        quantity: number
      ) => {
        const currentItems = get().items;
        const uuid = uuidv4();
        set({
          items: [...currentItems, { ...item, quantity, supplements, uuid }],
        });
      },
      removeItem: (uuid: string) => {
        set({ items: [...get().items.filter((item) => item.uuid !== uuid)] });
      },
      removeAll: () => {
        set({ items: [] });
      },
      increaseQunatity: (uuid: string) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.uuid === uuid);
        if (existingItem) {
          existingItem.quantity += 1;
          set({ items: [...currentItems] });
        }
      },
      decreaseQunatity: (uuid: string) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.uuid === uuid);
        if (existingItem) {
          if (existingItem.quantity !== 1) {
            existingItem.quantity -= 1;
            set({ items: [...currentItems] });
          }
        }
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
