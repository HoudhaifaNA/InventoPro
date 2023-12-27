import { Expense, Product } from '@/types';

export const calculateExpensesTotal = (expenses: Expense[]) => {
  let total = expenses.reduce((prev, curr) => prev + curr.cost_in_dzd, 0);

  return total;
};

export const calculateShipmentTotal = (products: Product[]) => {
  let total = products.reduce((prev, curr) => prev + curr.totalPrice, 0);

  return total;
};

export const calculatePriceByPercentage = (percentage: number, price: number, isSQL: boolean) => {
  return (percentage * price) / 100 + price;
};
