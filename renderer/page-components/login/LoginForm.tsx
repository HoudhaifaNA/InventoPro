import { TextInput } from '@tremor/react';
import { isAxiosError } from 'axios';

import LabeledInput from '@/components/LabeledInput';
import Button from '@/components/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import API from '@/utils/API';
import notify from '@/utils/notify';
import redirectPath from '@/utils/redirectPath';
interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      await API.post('/users/login', data);
      notify('success', 'Connecté avec succès');

      setTimeout(() => {
        redirectPath('/dashboard');
      }, 500);
    } catch (err) {
      console.log(err);

      let message = 'Error';
      if (isAxiosError(err)) {
        message = err.response?.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      notify('error', message);
    }
  };

  return (
    <div className='flex basis-full  flex-col items-center gap-14 rounded-md bg-white p-4 pb-36 md:basis-2/3 lg:basis-2/5'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='flex h-48 items-center text-5xl font-bold text-rose-600'>inventoPro</h1>
        <h1 className='text-4xl font-bold'>Content de te revoir!</h1>
        <small className='text-base'>Veuillez entrer vos coordonnées</small>
      </div>
      <form className='flex w-9/12 flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
        <LabeledInput id='username' label='Nom :' isError={!!errors.username} errorMessage={errors.username?.message}>
          <TextInput
            type='text'
            placeholder='Nom'
            {...register('username', { required: { value: true, message: "Nom d'utilisateur requis" } })}
          />
        </LabeledInput>
        <LabeledInput
          id='password'
          label='Mot de pass :'
          isError={!!errors.password}
          errorMessage={errors.password?.message}
        >
          <TextInput
            type='password'
            placeholder='Mot de pass'
            {...register('password', { required: { value: true, message: 'Mot de passe requis' } })}
          />
        </LabeledInput>
        <Button type='submit' loading={isSubmitting}>
          Se connecter
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
