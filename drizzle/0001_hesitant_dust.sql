DO $$ BEGIN
 CREATE TYPE "orderStatus" AS ENUM('pending', 'completed', 'cancelled');
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
CREATE TABLE IF NOT EXISTS "menuItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"description" text,
	"price" varchar(10) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"categoryId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menuItemCategory" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"status" "orderStatus" NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ordersToMenuItems" (
	"orderId" integer NOT NULL,
	"menuItemId" integer NOT NULL,
	"number" integer,
	CONSTRAINT "ordersToMenuItems_orderId_menuItemId_pk" PRIMARY KEY("orderId","menuItemId")
);
--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "name" TO "firstname";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_id_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "firstname" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "lastname" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "type" "userType";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToMenuItems" ADD CONSTRAINT "ordersToMenuItems_orderId_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordersToMenuItems" ADD CONSTRAINT "ordersToMenuItems_menuItemId_menuItem_id_fk" FOREIGN KEY ("menuItemId") REFERENCES "menuItem"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");