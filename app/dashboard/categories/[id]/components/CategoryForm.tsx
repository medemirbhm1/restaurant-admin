"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CldUploadWidget } from "next-cloudinary";
import ImageUpload from "@/components/ImageUpload";
import { useState } from "react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export const creationFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Le nom ne doit pas être vide",
    })
    .max(50, {
      message: "Le nom ne doit pas dépasser 50 caractères",
    }),
  description: z.string(),
  imgUrl: z.string().min(1, {
    message: "L'image est obligatoire",
  }),
});
type CategoryFormValues = z.infer<typeof creationFormSchema>;

function CategoryForm({
  initialData,
  id,
}: {
  initialData?: CategoryFormValues | null;
  id: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(creationFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: CategoryFormValues) {
    try {
      setLoading(true);
      console.log(values);
      await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      form.reset();
      setLoading(false);
      toast({
        description: "Catégorie ajouté avec succès",
      });
    } catch (err) {
      console.error(err);
    }
  }
  const handleDelete = async () => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      router.push("/dashboard/categories");
    } catch (err) {}
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-5xl mb-10">
          {initialData ? "Modifier la catégorie" : "Ajouter une catégorie"}
        </h1>
        {initialData ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                Supprimer <Trash className="w-4 h-4 ml-2" />
              </Button>
            </AlertDialogTrigger>
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
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>

      <div className="max-w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="pizza" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de la catégorie"
                      className="resize-none"
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
              name="imgUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Ajouter</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default CategoryForm;
