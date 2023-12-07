import { TextInput } from '@tremor/react';

import LabeledInput from '@/components/LabeledInput';
import Button from '@/components/Button';

const LoginForm = () => {
  return (
    <div className='flex h-full basis-full  flex-col items-center gap-14 rounded-md bg-white p-4 md:basis-2/3 lg:basis-2/5'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='flex h-48 items-center text-5xl font-bold text-rose-600'>inventoPro</h1>
        <h1 className='text-4xl font-bold'>Content de te revoir!</h1>
        <small className='text-base'>Veuillez entrer vos coordonnées</small>
      </div>
      <form className='flex w-9/12 flex-col gap-6'>
        <LabeledInput id='username' label='Nom :'>
          <TextInput type='text' placeholder='Nom' />
        </LabeledInput>
        <LabeledInput id='password' label='Mot de pass :'>
          <TextInput type='password' placeholder='Mot de pass' />
        </LabeledInput>
        <Button>Se connecter</Button>
      </form>
    </div>
  );
};

export default LoginForm;
