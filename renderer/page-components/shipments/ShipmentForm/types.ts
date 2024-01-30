import { Expense, Product } from 'types';

export interface ProductsItem {
  id: string;
  name: string;
  reference: string;
}
export interface ProductsList {
  products: ProductsItem[];
}

interface ProductBought extends Product {
  percentage: number;
}

export interface ShipmentFormInputs {
  shipmentDate: Date;
  arrivalDate?: Date;
  shipmentCode: string;
  productsIds: string[];
  productsNames: string[];
  productsBought: ProductBought[];
  expenses: Expense[];
}

export type Currencies = 'Dinar' | 'Dollar' | 'Renminbi';
