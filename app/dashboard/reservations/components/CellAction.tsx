"use client";

import React, { useState } from "react";
import { ReservationColumn } from "./Columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, MoreHorizontal, Trash, XIcon } from "lucide-react";
import DeleteAction from "./DeleteAction";
import EditStateAction from "./EditStateAction";
import { order, reservation } from "@/lib/schema";

interface cellActionProps {
  data: ReservationColumn;
}

const CellAction: React.FC<cellActionProps> = ({ data }) => {
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editStateAlert, setEditStateAlert] = useState<{
    open: boolean;
    state: reservation["status"] | null;
  }>({
    open: false,
    state: null,
  });
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {data.status === "pending" ? (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setEditStateAlert({ open: true, state: "confirmed" });
                }}
              >
                <Check className="w-4 h-4 mr-2 inline" />
                Marquer comme confirmée
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditStateAlert({ open: true, state: "cancelled" });
                }}
              >
                <XIcon className="w-4 h-4 mr-2 inline" />
                Marque comme annulée
              </DropdownMenuItem>
            </>
          ) : data.status === "confirmed" ? (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setEditStateAlert({ open: true, state: "completed" });
                }}
              >
                <Check className="w-4 h-4 mr-2 inline" />
                Marquer comme terminée
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditStateAlert({ open: true, state: "cancelled" });
                }}
              >
                <XIcon className="w-4 h-4 mr-2 inline" />
                Marquer comme annulée
              </DropdownMenuItem>
            </>
          ) : null}
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
      <EditStateAction
        id={data.id.toString()}
        open={editStateAlert.open}
        action={editStateAlert.state}
        onCancel={() => setEditStateAlert({ open: false, state: null })}
      />
    </>
  );
};

export default CellAction;
