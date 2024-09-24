"use client";
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
import {  buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

function DeleteAction({
  id,
  children,
  open,
  onCancel,
}: {
  id: string;
  children?: React.ReactNode;
  open?: boolean;
  onCancel?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error();
      }
      toast({
        description: "élément supprimée avec succès",
      });
      if (typeof onCancel === "function") {
        onCancel();
        router.refresh();
      } else {
        router.push("/dashboard/reservations");
      }
    } catch (err) {
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
            Etes-vous sûr de vouloir supprimer cette réservation ?
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
          <AlertDialogAction
            onClick={handleDelete}
            className={buttonVariants({ variant: "destructive" })}
            disabled={loading}
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAction;
