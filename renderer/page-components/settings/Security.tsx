import { TextInput } from '@tremor/react';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';

import Button from '@/components/Button';
import LabeledInput from '@/components/LabeledInput';
import API from '@/utils/API';
import notify from '@/utils/notify';

interface SecuritySettingsInputs {
  currentPassword: string;
  newPassword: string;
}

const Security = () => {
  const DEFAULT_VALUES = { currentPassword: '', newPassword: '' };
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SecuritySettingsInputs>({
    defaultValues: DEFAULT_VALUES,
  });

  const updatePassword = async (data: SecuritySettingsInputs) => {
    try {
      const res = await API.patch('/users/updateMe', data);
      notify('success', res.data.message);
      reset(DEFAULT_VALUES);
    } catch (err) {
      console.log(err);

      let message = 'Error';
      if (err instanceof AxiosError) {
        message = err.response?.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      notify('error', message);
    }
  };

  return (
    <form className='space-y-4' id='UPDATE-PASSWORD' onSubmit={handleSubmit(updatePassword)}>
      <span className='text-lg font-semibold'>Security</span>
      <LabeledInput id='current-password' label='Mot de pass'>
        <TextInput
          type='password'
          placeholder='*******'
          {...register('currentPassword', {
            required: { value: true, message: 'Mot de pass est requis' },
          })}
        />
      </LabeledInput>
      <LabeledInput id='new-password' label='Nouveau mot de pass'>
        <TextInput
          type='password'
          placeholder='*******'
          {...register('newPassword', {
            required: { value: true, message: 'Nouveau mot de pass est requis' },
          })}
        />
      </LabeledInput>
      <Button type='submit' form='UPDATE-PASSWORD' loading={isSubmitting}>
        Modifier
      </Button>
    </form>
  );
};

export default Security;
