"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { supplement } from "@/lib/schema";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";

export const supplementFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Le nom ne doit pas être vide",
    })
    .max(50, {
      message: "Le nom ne doit pas dépasser 50 caractères",
    })
    .trim(),
  price: z.coerce
    .number({
      message: "Le prix doit être un nombre",
    })
    .min(0, {
      message: "Le prix doit être supérieur ou égal à 0",
    }),
});
type SupplementFormValues = z.infer<typeof supplementFormSchema>;

export function SupplementDialog({
  initialData,
  open,
  onCancel,
  children,
}: {
  initialData?: supplement;
  open?: boolean;
  onCancel?: () => void;
  children?: React.ReactNode;
}) {
  const [localOpen, setLocalOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<SupplementFormValues>({
    resolver: zodResolver(supplementFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          price: initialData.price,
        }
      : undefined,
  });

  const onSubmit = async (values: SupplementFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const res = await fetch(`/api/supplements/${initialData.id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast({
          description: "Supplément modifié avec succès",
        });
        if (!res.ok) {
          throw new Error();
        }
      } else {
        const res = await fetch("/api/supplements", {
          method: "POST",
          body: JSON.stringify({ ...values, categoryId: +params.id }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast({
          description: "Supplément ajouté avec succès",
        });
        if (!res.ok) {
          throw new Error();
        }
      }
      setLoading(false);
      await router.refresh();
      if (typeof onCancel === "function") {
        onCancel();
      } else {
        setLocalOpen(false);
      }
    } catch (err) {
      setLoading(false);
      toast({
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog open={open !== undefined ? open : localOpen}>
      <DialogTrigger
        onClick={() => {
          if (typeof open === "undefined") {
            setLocalOpen(true);
          }
        }}
        asChild
      >
        {children}
      </DialogTrigger>
      <DialogContent cancelButtonHidden className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? `Modifier le supplément ${initialData.name}`
              : "Ajouter un supplément"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Les modifications que vous apportez seront appliquées à tous les produits de cette catégorie"
              : "Le supplément que vous ajoutez sera disponible pour les produits de cette catégorie"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              return form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Frittes"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Si c'est gratuit, mettez 0"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose
                onClick={() => {
                  if (typeof onCancel === "function") {
                    onCancel();
                  } else {
                    setLocalOpen(false);
                  }
                }}
                asChild
              >
                <Button disabled={loading} type="button" variant="secondary">
                  Annuler
                </Button>
              </DialogClose>
              <Button disabled={loading} type="submit">
                Sauvegarder
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
