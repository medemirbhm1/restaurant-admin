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
import { menuItem, supplement } from "@/lib/schema";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import useCart from "@/hooks/useCart";
import { MinusIcon, PlusIcon } from "lucide-react";
import { set } from "date-fns";

const OrderItemFormSchema = z.object({
  supplements: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      price: z.number(),
    })
  ),
});
type OrderItemFormValues = z.infer<typeof OrderItemFormSchema>;

export function OrderItemDialog({
  children,
  supplements,
  menuItem,
}: {
  children?: React.ReactNode;
  supplements: supplement[];
  menuItem: menuItem;
}) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const cart = useCart();
  const [localOpen, setLocalOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<OrderItemFormValues>({
    resolver: zodResolver(OrderItemFormSchema),
    defaultValues: {
      supplements: [],
    },
  });

  const onSubmit = async (values: OrderItemFormValues) => {
    setLoading(true);
    cart.addItem(menuItem, values.supplements, quantity);
    toast({
      title: "Ajouté au panier",
      description: "L' élément a été ajouté à votre panier",
    });
    setLocalOpen(false);
    setLoading(false);
    setQuantity(1);
    form.reset();
  };

  return (
    <Dialog open={localOpen}>
      <DialogTrigger onClick={() => setLocalOpen(true)} asChild>
        {children}
      </DialogTrigger>
      <DialogContent cancelButtonHidden className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter au panier</DialogTitle>
          <DialogDescription>
            Vous pouvez ajouter des suppléments à votre commande
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
            <div className="">
              <FormLabel className="text-base">Quantité</FormLabel>
              <div className="flex justify-center items-center gap-4 font-bold text-lg">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={quantity === 1}
                  onClick={() => setQuantity((old) => old - 1)}
                >
                  <MinusIcon className="w-6 h-6 " />
                </Button>
                {quantity}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setQuantity((old) => old + 1)}
                >
                  <PlusIcon className="w-6 h-6 " />
                </Button>
              </div>
            </div>
            <FormField
              control={form.control}
              name="supplements"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <FormLabel className="text-base">Suppléments</FormLabel>
                    </div>
                    <FormDescription></FormDescription>
                  </div>
                  <div className="space-y-3">
                    {supplements.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="supplements"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          {
                                            id: item.id,
                                            name: item.name,
                                            price: item.price,
                                          },
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value.id !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.name}
                                <div className="text-xs mt-1 text-muted-foreground">
                                  {item.price > 0
                                    ? `+${item.price} DA`
                                    : "Gratuit"}
                                </div>
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter >
              <DialogClose onClick={() => setLocalOpen(false)} asChild>
                <Button disabled={loading} type="button" variant="secondary">
                  Annuler
                </Button>
              </DialogClose>
              <Button disabled={loading} type="submit" className="mb-2">
                Ajouter
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
