DO $$ BEGIN
 CREATE TYPE "orderStatus" AS ENUM('pending', 'ready', 'completed', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "orderType" AS ENUM('delivery', 'pickup');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "userType" AS ENUM('client', 'admin', 'superadmin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menuItemCategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"description" text NOT NULL,
	"imgUrl" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"shownInLandingPage" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menuItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"categoryId" integer NOT NULL,
	"imgUrl" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientFullName" varchar(50) NOT NULL,
	"clientPhone" varchar(20) NOT NULL,
	"address" text,
	"status" "orderStatus" NOT NULL,
	"type" "orderType" NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"number" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ordersToMenuItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"orderId" integer NOT NULL,
	"menuItemId" integer NOT NULL,
	"quantity" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ordersToMenuItemsToSupplements" (
	"id" serial PRIMARY KEY NOT NULL,
	"orderToMenuItemId" integer NOT NULL,
	"supplementId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"placesNb" integer NOT NULL,
	"dateTime" timestamp NOT NULL,
	"notes" text,
	"fullName" varchar(50) NOT NULL,
	"phone" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplements" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"price" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"categoryId" integer,
	"enabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "supplements_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstname" varchar(30) NOT NULL,
	"lastname" varchar(30) NOT NULL,
	"username" varchar(30) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"type" "userType",
	"password" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniqueIdx" ON "users" ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToMenuItems" ADD CONSTRAINT "ordersToMenuItems_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToMenuItems" ADD CONSTRAINT "ordersToMenuItems_menuItemId_menuItems_id_fk" FOREIGN KEY ("menuItemId") REFERENCES "menuItems"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToMenuItemsToSupplements" ADD CONSTRAINT "ordersToMenuItemsToSupplements_orderToMenuItemId_ordersToMenuItems_id_fk" FOREIGN KEY ("orderToMenuItemId") REFERENCES "ordersToMenuItems"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToMenuItemsToSupplements" ADD CONSTRAINT "ordersToMenuItemsToSupplements_supplementId_supplements_id_fk" FOREIGN KEY ("supplementId") REFERENCES "supplements"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
