"use client";
import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import { cn } from "@/lib/utils";
import { order } from "@/lib/schema";

export type OrderColumn = {
  id: number;
  clientFullName: string;
  number: number;
  status: order["status"];
  type: order["type"];
  createdAt: Date;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "number",
    header: "Numéro",
  },
  {
    accessorKey: "clientFullName",
    header: "Nom",
  },
  {
    accessorKey: "status",
    header: "État",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span
          className={cn(
            "w-4 h-4 rounded-full",
            row.original.status === "pending"
              ? "bg-orange-500"
              : row.original.status === "ready"
              ? "bg-green-600"
              : row.original.status === "completed"
              ? "bg-slate-950"
              : "bg-red-500"
          )}
        />
        <span>{row.original.status}</span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "createdAt",
    header: "Heure",
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleTimeString()}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
