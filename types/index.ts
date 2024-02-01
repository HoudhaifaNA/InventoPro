export interface Expense {
  id: string;
  type: 'DZD' | 'RMB' | 'USD';
  raison: string;
  exr: number;
  cost_in_usd: number;
  cost_in_rmb: number;
  cost_in_dzd: number;
}

export const isValidExpenses = (expenses: any): expenses is Expense[] => {
  if (!Array.isArray(expenses)) {
    return false;
  }

  for (const exp of expenses) {
    if (
      typeof exp === 'object' &&
      typeof exp.id === 'string' &&
      ['DZD', 'RMB', 'USD'].indexOf(exp.type) !== -1 &&
      typeof exp.raison === 'string' &&
      typeof exp.exr === 'number' &&
      typeof exp.cost_in_dzd === 'number' &&
      typeof exp.cost_in_usd === 'number' &&
      typeof exp.cost_in_rmb === 'number'
    ) {
      continue;
    } else {
      return false;
    }
  }
  return true;
};

export interface Product {
  id: string;
  quantity: number;
  expenseSlice: number;
  totalPrice: number;
}

export const isValidProducts = (products: any): products is Product[] => {
  if (!Array.isArray(products)) {
    return false;
  }

  for (const product of products) {
    if (
      typeof product === 'object' &&
      typeof product.id === 'string' &&
      typeof product.quantity === 'number' &&
      typeof product.expenseSlice === 'number' &&
      typeof product.totalPrice === 'number'
    ) {
      continue;
    } else {
      return false;
    }
  }

  return true;
};
