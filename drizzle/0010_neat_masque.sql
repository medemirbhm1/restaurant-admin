CREATE TABLE IF NOT EXISTS "reservation" (
	"id" serial PRIMARY KEY NOT NULL,
	"placesNb" integer NOT NULL,
	"dateTime" timestamp NOT NULL,
	"notes" text,
	"fullName" varchar(50) NOT NULL,
	"phone" integer NOT NULL
);
