"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { SupplementDialog } from "./SupplementDialog";
import { supplement } from "@/lib/schema";
import SupplementDeleteDialog from "./SupplementDeleteDialog";

function SupplementAction({ supplementData }: { supplementData: supplement }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            modifier
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
            <Trash className="w-4 h-4 mr-2 inline" />
            supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SupplementDialog
        initialData={supplementData}
        open={editDialogOpen}
        onCancel={() => setEditDialogOpen(false)}
      />
      <SupplementDeleteDialog
        id={supplementData.id.toString()}
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}

export default SupplementAction;
