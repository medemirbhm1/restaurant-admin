"use client";

import { DataTable } from "@/components/ui/DataTable";
import { columns } from "./Columns";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export const getOrders = async (page: string) => {
  try {
    const res = await fetch(`/api/orders?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default function OrdersTable() {
  const page = useSearchParams().get("page") || "1";
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["orders", page],
    queryFn: () => getOrders(page),
  });
  return data?.orders?.length ? (
    <>
      <DataTable
        columns={columns}
        data={data.orders}
        filterKey="clientFullName"
        disablePagination
      />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(`/dashboard/orders?page=${parseInt(page) - 1}`)
          }
          disabled={parseInt(page) === 1}
        >
          précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(`/dashboard/orders?page=${parseInt(page) + 1}`)
          }
          disabled={!data?.next}
        >
          Suivant
        </Button>
      </div>
    </>
  ) : null;
}
