import { NumberInput, SearchSelect, SearchSelectItem, Select, SelectItem } from '@tremor/react';

import Button from '@/components/Button';
import FormRow from '@/components/FormRow';
import LabeledInput from '@/components/LabeledInput';

const FORM_ID = 'sellProductForm';

const SellProductForm = () => {
  return (
    <form id={FORM_ID} className='relative flex max-h-[520px] min-h-[280px] flex-col gap-6 overflow-auto pb-1'>
      <FormRow>
        <LabeledInput label='Quantité :' className='flex-1'>
          <NumberInput placeholder='150' enableStepper={false} />
        </LabeledInput>
        <LabeledInput label='Expédition :' className='flex-1'>
          <SearchSelect placeholder='Sélectionner...'>
            <SearchSelectItem value='1'>EXP-15646 (14-05-2021)</SearchSelectItem>
            <SearchSelectItem value='1'>EXP-15fFA (14-12-2021)</SearchSelectItem>
            <SearchSelectItem value='1'>EXP-1247S (11-11-2023)</SearchSelectItem>
            <SearchSelectItem value='1'>EXP-19ASF (11-10-2024)</SearchSelectItem>
          </SearchSelect>
        </LabeledInput>
      </FormRow>

      <FormRow>
        <LabeledInput label='Type de vente :' className='basis-1/2'>
          <Select defaultValue='1' placeholder='Sélectionner...'>
            <SelectItem value='1'>Details</SelectItem>
            <SelectItem value='2'>Gros</SelectItem>
          </Select>
        </LabeledInput>
        <LabeledInput label='Prix :' className='flex-1'>
          <NumberInput placeholder='1500' enableStepper={false} />
        </LabeledInput>
        <LabeledInput label='Total :' className='flex-1'>
          <NumberInput placeholder='17800' enableStepper={false} />
        </LabeledInput>
      </FormRow>

      <div className='modal-actions flex w-full items-center justify-end gap-4 border-t border-neutral-300 bg-white p-4'>
        <Button variant='light'>Annuler</Button>
        <Button type='submit' form={FORM_ID}>
          Suivante
        </Button>
      </div>
    </form>
  );
};

export default SellProductForm;
