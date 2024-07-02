import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./Columns";

async function CategoryClient() {
  const menuItems = await db.query.menuItems.findMany({
    columns: {
      id: true,
      name: true,
      imgUrl: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-5xl">Menu</h2>
        <Link href="/dashboard/menu/add-item">
          <Button>
            Ajouter <Plus className="w-5 h-5 ml-1" />
          </Button>
        </Link>
      </div>
      <Separator className="mt-10" />
      <DataTable columns={columns} data={menuItems} filterKey="name" />
    </div>
  );
}

export default CategoryClient;
