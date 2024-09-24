"use client";
import useOrderHistory from "@/hooks/useOrderHistory";
import { OrderStates, OrderTypes } from "@/lib/constants";
import { order } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChefHatIcon, ClockIcon, XIcon } from "lucide-react";
import React from "react";

function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      try {
        const ordersIds = useOrderHistory.getState().orders;
        const res = await fetch(`/api/orders?ids=${ordersIds.join(",")}`);
        return res.json();
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  });
  return (
    <main className="container mb-52">
      <h1 className="text-3xl mt-14 font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
        Mes commandes
      </h1>
      {!isLoading ? (
        data && data.orders?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-10">
            {data.orders.map((order: order) => (
              <div
                key={order.id}
                className="border relative border-gray-200 rounded-3xl flex flex-col items-center py-20 px-4 text-center"
              >
                <div className="absolute top-4 right-4">
                  {
                    {
                      pending: (
                        <ClockIcon className="w-8 h-8 text-orange-500" />
                      ),
                      ready: <ChefHatIcon className="w-8 h-8 text-green-500" />,
                      completed: <CheckIcon className="w-8 h-8 text-black" />,
                      cancelled: <XIcon className="w-8 h-8 text-red-500" />,
                    }[order.status]
                  }
                </div>
                <p className="text-4xl font-bold">#N°{order.number}</p>
                <p>{OrderTypes[order.type]}</p>
                {order.type === "delivery" && <p>{order.address}</p>}
                <p className="text-gray-500">
                  Ajouté le {new Date(order.createdAt).toLocaleDateString()} à{" "}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
                <p
                  className={cn(
                    "text-lg font-bold",
                    {
                      pending: "text-orange-500",
                      ready: "text-green-500",
                      completed: "text-black",
                      cancelled: "text-red-500",
                    }[order.status]
                  )}
                >
                  {OrderStates[order.status]}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-40">Aucune commande</p>
        )
      ) : (
        <p className="text-center  animate-pulse mt-40">Chargement...</p>
      )}
    </main>
  );
}

export default Page;
