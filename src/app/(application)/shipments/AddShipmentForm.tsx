import { ReactNode } from 'react';
import { DatePicker, MultiSelect, MultiSelectItem, NumberInput, TextInput } from '@tremor/react';

import LabeledInput from '@/components/LabeledInput';
import Button from '@/components/Button';

const FORM_ID = 'addShipmentForm';

const FormRow = ({ children }: { children: ReactNode }) => {
  return <div className='flex items-center gap-4'>{children}</div>;
};

const AddShipmentForm = () => {
  return (
    <form id={FORM_ID} className='relative flex max-h-[520px] min-h-[320px] flex-col gap-6 overflow-auto pb-1'>
      <FormRow>
        <LabeledInput label="Date d'expédition :" className='flex-1'>
          <DatePicker placeholder='Sélectionner une date' />
        </LabeledInput>
        <LabeledInput label='Liste de produits :' className='flex-1'>
          <MultiSelect placeholder='Sélectionner...' placeholderSearch='Recherche'>
            <Button variant='light' icon='add' className='w-full justify-start rounded-none px-[7px]'>
              Ajouter un produit
            </Button>
            <MultiSelectItem value='1'>Produit 1</MultiSelectItem>
            <MultiSelectItem value='2'>Produit 2</MultiSelectItem>
            <MultiSelectItem value='3'>Produit 3</MultiSelectItem>
          </MultiSelect>
        </LabeledInput>
      </FormRow>
      {/* <FormRow>
        <LabeledInput label='Nom du produit :' className='basis-1/2'>
          <TextInput disabled />
        </LabeledInput>
        <LabeledInput id='product-price' label='Prix :' className='flex-1'>
          <NumberInput placeholder='100000' min={0} enableStepper={false} />
        </LabeledInput>
        <LabeledInput id='product-quantity' label='Quantité :' className='flex-1'>
          <NumberInput placeholder='10' min={0} enableStepper={false} />
        </LabeledInput>
      </FormRow> */}

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
