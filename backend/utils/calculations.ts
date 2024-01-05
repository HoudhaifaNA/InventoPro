import { Expense, ProductSelect } from '../../db/schema';

interface Product {
  id: string;
  quantity: number;
  totalPrice: number;
}

export const calculateExpensesTotal = (expenses: Expense[]) => {
  let total = expenses.reduce((prev, curr) => prev + curr.cost_in_dzd, 0);

  return total;
};

export const calculateShipmentTotal = (products: Product[]) => {
  let total = products.reduce((prev, curr) => prev + curr.totalPrice, 0);

  return total;
};
