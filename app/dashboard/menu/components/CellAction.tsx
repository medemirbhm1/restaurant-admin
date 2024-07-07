"use client";

import React, { useState } from "react";
import { MenuItemColumn } from "./Columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import DeleteAction from "./DeleteAction";

interface cellActionProps {
  data: MenuItemColumn;
}
const CellAction: React.FC<cellActionProps> = ({ data }) => {
  const router = useRouter();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              router.push(`/dashboard/menu/${data.id}`);
            }}
          >
            <Edit className="w-4 h-4 mr-2" />
            modifier
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setDeleteAlertOpen(true)}>
            <Trash className="w-4 h-4 mr-2 inline" />
            supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteAction
        id={data.id.toString()}
        open={deleteAlertOpen}
        onCancel={() => setDeleteAlertOpen(false)}
      />
    </>
  );
};

export default CellAction;
