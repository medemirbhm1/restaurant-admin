ALTER TABLE "menuItems" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "menuItems" ALTER COLUMN "categoryId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "menuItems" ADD COLUMN "imgUrl" text NOT NULL;--> statement-breakpoint
ALTER TABLE "menuItems" ADD COLUMN "enabled" boolean DEFAULT true NOT NULL;