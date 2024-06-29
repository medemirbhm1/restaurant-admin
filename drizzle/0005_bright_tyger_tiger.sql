ALTER TABLE "menuItemCategory" RENAME TO "menuItemCategories";--> statement-breakpoint
ALTER TABLE "menuItem" RENAME TO "menuItems";--> statement-breakpoint
ALTER TABLE "order" RENAME TO "orders";--> statement-breakpoint
ALTER TABLE "supplement" RENAME TO "supplements";--> statement-breakpoint
ALTER TABLE "user" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_username_unique";--> statement-breakpoint
ALTER TABLE "ordersToMenuItems" DROP CONSTRAINT "ordersToMenuItems_orderId_order_id_fk";
--> statement-breakpoint
ALTER TABLE "ordersToMenuItems" DROP CONSTRAINT "ordersToMenuItems_menuItemId_menuItem_id_fk";
--> statement-breakpoint
ALTER TABLE "ordersToMenuItemsToSupplements" DROP CONSTRAINT "ordersToMenuItemsToSupplements_orderId_order_id_fk";
--> statement-breakpoint
ALTER TABLE "ordersToMenuItemsToSupplements" DROP CONSTRAINT "ordersToMenuItemsToSupplements_menuItemId_menuItem_id_fk";
--> statement-breakpoint
ALTER TABLE "ordersToMenuItemsToSupplements" DROP CONSTRAINT "ordersToMenuItemsToSupplements_supplementId_supplement_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToMenuItems" ADD CONSTRAINT "ordersToMenuItems_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToMenuItems" ADD CONSTRAINT "ordersToMenuItems_menuItemId_menuItems_id_fk" FOREIGN KEY ("menuItemId") REFERENCES "menuItems"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToMenuItemsToSupplements" ADD CONSTRAINT "ordersToMenuItemsToSupplements_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToMenuItemsToSupplements" ADD CONSTRAINT "ordersToMenuItemsToSupplements_menuItemId_menuItems_id_fk" FOREIGN KEY ("menuItemId") REFERENCES "menuItems"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToMenuItemsToSupplements" ADD CONSTRAINT "ordersToMenuItemsToSupplements_supplementId_supplements_id_fk" FOREIGN KEY ("supplementId") REFERENCES "supplements"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");