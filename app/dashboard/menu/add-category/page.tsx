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
import { CldUploadWidget } from "next-cloudinary";
import ImageUpload from "@/components/ImageUpload";
import { useState } from "react";

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

function Page() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(creationFormSchema),
    defaultValues: {
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
  return (
    <div>
      <h1 className="font-bold text-5xl mb-10">Ajouter une Catégorie</h1>
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

export default Page;
