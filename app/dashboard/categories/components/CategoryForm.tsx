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

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ImageUpload from "@/components/ImageUpload";
import { useState } from "react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteAction from "./DeleteAction";

export const creationFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Le nom ne doit pas être vide",
    })
    .max(50, {
      message: "Le nom ne doit pas dépasser 50 caractères",
    })
    .trim(),
  description: z.string().trim(),
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
      if (initialData) {
        const res = await fetch(`/api/categories/${id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast({
          description: "Catégorie modifiée avec succès",
        });
        if (!res.ok) {
          throw new Error();
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast({
          description: "Catégorie ajoutée avec succès",
        });
        if (!res.ok) {
          throw new Error();
        }
      }
      form.reset();
      setLoading(false);
      await router.push("/dashboard/categories");
      router.refresh();
    } catch (err) {
      setLoading(false);
      toast({
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-5xl mb-10">
          {initialData ? "Modifier la catégorie" : "Ajouter une catégorie"}
        </h1>
        {initialData ? (
          <DeleteAction id={id}>
            <Button variant="destructive">
              Supprimer <Trash className="w-4 h-4 ml-2" />
            </Button>
          </DeleteAction>
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
            <Button type="submit" disabled={loading || !form.formState.isDirty}>
              {initialData ? "Modifier" : "Ajouter"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default CategoryForm;
