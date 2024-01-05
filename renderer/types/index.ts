import { ProductSelect, ShipmentSelect } from '../../db/schema';

interface ProductsWithShipment extends ProductSelect {
  shipments: ShipmentSelect[];
}
export type { ProductSelect, ProductsWithShipment, ShipmentSelect };
