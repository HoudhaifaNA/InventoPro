import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { TextInput } from '@tremor/react';
import { SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/components/Button';
import FormRow from '@/components/FormRow';
import LabeledInput from '@/components/LabeledInput';
import cn from '@/utils/cn';
import { useModals, useResources, useSavedData } from '@/store';
import { ConfirmationalInputs, FormType } from './types';
import submitForm from './submitForm';
import revalidatePath from '@/utils/revalidatePath';
import { GetProductsStore } from '@/types';
import API from '@/utils/API';

const FORM_ID = 'confirmationalForm';

interface ConfirmationalFormProps {
  className?: string;
  type: FormType;
  ids: string | number;
  children: ReactNode;
}

const ConfirmationalForm = ({ className, type, ids, children }: ConfirmationalFormProps) => {
  const router = useRouter();
  const { handleSubmit, register, formState } = useForm<ConfirmationalInputs>();
  const { deleteModal } = useModals();
  const { products, shipments, sales, resetSelected } = useResources();
  const { names, categories, companies, updateData } = useSavedData();

  const { errors, isSubmitting } = formState;

  const onSubmit: SubmitHandler<ConfirmationalInputs> = async (data) => {
    const status = await submitForm(data, { ids, type });
    if (status === 'success') {
      deleteModal(1);
      if (type === 'd-products') {
        revalidatePath(/^\/products/);
        const res = await API<GetProductsStore>('/products/store');
        if (res.data.names) {
          const { names, categories, companies } = res.data;
          updateData(names, companies, categories);
        }
        products.selectedItems.length > 0 && resetSelected('products');
        router.push('/products');
      } else if (type === 'd-shipments') {
        revalidatePath(/^\/shipments/);
        shipments.selectedItems.length > 0 && resetSelected('shipments');
      } else if (type === 'cancel-sale') {
        revalidatePath(/^\/sales/);
        sales.selectedItems.length > 0 && resetSelected('sales');
      }
    }
  };

  return (
    <form
      id={FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      className={cn('relative flex max-h-[520px] flex-col gap-6 overflow-auto pb-1', className)}
    >
      <p>{children}</p>
      <FormRow>
        <LabeledInput
          label='Mot de pass :'
          className='basis-1/2'
          isError={!!errors.password}
          errorMessage={errors.password?.message}
        >
          <TextInput type='password' placeholder='****' {...register('password')} />
        </LabeledInput>
      </FormRow>
      <div className='modal-actions flex w-full items-center justify-end gap-4 border-t border-neutral-300 bg-white p-4'>
        <Button type='submit' form={FORM_ID} loading={isSubmitting}>
          Confirmer
        </Button>
      </div>
    </form>
  );
};

export default ConfirmationalForm;
