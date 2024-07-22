import { menuItem, supplement } from "./lib/schema";

export type cartSupplement = {
  id: number;
  name: string;
  price: number;
};
export interface OrderItem extends menuItem {
  quantity: number;
  supplements: cartSupplement[];
  uuid: string;
}
