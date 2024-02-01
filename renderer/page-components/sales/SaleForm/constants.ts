import { SaleFormInputs } from './types';

export const SALE_PRODUCT_DEFAULT_VALUES: SaleFormInputs = {
  soldAt: new Date(),
  productId: '',
  quantity: 1,
  type: 'retail',
  price: 0,
  total: 0,
};
