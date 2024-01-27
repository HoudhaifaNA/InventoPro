import { NumberInput } from '@tremor/react';
import { useForm } from 'react-hook-form';

import Button from '@/components/Button';
import LabeledInput from '@/components/LabeledInput';
import { useSavedData } from '@/store';

interface GeneralSettingsInputs {
  stockThreshold: number;
  inactiveTimeThreshold: number;
}

const General = () => {
  const { inactiveTimeThreshold, stockThreshold, updateSettings } = useSavedData();
  const { register, handleSubmit } = useForm<GeneralSettingsInputs>({
    defaultValues: { inactiveTimeThreshold, stockThreshold },
  });

  const setSettings = (data: GeneralSettingsInputs) => {
    updateSettings(data.stockThreshold, data.inactiveTimeThreshold);
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit(setSettings)} id='UPDATE-SETTINGS'>
      <span className='text-lg font-semibold'>General</span>
      <LabeledInput id='stock-warning' label='Avertissement de stock'>
        <NumberInput
          placeholder='ex: 25'
          min={1}
          {...register('stockThreshold', {
            min: { value: 1, message: 'Minimum est 1' },
            required: { value: true, message: 'Avertissement de stock est requis' },
          })}
        />
      </LabeledInput>
      <LabeledInput id='session-timeout' label="Temps d'inactivité (minutes)">
        <NumberInput
          placeholder='ex: 5'
          min={1}
          {...register('inactiveTimeThreshold', {
            min: { value: 1, message: 'Minimum est 5' },
            required: { value: true, message: "Temps d'inactivité est requis" },
          })}
        />
      </LabeledInput>
      <Button type='submit' form='UPDATE-SETTINGS'>
        Mettre à jour
      </Button>
    </form>
  );
};

export default General;
