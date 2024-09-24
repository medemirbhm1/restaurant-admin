import { Separator } from "@radix-ui/react-dropdown-menu";
import OrdersTable from "./ReservationsTable";

async function ReservationClient() {
  return (
    <div>
      <h2 className="font-bold text-5xl">Réservations</h2>
      <Separator className="mt-10" />
      <OrdersTable />
    </div>
  );
}

export default ReservationClient;
