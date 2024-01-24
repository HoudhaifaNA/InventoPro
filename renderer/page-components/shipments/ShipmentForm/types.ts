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
  arrivalDate?: Date;
  shipmentCode: string;
  productsIds: string[];
  productsNames: string[];
  productsBought: Product[];
  expenses: Expense[];
}

export type Currencies = 'Dinar' | 'Dollar' | 'Renminbi';
