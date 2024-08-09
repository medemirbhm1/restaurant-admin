"use client";

import React, { useState } from "react";
import { OrderColumn } from "./Columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Check,
  Edit,
  ListCollapse,
  MoreHorizontal,
  Trash,
  XIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import DeleteAction from "./DeleteAction";
import EditStateAction from "./EditStateAction";
import { order } from "@/lib/schema";

interface cellActionProps {
  data: OrderColumn;
}
const CellAction: React.FC<cellActionProps> = ({ data }) => {
  const router = useRouter();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editStateAlert, setEditStateAlert] = useState<{
    open: boolean;
    state: order["status"] | null;
  }>({
    open: false,
    state: null,
  });
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
              router.push(`/dashboard/orders/${data.id}`);
            }}
          >
            <ListCollapse className="w-4 h-4 mr-2" />
            Voir détails
          </DropdownMenuItem>
          {data.status === "pending" ? (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setEditStateAlert({ open: true, state: "ready" });
                }}
              >
                <Check className="w-4 h-4 mr-2 inline" />
                Marquer comme prête
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditStateAlert({ open: true, state: "cancelled" });
                }}
              >
                <XIcon className="w-4 h-4 mr-2 inline" />
                Annuler la commande
              </DropdownMenuItem>
            </>
          ) : data.status === "ready" ? (
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
                Annuler la commande
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
