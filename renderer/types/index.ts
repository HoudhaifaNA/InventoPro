import { ProductSelect, ShipmentSelect } from '../../db/schema';

interface ProductsWithShipment extends ProductSelect {
  shipments: ShipmentSelect[];
}

type QueryValue = string | number | boolean;
interface QueryParameters {
  [key: string]: QueryValue;
}
type QueryItem = {
  query: string;
  value: QueryValue;
};

export type { ProductSelect, QueryParameters, QueryItem, ProductsWithShipment, ShipmentSelect };
