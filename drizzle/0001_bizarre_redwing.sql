DO $$ BEGIN
 CREATE TYPE "reservationStatus" AS ENUM('pending', 'confirmed', 'completed', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "ordersToMenuItems" ALTER COLUMN "quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "status" "reservationStatus" NOT NULL;