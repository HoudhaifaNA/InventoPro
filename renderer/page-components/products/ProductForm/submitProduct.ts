import { SubmitHandler } from 'react-hook-form';
import { AxiosError } from 'axios';

import { AddProductFormInputs } from './types';
import API from '@/utils/API';
import notify from '@/utils/notify';

type Status = 'success' | 'error';
const submitProduct: SubmitHandler<AddProductFormInputs> = async (data): Promise<Status> => {
  const formData = new FormData();

  let status: Status = 'success';
  Object.entries(data).map(([key, value]) => {
    formData.append(key, value);
  });

  try {
    const res = await API.post('/products', formData);
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