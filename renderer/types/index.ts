import { ProductSelect, ShipmentSelect } from '../../db/schema';
import { Expense, Product } from '../../types';

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
  children: ({ id }: { id: string }) => JSX.Element;
  additionalData?: any;
}

interface GetProducts {
  results: number;
  start: number;
  products: ProductsWithShipment[];
  companiesList: string[];
  categoriesList: string[];
}

export type {
  ProductSelect,
  QueryParameters,
  GetProducts,
  QueryItem,
  IModal,
  Expense,
  Product,
  ProductsWithShipment,
  ShipmentSelect,
};
