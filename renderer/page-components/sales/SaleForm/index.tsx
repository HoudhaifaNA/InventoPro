import { useEffect } from 'react';
import { DatePicker, NumberInput, Select, SelectItem, TextInput } from '@tremor/react';

import Button from '@/components/Button';
import FormRow from '@/components/FormRow';
import LabeledInput from '@/components/LabeledInput';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { SaleFormInputs } from './types';
import { SALE_PRODUCT_DEFAULT_VALUES } from './constants';
import { useModals } from '@/store';
import revalidatePath from '@/utils/revalidatePath';
import submitSale from './submitSale';

const FORM_ID = 'saleForm';

const SaleForm = ({ id }: { id: string }) => {
  const { modals, deleteModal } = useModals();

  const currModal = modals.find((md) => md.id === id);
  const isEdit = currModal && id === 'EDIT_SALE';
  const additionalData = currModal?.additionalData;

  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SaleFormInputs>({
    defaultValues: isEdit
      ? { ...additionalData, soldAt: new Date(additionalData.soldAt) }
      : SALE_PRODUCT_DEFAULT_VALUES,
  });

  const [type, quantity, price, total] = watch(['type', 'quantity', 'price', 'total']);

  useEffect(() => {
    if (!isEdit) {
      if (type === 'retail') {
        setValue('price', additionalData.retailPrice);
      }
      if (type === 'wholesale') {
        setValue('price', additionalData.wholesalePrice);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, isEdit]);

  useEffect(() => {
    if (!isEdit) {
      setValue('productId', additionalData.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [additionalData, isEdit]);

  useEffect(() => {
    setValue('total', quantity * price);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, price]);

  const onSubmit: SubmitHandler<SaleFormInputs> = async (data) => {
    const config = isEdit ? { isEdit, id: currModal.additionalData.id } : undefined;
    const status = await submitSale(data, config);
    if (status === 'success') {
      deleteModal(1);
      revalidatePath(/^\/sales/);
      revalidatePath(/^\/products/);
    }
  };

  return (
    <form
      id={FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      className='relative flex max-h-[520px] min-h-[280px] flex-col gap-6 overflow-auto pb-1'
    >
      <FormRow>
        <LabeledInput label='Vendu à :' className='flex-1'>
          <Controller
            name='soldAt'
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <DatePicker
                  placeholder='Sélectionner une date'
                  enableClear={false}
                  value={value}
                  onValueChange={onChange}
                />
              );
            }}
          />
        </LabeledInput>
        <LabeledInput label='Produit :' className='flex-1'>
          <TextInput value={isEdit ? additionalData.product.name : additionalData.name} disabled />
        </LabeledInput>
      </FormRow>

      <FormRow>
        <LabeledInput label='Type de vente :' className='flex-1'>
          <Controller
            name='type'
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <Select
                  defaultValue='retail'
                  enableClear={false}
                  onValueChange={onChange}
                  value={value}
                  placeholder='Sélectionner...'
                >
                  <SelectItem value='retail'>Details</SelectItem>
                  <SelectItem value='wholesale'>Gros</SelectItem>
                </Select>
              );
            }}
          />
        </LabeledInput>
        <LabeledInput label='Prix :' className='flex-1' isError={!!errors.price} errorMessage={errors.price?.message}>
          <NumberInput
            {...register('price', {
              valueAsNumber: true,
              required: { value: true, message: 'Prix est requis' },
              min: { value: 0, message: 'Minimum est 0' },
            })}
            placeholder='1500'
            enableStepper={false}
          />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput
          label='Quantité :'
          className='flex-1'
          isError={!!errors.quantity}
          errorMessage={errors.quantity?.message}
        >
          <NumberInput
            {...register('quantity', {
              valueAsNumber: true,
              required: { value: true, message: 'Quantité est requise' },
              min: { value: 1, message: 'Minimum est 1' },
            })}
            placeholder='150'
            enableStepper={false}
          />
        </LabeledInput>
        <LabeledInput label='Total :' className='flex-1'>
          <NumberInput placeholder='17800' value={total} disabled enableStepper={false} />
        </LabeledInput>
      </FormRow>

      <div className='modal-actions flex w-full items-center justify-end gap-4 border-t border-neutral-300 bg-white p-4'>
        <Button type='submit' form={FORM_ID}>
          Vendre
        </Button>
      </div>
    </form>
  );
};

export default SaleForm;
