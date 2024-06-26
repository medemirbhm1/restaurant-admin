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
  const router = useRouter();
  const { toast } = useToast();
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error();
      }
      toast({
        description: "Catégorie supprimée avec succès",
      });
      if (typeof onCancel === "function") {
        onCancel();
        router.refresh();
      } else {
        router.push("/dashboard/categories");
      }
    } catch (err) {
      toast({
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Etes-vous sûr de vouloir supprimer cette catégorie ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div onClick={onCancel}>
            <AlertDialogCancel className="w-full ">Cancel</AlertDialogCancel>
          </div>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAction;
