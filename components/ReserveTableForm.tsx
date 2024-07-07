"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const creationFormSchema = z.object({
  fullName: z.string({
    message: "Le nom ne doit pas être vide",
  }),
  phone: z.coerce.number().int().positive(),
  placesNb: z.coerce.number().int().min(2, {
    message: "Le nombre de places doit être supérieur à 2",
  }),
  date: z.date(),
  notes: z.string(),
});

type ReservationFormValues = z.infer<typeof creationFormSchema>;

function ReserveTableForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(creationFormSchema),
  });
  const onSubmit = async (values: ReservationFormValues) => {
    console.log(values);
  };
  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre nom </FormLabel>
                  <FormControl>
                    <Input
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
              name="phone"
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
              name="placesNb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de places</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ReserveTableForm;
