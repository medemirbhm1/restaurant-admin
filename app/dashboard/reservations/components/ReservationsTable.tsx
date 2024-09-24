"use client";

import { DataTable } from "@/components/ui/DataTable";
import { columns } from "./Columns";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export const getReservations = async (page: string) => {
  try {
    const res = await fetch(`/api/reservations?page=${page}`, {
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

export default function ReservationsTable() {
  const page = useSearchParams().get("page") || "1";
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["reservations", page],
    queryFn: () => getReservations(page),
  });
  
  return data?.reservations?.length ? (
    <>
      <DataTable
        columns={columns}
        data={data.reservations}
        filterKey="clientFullName"
        disablePagination
      />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(`/dashboard/reservations?page=${parseInt(page) - 1}`)
          }
          disabled={parseInt(page) === 1}
        >
          précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(`/dashboard/reservations?page=${parseInt(page) + 1}`)
          }
          disabled={!data?.next}
        >
          Suivant
        </Button>
      </div>
    </>
  ) : null;
}
