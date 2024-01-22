import { Expense, Product } from 'types';

export interface ProductsItem {
  id: string;
  name: string;
}
export interface ProductsList {
  products: ProductsItem[];
}

export interface ShipmentFormInputs {
  shipmentDate: Date;
  arrivalDate: Date | null;
  shipmentCode: string;
  productsList: string[];
  productsBought: Product[];
  expense: Expense[];
}
