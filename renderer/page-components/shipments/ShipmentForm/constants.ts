import { Currencies, ShipmentFormInputs } from './types';

export const ADD_SHIPMENT_DEFAULT_VALUES: ShipmentFormInputs = {
  shipmentDate: new Date(),
  shipmentCode: '',
  productsIds: [],
  productsNames: [],
  productsBought: [],
  expenses: [],
};

export const CURRENCY_OPTIONS = {
  DZD: { icon: 'DZD', field: 'cost_in_dzd' },
  RMB: { icon: '¥', field: 'cost_in_rmb' },
  USD: { icon: '$', field: 'cost_in_usd' },
} as const;

export const BTN_TYPES: Currencies[] = ['Dinar', 'Dollar', 'Renminbi'] as const;
