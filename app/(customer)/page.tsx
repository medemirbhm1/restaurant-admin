import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChefHat, ShoppingBasket } from "lucide-react";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { menuItemCategories } from "@/lib/schema";
import ReserveTableForm from "@/components/ReserveTableForm";

export default async function Page() {
  const categories = await db.query.menuItemCategories.findMany({
    where: and(
      eq(menuItemCategories.shownInLandingPage, true),
      eq(menuItemCategories.enabled, true)
    ),
  });
  return (
    <div>
      <main>
        <section className="w-full py-12 break-word">
          <div className="container grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Bienvenue à Arabesque
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Délectez-vous de notre cuisine exquise, préparée avec des
                  ingrédients de première qualité, et de notre service
                  attentionné qui saura répondre à tous vos besoins et attentes.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href={`/order/${categories[0].id}`}>
                  <Button>Commander maintenant</Button>
                </Link>
                <a href="#reservation">
                  <Button variant="secondary">Réserver une table</Button>
                </a>
              </div>
            </div>
            <Image
              src="/hero.webp"
              width="550"
              height="550"
              alt="Hero"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover w-full lg:order-last"
            />
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Explorer notre menu
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Découvrez notre menu varié, composé d&pos;une sélection de
                  plats appétissants et de desserts délicieux.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {categories.map((category) => (
                <div className="p-1 group" key={category.id}>
                  <Card className="transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Image
                        src={category.imgUrl}
                        width="150"
                        height="150"
                        alt="Entrees"
                        className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center"
                      />
                      <h3 className="text-xl font-bold mt-4">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground mt-2 text-sm">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32" id="reservation">
          <div className="container">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Réservez une table
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Réservez une table pour profiter de notre cuisine exquise et
                  de notre service attentionné.
                </p>
              </div>
              <ReserveTableForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function BeefIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12.5" cy="8.5" r="2.5" />
      <path d="M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z" />
      <path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5" />
    </svg>
  );
}
