import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum("userType", [
  "client",
  "admin",
  "superadmin",
]);

export const orderStatusEnum = pgEnum("orderStatus", [
  "pending",
  "completed",
  "cancelled",
]);

export const user = pgTable(
  "user",
  {
    id: serial("id").primaryKey(),
    firstname: varchar("firstname", { length: 30 }).notNull(),
    lastname: varchar("lastname", { length: 30 }).notNull(),
    username: varchar("username", { length: 30 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }).notNull(),
    type: userTypeEnum("type"),
    password: text("password").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (user) => ({
    uniqueIdx: uniqueIndex("uniqueIdx").on(user.id),
  })
);
export const userRelations = relations(user, ({ many }) => ({
  orders: many(order),
}));

export const menuItem = pgTable("menuItem", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 30 }).notNull(),
  description: text("description"),
  price: varchar("price", { length: 10 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  categoryId: integer("categoryId"),
});

export const menuItemRelations = relations(menuItem, ({ one, many }) => ({
  category: one(menuItemCategory, {
    fields: [menuItem.categoryId],
    references: [menuItemCategory.id],
  }),
  ordersToMenuItems: many(ordersToMenuItems),
}));

export const menuItemCategory = pgTable("menuItemCategory", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 30 }).notNull(),
  description: text("description").notNull(),
  imgUrl: text("imgUrl").notNull(),
});

export const menuItemCategoryRelations = relations(
  menuItemCategory,
  ({ many }) => ({
    menuItems: many(menuItem),
  })
);

export const order = pgTable("order", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  status: orderStatusEnum("status").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
  ordersToMenuItems: many(ordersToMenuItems),
}));

export const ordersToMenuItems = pgTable(
  "ordersToMenuItems",
  {
    orderId: integer("orderId")
      .notNull()
      .references(() => order.id),
    menuItem: integer("menuItemId")
      .notNull()
      .references(() => menuItem.id),
    quantity: integer("number"),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.orderId, t.menuItem],
    }),
  })
);

export const ordersToMenuItemsRelations = relations(
  ordersToMenuItems,
  ({ one }) => ({
    order: one(order, {
      fields: [ordersToMenuItems.orderId],
      references: [order.id],
    }),
    menuItem: one(menuItem, {
      fields: [ordersToMenuItems.menuItem],
      references: [menuItem.id],
    }),
  })
);
