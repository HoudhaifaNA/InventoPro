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

interface IModal {
  id: string;
  title: string;
  children: () => JSX.Element;
}

interface GetProducts {
  results: number;
  start: number;
  products: ProductsWithShipment[];
  companiesList: string[];
  categoriesList: string[];
}

export type { ProductSelect, QueryParameters, GetProducts, QueryItem, IModal, ProductsWithShipment, ShipmentSelect };
