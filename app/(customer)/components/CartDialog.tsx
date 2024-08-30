"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  MinusCircle,
  PlusCircle,
  ShoppingBasket,
  Trash,
  XIcon,
} from "lucide-react";
import useCart from "@/hooks/useCart";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const OrderFormSchema = z
  .object({
    clientFullName: z.string({
      message: "Le nom est requis",
    }),
    clientPhone: z.string({
      message: "Le numéro de téléphone est requis",
    }),
    type: z.enum(["delivery", "pickup"]),
    address: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine(({ type, address }, ctx) => {
    if (type === "delivery" && !address) {
      ctx.addIssue({
        code: "custom",
        message: "L'adresse est requise pour la livraison",
        path: ["address"],
      });
    }
  });

type OrderFormValues = z.infer<typeof OrderFormSchema>;

export default function CartDialog() {
  const [loading, setLoading] = useState(false);
  const cart = useCart();
  const [activeStep, setActiveStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
  });
  const onSubmit = async (values: OrderFormValues) => {
    try {
      setLoading(true);
      const orderItems = cart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        supplements: item.supplements.map((supplement) => supplement.id),
      }));
      const res = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({ ...values, orderItems }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error();
      }
      cart.removeAll();
      const { orderNum } = await res.json();
      setOrderNumber(orderNum);
      setActiveStep(3);
      
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setActiveStep(1);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="icon" className="rounded-full">
          <ShoppingBasket className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {activeStep !== 3 ? (
            <>
              <DialogTitle>Mon panier</DialogTitle>
              <DialogDescription>
                Vous avez {cart.items.length} éléments dans votre panier
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle>Commande envoyée avec succès</DialogTitle>
              <DialogDescription>
                On vous contactera lorsque votre commande sera prête
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {activeStep === 3 ? (
          <div className="flex flex-col items-center text-center gap-4">
            <p className="text-4xl font-bold">N°{orderNumber}</p>
            <p className="text-muted-foreground">
              Vous pouvez suivre votre commande en utilisant ce numéro
            </p>
          </div>
        ) : cart.items.length ? (
          activeStep === 1 ? (
            <div>
              {cart.items.map((item) => (
                <div key={item.uuid} className="flex gap-4 mb-4 text-sm">
                  <Image
                    src={item.imgUrl}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg"
                    alt=""
                  />
                  <div>
                    <p>{item.name}</p>
                    <p className="text-muted-foreground">
                      {item.supplements
                        .map((supplement) => supplement.name)
                        .join(", ")}
                    </p>
                    <p>
                      {(item.price +
                        item.supplements.reduce(
                          (acc, supplement) => acc + supplement.price,
                          0
                        )) *
                        item.quantity}
                      DA
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        className="w-fit h-fit"
                        variant="ghost"
                        size="icon"
                        onClick={() => cart.increaseQunatity(item.uuid)}
                      >
                        <PlusCircle className="w-5 h-5" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        className="w-fit h-fit"
                        variant="ghost"
                        size="icon"
                        onClick={() => cart.decreaseQunatity(item.uuid)}
                        disabled={item.quantity === 1}
                      >
                        <MinusCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="ml-auto self-center">
                    <Button
                      className="w-fit h-fit"
                      variant="ghost"
                      size="icon"
                      onClick={() => cart.removeItem(item.uuid)}
                    >
                      <Trash className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
              <DialogFooter>
                <Button onClick={() => setActiveStep(2)} className="w-full">
                  Commander
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="clientFullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="john doe"
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
                  name="clientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de téléphone</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="XXXXXXXXXX"
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pickup">Ramassage</SelectItem>
                          <SelectItem value="delivery">Livraison</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Sélectionner comment vous voulez récuppérer votre
                        commande
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("type") === "delivery" ? (
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Adresse"
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Notes{" "}
                        <span className="text-muted-foreground">
                          (optionnel)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Si vous voulez préciser quelque chose"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="flex flex-col lg:flex-row gap-2">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    Envoyer la commande
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setActiveStep(1)}
                  >
                    Retour
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
