"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Checkbox } from "@/components/ui/checkbox";
import { type menuItemCategory, type menuItem } from "@/lib/schema";

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
  price: z.coerce
    .number({
      message: "Le prix doit être un nombre",
    })
    .min(0, {
      message: "Prix non valide",
    }),
  enabled: z.boolean().optional(),
  categoryId: z.coerce.number(),
});
type MenuItemFormValues = z.infer<typeof creationFormSchema>;

function CategoryForm({
  initialData,
  id,
  categories,
}: {
  initialData?: menuItem | null;
  id: string;
  categories: menuItemCategory[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(creationFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          imgUrl: initialData.imgUrl,
          price: initialData.price,
          enabled: initialData.enabled,
          categoryId: initialData.categoryId,
        }
      : undefined,
  });

  async function onSubmit(values: MenuItemFormValues) {
    try {
      setLoading(true);

      if (initialData) {
        const res = await fetch(`/api/menuItems/${id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error();
        }
        toast({
          description: "Element modifié avec succès",
        });
      } else {
        const res = await fetch("/api/menuItems", {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error();
        }
        toast({
          description: "Element ajouté avec succès",
        });
        const { id } = await res.json();
        router.push(`/dashboard/menu/${id}`);
      }
      form.reset();
      setLoading(false);
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
          {initialData ? "Modifier l'élément" : "Ajouter un élément"}
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
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="10"
                      type="number"
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    La catégorie à laquelle appartient cet élément
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {initialData ? (
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {field.value ? "Activé" : "Désactivé"}
                      </FormLabel>
                      <FormDescription>
                        Si désactivé, cet élément ne sera pas visible sur le
                        site
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            ) : null}

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
