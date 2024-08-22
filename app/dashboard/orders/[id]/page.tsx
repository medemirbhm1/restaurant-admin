import React from "react";
import { redirect } from "next/navigation";
import { getOrder } from "@/lib/data-access";
import Image from "next/image";
import DeleteAction from "../components/DeleteAction";
// import EditStateAction from "../components/EditStateAction";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

async function page({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  let order = null;
  const idInt = parseInt(id);
  if (!isNaN(idInt)) {
    order = await getOrder(idInt);
  }
  if (!order) {
    return redirect("/dashboard/orders");
  }
  return (
    <div className="container">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-5xl mb-10">Commande N°{order.id}</h1>
        <div>
          <DeleteAction id={order.id.toString()}>
            <Button variant="destructive">
              Supprimer <Trash className="w-4 h-4 ml-2" />
            </Button>
          </DeleteAction>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-10 justify-between">
        <div>
          <span className="text-lg font-semibold mr-2 inline-block">
            Identifiant:
          </span>
          <span>{order.id}</span>
        </div>
        <div>
          <span className="text-lg font-semibold mr-2 inline-block">Nom:</span>
          <span>{order.clientFullName}</span>
        </div>
        <div>
          <span className="text-lg font-semibold mr-2 inline-block">
            Téléphone:
          </span>
          <span>{order.clientPhone}</span>
        </div>
        <div>
          <span className="text-lg font-semibold mr-2 inline-block">type:</span>
          <span>{order.type === "delivery" ? "Livraison" : "Ramassage"}</span>
        </div>
        {order.type === "delivery" && (
          <div>
            <span className="text-lg font-semibold mr-2 inline-block">
              Adresse:
            </span>
            <span>{order.address}</span>
          </div>
        )}
        <div>
          <span className="text-lg font-semibold mr-2 inline-block">type:</span>
          <span>{order.type === "delivery" ? "Livraison" : "Ramassage"}</span>
        </div>
        <div>
          <span className="text-lg font-semibold mr-2 inline-block">Etat:</span>
          <span>
            {
              {
                pending: "En attente",
                ready: "Prête",
                completed: "Livré",
                cancelled: "Annulée",
              }[order.status]
            }
          </span>
        </div>
        <div>
          <span className="text-lg font-semibold mr-2 inline-block">
            Date de création:
          </span>
          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="text-lg font-semibold mr-2 inline-block">
            Heure de création:
          </span>
          <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
        </div>
        <div>
          <span className="text-lg font-semibold mr-2 inline-block">
            Total:
          </span>
          <span>
            {order.ordersToMenuItems
              .reduce(
                (acc, orderItem) =>
                  acc +
                  (orderItem.menuItem.price +
                    orderItem.ordersToMenuItemsToSupplements.reduce(
                      (acc, orderItemSupplement) =>
                        acc + orderItemSupplement.supplement.price,
                      0
                    )) *
                    orderItem.quantity,
                0
              )
              .toLocaleString("fr-FR", {
                style: "currency",
                currency: "DZA",
              })}
          </span>
        </div>
      </div>
      <div className="mt-10">
        {order.ordersToMenuItems.map((orderItem) => (
          <div key={orderItem.id} className="flex gap-4 mb-4 text-sm">
            <Image
              src={orderItem.menuItem.imgUrl}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-lg"
              alt=""
            />
            <div>
              <p className="font-semibold text-lg">
                {orderItem.menuItem.name} X {orderItem.quantity}
              </p>
              <p className="text-muted-foreground">
                {orderItem.ordersToMenuItemsToSupplements.length
                  ? orderItem.ordersToMenuItemsToSupplements
                      .map(
                        (orderItemSupplement) =>
                          orderItemSupplement.supplement.name
                      )
                      .join(", ")
                  : "Sans suppléments"}
              </p>
              <p>
                {(orderItem.menuItem.price +
                  orderItem.ordersToMenuItemsToSupplements.reduce(
                    (acc, orderItemSupplement) =>
                      acc + orderItemSupplement.supplement.price,
                    0
                  )) *
                  orderItem.quantity}
                DA
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
