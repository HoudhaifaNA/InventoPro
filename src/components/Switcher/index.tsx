import { useState } from 'react';
import clsx from 'clsx';

import Button from '@/components/Button';
import Icon from '@/components/Icon';

export interface Option {
  title?: string;
  icon?: string;
  payload: string;
}

interface SwitcherProps {
  options: Option[];
  handleSelect: (payload: Option['payload']) => void;
}

const Switcher = ({ options, handleSelect }: SwitcherProps) => {
  const [selectedOption, selectOption] = useState(options[0].payload);

  const renderOptions = () => {
    return options.map(({ title, icon, payload }) => {
      const isSelected = payload === selectedOption;

      const handleClick = () => {
        selectOption(payload);
        handleSelect(payload);
      };

      return (
        <Button variant={isSelected ? 'primary' : 'light'} onClick={handleClick} key={payload}>
          {icon && <Icon icon={icon} className={clsx('h-5 w-5', isSelected ? 'fill-white' : 'fill-rose-600')} />}
          {title}
        </Button>
      );
    });
  };

  return <div className='flex items-center rounded border border-rose-600'>{renderOptions()}</div>;
};

export default Switcher;
