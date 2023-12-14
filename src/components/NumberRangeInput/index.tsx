'use client';
import { NumberInput } from '@tremor/react';

import LabeledInput from '@/components/LabeledInput';
import Icon from '@/components/Icon';

interface NumberRangeInputProps {
  label: string;
  currency: 'dollar' | 'yuan' | 'dinar';
}

const NumberRangeInput = ({ label, currency }: NumberRangeInputProps) => {
  const initialProps = {
    className: 'pl-2',
    enableStepper: false,
    icon: () => <Icon icon={currency} className='h-5 w-5 fill-current' />,
    step: 100,
  };

  return (
    <LabeledInput label={label}>
      <div className='flex flex-col'>
        <NumberInput {...initialProps} placeholder='Prix ​​minimum' />
        <div className='ml-[18px] h-3 w-0.5 rounded-full bg-neutral-400' />
        <NumberInput {...initialProps} placeholder='Prix maximum' />
      </div>
    </LabeledInput>
  );
};

export default NumberRangeInput;
