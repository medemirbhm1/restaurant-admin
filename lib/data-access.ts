import { eq } from "drizzle-orm";
import { db } from "./db";
import { order, orders } from "./schema";

export const getOrder = async (id: number) => {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        ordersToMenuItems: {
          columns: {
            id: true,
            quantity: true,
          },
          with: {
            ordersToMenuItemsToSupplements: {
              columns: {
                id: true,
              },
              with: {
                supplement: {
                  columns: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
            menuItem: {
              columns: {
                id: true,
                name: true,
                price: true,
                imgUrl: true,
              },
            },
          },
        },
      },
    });
    if (!order) {
      return null;
    }
    return order;
  } catch (err) {
    return null;
  }
};
