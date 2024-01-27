import { isAxiosError } from 'axios';

import { ShipmentFormInputs } from './types';
import API from '@/utils/API';
import notify from '@/utils/notify';

type Status = 'success' | 'error';

interface Config {
  isEdit: boolean;
  id: string | number;
}

const submitShipment = async (data: ShipmentFormInputs, config?: Config): Promise<Status> => {
  let status: Status = 'success';
  try {
    let values = data;

    //@ts-ignore
    if (!data.arrivalDate) values.arrivalDate = null;
    const isEdit = config?.isEdit && config.id;
    const method = isEdit ? 'patch' : 'post';
    const url = isEdit ? `/shipments/${config.id}` : '/shipments';
    const res = await API[method](url, values);
    notify('success', res.data.message);
  } catch (err) {
    console.log(err);

    let message = 'Error';
    if (isAxiosError(err)) {
      message = err.response?.data.message;
    } else if (err instanceof Error) {
      message = err.message;
    }
    notify('error', message);
    status = 'error';
  }
  return status;
};

export default submitShipment;
