import { InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
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

export const ordersStatusEnum = pgEnum("orderStatus", [
  "pending",
  "completed",
  "cancelled",
]);

export const users = pgTable(
  "users",
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
export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const menuItems = pgTable("menuItems", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 30 }).notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  categoryId: integer("categoryId").notNull(),
  imgUrl: text("imgUrl").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
});
export type menuItem = InferSelectModel<typeof menuItems>;

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  category: one(menuItemCategories, {
    fields: [menuItems.categoryId],
    references: [menuItemCategories.id],
  }),
  ordersToMenuItems: many(ordersToMenuItems),
  ordersToMenuItemsToSupplements: many(ordersToMenuItemsToSupplements),
}));

export const supplements = pgTable("supplements", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 30 }).notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  categoryId: integer("categoryId"),
  enabled: boolean("enabled").default(true).notNull(),
});
export type supplement = InferSelectModel<typeof supplements>;

export const supplementsRelations = relations(supplements, ({ one }) => ({
  category: one(menuItemCategories, {
    fields: [supplements.categoryId],
    references: [menuItemCategories.id],
  }),

  ordersToMenuItemsToSupplements: one(ordersToMenuItemsToSupplements),
}));
export const menuItemCategories = pgTable("menuItemCategories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 30 }).notNull(),
  description: text("description").notNull(),
  imgUrl: text("imgUrl").notNull(),
});
export type menuItemCategory = InferSelectModel<typeof menuItemCategories> & {
  supplements?: supplement[];
};

export const menuItemCategoriesRelations = relations(
  menuItemCategories,
  ({ many }) => ({
    menuItems: many(menuItems),
    supplements: many(supplements),
  })
);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  status: ordersStatusEnum("status").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  ordersToMenuItems: many(ordersToMenuItems),
  ordersToMenuItemsToSupplements: many(ordersToMenuItemsToSupplements),
}));

export const ordersToMenuItems = pgTable(
  "ordersToMenuItems",
  {
    orderId: integer("orderId")
      .notNull()
      .references(() => orders.id),
    menuItemId: integer("menuItemId")
      .notNull()
      .references(() => menuItems.id),
    quantity: integer("number"),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.orderId, t.menuItemId],
    }),
  })
);

export const ordersToMenuItemsRelations = relations(
  ordersToMenuItems,
  ({ one }) => ({
    order: one(orders, {
      fields: [ordersToMenuItems.orderId],
      references: [orders.id],
    }),
    menuItem: one(menuItems, {
      fields: [ordersToMenuItems.menuItemId],
      references: [menuItems.id],
    }),
  })
);

export const ordersToMenuItemsToSupplements = pgTable(
  "ordersToMenuItemsToSupplements",
  {
    orderId: integer("orderId")
      .notNull()
      .references(() => orders.id),
    menuItemId: integer("menuItemId")
      .notNull()
      .references(() => menuItems.id),
    supplementId: integer("supplementId")
      .notNull()
      .references(() => supplements.id),
    quantity: integer("number"),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.orderId, t.menuItemId, t.supplementId],
    }),
  })
);

export const ordersToMenuItemsToSupplementsRelations = relations(
  ordersToMenuItemsToSupplements,
  ({ one }) => ({
    order: one(orders, {
      fields: [ordersToMenuItemsToSupplements.orderId],
      references: [orders.id],
    }),
    menuItem: one(menuItems, {
      fields: [ordersToMenuItemsToSupplements.menuItemId],
      references: [menuItems.id],
    }),
    supplement: one(supplements, {
      fields: [ordersToMenuItemsToSupplements.supplementId],
      references: [supplements.id],
    }),
  })
);
