
import { Separator } from "@radix-ui/react-dropdown-menu";
import OrdersTable from "./OrdersTable";

async function OrderClient() {
  return (
    <div>
      <h2 className="font-bold text-5xl">Commandes</h2>
      <Separator className="mt-10" />
      <OrdersTable />
    </div>
  );
}

export default OrderClient;
