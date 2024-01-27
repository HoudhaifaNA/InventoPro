export interface SaleFormInputs {
  soldAt: Date;
  productId: string;
  quantity: number;
  type: 'retail' | 'wholesale';
  price: number;
  total: number;
}
