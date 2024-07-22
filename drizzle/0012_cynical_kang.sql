ALTER TABLE "ordersToMenuItemsToSupplements" DROP CONSTRAINT "ordersToMenuItemsToSupplements_orderId_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "ordersToMenuItemsToSupplements" DROP CONSTRAINT "ordersToMenuItemsToSupplements_menuItemId_menuItems_id_fk";
--> statement-breakpoint
ALTER TABLE "ordersToMenuItemsToSupplements" DROP CONSTRAINT "ordersToMenuItemsToSupplements_supplementId_supplements_id_fk";
--> statement-breakpoint
ALTER TABLE "ordersToMenuItems" DROP CONSTRAINT "ordersToMenuItems_orderId_menuItemId_pk";--> statement-breakpoint
ALTER TABLE "ordersToMenuItemsToSupplements" DROP CONSTRAINT "ordersToMenuItemsToSupplements_orderId_menuItemId_supplementId_pk";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "clientFullName" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "ordersToMenuItems" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "ordersToMenuItemsToSupplements" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "ordersToMenuItemsToSupplements" ADD COLUMN "orderToMenuItemId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "ordersToMenuItemsToSupplements" DROP COLUMN IF EXISTS "orderId";--> statement-breakpoint
ALTER TABLE "ordersToMenuItemsToSupplements" DROP COLUMN IF EXISTS "menuItemId";--> statement-breakpoint
ALTER TABLE "ordersToMenuItemsToSupplements" DROP COLUMN IF EXISTS "number";