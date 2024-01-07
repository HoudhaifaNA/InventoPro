import { NumberInput } from '@tremor/react';

import LabeledInput from '@/components/LabeledInput';
import Icon from '@/components/Icon';
import { useEffect, useState } from 'react';

interface NumberRangeInputProps {
  label: string;
  currency: 'dollar' | 'yuan' | 'dinar';
  onRangeChange: (range: string) => void;
}

const NumberRangeInput = ({ label, currency, onRangeChange }: NumberRangeInputProps) => {
  const [range, setRange] = useState<number[]>([]);

  const initialProps = {
    className: 'pl-2',
    enableStepper: false,
    icon: () => <Icon icon={currency} className='h-5 w-5 fill-current' />,
    step: 100,
  };

  useEffect(() => {
    onRangeChange(range.map((rng) => (isNaN(rng) ? null : rng)).join('_'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return (
    <LabeledInput label={label}>
      <div className='flex flex-col'>
        <NumberInput
          {...initialProps}
          placeholder='Prix ​​minimum'
          onValueChange={(min) => setRange([min, range[1]])}
        />
        <div className='ml-[18px] h-3 w-0.5 rounded-full bg-neutral-400' />
        <NumberInput {...initialProps} placeholder='Prix maximum' onValueChange={(max) => setRange([range[0], max])} />
      </div>
    </LabeledInput>
  );
};

export default NumberRangeInput;
