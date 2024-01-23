import { SubmitHandler } from 'react-hook-form';
import { AxiosError } from 'axios';

import { ShipmentFormInputs } from './types';
import API from '@/utils/API';
import notify from '@/utils/notify';

type Status = 'success' | 'error';

interface Config {
  isEdit: boolean;
  id: string | number;
}

const submitShipment = async (data: ShipmentFormInputs, config?: Config): Promise<Status> => {
  try {
    const isEdit = config?.isEdit && config.id;
    const method = isEdit ? 'patch' : 'post';
    const url = isEdit ? `/shipments/${config.id}` : '/shipments';
    const res = await API[method](url, data);
    notify('success', res.data.message);
  } catch (err) {
    console.log(err);

    let message = 'Error';
    if (err instanceof AxiosError) {
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