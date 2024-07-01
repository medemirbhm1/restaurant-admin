"use client";
import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import Image from "next/image";

export type CategoryColumn = {
  id: number;
  name: string;
  imgUrl: string;
  //   createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "imgUrl",
    header: "",
    cell: ({ row }) => (
      <Image
        src={row.original.imgUrl}
        width={100}
        height={100}
        className="object-cover rounded w-28 h-16"
        alt=""
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Nom",
  },

  {
    accessorKey: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
