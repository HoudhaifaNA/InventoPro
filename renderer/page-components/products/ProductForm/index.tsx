import { SubmitHandler, useForm } from 'react-hook-form';
import { NumberInput, TextInput } from '@tremor/react';

import Button from '@/components/Button';
import FormRow from '@/components/FormRow';
import LabeledInput from '@/components/LabeledInput';
import DropzoneSpace from './DropzoneSpace';
import { useModals } from '@/store';
import revalidatePath from '@/utils/revalidatePath';
import { AddProductFormInputs } from './types';
import { ADD_PRODUCT_DEFAULT_VALUES } from './constant';
import submitProduct from './submitProduct';

const FORM_ID = 'addProductForm';

const AddProductForm = ({ id }: { id: string }) => {
  const { modals, deleteModal } = useModals();

  const currModal = modals.find((md) => md.id === id);
  const isEdit = currModal && id === 'EDIT_PRODUCT';

  const { handleSubmit, register, setValue, getValues, formState } = useForm<AddProductFormInputs>({
    defaultValues: isEdit ? currModal.additionalData : ADD_PRODUCT_DEFAULT_VALUES,
  });

  const { thumbnail } = getValues();
  const { errors, isSubmitting } = formState;

  const onSubmit: SubmitHandler<AddProductFormInputs> = async (data) => {
    const config = isEdit ? { isEdit, id: currModal.additionalData.id } : undefined;
    const status = await submitProduct(data, config);
    if (status === 'success') {
      deleteModal(1);
      revalidatePath(/^\/products/);
    }
  };

  return (
    <form
      id={FORM_ID}
      className='relative flex max-h-[520px] min-h-[320px] flex-col gap-6 overflow-auto pb-1'
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormRow>
        <LabeledInput label='Nom :' className='flex-1' isError={!!errors.name} errorMessage={errors.name?.message}>
          <TextInput
            placeholder='Nom'
            {...register('name', { required: { value: true, message: 'Nom de produit requis' } })}
          />
        </LabeledInput>
        <LabeledInput label='Référence :' className='flex-1'>
          <TextInput placeholder='4687J9fA' {...register('reference')} />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Entreprise :' className='flex-1'>
          <TextInput placeholder='Electric Wise' {...register('company')} />
        </LabeledInput>
        <LabeledInput label='Catégorie :' className='flex-1'>
          <TextInput placeholder='Lustres' {...register('category')} />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Pourcentage (%) :' className='flex-1'>
          <NumberInput placeholder='0%' disabled enableStepper={false} />
        </LabeledInput>
        <LabeledInput label='Prix ​​en détail :' className='flex-1'>
          <NumberInput placeholder='1590' enableStepper={false} {...register('retailPrice')} />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Pourcentage (%) :' className='flex-1'>
          <NumberInput placeholder='0%' disabled enableStepper={false} />
        </LabeledInput>
        <LabeledInput label='Prix en gros :' className='flex-1'>
          <NumberInput placeholder='1590' enableStepper={false} {...register('wholesalePrice')} />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Stock :' className='basis-[49%]'>
          <NumberInput placeholder='1500' enableStepper={false} {...register('stock')} />
        </LabeledInput>
        {/* <LabeledInput label='Expédition :' className='flex-1'>
          <SearchSelect placeholder='Sélectionner...'>
            <SearchSelectItem value='1'>EXP-15646 (14-05-2021)</SearchSelectItem>
            <SearchSelectItem value='1'>EXP-15fFA (14-12-2021)</SearchSelectItem>
            <SearchSelectItem value='1'>EXP-1247S (11-11-2023)</SearchSelectItem>
            <SearchSelectItem value='1'>EXP-19ASF (11-10-2024)</SearchSelectItem>
          </SearchSelect>
        </LabeledInput> */}
        {/* <LabeledInput label='Prix ​​unitaire :' className='flex-1'>
          <NumberInput placeholder='1500' value={15700} enableStepper={false} disabled />
        </LabeledInput> */}
      </FormRow>
      <LabeledInput label='Image :'>
        <DropzoneSpace setValue={setValue} thumbnail={thumbnail} />
      </LabeledInput>
      <div className='modal-actions flex w-full items-center justify-end gap-4 border-t border-neutral-300 bg-white p-4'>
        <Button type='submit' loading={isSubmitting} form={FORM_ID}>
          {isEdit ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
