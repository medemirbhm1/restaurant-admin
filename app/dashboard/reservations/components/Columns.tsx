"use client";
import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import { cn } from "@/lib/utils";
import { reservation } from "@/lib/schema";
import { ReservationStates } from "@/lib/constants";

export type ReservationColumn = {
  id: number;
  placesNb: number;
  fullName: string;
  dateTime: Date;
  phone: number;
  status: reservation["status"];
  createdAt: Date;
  notes: string;
};

export const columns: ColumnDef<ReservationColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
              : row.original.status === "confirmed"
              ? "bg-green-600"
              : row.original.status === "completed"
              ? "bg-slate-950"
              : "bg-red-500"
          )}
        />
        <span>{ReservationStates[row.original.status]}</span>
      </div>
    ),
  },
  {
    accessorKey: "dateTime",
    header: "Date",
    cell: ({ row }) => (
      <span>{new Date(row.original.dateTime).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "dateTime",
    header: "Heure",
    cell: ({ row }) => (
      <span>{new Date(row.original.dateTime).toLocaleTimeString()}</span>
    ),
  },
  {
    accessorKey: "placesNb",
    header: "Places",
  },
  {
    accessorKey: "fullName",
    header: "Nom",
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },

  {
    accessorKey: "createdAt",
    header: "Créée le",
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleTimeString()}</span>
    ),
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
