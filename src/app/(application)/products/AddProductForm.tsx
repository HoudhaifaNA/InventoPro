import { NumberInput, SearchSelect, SearchSelectItem, TextInput } from '@tremor/react';

import Button from '@/components/Button';
import FormRow from '@/components/FormRow';
import LabeledInput from '@/components/LabeledInput';
import DropzoneSpace from './DropzoneSpace';

const FORM_ID = 'addProductForm';

const AddProductForm = () => {
  return (
    <form id={FORM_ID} className='relative flex max-h-[520px] min-h-[320px] flex-col gap-6 overflow-auto pb-1'>
      <FormRow>
        <LabeledInput label='Nom :' className='flex-1'>
          <TextInput placeholder='Nom' />
        </LabeledInput>
        <LabeledInput label='Référence :' className='flex-1'>
          <TextInput placeholder='4687J9fA' />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Entreprise :' className='flex-1'>
          <SearchSelect placeholder='Sélectionner...'>
            <SearchSelectItem value='1'>ABC Electic</SearchSelectItem>
            <SearchSelectItem value='2'>VIM</SearchSelectItem>
            <SearchSelectItem value='3'>Company Great</SearchSelectItem>
          </SearchSelect>
        </LabeledInput>
        <LabeledInput label='Catégorie :' className='flex-1'>
          <SearchSelect placeholder='Sélectionner...'>
            <SearchSelectItem value='1'>General</SearchSelectItem>
            <SearchSelectItem value='2'>Electric</SearchSelectItem>
            <SearchSelectItem value='3'>Lustre</SearchSelectItem>
          </SearchSelect>
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Expédition :' className='flex-1'>
          <SearchSelect placeholder='Sélectionner...'>
            <SearchSelectItem value='1'>EXP-15646 (14-05-2021)</SearchSelectItem>
            <SearchSelectItem value='1'>EXP-15fFA (14-12-2021)</SearchSelectItem>
            <SearchSelectItem value='1'>EXP-1247S (11-11-2023)</SearchSelectItem>
            <SearchSelectItem value='1'>EXP-19ASF (11-10-2024)</SearchSelectItem>
          </SearchSelect>
        </LabeledInput>
        <LabeledInput label='Prix ​​unitaire :' className='flex-1'>
          <NumberInput placeholder='1500' value={15700} enableStepper={false} disabled />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Pourcentage (%) :' className='flex-1'>
          <NumberInput placeholder='0%' enableStepper={false} />
        </LabeledInput>
        <LabeledInput label='Prix ​​en détail :' className='flex-1'>
          <NumberInput placeholder='1590' enableStepper={false} />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Pourcentage (%) :' className='flex-1'>
          <NumberInput placeholder='0%' enableStepper={false} />
        </LabeledInput>
        <LabeledInput label='Prix en gros :' className='flex-1'>
          <NumberInput placeholder='1590' enableStepper={false} />
        </LabeledInput>
      </FormRow>
      <LabeledInput label='Image :'>
        <DropzoneSpace />
      </LabeledInput>
      <div className='modal-actions flex w-full items-center justify-end gap-4 border-t border-neutral-300 bg-white p-4'>
        <Button variant='light'>Annuler</Button>
        <Button type='submit' form={FORM_ID}>
          Suivante
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
