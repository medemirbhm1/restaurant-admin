import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { order } from "@/lib/schema";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function EditStateAction({
  id,
  children,
  open,
  onCancel,
  action,
}: {
  id: string;
  children?: React.ReactNode;
  open?: boolean;
  onCancel?: () => void;
  action: order["status"] | null;
}) {
  const page = useSearchParams().get("page") || "1";
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const handleUpdate = async () => {
    try {
      if (!action) {
        throw new Error("Action not provided");
      }
      setLoading(true);
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: action,
        }),
      });
      if (!res.ok) {
        throw new Error();
      }
      toast({
        description: "état modifié avec succès",
      });
      if (typeof onCancel === "function") {
        queryClient.setQueryData(
          ["orders", page],
          (old: { orders: order[]; next: boolean }) => {
            return {
              ...old,
              orders: old.orders.map((o) => {
                if (o.id === parseInt(id)) {
                  return {
                    ...o,
                    status: action,
                  };
                }
                return o;
              }),
            };
          }
        );
        onCancel();
      } else {
        await router.push("/dashboard/orders");
      }
    } catch (err) {
      console.log(err);
      toast({
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Etes vous sur de vouloir changer l&apos;état de cette commande
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div onClick={onCancel}>
            <AlertDialogCancel className="w-full" disabled={loading}>
              Annuler
            </AlertDialogCancel>
          </div>
          <AlertDialogAction onClick={handleUpdate} disabled={loading}>
            Continuer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditStateAction;
