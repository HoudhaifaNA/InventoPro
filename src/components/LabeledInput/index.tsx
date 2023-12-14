import { ReactElement, cloneElement } from 'react';
import clsx from 'clsx';

interface LabeledInputProps {
  id?: string;
  label: string;
  color?: 'white' | 'black';
  children: ReactElement | JSX.Element;
}

const LabeledInput = ({ id, label, color = 'black', children }: LabeledInputProps) => {
  const clonedChildren = cloneElement(children, { id });

  return (
    <div>
      <label
        htmlFor={id}
        className={clsx('mb-2 inline-block text-sm font-medium', color === 'white' ? 'text-white' : 'text-black')}
      >
        {label}
      </label>
      {clonedChildren}
    </div>
  );
};

export default LabeledInput;
