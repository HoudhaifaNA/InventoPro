import Button from '@/components/Button';
import FormStepOne from './FormStepOne';
import FormStepTwo from './FormStepTwo';
import FormStepThree from './FormStepThree';

const FORM_ID = 'addShipmentForm';

const AddShipmentForm = () => {
  return (
    <form id={FORM_ID} className='relative flex max-h-[520px] min-h-[320px] flex-col gap-6 overflow-auto pb-1'>
      {/* <FormStepOne /> */}
      {/* <FormStepTwo /> */}
      {/* <FormStepThree /> */}
      <div className='modal-actions flex w-full items-center justify-end gap-4 border-t border-neutral-300 bg-white p-4'>
        <Button variant='light'>Annuler</Button>
        <Button type='submit' form={FORM_ID}>
          Suivante
        </Button>
      </div>
    </form>
  );
};

export default AddShipmentForm;
