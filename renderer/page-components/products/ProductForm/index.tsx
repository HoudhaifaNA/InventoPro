import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NumberInput, SearchSelect, SearchSelectItem, TextInput } from '@tremor/react';
import useSWR from 'swr';
import { nanoid } from 'nanoid';

import Button from '@/components/Button';
import FormRow from '@/components/FormRow';
import LabeledInput from '@/components/LabeledInput';
import DropzoneSpace from './DropzoneSpace';
import { useModals } from '@/store';
import revalidatePath from '@/utils/revalidatePath';
import { AddProductFormInputs } from './types';
import { ADD_PRODUCT_DEFAULT_VALUES } from './constant';
import submitProduct from './submitProduct';
import { fetcher } from '@/utils/API';
import { ShipmentSelect, ShipmentToProductSelect } from 'types';
import formatUIDate from '@/utils/formatUIDate';
import ShipmentForm from '@/page-components/shipments/ShipmentForm';
import { useEffect } from 'react';

const FORM_ID = 'addProductForm';

interface ShipmentDetails {
  shipments: Pick<ShipmentSelect, 'id' | 'shipmentDate' | 'shipmentCode'>;
}
interface GetProductShipments {
  shipments: (Pick<ShipmentToProductSelect, 'unitPrice'> & ShipmentDetails)[];
}

const AddProductForm = ({ id }: { id: string }) => {
  const { modals, addModal, deleteModal } = useModals();

  const currModal = modals.find((md) => md.id === id);
  const isEdit = currModal && id === 'EDIT_PRODUCT';

  let url = isEdit ? `/shipments/product/${currModal.additionalData.id}` : null;
  const { data } = useSWR<GetProductShipments>(url, fetcher);

  const { handleSubmit, register, setValue, watch, getValues, control, formState } = useForm<AddProductFormInputs>({
    defaultValues: isEdit ? currModal.additionalData : ADD_PRODUCT_DEFAULT_VALUES,
  });

  const addShipment = () => addModal({ id: nanoid(), title: 'Ajouter une expédition', children: ShipmentForm });

  const { thumbnail } = getValues();
  const { errors, isSubmitting } = formState;

  const [currentShipmentId, retailPercentage, wholesalePercentage, retailPrice, wholesalePrice, unitPrice] = watch([
    'currentShipmentId',
    'retailPercentage',
    'wholesalePercentage',
    'retailPrice',
    'wholesalePrice',
    'unitPrice',
  ]);

  const onSubmit: SubmitHandler<AddProductFormInputs> = async (data) => {
    const config = isEdit ? { isEdit, id: currModal.additionalData.id } : undefined;
    const status = await submitProduct(data, config);
    if (status === 'success') {
      deleteModal(1);
      revalidatePath(/^\/products/);
    }
  };

  useEffect(() => {
    if (currentShipmentId && unitPrice) {
      setValue('retailPrice', (retailPercentage / 100) * unitPrice + unitPrice);
      setValue('wholesalePrice', (wholesalePercentage / 100) * unitPrice + unitPrice);
    } else if (!currentShipmentId) {
      setValue('retailPercentage', 0);
      setValue('wholesalePercentage', 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retailPercentage, wholesalePercentage, unitPrice, currentShipmentId]);

  useEffect(() => {
    if (currentShipmentId) {
      const currShipment = data?.shipments.find((shipment) => shipment.shipments.id === currentShipmentId);
      if (currShipment) {
        setValue('unitPrice', currShipment.unitPrice);
      }
    } else {
      setValue('unitPrice', undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentShipmentId]);

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
        <LabeledInput
          label='Pourcentage (%) :'
          className='flex-1'
          isError={!!errors.retailPercentage}
          errorMessage={errors.retailPercentage?.message}
        >
          <NumberInput
            placeholder='0%'
            disabled={!isEdit}
            enableStepper={false}
            {...register('retailPercentage', {
              valueAsNumber: true,
              min: { value: 0, message: 'Minimum est 0' },
            })}
          />
        </LabeledInput>
        <LabeledInput
          label='Prix ​​en détail :'
          className='flex-1'
          isError={!!errors.retailPrice}
          errorMessage={errors.retailPrice?.message}
        >
          <NumberInput
            placeholder='1590'
            enableStepper={false}
            disabled={Boolean(currentShipmentId)}
            {...register('retailPrice', {
              valueAsNumber: true,
              min: { value: 0, message: 'Minimum est 0' },
            })}
          />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput
          label='Pourcentage (%) :'
          className='flex-1'
          isError={!!errors.wholesalePercentage}
          errorMessage={errors.wholesalePercentage?.message}
        >
          <NumberInput
            placeholder='0%'
            disabled={!isEdit}
            enableStepper={false}
            {...register('wholesalePercentage', {
              valueAsNumber: true,
              min: { value: 0, message: 'Minimum est 0' },
            })}
          />
        </LabeledInput>
        <LabeledInput
          label='Prix en gros :'
          className='flex-1'
          isError={!!errors.wholesalePrice}
          errorMessage={errors.wholesalePrice?.message}
        >
          <NumberInput
            placeholder='1590'
            enableStepper={false}
            disabled={Boolean(currentShipmentId)}
            {...register('wholesalePrice', {
              valueAsNumber: true,
              min: { value: 0, message: 'Minimum est 0' },
            })}
          />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput
          label='Stock :'
          className='basis-[49%]'
          isError={!!errors.stock}
          errorMessage={errors.stock?.message}
        >
          <NumberInput
            placeholder='1500'
            enableStepper={false}
            disabled={isEdit}
            min={0}
            {...register('stock', {
              valueAsNumber: true,
              min: { value: 0, message: 'Minimum est 0' },
            })}
          />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Expédition :' className='flex-1'>
          <Controller
            name='currentShipmentId'
            control={control}
            disabled={!isEdit}
            render={({ field: { onChange, value } }) => {
              return (
                <SearchSelect placeholder='Sélectionner...' disabled={!isEdit} value={value} onValueChange={onChange}>
                  <Button
                    variant='light'
                    icon='add'
                    className='w-full justify-start rounded-none px-[7px]'
                    onClick={addShipment}
                  >
                    Ajouter une expédition
                  </Button>
                  {data?.shipments &&
                    data.shipments.map(({ shipments }) => {
                      const { id, shipmentCode, shipmentDate } = shipments;
                      return (
                        <SearchSelectItem value={id} key={id}>
                          <span>{shipmentCode || '--'}</span>
                          {'  '}
                          <span>({formatUIDate(shipmentDate)})</span>
                        </SearchSelectItem>
                      );
                    })}
                </SearchSelect>
              );
            }}
          />
        </LabeledInput>
        <LabeledInput label='Prix ​​unitaire :' className='flex-1'>
          <NumberInput placeholder='0' {...register('unitPrice')} enableStepper={false} disabled />
        </LabeledInput>
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
