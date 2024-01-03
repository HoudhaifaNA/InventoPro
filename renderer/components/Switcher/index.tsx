import { useState } from 'react';

import Button from '@/components/Button';
import Icon from '@/components/Icon';

export interface Option {
  title?: string;
  icon?: string;
  payload: string;
}

interface SwitcherProps {
  options: Option[];
  squared?: boolean;
  handleSelect: (payload: Option['payload']) => void;
}

const Switcher = ({ options, squared, handleSelect }: SwitcherProps) => {
  const [selectedOption, selectOption] = useState(options[0].payload);

  const renderOptions = () => {
    return options.map(({ title, icon, payload }) => {
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
          key={payload}
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
