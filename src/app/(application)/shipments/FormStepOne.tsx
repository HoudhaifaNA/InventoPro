import { DatePicker, MultiSelect, MultiSelectItem, TextInput, NumberInput } from '@tremor/react';

import Button from '@/components/Button';
import FormRow from '@/components/FormRow';
import LabeledInput from '@/components/LabeledInput';

const FormStepOne = () => {
  return (
    <>
      <FormRow>
        <LabeledInput label="Date d'expédition :" className='flex-1'>
          <DatePicker placeholder='Sélectionner une date' />
        </LabeledInput>
        <LabeledInput label='Liste de produits :' className='flex-1'>
          <MultiSelect placeholder='Sélectionner...' placeholderSearch='Recherche'>
            <Button type='button' variant='light' icon='add' className='w-full justify-start rounded-none px-[7px]'>
              Ajouter un produit
            </Button>
            <MultiSelectItem value='1'>Produit 1</MultiSelectItem>
            <MultiSelectItem value='2'>Produit 2</MultiSelectItem>
            <MultiSelectItem value='3'>Produit 3</MultiSelectItem>
          </MultiSelect>
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Nom du produit :' className='basis-1/2'>
          <TextInput disabled />
        </LabeledInput>
        <LabeledInput id='product-price' label='Prix :' className='flex-1'>
          <NumberInput placeholder='100000' min={0} enableStepper={false} />
        </LabeledInput>
        <LabeledInput id='product-quantity' label='Quantité :' className='flex-1'>
          <NumberInput placeholder='10' min={0} enableStepper={false} />
        </LabeledInput>
      </FormRow>
    </>
  );
};

export default FormStepOne;
