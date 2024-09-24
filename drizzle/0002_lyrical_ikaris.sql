ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;