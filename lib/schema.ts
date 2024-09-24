import { InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
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
  "ready",
  "completed",
  "cancelled",
]);

export const reservationStatusEnum = pgEnum("reservationStatus", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

export const ordersType = pgEnum("orderType", ["delivery", "pickup"]);

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
  id: serial("id").primaryKey().unique(),
  name: varchar("name", { length: 30 }).notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  categoryId: integer("categoryId"),
  enabled: boolean("enabled").default(true).notNull(),
});
export type supplement = InferSelectModel<typeof supplements>;

export const supplementsRelations = relations(supplements, ({ one, many }) => ({
  category: one(menuItemCategories, {
    fields: [supplements.categoryId],
    references: [menuItemCategories.id],
  }),
  ordersToMenuItemsToSupplements: many(ordersToMenuItemsToSupplements),
}));
export const menuItemCategories = pgTable("menuItemCategories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 30 }).notNull(),
  description: text("description").notNull(),
  imgUrl: text("imgUrl").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  shownInLandingPage: boolean("shownInLandingPage").default(true).notNull(),
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
  clientFullName: varchar("clientFullName", { length: 50 }).notNull(),
  clientPhone: varchar("clientPhone", { length: 20 }).notNull(),
  address: text("address"),
  status: ordersStatusEnum("status").notNull(),
  type: ordersType("type").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  number: integer("number").notNull(),
});

export type order = InferSelectModel<typeof orders>;

export const ordersRelations = relations(orders, ({ one, many }) => ({
  ordersToMenuItems: many(ordersToMenuItems),
  ordersToMenuItemsToSupplements: many(ordersToMenuItemsToSupplements),
}));

export const ordersToMenuItems = pgTable("ordersToMenuItems", {
  id: serial("id").primaryKey(),
  orderId: integer("orderId")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),
  menuItemId: integer("menuItemId")
    .notNull()
    .references(() => menuItems.id, {
      onDelete: "restrict",
    }),
  quantity: integer("quantity").notNull(),
});

export const ordersToMenuItemsRelations = relations(
  ordersToMenuItems,
  ({ one, many }) => ({
    order: one(orders, {
      fields: [ordersToMenuItems.orderId],
      references: [orders.id],
    }),
    menuItem: one(menuItems, {
      fields: [ordersToMenuItems.menuItemId],
      references: [menuItems.id],
    }),
    ordersToMenuItemsToSupplements: many(ordersToMenuItemsToSupplements),
  })
);

export const ordersToMenuItemsToSupplements = pgTable(
  "ordersToMenuItemsToSupplements",
  {
    id: serial("id").primaryKey(),
    orderToMenuItemId: integer("orderToMenuItemId")
      .notNull()
      .references(() => ordersToMenuItems.id, {
        onDelete: "cascade",
      }),
    supplementId: integer("supplementId")
      .notNull()
      .references(() => supplements.id, {
        onDelete: "restrict",
      }),
  }
);

export const ordersToMenuItemsToSupplementsRelations = relations(
  ordersToMenuItemsToSupplements,
  ({ one }) => ({
    orderToMenuItem: one(ordersToMenuItems, {
      fields: [ordersToMenuItemsToSupplements.orderToMenuItemId],
      references: [ordersToMenuItems.id],
    }),
    supplement: one(supplements, {
      fields: [ordersToMenuItemsToSupplements.supplementId],
      references: [supplements.id],
    }),
  })
);

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  placesNb: integer("placesNb").notNull(),
  dateTime: timestamp("dateTime").notNull(),
  notes: text("notes"),
  fullName: varchar("fullName", { length: 50 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  status: reservationStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});


export type reservation = InferSelectModel<typeof reservations>;
