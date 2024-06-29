CREATE TABLE IF NOT EXISTS "ordersToMenuItemsToSupplements" (
	"orderId" integer NOT NULL,
	"menuItemId" integer NOT NULL,
	"supplementId" integer NOT NULL,
	"number" integer,
	CONSTRAINT "ordersToMenuItemsToSupplements_orderId_menuItemId_supplementId_pk" PRIMARY KEY("orderId","menuItemId","supplementId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplement" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"price" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
alter table "menuItem" alter column price type integer using (price::integer);

DO $$ BEGIN
 ALTER TABLE "ordersToMenuItemsToSupplements" ADD CONSTRAINT "ordersToMenuItemsToSupplements_orderId_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToMenuItemsToSupplements" ADD CONSTRAINT "ordersToMenuItemsToSupplements_menuItemId_menuItem_id_fk" FOREIGN KEY ("menuItemId") REFERENCES "menuItem"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToMenuItemsToSupplements" ADD CONSTRAINT "ordersToMenuItemsToSupplements_supplementId_supplement_id_fk" FOREIGN KEY ("supplementId") REFERENCES "supplement"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
