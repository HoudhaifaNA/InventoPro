import { SubmitHandler } from 'react-hook-form';
import { AxiosError } from 'axios';

import { AddProductFormInputs } from './types';
import API from '@/utils/API';
import notify from '@/utils/notify';

type Status = 'success' | 'error';

interface Config {
  isEdit: boolean;
  id: string | number;
}

const submitProduct = async (data: AddProductFormInputs, config?: Config): Promise<Status> => {
  const formData = new FormData();

  let status: Status = 'success';
  Object.entries(data).map(([key, value]) => {
    if (key === 'currentShipmentId' && !value) {
      formData.append(key, 'undefined');
      return;
    }
    formData.append(key, value);
  });

  try {
    const isEdit = config?.isEdit && config.id;
    const method = isEdit ? 'patch' : 'post';
    const url = isEdit ? `/products/${config.id}` : '/products';
    const res = await API[method](url, formData);
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

export default submitProduct;
