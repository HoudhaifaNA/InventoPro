import { ProductSelect, SaleSelect, ShipmentSelect, ShipmentToProductSelect } from '../../db/schema';
import { Expense, Product } from '../../types';

interface ProductsWithShipment extends ProductSelect {
  shipments: ShipmentSelect[];
}

interface ShipmentWithProducts extends ShipmentSelect {
  shipmentProducts: Pick<
    ShipmentToProductSelect,
    'expenseSlice' | 'productId' | 'quantity' | 'unitPrice' | 'totalPrice'
  >[];
}

interface SalesWithProduct extends SaleSelect {
  product: Pick<ProductSelect, 'name' | 'reference'>;
}

interface ProductStock {
  id: string;
  name: string;
  reference: string;
  bought: number;
  sold: number;
  stock: number;
}
interface GetStock {
  stock: ProductStock[];
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
  ProductStock,
  GetStock,
  ShipmentWithProducts,
  SalesWithProduct,
  ShipmentSelect,
  ShipmentToProductSelect,
};
