import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/components/Button';
import FormStepOne from './FormStepOne';
import FormStepTwo from './FormStepTwo';
import FormStepThree from './FormStepThree';
import { ShipmentFormInputs } from './types';
import { ADD_SHIPMENT_DEFAULT_VALUES } from './constants';
import { useModals } from '@/store';
import submitShipment from './submitShipment';
import revalidatePath from '@/utils/revalidatePath';
import { useEffect, useState } from 'react';
import { ShipmentWithProducts } from '@/types';

const FORM_ID = 'shipmentForm';

const ShipmentForm = ({ id }: { id: string }) => {
  const [step, setStep] = useState(1);
  const { modals, deleteModal } = useModals();

  const currModal = modals.find((md) => md.id === id);
  const isEdit = currModal && id === 'EDIT_SHIPMENT';
  let DEFAULT_VALUES = ADD_SHIPMENT_DEFAULT_VALUES;
  const additionalData = currModal?.additionalData as ShipmentWithProducts;

  // if (isEdit && additionalData) {
  //   DEFAULT_VALUES.productsIds = additionalData.shipmentProducts.map((pr) => pr.productId);
  //   DEFAULT_VALUES.productsBought = additionalData.shipmentProducts.map(
  //     ({ productId, expenseSlice, quantity, totalPrice }) => {
  //       return { id: productId, expenseSlice, quantity, totalPrice };
  //     }
  //   );
  //   DEFAULT_VALUES.shipmentDate = new Date(additionalData.shipmentDate);
  //   DEFAULT_VALUES.shipmentCode = additionalData.shipmentCode || '';
  //   DEFAULT_VALUES.expenses = additionalData.expenses;
  //   DEFAULT_VALUES.arrivalDate = additionalData.arrivalDate ? new Date(additionalData.arrivalDate) : undefined;
  // }

  const methods = useForm<ShipmentFormInputs>({ defaultValues: ADD_SHIPMENT_DEFAULT_VALUES });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit) {
      // If it's an edit modal, update the default values based on additionalData
      const additionalData = currModal?.additionalData as ShipmentWithProducts;

      if (additionalData) {
        reset({
          productsIds: additionalData.shipmentProducts.map((pr) => pr.productId),
          productsBought: additionalData.shipmentProducts.map(({ productId, expenseSlice, quantity, totalPrice }) => {
            return { id: productId, expenseSlice, quantity, totalPrice };
          }),
          shipmentDate: new Date(additionalData.shipmentDate),
          shipmentCode: additionalData.shipmentCode || '',
          expenses: additionalData.expenses,
          arrivalDate: additionalData.arrivalDate ? new Date(additionalData.arrivalDate) : undefined,
        });
      }
    }
  }, [isEdit, currModal, reset]);

  const onSubmit: SubmitHandler<ShipmentFormInputs> = async (data) => {
    if (step === 3) {
      const config = isEdit ? { isEdit, id: currModal.additionalData.id } : undefined;
      const status = await submitShipment(data, config);
      if (status === 'success') {
        deleteModal(1);
        revalidatePath(/^\/shipments/);
      }
    } else {
      setStep(step + 1);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        id={FORM_ID}
        onSubmit={handleSubmit(onSubmit)}
        className='relative flex max-h-[520px] min-h-[320px] flex-col gap-6 overflow-auto pb-1'
      >
        {step === 1 && <FormStepOne />}
        {step === 2 && <FormStepTwo />}
        {step === 3 && <FormStepThree />}
      </form>
      <div className='modal-actions flex w-full items-center justify-end gap-4 border-t border-neutral-300 bg-white p-4'>
        {step > 1 && (
          <Button variant='light' onClick={() => setStep(step - 1)}>
            Retour
          </Button>
        )}
        <Button type='submit' loading={isSubmitting} form={FORM_ID}>
          {step === 3 ? (isEdit ? 'Modifier' : 'Ajouter') : 'Suivante'}
        </Button>
      </div>
    </FormProvider>
  );
};

export default ShipmentForm;
