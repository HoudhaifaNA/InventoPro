import { DatePicker, TextInput, NumberInput } from '@tremor/react';

import Button from '@/components/Button';
import FormRow from '@/components/FormRow';
import LabeledInput from '@/components/LabeledInput';
import Icon from '@/components/Icon';

const FormStepTwo = () => {
  return (
    <>
      <FormRow>
        <Button variant='light' icon='add' className='pl-0'>
          Locale
        </Button>
        <Button variant='light' icon='add' className='pl-0'>
          Dollar
        </Button>
        <Button variant='light' icon='add' className='pl-0'>
          Yuan
        </Button>
      </FormRow>
      <FormRow>
        <LabeledInput label="Date d'arrivée :" className='flex-1'>
          <DatePicker placeholder='Sélectionner une date' />
        </LabeledInput>
        <LabeledInput id='shipment-id' label="ID d'expédition :" className='flex-1'>
          <TextInput placeholder='EXP-454654EF9A' />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Raison :' className='flex-1'>
          <TextInput placeholder="Billet d'avion" />
        </LabeledInput>
        <LabeledInput id='cost' label='Coût :' className='flex-1'>
          <NumberInput placeholder='170' min={0} enableStepper={false} />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Raison :' className='basis-1/2'>
          <TextInput placeholder="Billet d'avion" />
        </LabeledInput>
        <LabeledInput id='exchange-rate' label='Prix de ¥100 :' className='flex-1'>
          <NumberInput placeholder='18000' min={0} enableStepper={false} />
        </LabeledInput>
        <LabeledInput id='cost' label='Coût :' className='flex-1'>
          <NumberInput placeholder='170' min={0} enableStepper={false} />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Raison :' className='basis-1/2'>
          <TextInput placeholder="Billet d'avion" />
        </LabeledInput>
        <LabeledInput id='exchange-rate' label='Prix de $100 :' className='flex-1'>
          <NumberInput placeholder='18000' min={0} enableStepper={false} />
        </LabeledInput>
        <LabeledInput id='cost' label='Coût :' className='flex-1'>
          <NumberInput placeholder='170' min={0} enableStepper={false} />
        </LabeledInput>
        <Button className='group-hover:animate-showDeleteBtn absolute right-0 top-7 opacity-0' squared>
          <Icon icon='close' className='h-5 w-5' />
        </Button>
      </FormRow>
    </>
  );
};

export default FormStepTwo;