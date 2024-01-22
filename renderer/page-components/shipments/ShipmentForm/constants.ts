import { ShipmentFormInputs } from './types';

export const ADD_SHIPMENT_DEFAULT_VALUES: ShipmentFormInputs = {
  shipmentDate: new Date(),
  arrivalDate: null,
  shipmentCode: '',
  productsList: [],
  productsBought: [],
  expense: [],
};
