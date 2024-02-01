import { useState } from 'react';

import Button from '@/components/Button';
import Icon from '@/components/Icon';

export interface Option<T> {
  title?: string;
  icon?: string;
  payload: T;
}

interface SwitcherProps<T> {
  options: Option<T>[];
  defaultValue: T;
  squared?: boolean;
  handleSelect: (payload: T) => void;
}

const Switcher = <T,>({ options, defaultValue, squared, handleSelect }: SwitcherProps<T>) => {
  const [selectedOption, selectOption] = useState(defaultValue);

  const renderOptions = () => {
    return options.map(({ title, icon, payload }, ind) => {
      const isSelected = payload === selectedOption;

      const handleClick = () => {
        selectOption(payload);
        handleSelect(payload);
      };

      return (
        <Button
          variant={isSelected ? 'primary' : 'light'}
          className='flex-1'
          squared={squared}
          onClick={handleClick}
          key={ind}
        >
          {icon && <Icon icon={icon} className='h-5 w-5' />}
          {title}
        </Button>
      );
    });
  };

  return <div className='flex items-center rounded border border-rose-600'>{renderOptions()}</div>;
};

export default Switcher;
