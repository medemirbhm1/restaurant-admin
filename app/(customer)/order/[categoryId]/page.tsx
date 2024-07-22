import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { menuItemCategories, menuItems, supplements } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { OrderItemDialog } from "./OrderItemDialog";

export default async function Page({
  params,
}: {
  params: { categoryId: string };
}) {
  const category = await db.query.menuItemCategories.findFirst({
    where: eq(menuItemCategories.id, parseInt(params.categoryId)),
  });
  if (!category) {
    return <div>Category not found</div>;
  }
  const categories = await db.query.menuItemCategories.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
  const items = await db.query.menuItems.findMany({
    where: eq(menuItems.categoryId, parseInt(params.categoryId)),
  });
  const categorySupplements = await db.query.supplements.findMany({
    where: eq(supplements.categoryId, parseInt(params.categoryId)),
  });

  return (
    <div className="">
      <section className="container">
        <div className="h-40 relative p-4 flex items-end lg:h-80">
          <Image
            src={category.imgUrl}
            fill
            className="rounded-xl object-cover"
            alt=""
          />
          <div className="absolute h-full w-full left-0 top-0 bg-black/40 rounded-xl" />
          <div className="text-white text-xl font-semibold relative">
            {category.name}
          </div>
        </div>
        <div className="mt-8">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="rounded-lg bg-background pl-8 w-full"
            />
          </div>
          <div
            className="mt-4 pb-4 flex gap-2 items-center overflow-x-auto lg:flex-wrap"
            id="categoriesSwiper"
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/order/${category.id}`}
                className={cn(
                  "text-sm rounded-full py-1 px-4 bg-secondary text-muted-foreground hover:bg-primary/50 hover:text-white transition-colors whitespace-nowrap",
                  category.id === parseInt(params.categoryId) &&
                    "bg-primary text-white"
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2 xl:grid-cols-3">
            {items.map((menuItem) => (
              <Card
                key={menuItem.id}
                className="relative rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl"
              >
                <Image
                  src={menuItem.imgUrl}
                  alt=""
                  fill
                  className="w-full !h-60 object-cover"
                />
                <div className="p-6 bg-background mt-60">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <div>
                      <h3 className="text-xl font-bold">{menuItem.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {menuItem.description}
                      </p>
                    </div>
                    <div className="text-2xl font-bold">
                      {menuItem.price} DA
                    </div>
                  </div>
                  <OrderItemDialog
                    supplements={categorySupplements}
                    menuItem={menuItem}
                  >
                    <Button className="mt-4 w-full">Ajouter au panier</Button>
                  </OrderItemDialog>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
