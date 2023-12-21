import { ComponentPropsWithoutRef } from 'react';
import { TextInput } from '@tremor/react';

import Button from '@/components/Button';
import FormRow from '@/components/FormRow';
import LabeledInput from '@/components/LabeledInput';
import cn from '@/utils/cn';

const FORM_ID = 'confirmationalForm';

interface ConfirmationalFormProps extends Omit<ComponentPropsWithoutRef<'form'>, 'id'> {}

const ConfirmationalForm = ({ className, children, ...props }: ConfirmationalFormProps) => {
  return (
    <form
      id={FORM_ID}
      {...props}
      className={cn('relative flex max-h-[520px] flex-col gap-6 overflow-auto pb-1', className)}
    >
      {children}
      <FormRow>
        <LabeledInput label='Mot de pass :' className='basis-1/2'>
          <TextInput type='password' placeholder='****' />
        </LabeledInput>
      </FormRow>
      <div className='modal-actions flex w-full items-center justify-end gap-4 border-t border-neutral-300 bg-white p-4'>
        <Button variant='light'>Annuler</Button>
        <Button type='submit' form={FORM_ID}>
          Confirmer
        </Button>
      </div>
    </form>
  );
};

export default ConfirmationalForm;
