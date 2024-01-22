import { AxiosError } from 'axios';

import API from '@/utils/API';
import notify from '@/utils/notify';
import { ConfirmationalInputs, FormType } from './types';

type Status = 'success' | 'error';

interface Config {
  type: FormType;
  id: string | number;
}

const submitForm = async (data: ConfirmationalInputs, { type, id }: Config): Promise<Status> => {
  let status: Status = 'success';
  let url;
  if (type === 'd-products') {
    url = `/products/${id}`;
  }

  try {
    const res = await API.delete(url, { data });
    notify('success', 'Success');
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

export default submitForm;
