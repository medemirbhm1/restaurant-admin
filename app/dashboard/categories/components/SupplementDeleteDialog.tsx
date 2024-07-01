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
import { useRouter } from "next/navigation";
import { useState } from "react";

function SupplementDeleteDialog({
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
      const res = await fetch(`/api/supplements/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error();
      }
      toast({
        description: "Supplément supprimée avec succès",
      });
      if (typeof onCancel === "function") {
        onCancel();
        router.refresh();
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
            Etes-vous sûr de vouloir supprimer ce supplément ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div onClick={onCancel}>
            <AlertDialogCancel disabled={loading} className="w-full ">
              Cancel
            </AlertDialogCancel>
          </div>
          <AlertDialogAction disabled={loading} onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default SupplementDeleteDialog;
