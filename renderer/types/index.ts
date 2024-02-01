import { ProductSelect, SaleSelect, ShipmentSelect, ShipmentToProductSelect } from '../../db/schema';
import { Expense, Product } from '../../types';

type productShipment = Pick<ShipmentToProductSelect, 'unitPrice' | 'quantity' | 'shipmentId'> & {
  shipment: ShipmentSelect;
};

interface ProductsWithShipment extends ProductSelect {
  productShipments: productShipment[];
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

interface ProductMonthlyStats {
  month: string;
  purchases: number;
  sales: number;
}
interface ProductSalesStats {
  name: string;
  salesCount: number;
}

interface GetStats {
  productsBought: {
    count: number;
    quantity: number | null;
    total: number | null;
  };
  totalSales: {
    count: number;
    quantity: number | null;
    total: number | null;
  };
  totalExpenses: {
    count: number;
    total: number | null;
  };
  totalShipments: {
    count: number;
    total: number | null;
  };
  productsStatsPerMonth: ProductMonthlyStats[];
  topFiveProducts: ProductSalesStats[];
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
}

interface GetProductsStore {
  names: string[];
  companies: string[];
  categories: string[];
}

export type {
  ProductSelect,
  QueryParameters,
  GetProducts,
  QueryItem,
  IModal,
  Expense,
  GetStats,
  GetProductsStore,
  Product,
  ProductsWithShipment,
  ProductStock,
  GetStock,
  ShipmentWithProducts,
  SalesWithProduct,
  ShipmentSelect,
  ShipmentToProductSelect,
};
